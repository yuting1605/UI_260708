import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function CaregiverTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "rgb(0, 0, 0)" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        headerTitleAlign: "center",
        tabBarActiveTintColor: "hsl(0, 0%, 17%)",
        tabBarInactiveTintColor: "#8E8E93",

        tabBarStyle: { height: 85, paddingBottom: 10 },
        tabBarLabelStyle: { fontSize: 14, fontWeight: "600" ,marginTop: 6},
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "首頁",
  
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="contacts"
        options={{ 
          title: "好友清單", 
        tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={24} color={color} />
          ),
        }}

      />
      
      <Tabs.Screen
        name="alert-history"
        options={{ title: "緊急事件紀錄",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="warning" size={24} color={color} />
          ), 
          
          
          }}
      />
      
      {/* 💡 正常切換頁面，不攔截點擊，交由內頁處理登出 */}
      <Tabs.Screen
        name="settings"
        options={{ title: "設定",
          
        tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={24} color={color} />
          ), 
        }}
      />
    </Tabs>
  );
}