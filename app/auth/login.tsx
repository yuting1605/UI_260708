import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BASE_URL } from "../../constants/config";

export default function Login() {
  const { selectedRole } = useLocalSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getRoleDisplayName = (role: string | string[] | undefined) => {
    return role === "blind" ? "視障者" : "照護者/家屬";
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("提醒", "請輸入帳號與密碼");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          expectedRole: selectedRole,
        }),
      });
      const data = await response.json();

if (data.success) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));

        // 💡 1. 抓取註冊時填寫的「暱稱/姓名」 (full_name)
        const nameToSave = data.user?.full_name || data.user?.username || username;
        
        // 💡 2. 抓取帳號
        const usernameToSave = data.user?.username || username;
        
        // 💡 3. 抓取身分（順便把 "照護者/家屬" 簡化為 "照護者"）
        const roleToSave = (data.user?.role || selectedRole) === "blind" ? "視障者" : "照護者";

        // 💡 4. 抓取 User ID (轉換為字串)
        const userIdToSave = (data.user?.id || data.user?.user_id)?.toString();

        // 寫入 AsyncStorage 供設定頁與修改名稱頁面讀取
        await AsyncStorage.setItem("userName", nameToSave);         // 大字：暱稱
        await AsyncStorage.setItem("userAccount", usernameToSave);   // 小字：帳號
        await AsyncStorage.setItem("userRole", roleToSave);         // 身分標籤
        
        if (userIdToSave) {
          await AsyncStorage.setItem("userId", userIdToSave);       // 🔑 補上這行：寫入 userId！
        }

        router.replace(data.user.role === "blind" ? "/blind" : "/caregiver");
      }

      else {
        if (data.message.includes("屬於") || data.message.includes("身分")) {
          const actualRoleName = data.message.includes("blind")
            ? "視障者"
            : "照護者/家屬";
          const expectedRoleName = getRoleDisplayName(selectedRole);
          Alert.alert(
            "身分不符",
            `此帳號註冊身分為「${actualRoleName}」，無法以「${expectedRoleName}」身分登入。`,
          );
        } else {
          Alert.alert("登入失敗", data.message);
        }
      }
    } catch (e) {
      Alert.alert("錯誤", "無法連線至伺服器");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 導覽按鈕 */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backLink}
        accessible={true}
        accessibilityLabel="返回，重新選擇身分"
        accessibilityRole="button"
      >
        <Text style={styles.backLinkText}>← 重新選擇身分</Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        {selectedRole === "blind" ? "視障者登入" : "照護者/家屬登入"}
      </Text>

      {/* 帳號輸入框 */}
      <TextInput
        placeholder="請輸入帳號"
        style={styles.input}
        onChangeText={setUsername}
        autoCapitalize="none"
        accessible={true}
        accessibilityLabel="帳號"
        accessibilityHint="請輸入您的帳號"
      />

      {/* 密碼輸入框 */}
      <TextInput
        placeholder="請輸入密碼"
        style={styles.input}
        onChangeText={setPassword}
        secureTextEntry
        accessible={true}
        accessibilityLabel="密碼"
        accessibilityHint="請輸入您的密碼"
      />

      {/* 登入按鈕 */}
      <TouchableOpacity
        style={styles.btnBlue}
        onPress={handleLogin}
        disabled={loading}
        accessible={true}
        accessibilityLabel="登入"
        accessibilityHint="點擊後將開始驗證帳號密碼"
        accessibilityRole="button"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>登入</Text>
        )}
      </TouchableOpacity>

      {/* 註冊連結 */}
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/auth/register",
            params: { selectedRole },
          } as any)
        }
        accessible={true}
        accessibilityLabel="沒有帳號，前往註冊"
        accessibilityRole="link"
      >
        <Text style={styles.link}>沒有帳號？前往註冊</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    backgroundColor: "#f0f2f5",
  },
  backLink: { marginBottom: 20 },
  backLinkText: { color: "rgb(8, 14, 19)", fontSize: 16 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  btnBlue: {
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  link: { textAlign: "center", marginTop: 25, color: "rgb(0, 0, 0)", fontSize: 16 },
});