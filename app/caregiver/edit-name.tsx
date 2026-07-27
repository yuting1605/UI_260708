import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { BASE_URL } from "../../constants/config";

export default function CaregiverEditNameScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadCurrentName = async () => {
      try {
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) {
          setName(storedName);
        }
      } catch (error) {
        console.error("無法讀取使用者名稱:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadCurrentName();
  }, []);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert("提示", "名稱不能為空白，請輸入有效名稱");
      return;
    }

    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        Alert.alert("錯誤", "找不到使用者登入資訊，請重新登入");
        return;
      }

      const response = await fetch(`${BASE_URL}/update-name`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          name: trimmedName,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "資料庫更新失敗");
      }

      await AsyncStorage.setItem("userName", trimmedName);

      Alert.alert("成功", "名稱已成功更改！", [
        {
          text: "確定",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error("儲存失敗:", error);
      Alert.alert("錯誤", error.message || "更新失敗，請確認網路連線");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Stack.Screen
          options={{
            title: "編輯個人資料",
            headerTitleStyle: { fontSize: 20, fontWeight: "bold" },
            headerBackTitle: "返回",
          }}
        />

        <View style={styles.card}>
          <Text
            style={styles.label}
            accessible={true}
            accessibilityLabel="請輸入新的顯示名稱"
          >
            請輸入新的顯示名稱：
          </Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="請輸入名字"
            placeholderTextColor="#8E8E93"
            autoFocus={true}
            returnKeyType="done"
            onSubmitEditing={handleSave}
            accessible={true}
            accessibilityLabel={`目前輸入的名稱為：${name || "空白"}`}
            accessibilityHint="點擊兩下可進行編輯輸入"
          />

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleSave}
            disabled={loading}
            accessible={true}
            accessibilityLabel="儲存修改"
            accessibilityHint="點擊後將儲存新名稱並返回設定頁"
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={22}
                  color="#FFFFFF"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.saveButtonText}>儲存修改</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    padding: 20,
    justifyContent: "flex-start",
    paddingTop: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 14,
  },
  input: {
    backgroundColor: "#F2F2F7",
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C7C7CC",
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: "#hsl(0, 0%, 17%)",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#A2C8FF",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});