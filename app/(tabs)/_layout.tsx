import { Tabs } from "expo-router";
import { Bell, Home } from "lucide-react-native";
import { useAppStore } from "../../src/store/useAppStore";

export default function TabLayout() {
  const { isDarkMode } = useAppStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? "#0F172A" : "#FFFFFF",
          borderTopColor: isDarkMode ? "#1E293B" : "#E2E8F0",
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: isDarkMode ? "#64748B" : "#94A3B8",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color }) => <Bell color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
