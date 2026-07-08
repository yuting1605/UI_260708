import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// 💡 請檢查 react-native 的 import，確保裡面有包含 TouchableOpacity

export default function BlindCameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    AsyncStorage.getItem("user").then((data) => {
      if (data) setUser(JSON.parse(data));
    });
    requestPermission();
  }, []);

  if (!permission || !permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, marginBottom: 20, textAlign: "center" }}>
          需要相機權限以啟動功能
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.btn}
          accessible={true}
          accessibilityLabel="授權相機權限按鈕"
          accessibilityRole="button"
        >
          <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "bold" }}>
            授權相機
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 滿版相機畫面 */}
      <CameraView style={StyleSheet.absoluteFill} facing="back" />

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        {/* 💡 這裡原本的返回按鈕與 SOS 按鈕已經完全移除，只保留純相機與下方的 AI 偵測提示 */}
        
        <View style={{ flex: 1 }} pointerEvents="none" />

        {/* AI 狀態提示：保留讓螢幕閱讀器自動播報狀態更新 */}
        <View
          style={styles.infoBox}
          accessible={true}
          accessibilityLiveRegion="polite"
        >
          <Text style={styles.infoText}>AI 環境偵測中</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
  },

  btn: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "#007AFF",
    borderRadius: 12,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: 20,
  },

  infoBox: {
    backgroundColor: "#b1b1b1cc",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  infoText: { color: "rgb(255, 255, 255)", fontSize: 22, fontWeight: "bold" },
});