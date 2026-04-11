import { Tabs } from "expo-router";
import { Home, Store, ShoppingCart, User } from "lucide-react-native";
import { useCartStore } from "../../lib/store";
import { View, Text } from "react-native";
import AppHeader from "../../components/header/AppHeader";

export default function TabLayout() {
  const cartCount = useCartStore((state) => state.cartItems.length);

  return (
    <Tabs
      screenOptions={{
        header: () => <AppHeader />,
        tabBarActiveTintColor: "#29beb3",
        tabBarInactiveTintColor: "#999999",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#ededed",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, size }) => <Store color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <View>
              <ShoppingCart color={color} size={size} />
              {cartCount > 0 && (
                <View className="absolute -top-2 -right-2 bg-babyshopRed w-4 h-4 rounded-full flex items-center justify-center">
                  <Text className="text-white text-[10px] font-bold">
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
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
