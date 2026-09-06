// app/auth/sign-in/index.js

import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../../configs/FirebaseConfig";

const { width: W } = Dimensions.get("window");

// ✅ HARDCODED admin credentials — no .env dependency
const ADMIN_ID = "mayuri@admin.com";
const ADMIN_PASS = "12345678";

const BLUE = "#007bff";
const BLUE2 = "#0056b3";
const BG = "#ffffff";
const BG2 = "#f5f7fa";
const BG3 = "#eef2f7";
const TEXT = "#111827";
const TEXT2 = "#6b7280";
const TEXT3 = "#9ca3af";
const BORDER = "#e5e7eb";
const RED = "#ef4444";
const GREEN = "#22c55e";
const AMBER = "#f59e0b";
const ADMIN_GOLD = "#b45309";
const ADMIN_BG = "#fffbeb";
const ADMIN_BORDER = "#fde68a";

export default function AuthScreen() {
  const [role, setRole] = useState("user");
  const [mode, setMode] = useState("signin");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [rePass, setRePass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);

  const [adminId, setAdminId] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [showAdminPass, setShowAdminPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const roleAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const switchRole = (r) => {
    Animated.spring(roleAnim, {
      toValue: r === "user" ? 0 : 1,
      tension: 80,
      friction: 11,
      useNativeDriver: true,
    }).start();
    Animated.sequence([
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
    setRole(r);
    setError("");
    setEmail("");
    setPass("");
    setName("");
    setRePass("");
    setAdminId("");
    setAdminPass("");
  };

  const switchMode = (m) => {
    Animated.sequence([
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setMode(m);
    setError("");
    setEmail("");
    setPass("");
    setName("");
    setRePass("");
  };

  const clear = () => setError("");

  // ✅ Fixed admin login
  const handleAdminLogin = () => {
    const enteredId = adminId.trim().toLowerCase();
    const enteredPass = adminPass.trim();

    console.log("Admin login attempt:", enteredId);
    console.log("Expected:", ADMIN_ID);

    if (!enteredId || !enteredPass) {
      return setError("Please enter Admin ID and password.");
    }

    if (enteredId === ADMIN_ID.toLowerCase() && enteredPass === ADMIN_PASS) {
      console.log("✅ Admin login successful!");
      router.replace("/admin");
    } else {
      console.log("❌ Admin login failed");
      setError("Invalid Admin ID or password. Check your credentials.");
    }
  };

  const handleSignIn = async () => {
    if (!email.trim() || !pass.trim())
      return setError("Please fill in all fields.");
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      router.replace("/(tabs)/travel");
    } catch (e) {
      setError(friendly(e.code));
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    if (!name.trim()) return setError("Please enter your full name.");
    if (!email.trim()) return setError("Please enter your email.");
    if (pass.length < 6)
      return setError("Password must be at least 6 characters.");
    if (pass !== rePass) return setError("Passwords do not match.");
    setLoading(true);
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        pass,
      );
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: "user",
        createdAt: new Date().toISOString(),
      });
      Alert.alert("Account Created!", `Welcome, ${name.trim()}!`, [
        {
          text: "Start Exploring",
          onPress: () => router.replace("/(tabs)/travel"),
        },
      ]);
    } catch (e) {
      setError(friendly(e.code));
    }
    setLoading(false);
  };

  const handleForgot = async () => {
    if (!email.trim()) return setError("Enter your email address first.");
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert("Reset Link Sent", "Check your email inbox.");
    } catch (e) {
      setError(friendly(e.code));
    }
  };

  const friendly = (code) =>
    ({
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password.",
      "auth/invalid-credential": "Incorrect email or password.",
      "auth/email-already-in-use": "An account already exists with this email.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/too-many-requests": "Too many attempts. Try again later.",
      "auth/network-request-failed": "No internet connection.",
      "auth/invalid-email": "Please enter a valid email address.",
    })[code] || "Something went wrong. Please try again.";

  const pwStrength = (p) => {
    if (!p || p.length < 1) return null;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^a-zA-Z\d]/.test(p)) s++;
    if (s <= 2) return { pct: "33%", color: RED, label: "Weak" };
    if (s <= 3) return { pct: "66%", color: AMBER, label: "Medium" };
    return { pct: "100%", color: GREEN, label: "Strong" };
  };
  const pw = pwStrength(pass);

  const pillX = roleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, (W - 48) / 2 + 3],
  });

  const cardOpacity = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.6],
  });

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <LinearGradient
            colors={[BLUE, BLUE2]}
            style={S.hero}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={S.heroCircle1} />
            <View style={S.heroCircle2} />
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <Text style={S.heroLabel}>AI Travel Planner</Text>
              <Text style={S.heroTitle}>Plan Your Next{"\n"}Adventure</Text>
              <Text style={S.heroSub}>
                AI-powered itineraries tailored just for you
              </Text>
            </Animated.View>
          </LinearGradient>

          <View style={S.body}>
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              {/* Role Switcher */}
              <View style={S.roleSwitcher}>
                <Animated.View
                  style={[S.rolePill, { transform: [{ translateX: pillX }] }]}
                />
                <TouchableOpacity
                  onPress={() => switchRole("user")}
                  activeOpacity={0.8}
                  style={S.roleBtn}
                >
                  <Ionicons
                    name="person-outline"
                    size={15}
                    color={role === "user" ? BLUE : TEXT3}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[S.roleBtnText, role === "user" && { color: BLUE }]}
                  >
                    Traveller
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => switchRole("admin")}
                  activeOpacity={0.8}
                  style={S.roleBtn}
                >
                  <Ionicons
                    name="shield-outline"
                    size={15}
                    color={role === "admin" ? ADMIN_GOLD : TEXT3}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      S.roleBtnText,
                      role === "admin" && { color: ADMIN_GOLD },
                    ]}
                  >
                    Admin
                  </Text>
                </TouchableOpacity>
              </View>

              {/* USER */}
              {role === "user" && (
                <Animated.View style={{ opacity: cardOpacity }}>
                  <View style={S.modeTabs}>
                    <TouchableOpacity
                      onPress={() => switchMode("signin")}
                      style={[S.modeTab, mode === "signin" && S.modeTabActive]}
                    >
                      <Text
                        style={[
                          S.modeTabText,
                          mode === "signin" && S.modeTabTextActive,
                        ]}
                      >
                        Sign In
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => switchMode("signup")}
                      style={[S.modeTab, mode === "signup" && S.modeTabActive]}
                    >
                      <Text
                        style={[
                          S.modeTabText,
                          mode === "signup" && S.modeTabTextActive,
                        ]}
                      >
                        Create Account
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {mode === "signin" && (
                    <View>
                      <Text style={S.heading}>Welcome back</Text>
                      <Text style={S.subheading}>
                        Sign in to continue your journey
                      </Text>
                      <InputField
                        icon="mail-outline"
                        label="Email Address"
                        placeholder="you@example.com"
                        value={email}
                        onChangeText={(t) => {
                          setEmail(t);
                          clear();
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                      <InputField
                        icon="lock-closed-outline"
                        label="Password"
                        placeholder="Your password"
                        value={pass}
                        onChangeText={(t) => {
                          setPass(t);
                          clear();
                        }}
                        secure={!showPass}
                        eye={showPass ? "eye-outline" : "eye-off-outline"}
                        onEye={() => setShowPass(!showPass)}
                      />
                      <TouchableOpacity
                        onPress={handleForgot}
                        style={{
                          alignSelf: "flex-end",
                          marginTop: -8,
                          marginBottom: 20,
                        }}
                      >
                        <Text style={S.forgotLink}>Forgot Password?</Text>
                      </TouchableOpacity>
                      {!!error && <ErrorBanner msg={error} />}
                      <PrimaryButton
                        label="Sign In"
                        onPress={handleSignIn}
                        loading={loading}
                      />
                      <Divider label="or continue with" />
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 12,
                          marginBottom: 28,
                        }}
                      >
                        <SocialButton icon="logo-google" label="Google" />
                        <SocialButton icon="logo-apple" label="Apple" />
                      </View>
                      <View style={S.switchRow}>
                        <Text style={S.switchText}>
                          Don't have an account?{" "}
                        </Text>
                        <TouchableOpacity onPress={() => switchMode("signup")}>
                          <Text style={S.switchLink}>Sign Up</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {mode === "signup" && (
                    <View>
                      <Text style={S.heading}>Create account</Text>
                      <Text style={S.subheading}>
                        Join thousands of travellers today
                      </Text>
                      <InputField
                        icon="person-outline"
                        label="Full Name"
                        placeholder="Your full name"
                        value={name}
                        onChangeText={(t) => {
                          setName(t);
                          clear();
                        }}
                        autoCapitalize="words"
                      />
                      <InputField
                        icon="mail-outline"
                        label="Email Address"
                        placeholder="you@example.com"
                        value={email}
                        onChangeText={(t) => {
                          setEmail(t);
                          clear();
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                      <InputField
                        icon="lock-closed-outline"
                        label="Password"
                        placeholder="Min. 6 characters"
                        value={pass}
                        onChangeText={(t) => {
                          setPass(t);
                          clear();
                        }}
                        secure={!showPass}
                        eye={showPass ? "eye-outline" : "eye-off-outline"}
                        onEye={() => setShowPass(!showPass)}
                      />
                      {pw && (
                        <View style={{ marginTop: -10, marginBottom: 16 }}>
                          <View style={S.strengthTrack}>
                            <View
                              style={[
                                S.strengthFill,
                                { width: pw.pct, backgroundColor: pw.color },
                              ]}
                            />
                          </View>
                          <Text style={[S.strengthLabel, { color: pw.color }]}>
                            {pw.label} password
                          </Text>
                        </View>
                      )}
                      <InputField
                        icon="lock-closed-outline"
                        label="Confirm Password"
                        placeholder="Re-enter password"
                        value={rePass}
                        onChangeText={(t) => {
                          setRePass(t);
                          clear();
                        }}
                        secure={!showRePass}
                        eye={showRePass ? "eye-outline" : "eye-off-outline"}
                        onEye={() => setShowRePass(!showRePass)}
                      />
                      {!!error && <ErrorBanner msg={error} />}
                      <PrimaryButton
                        label="Create Account"
                        onPress={handleSignUp}
                        loading={loading}
                      />
                      <Text style={S.termsText}>
                        By signing up, you agree to our{" "}
                        <Text style={{ color: BLUE }}>Terms</Text> and{" "}
                        <Text style={{ color: BLUE }}>Privacy Policy</Text>
                      </Text>
                      <View style={[S.switchRow, { marginTop: 12 }]}>
                        <Text style={S.switchText}>
                          Already have an account?{" "}
                        </Text>
                        <TouchableOpacity onPress={() => switchMode("signin")}>
                          <Text style={S.switchLink}>Sign In</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </Animated.View>
              )}

              {/* ADMIN */}
              {role === "admin" && (
                <Animated.View style={{ opacity: cardOpacity }}>
                  <View style={S.adminInfoCard}>
                    <View style={S.adminIconWrap}>
                      <Ionicons
                        name="shield-checkmark"
                        size={28}
                        color={ADMIN_GOLD}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={S.adminInfoTitle}>Admin Console Access</Text>
                      <Text style={S.adminInfoSub}>
                        Restricted to authorised personnel only.
                      </Text>
                    </View>
                  </View>

                  <Text style={S.heading}>Admin Sign In</Text>
                  <Text style={S.subheading}>
                    Enter your admin credentials below
                  </Text>

                  <InputField
                    icon="id-card-outline"
                    label="Admin ID (Email)"
                    placeholder="mayuri@admin.com"
                    value={adminId}
                    onChangeText={(t) => {
                      setAdminId(t);
                      clear();
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    gold
                  />
                  <InputField
                    icon="lock-closed-outline"
                    label="Admin Password"
                    placeholder="Your admin password"
                    value={adminPass}
                    onChangeText={(t) => {
                      setAdminPass(t);
                      clear();
                    }}
                    secure={!showAdminPass}
                    eye={showAdminPass ? "eye-outline" : "eye-off-outline"}
                    onEye={() => setShowAdminPass(!showAdminPass)}
                    gold
                  />

                  {!!error && <ErrorBanner msg={error} />}

                  {/* ✅ Show what credentials to use */}
                  <View style={S.credHint}>
                    <Ionicons
                      name="information-circle-outline"
                      size={16}
                      color={ADMIN_GOLD}
                    />
                    <Text style={S.credHintText}>
                      Use: <Text style={{ fontWeight: "700" }}>{ADMIN_ID}</Text>{" "}
                      / <Text style={{ fontWeight: "700" }}>{ADMIN_PASS}</Text>
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={handleAdminLogin}
                    activeOpacity={0.85}
                    style={S.adminBtn}
                  >
                    <Ionicons
                      name="shield-checkmark"
                      size={18}
                      color="#fff"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={S.adminBtnText}>Access Admin Panel</Text>
                  </TouchableOpacity>

                  <View style={S.adminNote}>
                    <View style={S.adminNoteDot} />
                    <Text style={S.adminNoteText}>
                      Admin credentials are managed by the system administrator.
                    </Text>
                  </View>
                </Animated.View>
              )}
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function InputField({
  icon,
  label,
  placeholder,
  value,
  onChangeText,
  secure,
  eye,
  onEye,
  keyboardType,
  autoCapitalize,
  gold,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[iS.label, gold && { color: ADMIN_GOLD }]}>{label}</Text>
      <View
        style={[
          iS.wrap,
          focused && iS.wrapFocused,
          focused && gold && { borderColor: ADMIN_GOLD },
          gold &&
            !focused && {
              borderColor: ADMIN_BORDER,
              backgroundColor: ADMIN_BG,
            },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={focused ? (gold ? ADMIN_GOLD : BLUE) : TEXT3}
          style={iS.icon}
        />
        <TextInput
          style={[iS.input, { fontFamily: "Outfit-Regular" }]}
          placeholder={placeholder}
          placeholderTextColor={TEXT3}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure}
          keyboardType={keyboardType || "default"}
          autoCapitalize={autoCapitalize || "none"}
          autoCorrect={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {onEye && (
          <TouchableOpacity
            onPress={onEye}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name={eye} size={18} color={TEXT3} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const iS = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT2,
    marginBottom: 6,
    fontFamily: "Outfit-Medium",
  },
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: BG2,
    gap: 10,
  },
  wrapFocused: { borderColor: BLUE, backgroundColor: "#f0f7ff" },
  icon: {},
  input: { flex: 1, paddingVertical: 14, fontSize: 15, color: TEXT },
});

function ErrorBanner({ msg }) {
  return (
    <View style={eS.wrap}>
      <Ionicons name="alert-circle" size={16} color={RED} />
      <Text style={[eS.text, { fontFamily: "Outfit-Regular" }]}>{msg}</Text>
    </View>
  );
}
const eS = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fef2f2",
    borderWidth: 1.5,
    borderColor: "#fecaca",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  text: { color: RED, fontSize: 13, flex: 1 },
});

function PrimaryButton({ label, onPress, loading }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
      style={pS.btn}
    >
      <LinearGradient
        colors={loading ? ["#9ca3af", "#9ca3af"] : [BLUE, BLUE2]}
        style={pS.grad}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={[pS.text, { fontFamily: "Outfit-Medium" }]}>
            {label}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}
const pS = StyleSheet.create({
  btn: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 3,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  grad: { paddingVertical: 16, alignItems: "center", justifyContent: "center" },
  text: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

function Divider({ label }) {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
    >
      <View style={{ flex: 1, height: 1, backgroundColor: BORDER }} />
      <Text
        style={{
          color: TEXT3,
          fontSize: 13,
          marginHorizontal: 12,
          fontFamily: "Outfit-Regular",
        }}
      >
        {label}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: BORDER }} />
    </View>
  );
}

function SocialButton({ icon, label }) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: BG,
        borderWidth: 1.5,
        borderColor: BORDER,
        borderRadius: 12,
        paddingVertical: 13,
        elevation: 1,
      }}
    >
      <Ionicons
        name={icon}
        size={20}
        color={icon === "logo-google" ? "#DB4437" : "#000"}
      />
      <Text
        style={{
          color: TEXT,
          fontSize: 14,
          fontWeight: "600",
          fontFamily: "Outfit-Medium",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const S = StyleSheet.create({
  hero: {
    height: 220,
    paddingHorizontal: 28,
    paddingTop: 64,
    paddingBottom: 32,
    overflow: "hidden",
    position: "relative",
  },
  heroCircle1: {
    position: "absolute",
    right: -40,
    top: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  heroCircle2: {
    position: "absolute",
    right: 40,
    bottom: -60,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  heroLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontFamily: "Outfit-Medium",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    fontFamily: "Outfit-Bold",
    lineHeight: 36,
    marginBottom: 8,
  },
  heroSub: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontFamily: "Outfit-Regular",
    lineHeight: 20,
  },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 28 },
  roleSwitcher: {
    flexDirection: "row",
    backgroundColor: BG3,
    borderRadius: 14,
    padding: 3,
    marginBottom: 28,
    position: "relative",
    overflow: "hidden",
  },
  rolePill: {
    position: "absolute",
    top: 3,
    bottom: 3,
    width: (W - 48 - 6) / 2,
    borderRadius: 11,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  roleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: 11,
    zIndex: 1,
  },
  roleBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT3,
    fontFamily: "Outfit-Bold",
  },
  modeTabs: {
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: BORDER,
    marginBottom: 24,
  },
  modeTab: {
    flex: 1,
    paddingBottom: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginBottom: -1.5,
  },
  modeTabActive: { borderBottomColor: BLUE },
  modeTabText: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT3,
    fontFamily: "Outfit-Medium",
  },
  modeTabTextActive: { color: BLUE },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: TEXT,
    fontFamily: "Outfit-Bold",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: TEXT2,
    fontFamily: "Outfit-Regular",
    marginBottom: 24,
  },
  forgotLink: { color: BLUE, fontSize: 13, fontFamily: "Outfit-Medium" },
  termsText: {
    color: TEXT3,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    fontFamily: "Outfit-Regular",
    marginBottom: 4,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  switchText: { color: TEXT2, fontSize: 14, fontFamily: "Outfit-Regular" },
  switchLink: {
    color: BLUE,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Outfit-Medium",
  },
  strengthTrack: {
    height: 4,
    backgroundColor: BG3,
    borderRadius: 2,
    overflow: "hidden",
  },
  strengthFill: { height: "100%", borderRadius: 2 },
  strengthLabel: { fontSize: 12, marginTop: 4, fontFamily: "Outfit-Regular" },
  adminInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: ADMIN_BG,
    borderWidth: 1.5,
    borderColor: ADMIN_BORDER,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  adminIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: ADMIN_BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  adminInfoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: ADMIN_GOLD,
    fontFamily: "Outfit-Bold",
    marginBottom: 2,
  },
  adminInfoSub: {
    fontSize: 12,
    color: "#92400e",
    fontFamily: "Outfit-Regular",
    lineHeight: 17,
  },
  credHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: ADMIN_BORDER,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  credHintText: {
    color: ADMIN_GOLD,
    fontSize: 13,
    fontFamily: "Outfit-Regular",
    flex: 1,
  },
  adminBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ADMIN_GOLD,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
    elevation: 3,
  },
  adminBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Outfit-Bold",
  },
  adminNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  adminNoteDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GREEN,
  },
  adminNoteText: {
    color: TEXT3,
    fontSize: 12,
    fontFamily: "Outfit-Regular",
    flex: 1,
  },
});
