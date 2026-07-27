import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CaregiverSettingsScreen() {
  const router = useRouter();

  // 1. 儲存使用者資訊的 State
  const [userName, setUserName] = useState("載入中...");
  const [userAccount, setUserAccount] = useState("");
  const [userRole, setUserRole] = useState("照護者");

  // 2. 每次進入或回到此頁面時自動讀取最新 AsyncStorage 資料
  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        try {
          const storedName = await AsyncStorage.getItem("userName");
          const storedAccount = await AsyncStorage.getItem("userAccount");
          const storedRole = await AsyncStorage.getItem("userRole");

          if (storedName) setUserName(storedName);
          if (storedAccount) setUserAccount(storedAccount);
          if (storedRole) setUserRole(storedRole);
        } catch (error) {
          console.error("讀取身分資料失敗:", error);
        }
      };

      loadUserData();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert("確認", "確定要登出嗎？", [
      { text: "取消", style: "cancel" },
      {
        text: "登出",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 💡 身份顯示卡片 */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={32} color="#000000" />
        </View>
        <View style={styles.profileInfo}>
          {/* 大字：顯示姓名 */}
          <Text style={styles.userName}>{userName}</Text>

          {/* 小字：顯示帳號 */}
          {userAccount ? (
            <Text style={styles.userAccount}>帳號：{userAccount}</Text>
          ) : null}

          {/* 身分標籤 */}
          <View style={styles.roleBadge}>
            <Ionicons
              name="shield-checkmark"
              size={14}
              color="#000000"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.roleText}>{userRole}</Text>
          </View>
        </View>
      </View>

      {/* ✏️ 編輯個人資料按鈕（比照盲人端排版） */}
      <TouchableOpacity
        style={styles.editProfileButton}
        onPress={() => router.push("/caregiver/edit-name")}
        accessible={true}
        accessibilityLabel="編輯個人資料"
        accessibilityHint="點擊後開啟修改名稱頁面"
        accessibilityRole="button"
      >
        <Ionicons name="create-outline" size={22} color="rgb(0, 0, 0)" style={{ marginRight: 8 }} />
        <Text style={styles.editProfileText}>編輯個人資料</Text>
      </TouchableOpacity>

      {/* 登出按鈕 */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        accessible={true}
        accessibilityLabel="登出系統"
        accessibilityRole="button"
      >
        <Ionicons
          name="log-out-outline"
          size={22}
          color="#FF3B30"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.logoutText}>登出系統</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: "#F2F2F7",
  },

  // 身分顯示卡片樣式
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 2,
  },
  userAccount: {
    fontSize: 13,
    color: "#8E8E93",
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },

  // ✏️ 編輯個人資料按鈕樣式（盲人端同款獨立卡片）
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  editProfileText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },

  // 登出按鈕樣式
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF3B30",
  },
});