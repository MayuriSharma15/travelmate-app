import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { Platform } from "react-native";

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          height: Platform.OS === "web" ? 70 : 64,
          paddingBottom: Platform.OS === "web" ? 12 : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontFamily: "Outfit-Medium",
          fontSize: 11,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="mytrip"
        options={{
          title: "My Trips",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "location" : "location-outline"} color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "compass" : "compass-outline"} color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="travel"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "airplane" : "airplane-outline"} color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
