import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useAuthStore } from "../stores/authStore";

// Import your screen components here
import WelcomeWrapper from "../components/welcom/WelcomeWrapper";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ForgetPasswordScreen from "../screens/ForgetPasswordScreen";
import PlansScreen from "../screens/PlansScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AccountSettingsScreen from "../screens/AccountSettingsScreen";
import NotificationSettingsScreen from "../screens/NotificationSettingsScreen";
import TicketsScreen from "../screens/TicketsScreen";
import Marketplace from "../screens/Marketplace";
import EventsScreen from "../screens/EventsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator (for authenticated users)
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Events") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Tickets") {
            iconName = focused ? "ticket" : "ticket-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === "Plans") {
            iconName = focused ? "pricetag" : "pricetag-outline";
          } else if (route.name === "Marketplace") {
            iconName = focused ? "storefront" : "storefront-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#c28e5c",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        // options={{
        //   title: "Events",
        // tabBarIcon: ({ focused, color, size }) => (
        //   <Ionicons
        //     name={focused ? "calendar" : "calendar-outline"}
        //     size={size}
        //     color={color}
        //   />
        // ),
        // }}
      />
      <Tab.Screen name="Marketplace" component={Marketplace} />
      <Tab.Screen name="Plans" component={PlansScreen} />
      <Tab.Screen name="Tickets" component={TicketsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Auth Stack Navigator (for unauthenticated users)
function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen name="Welcome">
        {({ navigation }) => (
          <WelcomeWrapper
            onSkip={() => navigation.navigate("Login")}
            onLogin={() => navigation.navigate("Login")}
            onSignup={() => navigation.navigate("Signup")}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
    </Stack.Navigator>
  );
}

// Main Stack Navigator (for authenticated users)
function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
      />
    </Stack.Navigator>
  );
}

// Root Navigator - switches between Auth and Main based on auth status
export default function AppNavigator() {
  const status = useAuthStore((state) => state.status);

  // Show loading while checking auth status
  if (status === "checking") {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#c28e5c" />
      </View>
    );
  }

  // Show appropriate stack based on auth status
  return status === "authenticated" ? <MainStack /> : <AuthStack />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
