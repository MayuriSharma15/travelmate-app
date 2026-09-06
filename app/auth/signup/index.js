// // import { createUserWithEmailAndPassword } from "firebase/auth";
// // import { useState } from "react";
// // import {
// //   ActivityIndicator,
// //   Alert,
// //   KeyboardAvoidingView,
// //   Platform,
// //   StyleSheet,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   View
// // } from "react-native";
// // import { auth } from "../../../configs/FirebaseConfig";

// // import Ionicons from "@expo/vector-icons/Ionicons";
// // import { useRouter } from "expo-router"; // ✅ Expo Router

// // export default function SignUp() {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [rePassword, setRePassword] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const router = useRouter(); // ✅ instead of useNavigation()

// //   const handleSignUp = async () => {
// //     if (!email || !password || !rePassword) {
// //       Alert.alert("Error", "All fields are required");
// //       return;
// //     }

// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     if (!emailRegex.test(email)) {
// //       Alert.alert("Error", "Please enter a valid email address");
// //       return;
// //     }

// //     if (password.length < 6) {
// //       Alert.alert("Error", "Password should be at least 6 characters");
// //       return;
// //     }

// //     if (password !== rePassword) {
// //       Alert.alert("Error", "Passwords do not match");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       await createUserWithEmailAndPassword(auth, email, password);
// //       Alert.alert("Success", "Account created successfully!");

// //       // ✅ Prevent going back to SignUp
// //       router.replace("/auth/sign-in");
// //     } catch (error) {
// //       let msg = "Something went wrong. Please try again.";
// //       if (error.code === "auth/email-already-in-use") msg = "That email is already registered.";
// //       if (error.code === "auth/invalid-email") msg = "Invalid email format.";
// //       if (error.code === "auth/weak-password") msg = "Password must be at least 6 characters.";
// //       Alert.alert("Sign Up Failed", msg);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <KeyboardAvoidingView
// //       behavior={Platform.OS === "ios" ? "padding" : undefined}
// //       style={{ flex: 1 }}
// //     >
// //       <View style={styles.container}>
// //         {/* Back Arrow */}
// //         <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
// //           <Ionicons name="arrow-back" size={24} color="black" />
// //         </TouchableOpacity>

// //         <Text style={[styles.title, { fontFamily: "Outfit-Bold" }]}>Sign Up</Text>

// //         <TextInput
// //           style={[styles.input, { fontFamily: "Outfit-Regular" }]}
// //           placeholder="Email"
// //           value={email}
// //           onChangeText={setEmail}
// //           keyboardType="email-address"
// //           autoCapitalize="none"
// //         />

// //         <TextInput
// //           style={[styles.input, { fontFamily: "Outfit-Regular" }]}
// //           placeholder="Password"
// //           value={password}
// //           onChangeText={setPassword}
// //           secureTextEntry
// //         />

// //         <TextInput
// //           style={[styles.input, { fontFamily: "Outfit-Regular" }]}
// //           placeholder="Re-enter Password"
// //           value={rePassword}
// //           onChangeText={setRePassword}
// //           secureTextEntry
// //         />

// //         <TouchableOpacity
// //           style={[styles.button, loading && { opacity: 0.7 }]}
// //           onPress={handleSignUp}
// //           disabled={loading}
// //         >
// //           {loading ? (
// //             <ActivityIndicator size="small" color="#fff" />
// //           ) : (
// //             <Text style={[styles.buttonText, { fontFamily: "Outfit-Medium" }]}>Sign Up</Text>
// //           )}
// //         </TouchableOpacity>

