import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { User } from "firebase/auth";
import { auth } from "../configs/FirebaseConfig";
import LandingPage from "./LandingPage";

export default function Index() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
     if (currentUser) {
  router.replace("/LandingPage");

}
      setCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <LandingPage />;
}
// import React, { useRef, useEffect, useState } from "react";
// import { useRouter } from "expo-router";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ImageBackground,
//   TouchableOpacity,
//   Linking,
//   Animated,
//   Dimensions,
//   StatusBar,
//   ActivityIndicator,
// } from "react-native";
// import { LinearGradient } from 'expo-linear-gradient';
// import { auth } from "../configs/FirebaseConfig";
// import { User } from "firebase/auth";

// const { width, height } = Dimensions.get('window');

// export default function Index() {
//   const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
//   const [user, setUser] = useState<User | null>(null);
//   const bounceAnim = useRef(new Animated.Value(1)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideUpAnim = useRef(new Animated.Value(50)).current;
//   const router = useRouter();

//   // Check authentication status
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((currentUser: User | null) => {
//       setUser(currentUser);
//       setCheckingAuth(false);
      
//       // If user is logged in, redirect to tabs
//       if (currentUser) {
//         router.replace("/(tabs)/travel");
//       }
//     });

//     return unsubscribe;
//   }, []);

//   // Enhanced animations
//   useEffect(() => {
//     if (!checkingAuth && !user) {
//       // Logo bounce animation
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(bounceAnim, {
//             toValue: 1.08,
//             duration: 1200,
//             useNativeDriver: true,
//           }),
//           Animated.timing(bounceAnim, {
//             toValue: 1,
//             duration: 1200,
//             useNativeDriver: true,
//           }),
//         ])
//       ).start();

//       // Fade in and slide up animation for content
//       Animated.parallel([
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 1000,
//           delay: 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(slideUpAnim, {
//           toValue: 0,
//           duration: 800,
//           delay: 300,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     }
//   }, [checkingAuth, user]);

//   // Show loading spinner while checking auth
//   if (checkingAuth) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4F46E5" />
//         <Text style={styles.loadingText}>Loading...</Text>
//       </View>
//     );
//   }

//   // If user is logged in, show nothing (will redirect)
//   if (user) {
//     return null;
//   }

//   // Show landing page for non-authenticated users
//   return (
//     <>
//       <StatusBar barStyle="light-content" />
//       <ImageBackground
//         source={require("../assets/images/loginpage.jpg")}
//         style={styles.background}
//         blurRadius={0}
//       >
//         {/* Gradient Overlay for better readability */}
//         <LinearGradient
//           colors={['rgba(0,0,0,0.4)', 'rgba(79,70,229,0.3)', 'rgba(0,0,0,0.5)']}
//           style={styles.gradientOverlay}
//         />

//         <View style={styles.container}>
//           {/* Animated Logo Container */}
//           <Animated.View
//             style={[
//               styles.logoContainer,
//               { transform: [{ scale: bounceAnim }] },
//             ]}
//           >
//             <View style={styles.logoGlow}>
//               <Image
//                 source={require("../assets/images/logo.png")}
//                 style={styles.logo}
//               />
//             </View>
//           </Animated.View>

//           {/* Animated Content */}
//           <Animated.View
//             style={[
//               styles.contentContainer,
//               {
//                 opacity: fadeAnim,
//                 transform: [{ translateY: slideUpAnim }],
//               },
//             ]}
//           >
//             {/* Title Section */}
//             <View style={styles.titleSection}>
//               <Text style={styles.title}>TravelMate</Text>
//               <View style={styles.titleUnderline} />
//               <Text style={styles.subtitle}>Your AI-powered travel companion</Text>
//             </View>

//             {/* Enhanced Quote Box */}
//             <View style={styles.quoteBox}>
//               <View style={styles.quoteIconContainer}>
//                 <Text style={styles.quoteIcon}>"</Text>
//               </View>
//               <Text style={styles.quote}>
//                 Technology and travel united — making every journey smarter.
//               </Text>
//               <View style={styles.quoteDecorationLine} />
//             </View>

//             {/* Feature Highlights */}
//             <View style={styles.featuresContainer}>
//               <View style={styles.featureItem}>
//                 <Text style={styles.featureIcon}>🗺️</Text>
//                 <Text style={styles.featureText}>Smart Itineraries</Text>
//               </View>
//               <View style={styles.featureItem}>
//                 <Text style={styles.featureIcon}>🤖</Text>
//                 <Text style={styles.featureText}>AI Assistant</Text>
//               </View>
//               <View style={styles.featureItem}>
//                 <Text style={styles.featureIcon}>✈️</Text>
//                 <Text style={styles.featureText}>Real-time Updates</Text>
//               </View>
//             </View>

//             {/* CTA Button */}
//             <TouchableOpacity
//               onPress={() => router.push("/auth/sign-in")}
//               style={styles.getStartedButton}
//               activeOpacity={0.8}
//             >
//               <LinearGradient
//                 colors={['#4F46E5', '#2563EB']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//                 style={styles.buttonGradient}
//               >
//                 <Text style={styles.startedText}>Get Started</Text>
//                 <Text style={styles.buttonArrow}>→</Text>
//               </LinearGradient>
//             </TouchableOpacity>

//             {/* Website Link */}
//             <TouchableOpacity
//               onPress={() => Linking.openURL("https://yourwebsite.com")}
//               style={styles.websiteLinkContainer}
//             >
//               <Text style={styles.websiteLink}>🌐 Visit our website</Text>
//             </TouchableOpacity>
//           </Animated.View>

//           {/* Footer */}
//           <View style={styles.footerContainer}>
//             <Text style={styles.footer}>
//               © 2025 TravelMate Technologies Pvt. Ltd.
//             </Text>
//             <Text style={styles.footerSubtext}>All rights reserved.</Text>
//           </View>
//         </View>
//       </ImageBackground>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#4F46E5',
//     fontWeight: '600',
//   },
//   background: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   gradientOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 60,
//     paddingHorizontal: 24,
//   },
//   logoContainer: {
//     marginTop: 40,
//   },
//   logoGlow: {
//     backgroundColor: '#FFFFFF',
//     padding: 28,
//     borderRadius: 90,
//     shadowColor: '#4F46E5',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.4,
//     shadowRadius: 16,
//     elevation: 12,
//     borderWidth: 3,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     resizeMode: "contain",
//   },
//   contentContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//   },
//   titleSection: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   title: {
//     fontSize: 42,
//     fontWeight: '800',
//     color: '#FFFFFF',
//     letterSpacing: 1,
//     textShadowColor: 'rgba(0, 0, 0, 0.3)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 4,
//   },
//   titleUnderline: {
//     width: 60,
//     height: 4,
//     backgroundColor: '#4F46E5',
//     borderRadius: 2,
//     marginTop: 8,
//     marginBottom: 12,
//   },
//   subtitle: {
//     fontSize: 17,
//     color: '#E5E7EB',
//     fontWeight: '500',
//     letterSpacing: 0.5,
//     textShadowColor: 'rgba(0, 0, 0, 0.5)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//   },
//   quoteBox: {
//     backgroundColor: 'rgba(255, 255, 255, 0.95)',
//     paddingVertical: 24,
//     paddingHorizontal: 28,
//     borderRadius: 20,
//     marginBottom: 32,
//     width: width - 48,
//     maxWidth: 400,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: '#4F46E5',
//   },
//   quoteIconContainer: {
//     position: 'absolute',
//     top: -10,
//     left: 20,
//     backgroundColor: '#4F46E5',
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   quoteIcon: {
//     fontSize: 28,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     marginTop: -4,
//   },
//   quote: {
//     fontSize: 16,
//     color: '#111827',
//     textAlign: 'center',
//     fontStyle: 'italic',
//     lineHeight: 24,
//     marginTop: 8,
//   },
//   quoteDecorationLine: {
//     width: 40,
//     height: 2,
//     backgroundColor: '#4F46E5',
//     alignSelf: 'center',
//     marginTop: 16,
//     borderRadius: 1,
//   },
//   featuresContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     maxWidth: 380,
//     marginBottom: 36,
//     paddingHorizontal: 12,
//   },
//   featureItem: {
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//     paddingVertical: 16,
//     paddingHorizontal: 12,
//     borderRadius: 16,
//     minWidth: 100,
//     backdropFilter: 'blur(10px)',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   featureIcon: {
//     fontSize: 28,
//     marginBottom: 8,
//   },
//   featureText: {
//     fontSize: 12,
//     color: '#FFFFFF',
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   getStartedButton: {
//     borderRadius: 30,
//     overflow: 'hidden',
//     shadowColor: '#4F46E5',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.4,
//     shadowRadius: 12,
//     elevation: 10,
//     marginBottom: 20,
//   },
//   buttonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 48,
//     gap: 8,
//   },
//   startedText: {
//     fontSize: 18,
//     color: '#FFFFFF',
//     fontWeight: '700',
//     letterSpacing: 0.5,
//   },
//   buttonArrow: {
//     fontSize: 20,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//   },
//   websiteLinkContainer: {
//     paddingVertical: 8,
//   },
//   websiteLink: {
//     color: '#E5E7EB',
//     fontSize: 15,
//     fontWeight: '600',
//     textDecorationLine: 'underline',
//     textShadowColor: 'rgba(0, 0, 0, 0.3)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//   },
//   footerContainer: {
//     alignItems: 'center',
//     paddingBottom: 12,
//   },
//   footer: {
//     fontSize: 12,
//     color: '#E5E7EB',
//     textAlign: 'center',
//     fontWeight: '500',
//     textShadowColor: 'rgba(0, 0, 0, 0.5)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//   },
//   footerSubtext: {
//     fontSize: 11,
//     color: '#D1D5DB',
//     marginTop: 2,
//     textShadowColor: 'rgba(0, 0, 0, 0.5)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//   },
// });