import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { CustomerHomeScreen } from "./src/screens/CustomerHomeScreen";
import { WorkerHomeScreen } from "./src/screens/WorkerHomeScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { BookingHistoryScreen } from "./src/screens/BookingHistoryScreen";
import { WorkerProfileScreen } from "./src/screens/WorkerProfileScreen";
import { BookingScreen } from "./src/screens/BookingScreen";
import { TrackingScreen } from "./src/screens/TrackingScreen";
import { PaymentsScreen } from "./src/screens/PaymentsScreen";
import { ReviewsScreen } from "./src/screens/ReviewsScreen";
import { WorkerOnboardingScreen } from "./src/screens/WorkerOnboardingScreen";
import { Theme } from "./src/theme/theme";

type RootStackParamList = {
  Login: undefined;
  AppTabs: undefined;
  WorkerProfile: { workerId: string };
  Booking: { workerId?: string };
  Tracking: { bookingId: string };
  Payments: { bookingId: string };
  Reviews: { bookingId: string; workerId: string };
  WorkerOnboarding: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function Tabs() {
  const { activeMode } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 68,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: Theme.colors.surface,
        },
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: activeMode === "customer" ? "home-outline" : "briefcase-outline",
            Bookings: "receipt-outline",
          };
          return <Ionicons color={color} name={iconMap[route.name]} size={size} />;
        },
      })}
    >
      {activeMode === "customer" ? (
        <Tab.Screen component={CustomerHomeScreen} name="Home" />
      ) : (
        <Tab.Screen component={WorkerHomeScreen} name="Home" />
      )}
      <Tab.Screen component={BookingHistoryScreen} name="Bookings" />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen component={LoginScreen} name="Login" />
      ) : (
        <>
          <Stack.Screen component={Tabs} name="AppTabs" />
          <Stack.Screen component={WorkerProfileScreen} name="WorkerProfile" />
          <Stack.Screen component={BookingScreen} name="Booking" />
          <Stack.Screen component={TrackingScreen} name="Tracking" />
          <Stack.Screen component={PaymentsScreen} name="Payments" />
          <Stack.Screen component={ReviewsScreen} name="Reviews" />
          <Stack.Screen component={WorkerOnboardingScreen} name="WorkerOnboarding" />
        </>
      )}
    </Stack.Navigator>
  );
}

function AppContent() {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