// //         {/* ✅ Use router.push instead of navigation.navigate */}
// //         <TouchableOpacity onPress={() => router.push("/auth/sign-in")}>
// //           <Text style={[styles.link, { fontFamily: "Outfit-Regular" }]}>
// //             Already have an account? Sign In
// //           </Text>
// //         </TouchableOpacity>
// //       </View>
// //     </KeyboardAvoidingView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "#fff",
// //     padding: 20,
// //   },
// //   backButton: {
// //     position: "absolute",
// //     top: 50,
// //     left: 20,
// //     zIndex: 1,
// //   },
// //   title: {
// //     fontSize: 28,
// //     fontWeight: "bold",
// //     marginBottom: 30,
// //   },
// //   input: {
// //     width: "100%",
// //     borderWidth: 1,
// //     borderColor: "#ccc",
// //     padding: 12,
// //     marginVertical: 8,
// //     borderRadius: 8,
// //   },
// //   button: {
// //     backgroundColor: "#007bff",
// //     padding: 15,
// //     borderRadius: 8,
// //     marginTop: 15,
// //     width: "100%",
// //     alignItems: "center",
// //   },
// //   buttonText: {
// //     color: "#fff",
// //     fontSize: 16,
// //     fontWeight: "bold",
// //   },
// //   link: {
// //     marginTop: 15,
// //     color: "#007bff",
// //   },
// // });
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   ScrollView,
// } from "react-native";
// import { auth } from "../../../configs/FirebaseConfig";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { useRouter } from "expo-router";
// import { LinearGradient } from "expo-linear-gradient";

// export default function SignUp() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rePassword, setRePassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showRePassword, setShowRePassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});

//   const router = useRouter();

//   // Real-time validation
//   const validateEmail = (value) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!value) return "Email is required";
//     if (!emailRegex.test(value)) return "Please enter a valid email";
//     return "";
//   };

//   const validatePassword = (value) => {
//     if (!value) return "Password is required";
//     if (value.length < 6) return "Password must be at least 6 characters";
//     return "";
//   };

//   const validateRePassword = (value) => {
//     if (!value) return "Please confirm your password";
//     if (value !== password) return "Passwords do not match";
//     return "";
//   };

//   // Password strength calculation
//   const getPasswordStrength = (pass) => {
//     if (!pass) return { strength: 0, text: "", color: "#ccc" };
    
//     let strength = 0;
//     if (pass.length >= 6) strength++;
//     if (pass.length >= 10) strength++;
//     if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
//     if (/\d/.test(pass)) strength++;
//     if (/[^a-zA-Z\d]/.test(pass)) strength++;

//     if (strength <= 2) return { strength: 33, text: "Weak", color: "#ff4444" };
//     if (strength <= 3) return { strength: 66, text: "Medium", color: "#ffbb33" };
//     return { strength: 100, text: "Strong", color: "#00C851" };
//   };

//   const handleBlur = (field) => {
//     setTouched({ ...touched, [field]: true });
//   };

//   const handleEmailChange = (value) => {
//     setEmail(value);
//     if (touched.email) {
//       setErrors({ ...errors, email: validateEmail(value) });
//     }
//   };

//   const handlePasswordChange = (value) => {
//     setPassword(value);
//     if (touched.password) {
//       setErrors({ ...errors, password: validatePassword(value) });
//     }
//     if (touched.rePassword && rePassword) {
//       setErrors({ ...errors, rePassword: value !== rePassword ? "Passwords do not match" : "" });
//     }
//   };

//   const handleRePasswordChange = (value) => {
//     setRePassword(value);
//     if (touched.rePassword) {
//       setErrors({ ...errors, rePassword: validateRePassword(value) });
//     }
//   };

//   const handleSignUp = async () => {
//     // Validate all fields
//     const emailError = validateEmail(email);
//     const passwordError = validatePassword(password);
//     const rePasswordError = validateRePassword(rePassword);

//     setErrors({
//       email: emailError,
//       password: passwordError,
//       rePassword: rePasswordError,
//     });

//     setTouched({
//       email: true,
//       password: true,
//       rePassword: true,
//     });

//     if (emailError || passwordError || rePasswordError) {
//       return;
//     }

