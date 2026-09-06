import React, { useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function LandingPage() {
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(20)).current;
  const router = useRouter();

  useEffect(() => {
    // Smooth entrance animations
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(contentSlide, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ImageBackground
        source={require("../assets/images/loginpage.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Dark overlay for better readability */}
        <View style={styles.overlay} />
        
        {/* Content Container */}
        <View style={styles.content}>
          
          {/* Top Section - Logo & Title */}
          <View style={styles.topSection}>
            <Animated.View 
              style={[
                styles.logoWrapper,
                { transform: [{ scale: logoScale }] }
              ]}
            >
              <View style={styles.logoContainer}>
                <Image
                  source={require("../assets/images/logo.png")}
                  style={styles.logo}
                />
              </View>
            </Animated.View>

            <Animated.View 
              style={[
                styles.titleSection,
                { 
                  opacity: contentOpacity,
                  transform: [{ translateY: contentSlide }]
                }
              ]}
            >
              <Text style={styles.appName}>TravelMate</Text>
              <View style={styles.divider} />
              <Text style={styles.tagline}>Your AI-powered travel companion</Text>
            </Animated.View>
          </View>

          {/* Middle Section - Quote & Features */}
          <Animated.View 
            style={[
              styles.middleSection,
              { 
                opacity: contentOpacity,
                transform: [{ translateY: contentSlide }]
              }
            ]}
          >
            {/* Quote Card */}
            <View style={styles.quoteCard}>
              <View style={styles.quoteIcon}>
                <Ionicons name="bulb-outline" size={20} color="#4F46E5" />
              </View>
              <Text style={styles.quoteText}>
                Technology and travel united — making every journey smarter.
              </Text>
            </View>

            {/* Feature Pills with Icons */}
            <View style={styles.featuresRow}>
              <View style={styles.featurePill}>
                <Ionicons name="map-outline" size={16} color="#FFFFFF" />
                <Text style={styles.pillText}>Smart Plans</Text>
              </View>
              <View style={styles.featurePill}>
                <Ionicons name="sparkles-outline" size={16} color="#FFFFFF" />
                <Text style={styles.pillText}>AI Helper</Text>
              </View>
              <View style={styles.featurePill}>
                <Ionicons name="sync-outline" size={16} color="#FFFFFF" />
                <Text style={styles.pillText}>Live Updates</Text>
              </View>
            </View>
          </Animated.View>

          {/* Bottom Section - CTA */}
          <Animated.View 
            style={[
              styles.bottomSection,
              { 
                opacity: contentOpacity,
              }
            ]}
          >
            <TouchableOpacity
              onPress={() => router.push("/auth/sign-in")}
              activeOpacity={0.9}
              style={styles.ctaButton}
            >
              <LinearGradient
                colors={['#4F46E5', '#6366F1']}
                style={styles.ctaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.ctaText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/presentation")}
              style={styles.websiteButton}
            >
              <Ionicons name="document-text-outline" size={16} color="#FFFFFF" style={styles.websiteIcon} />
              <Text style={styles.websiteText}>View Project Presentation</Text>
            </TouchableOpacity>

            <Text style={styles.copyright}>
              © 2025 TravelMate Technologies Pvt. Ltd.
            </Text>
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },

  // TOP SECTION
  topSection: {
    alignItems: 'center',
    paddingTop: 20,
  },
  logoWrapper: {
    marginBottom: 24,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  titleSection: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: '#4F46E5',
    borderRadius: 2,
    marginVertical: 12,
  },
  tagline: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // MIDDLE SECTION
  middleSection: {
    alignItems: 'center',
  },
  quoteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingTop: 28,
    borderRadius: 20,
    marginBottom: 24,
    width: width - 40,
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  quoteIcon: {
    position: 'absolute',
    top: -16,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'rgba(79, 70, 229, 0.2)',
  },
  quoteText: {
    fontSize: 15,
    color: '#1F2937',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
    fontWeight: '500',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    gap: 6,
  },
  pillText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // BOTTOM SECTION
  bottomSection: {
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
    gap: 6,
  },
  websiteIcon: {
    opacity: 0.95,
  },
  websiteText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  copyright: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});