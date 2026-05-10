import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Screen } from "../components/Screen";
import { useAuth } from "../context/AuthContext";
import { Theme } from "../theme/theme";

export function LoginScreen() {
  const { requestOtp, verifyOtp } = useAuth();
  const [mobile, setMobile] = useState("9876543210");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [hint, setHint] = useState("");

  return (
    <Screen>
      <LinearGradient colors={["#FFF7ED", "#FFE7D1"]} style={styles.hero}>
        <Text style={styles.brand}>igo</Text>
        <Text style={styles.title}>India’s daily work marketplace in one app.</Text>
        <Text style={styles.subtitle}>
          Book trusted workers fast, or switch modes and start earning from the same phone number.
        </Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.label}>Mobile number</Text>
        <TextInput keyboardType="phone-pad" style={styles.input} value={mobile} onChangeText={setMobile} />
        {otpSent ? (
          <>
            <Text style={styles.label}>Enter OTP</Text>
            <TextInput keyboardType="number-pad" style={styles.input} value={otp} onChangeText={setOtp} />
            <Text style={styles.hint}>{hint}</Text>
            <Pressable style={styles.button} onPress={() => verifyOtp(mobile, otp, "customer")}>
              <Text style={styles.buttonText}>Verify and continue</Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            style={styles.button}
            onPress={async () => {
              const code = await requestOtp(mobile);
              setOtpSent(true);
              setHint(`Demo OTP: ${code}`);
            }}
          >
            <Text style={styles.buttonText}>Send OTP</Text>
          </Pressable>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 28,
    padding: 24,
    gap: 10,
  },
  brand: {
    fontSize: 34,
    fontWeight: "800",
    color: Theme.colors.accentDark,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Theme.colors.text,
  },
  subtitle: {
    color: Theme.colors.muted,
    lineHeight: 22,
  },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    gap: 10,
  },
  label: {
    fontWeight: "600",
    color: Theme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#FFFDF9",
  },
  button: {
    backgroundColor: Theme.colors.accent,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
  },
  hint: {
    color: Theme.colors.accentDark,
  },
});