//     setLoading(true);
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       Alert.alert("Success", "Account created successfully!", [
//         { text: "OK", onPress: () => router.replace("/auth/sign-in") }
//       ]);
//     } catch (error) {
//       let msg = "Something went wrong. Please try again.";
//       if (error.code === "auth/email-already-in-use") msg = "That email is already registered.";
//       if (error.code === "auth/invalid-email") msg = "Invalid email format.";
//       if (error.code === "auth/weak-password") msg = "Password must be at least 6 characters.";
//       Alert.alert("Sign Up Failed", msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const passwordStrength = getPasswordStrength(password);

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//       style={{ flex: 1 }}
//     >
//       <ScrollView 
//         contentContainerStyle={styles.scrollContainer}
//         keyboardShouldPersistTaps="handled"
//       >
//         <View style={styles.container}>
//           {/* Back Button */}
//           <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//             <View style={styles.backButtonCircle}>
//               <Ionicons name="arrow-back" size={24} color="#007bff" />
//             </View>
//           </TouchableOpacity>

//           {/* Header Section */}
//           <View style={styles.header}>
//             <Text style={[styles.title, { fontFamily: "Outfit-Bold" }]}>
//               Create Account
//             </Text>
//             <Text style={[styles.subtitle, { fontFamily: "Outfit-Regular" }]}>
//               Sign up to get started
//             </Text>
//           </View>

//           {/* Form Section */}
//           <View style={styles.form}>
//             {/* Email Input */}
//             <View style={styles.inputContainer}>
//               <View style={[
//                 styles.inputWrapper,
//                 touched.email && errors.email && styles.inputError
//               ]}>
//                 <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
//                 <TextInput
//                   style={[styles.input, { fontFamily: "Outfit-Regular" }]}
//                   placeholder="Email address"
//                   value={email}
//                   onChangeText={handleEmailChange}
//                   onBlur={() => handleBlur("email")}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                 />
//               </View>
//               {touched.email && errors.email ? (
//                 <Text style={[styles.errorText, { fontFamily: "Outfit-Regular" }]}>
//                   {errors.email}
//                 </Text>
//               ) : null}
//             </View>

//             {/* Password Input */}
//             <View style={styles.inputContainer}>
//               <View style={[
//                 styles.inputWrapper,
//                 touched.password && errors.password && styles.inputError
//               ]}>
//                 <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
//                 <TextInput
//                   style={[styles.input, { fontFamily: "Outfit-Regular" }]}
//                   placeholder="Password"
//                   value={password}
//                   onChangeText={handlePasswordChange}
//                   onBlur={() => handleBlur("password")}
//                   secureTextEntry={!showPassword}
//                 />
//                 <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//                   <Ionicons 
//                     name={showPassword ? "eye-outline" : "eye-off-outline"} 
//                     size={20} 
//                     color="#666" 
//                   />
//                 </TouchableOpacity>
//               </View>
//               {touched.password && errors.password ? (
//                 <Text style={[styles.errorText, { fontFamily: "Outfit-Regular" }]}>
//                   {errors.password}
//                 </Text>
//               ) : null}
              
//               {/* Password Strength Indicator */}
//               {password.length > 0 && (
//                 <View style={styles.strengthContainer}>
//                   <View style={styles.strengthBar}>
//                     <View 
//                       style={[
//                         styles.strengthFill, 
//                         { width: `${passwordStrength.strength}%`, backgroundColor: passwordStrength.color }
//                       ]} 
//                     />
//                   </View>
//                   <Text style={[styles.strengthText, { fontFamily: "Outfit-Regular", color: passwordStrength.color }]}>
//                     {passwordStrength.text}
//                   </Text>
//                 </View>
//               )}
//             </View>

//             {/* Re-enter Password Input */}
//             <View style={styles.inputContainer}>
//               <View style={[
//                 styles.inputWrapper,
//                 touched.rePassword && errors.rePassword && styles.inputError
//               ]}>
//                 <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
//                 <TextInput
//                   style={[styles.input, { fontFamily: "Outfit-Regular" }]}
//                   placeholder="Confirm password"
//                   value={rePassword}
//                   onChangeText={handleRePasswordChange}
//                   onBlur={() => handleBlur("rePassword")}
//                   secureTextEntry={!showRePassword}
//                 />
//                 <TouchableOpacity onPress={() => setShowRePassword(!showRePassword)}>
//                   <Ionicons 
//                     name={showRePassword ? "eye-outline" : "eye-off-outline"} 
//                     size={20} 
//                     color="#666" 
//                   />
//                 </TouchableOpacity>
//               </View>
//               {touched.rePassword && errors.rePassword ? (
//                 <Text style={[styles.errorText, { fontFamily: "Outfit-Regular" }]}>
//                   {errors.rePassword}
//                 </Text>
//               ) : null}
//             </View>

//             {/* Sign Up Button */}
//             <TouchableOpacity
//               style={[styles.button, loading && styles.buttonDisabled]}
//               onPress={handleSignUp}
//               disabled={loading}
//               activeOpacity={0.8}
//             >
//               <LinearGradient
//                 colors={loading ? ["#ccc", "#999"] : ["#007bff", "#0056b3"]}
//                 style={styles.buttonGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//               >
//                 {loading ? (
//                   <ActivityIndicator size="small" color="#fff" />
//                 ) : (
//                   <Text style={[styles.buttonText, { fontFamily: "Outfit-Medium" }]}>
//                     Create Account
//                   </Text>
//                 )}
//               </LinearGradient>
//             </TouchableOpacity>

//             {/* Divider */}
//             <View style={styles.divider}>
//               <View style={styles.dividerLine} />
//               <Text style={[styles.dividerText, { fontFamily: "Outfit-Regular" }]}>
//                 or continue with
//               </Text>
//               <View style={styles.dividerLine} />
//             </View>

//             {/* Social Login Buttons */}
//             <View style={styles.socialContainer}>
//               <TouchableOpacity style={styles.socialButton}>
//                 <Ionicons name="logo-google" size={24} color="#DB4437" />
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.socialButton}>
//                 <Ionicons name="logo-apple" size={24} color="#000" />
//               </TouchableOpacity>
//             </View>

//             {/* Sign In Link */}
//             <View style={styles.footer}>
//               <Text style={[styles.footerText, { fontFamily: "Outfit-Regular" }]}>
//                 Already have an account?{" "}
//               </Text>
//               <TouchableOpacity onPress={() => router.push("/auth/sign-in")}>
//                 <Text style={[styles.link, { fontFamily: "Outfit-Medium" }]}>
//                   Sign In
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 24,
//   },
//   backButton: {
//     position: "absolute",
//     top: 50,
//     left: 20,
//     zIndex: 1,
//   },
//   backButtonCircle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#f0f0f0",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     marginTop: 120,
//     marginBottom: 40,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: "bold",
//     color: "#1a1a1a",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#666",
//   },
//   form: {
//     width: "100%",
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   inputWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1.5,
//     borderColor: "#e0e0e0",
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     backgroundColor: "#fafafa",
//   },
//   inputError: {
//     borderColor: "#ff4444",
//   },
//   inputIcon: {
//     marginRight: 12,
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 16,
//     fontSize: 16,
//     color: "#1a1a1a",
//   },
//   errorText: {
//     color: "#ff4444",
//     fontSize: 12,
//     marginTop: 6,
//     marginLeft: 4,
//   },
//   strengthContainer: {
//     marginTop: 8,
//   },
//   strengthBar: {
//     height: 4,
//     backgroundColor: "#e0e0e0",
//     borderRadius: 2,
//     overflow: "hidden",
//   },
//   strengthFill: {
//     height: "100%",
//     borderRadius: 2,
//   },
//   strengthText: {
//     fontSize: 12,
//     marginTop: 4,
//     fontWeight: "500",
//   },
//   button: {
//     marginTop: 10,
//     borderRadius: 12,
//     overflow: "hidden",
//     elevation: 2,
//     shadowColor: "#007bff",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//   },
//   buttonDisabled: {
//     elevation: 0,
//     shadowOpacity: 0,
//   },
//   buttonGradient: {
//     paddingVertical: 16,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   divider: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 30,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#e0e0e0",
//   },
//   dividerText: {
//     marginHorizontal: 16,
//     color: "#999",
//     fontSize: 14,
//   },
//   socialContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 16,
//     marginBottom: 30,
//   },
//   socialButton: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "#f5f5f5",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 40,
//   },
//   footerText: {
//     color: "#666",
//     fontSize: 14,
//   },
//   link: {
//     color: "#007bff",
//     fontSize: 14,
//     fontWeight: "600",
//   },
// });

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";   // ← NEW
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { auth, db } from "../../../configs/FirebaseConfig";  // ← added db
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const router = useRouter();

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return "Email is required";
    if (!emailRegex.test(value)) return "Please enter a valid email";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateRePassword = (value) => {
    if (!value) return "Please confirm your password";
    if (value !== password) return "Passwords do not match";
    return "";
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { strength: 0, text: "", color: "#ccc" };
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.length >= 10) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z\d]/.test(pass)) strength++;
    if (strength <= 2) return { strength: 33, text: "Weak", color: "#ff4444" };
    if (strength <= 3) return { strength: 66, text: "Medium", color: "#ffbb33" };
    return { strength: 100, text: "Strong", color: "#00C851" };
  };

  const handleBlur = (field) => setTouched({ ...touched, [field]: true });

  const handleEmailChange = (value) => {
    setEmail(value);
    if (touched.email) setErrors({ ...errors, email: validateEmail(value) });
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (touched.password) setErrors({ ...errors, password: validatePassword(value) });
    if (touched.rePassword && rePassword) {
      setErrors({ ...errors, rePassword: value !== rePassword ? "Passwords do not match" : "" });
    }
  };

  const handleRePasswordChange = (value) => {
    setRePassword(value);
    if (touched.rePassword) setErrors({ ...errors, rePassword: validateRePassword(value) });
  };

  // ── ONLY THIS FUNCTION CHANGED ────────────────────────────────────────────
  const handleSignUp = async () => {
    const emailError      = validateEmail(email);
    const passwordError   = validatePassword(password);
    const rePasswordError = validateRePassword(rePassword);

    setErrors({ email: emailError, password: passwordError, rePassword: rePasswordError });
    setTouched({ email: true, password: true, rePassword: true });

    if (emailError || passwordError || rePasswordError) return;

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // Save user to Firestore with role = "user"
      // Admins are promoted manually in Firebase console (role → "admin")
      await setDoc(doc(db, "users", cred.user.uid), {
        uid:       cred.user.uid,
        email:     email.trim().toLowerCase(),
        role:      "user",                        // ← default role
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.replace("/auth/sign-in") },
      ]);
    } catch (error) {
      let msg = "Something went wrong. Please try again.";
      if (error.code === "auth/email-already-in-use") msg = "That email is already registered.";
      if (error.code === "auth/invalid-email")        msg = "Invalid email format.";
      if (error.code === "auth/weak-password")        msg = "Password must be at least 6 characters.";
      Alert.alert("Sign Up Failed", msg);
    } finally {
      setLoading(false);
    }
  };
  // ── END OF CHANGES ────────────────────────────────────────────────────────

  const passwordStrength = getPasswordStrength(password);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <View style={styles.backButtonCircle}>
              <Ionicons name="arrow-back" size={24} color="#007bff" />
            </View>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[styles.title, { fontFamily: "Outfit-Bold" }]}>Create Account</Text>
            <Text style={[styles.subtitle, { fontFamily: "Outfit-Regular" }]}>Sign up to get started</Text>
          </View>

          <View style={styles.form}>
            {/* Email */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, touched.email && errors.email && styles.inputError]}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { fontFamily: "Outfit-Regular" }]}
                  placeholder="Email address"
                  value={email}
                  onChangeText={handleEmailChange}
                  onBlur={() => handleBlur("email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {touched.email && errors.email ? (
                <Text style={[styles.errorText, { fontFamily: "Outfit-Regular" }]}>{errors.email}</Text>
              ) : null}
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, touched.password && errors.password && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { fontFamily: "Outfit-Regular" }]}
                  placeholder="Password"
                  value={password}
                  onChangeText={handlePasswordChange}
                  onBlur={() => handleBlur("password")}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password ? (
                <Text style={[styles.errorText, { fontFamily: "Outfit-Regular" }]}>{errors.password}</Text>
              ) : null}
              {password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBar}>
                    <View style={[styles.strengthFill, { width: `${passwordStrength.strength}%`, backgroundColor: passwordStrength.color }]} />
                  </View>
                  <Text style={[styles.strengthText, { fontFamily: "Outfit-Regular", color: passwordStrength.color }]}>
                    {passwordStrength.text}
                  </Text>
                </View>
              )}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, touched.rePassword && errors.rePassword && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { fontFamily: "Outfit-Regular" }]}
                  placeholder="Confirm password"
                  value={rePassword}
                  onChangeText={handleRePasswordChange}
                  onBlur={() => handleBlur("rePassword")}
                  secureTextEntry={!showRePassword}
                />
                <TouchableOpacity onPress={() => setShowRePassword(!showRePassword)}>
                  <Ionicons name={showRePassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
                </TouchableOpacity>
              </View>
              {touched.rePassword && errors.rePassword ? (
                <Text style={[styles.errorText, { fontFamily: "Outfit-Regular" }]}>{errors.rePassword}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={loading ? ["#ccc", "#999"] : ["#007bff", "#0056b3"]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={[styles.buttonText, { fontFamily: "Outfit-Medium" }]}>Create Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={[styles.dividerText, { fontFamily: "Outfit-Regular" }]}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={24} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-apple" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { fontFamily: "Outfit-Regular" }]}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/sign-in")}>
                <Text style={[styles.link, { fontFamily: "Outfit-Medium" }]}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 24 },
  backButton: { position: "absolute", top: 50, left: 20, zIndex: 1 },
  backButtonCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#f0f0f0", justifyContent: "center", alignItems: "center" },
  header: { marginTop: 120, marginBottom: 40 },
  title: { fontSize: 32, fontWeight: "bold", color: "#1a1a1a", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666" },
  form: { width: "100%" },
  inputContainer: { marginBottom: 20 },
  inputWrapper: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: "#e0e0e0", borderRadius: 12, paddingHorizontal: 16, backgroundColor: "#fafafa" },
  inputError: { borderColor: "#ff4444" },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 16, fontSize: 16, color: "#1a1a1a" },
  errorText: { color: "#ff4444", fontSize: 12, marginTop: 6, marginLeft: 4 },
  strengthContainer: { marginTop: 8 },
  strengthBar: { height: 4, backgroundColor: "#e0e0e0", borderRadius: 2, overflow: "hidden" },
  strengthFill: { height: "100%", borderRadius: 2 },
  strengthText: { fontSize: 12, marginTop: 4, fontWeight: "500" },
  button: { marginTop: 10, borderRadius: 12, overflow: "hidden", elevation: 2, shadowColor: "#007bff", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  buttonDisabled: { elevation: 0, shadowOpacity: 0 },
  buttonGradient: { paddingVertical: 16, alignItems: "center", justifyContent: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 30 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e0e0e0" },
  dividerText: { marginHorizontal: 16, color: "#999", fontSize: 14 },
  socialContainer: { flexDirection: "row", justifyContent: "center", gap: 16, marginBottom: 30 },
  socialButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#f5f5f5", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#e0e0e0" },
  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 40 },
  footerText: { color: "#666", fontSize: 14 },
  link: { color: "#007bff", fontSize: 14, fontWeight: "600" },
});