import { Tabs } from "expo-router";
import { Home, Store, ShoppingCart, User } from "lucide-react-native";
import { useCartStore } from "../../lib/store";
import { View, Text, Platform } from "react-native";
import AppHeader from "../../components/header/AppHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const cartCount = useCartStore((state) => state.cartItems.length);

  return (
    <Tabs
      screenOptions={{
        header: () => <AppHeader />,
        tabBarActiveTintColor: "#29beb3",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          height: 64 + Math.max(0, insets.bottom - 8),
          paddingBottom: Math.max(8, insets.bottom),
          paddingTop: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View className={`items-center justify-center ${focused ? 'w-10 h-10 rounded-full bg-babyshopSky/10' : ''}`}>
              <Home color={color} size={focused ? 22 : 20} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, focused }) => (
            <View className={`items-center justify-center ${focused ? 'w-10 h-10 rounded-full bg-babyshopSky/10' : ''}`}>
              <Store color={color} size={focused ? 22 : 20} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, focused }) => (
            <View className={`items-center justify-center ${focused ? 'w-10 h-10 rounded-full bg-babyshopSky/10' : ''}`}>
              <ShoppingCart color={color} size={focused ? 22 : 20} strokeWidth={focused ? 2.5 : 2} />
              {cartCount > 0 && (
                <View
                  className="absolute -top-1 -right-1 bg-rose-500 rounded-full items-center justify-center"
                  style={{ minWidth: 16, height: 16, paddingHorizontal: 3 }}
                >
                  <Text className="text-white text-[9px] font-bold">
                    {cartCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View className={`items-center justify-center ${focused ? 'w-10 h-10 rounded-full bg-babyshopSky/10' : ''}`}>
              <User color={color} size={focused ? 22 : 20} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      {/* Hidden secondary pages that still need the tab bar layout */}
      <Tabs.Screen name="about" options={{ href: null }} />
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen name="privacy" options={{ href: null }} />
      <Tabs.Screen name="terms" options={{ href: null }} />
      <Tabs.Screen name="testimonials" options={{ href: null }} />
      <Tabs.Screen name="returns" options={{ href: null }} />
    </Tabs>
  );
}
