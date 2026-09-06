import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';

export default function PresentationScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Professional Header */}
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Project Documentation</Text>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          style={styles.titleSection}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="airplane" size={42} color={colors.primary} />
          </View>
          <Text style={styles.mainTitle}>TravelMate</Text>
          <Text style={styles.subtitle}>AI-Powered Travel Planning Platform</Text>
          <Text style={styles.projectType}>Final Year Project Presentation</Text>
          <View style={styles.divider} />
          <Text style={styles.authorInfo}>January 2026</Text>
        </LinearGradient>

        {/* Problem Statement */}
        <View style={styles.section}>
          <SectionHeader 
            icon="alert-circle-outline" 
            title="The Travel Planning Challenge" 
          />
          
          <View style={styles.problemCard}>
            <CardHeader icon="close-circle" title="Current Problems" color={colors.danger} />
            <BulletPoint icon="close" text="Fragmented planning across multiple apps" color={colors.danger} isDark={true} />
            <BulletPoint icon="close" text="Time-consuming research process" color={colors.danger} isDark={true} />
            <BulletPoint icon="close" text="Information overload" color={colors.danger} isDark={true} />
            <BulletPoint icon="close" text="Difficulty in budget management" color={colors.danger} isDark={true} />
            <BulletPoint icon="close" text="Generic, non-personalized plans" color={colors.danger} isDark={true} />
          </View>

          <View style={styles.solutionCard}>
            <CardHeader icon="checkmark-circle" title="Our Solution" color={colors.success} />
            <BulletPoint icon="checkmark" text="Unified, all-in-one platform" color={colors.success} isDark={true} />
            <BulletPoint icon="checkmark" text="AI-powered automation" color={colors.success} isDark={true} />
            <BulletPoint icon="checkmark" text="Curated recommendations" color={colors.success} isDark={true} />
            <BulletPoint icon="checkmark" text="Budget-aware planning" color={colors.success} isDark={true} />
            <BulletPoint icon="checkmark" text="Personalized itineraries" color={colors.success} isDark={true} />
          </View>
        </View>

        {/* Objectives */}
        <View style={[styles.section, styles.lightSection]}>
          <SectionHeader 
            icon="flag-outline" 
            title="Project Objectives" 
            isDark={true}
          />
          <View style={styles.objectivesGrid}>
            <FeatureCard icon="albums-outline" title="Simplify Planning" desc="Single platform for trip management" />
            <FeatureCard icon="sparkles-outline" title="AI-Powered" desc="Intelligent recommendations" />
            <FeatureCard icon="sync-outline" title="Real-Time Updates" desc="Current weather & events" />
            <FeatureCard icon="wallet-outline" title="Budget-Friendly" desc="Plans within your budget" />
            <FeatureCard icon="color-palette-outline" title="Great UX" desc="Intuitive interface" />
            <FeatureCard icon="timer-outline" title="Save Time" desc="Automate tasks" />
          </View>
        </View>

        {/* Technology Stack */}
        <View style={styles.section}>
          <SectionHeader 
            icon="hardware-chip-outline" 
            title="Technology Stack" 
          />
          
          <TechCard 
            icon="phone-portrait-outline" 
            title="Frontend"
            items={[
              "React Native (Cross-platform)",
              "Expo SDK",
              "React Navigation",
              "Linear Gradients",
              "Vector Icons"
            ]}
          />

          <TechCard 
            icon="cloud-outline" 
            title="Backend"
            items={[
              "Firebase Authentication",
              "Firestore Database",
              "Cloud Functions",
              "Cloud Storage"
            ]}
          />

          <TechCard 
            icon="sparkles-outline" 
            title="AI Integration"
            items={[
              "OpenAI GPT-4",
              "Natural Language Processing",
              "Context-aware planning",
              "Smart recommendations"
            ]}
          />
        </View>

        {/* Core Features */}
        <View style={[styles.section, styles.lightSection]}>
          <SectionHeader 
            icon="star-outline" 
            title="Core Features" 
            isDark={true}
          />
          
          <TimelineItem 
            number="1"
            icon="lock-closed-outline"
            title="User Authentication"
            desc="Secure email/password and Google Sign-In"
          />
          <TimelineItem 
            number="2"
            icon="create-outline"
            title="Smart Trip Creation"
            desc="Guided workflow: Destination → Travelers → Dates → Budget"
          />
          <TimelineItem 
            number="3"
            icon="sparkles-outline"
            title="AI-Powered Itineraries"
            desc="OpenAI generates personalized day-wise plans"
          />
          <TimelineItem 
            number="4"
            icon="briefcase-outline"
            title="Trip Management"
            desc="View, edit, and organize all your trips"
          />
          <TimelineItem 
            number="5"
            icon="compass-outline"
            title="Discover & Explore"
            desc="Browse trending destinations and experiences"
          />
        </View>

        {/* Trip Creation Workflow */}
        <View style={styles.section}>
          <SectionHeader 
            icon="git-network-outline" 
            title="Trip Creation Workflow" 
          />
          
          <View style={styles.workflowContainer}>
            <WorkflowStep number="1" icon="location-outline" label="Destination Selection" />
            <WorkflowArrow />
            <WorkflowStep number="2" icon="people-outline" label="Choose Travelers" />
            <WorkflowArrow />
            <WorkflowStep number="3" icon="calendar-outline" label="Select Dates" />
            <WorkflowArrow />
            <WorkflowStep number="4" icon="cash-outline" label="Set Budget" />
            <WorkflowArrow />
            
            <View style={styles.aiMagicCard}>
              <Ionicons name="sparkles" size={32} color={colors.primary} />
              <Text style={styles.aiMagicTitle}>AI Processing</Text>
              <Text style={styles.aiMagicDesc}>
                OpenAI generates a complete personalized itinerary with day-wise activities, 
                restaurants, hotels, and budget breakdown
              </Text>
            </View>
          </View>
        </View>

        {/* Key Screens */}
        <View style={[styles.section, styles.lightSection]}>
          <SectionHeader 
            icon="phone-portrait-outline" 
            title="Application Screens" 
            isDark={true}
          />
          
          <ScreenCard icon="rocket-outline" title="Onboarding" items={["Animated landing", "Sign in/up", "Social auth"]} />
          <ScreenCard icon="airplane-outline" title="My Trips" items={["Trip list view", "Empty states", "Quick actions"]} />
          <ScreenCard icon="add-circle-outline" title="Trip Creation" items={["Multi-step wizard", "Progress indicators", "Review & confirm"]} />
          <ScreenCard icon="compass-outline" title="Discover" items={["Trending destinations", "Category browsing", "Featured experiences"]} />
          <ScreenCard icon="person-outline" title="Profile" items={["User information", "Settings", "Travel statistics"]} />
        </View>

        {/* Security */}
        <View style={styles.section}>
          <SectionHeader 
            icon="shield-checkmark-outline" 
            title="Security & Privacy" 
          />
          
          <SecurityCard icon="lock-closed-outline" title="Secure Auth" desc="Firebase authentication with encryption" />
          <SecurityCard icon="shield-outline" title="Data Protection" desc="Firestore security rules & HTTPS" />
          <SecurityCard icon="key-outline" title="API Keys" desc="Environment variables & secure storage" />
          <SecurityCard icon="eye-off-outline" title="Privacy First" desc="User data isolation & consent" />
        </View>

        {/* Future Enhancements */}
        <View style={[styles.section, styles.lightSection]}>
          <SectionHeader 
            icon="rocket-outline" 
            title="Future Enhancements" 
            isDark={true}
          />
          
          <FutureCard 
            phase="Phase 2"
            icon="calendar-outline"
            title="Booking Integration"
            desc="Flight, hotel, and activity booking with payment gateway"
          />
          <FutureCard 
            phase="Phase 2"
            icon="people-outline"
            title="Social Features"
            desc="Share itineraries and collaborative planning"
          />
          <FutureCard 
            phase="Phase 2"
            icon="map-outline"
            title="Offline Mode"
            desc="Download itineraries and offline maps"
          />
          <FutureCard 
            phase="Phase 3"
            icon="cube-outline"
            title="AR Navigation"
            desc="Augmented reality and virtual tours"
          />
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <SectionHeader 
            icon="stats-chart-outline" 
            title="Project Statistics" 
          />
          
          <View style={styles.statsGrid}>
            <StatCard number="15+" label="Screens" />
            <StatCard number="50+" label="Components" />
            <StatCard number="5000+" label="Lines of Code" />
            <StatCard number="3" label="API Integrations" />
          </View>
        </View>

        {/* Conclusion */}
        <View style={[styles.section, styles.lightSection]}>
          <SectionHeader 
            icon="checkmark-done-outline" 
            title="Conclusion" 
            isDark={true}
          />
          
          <View style={styles.conclusionCard}>
            <Text style={styles.conclusionSubtitle}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} /> Achieved
            </Text>
            <BulletPoint icon="checkmark" text="Fully functional mobile app" color={colors.success} isLight={true} />
            <BulletPoint icon="checkmark" text="AI-powered itinerary generation" color={colors.success} isLight={true} />
            <BulletPoint icon="checkmark" text="Modern, intuitive UI/UX" color={colors.success} isLight={true} />
            <BulletPoint icon="checkmark" text="Secure authentication & data" color={colors.success} isLight={true} />
            <BulletPoint icon="checkmark" text="Scalable architecture" color={colors.success} isLight={true} />
          </View>

          <View style={styles.quoteCard}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.primary} style={styles.quoteIcon} />
            <Text style={styles.quoteText}>
              TravelMate demonstrates the power of AI in transforming traditional 
              travel planning into an intelligent, personalized, and seamless experience.
            </Text>
          </View>
        </View>

        {/* Thank You */}
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          style={[styles.thankYouSection]}
        >
          <Text style={styles.thankYouTitle}>Thank You</Text>
          <Text style={styles.thankYouSubtitle}>Questions & Discussion</Text>
          
          <View style={styles.contactCard}>
            <ContactItem icon="mail-outline" text="[Your Email]" />
            <ContactItem icon="logo-github" text="GitHub: [Your GitHub]" />
            <ContactItem icon="logo-linkedin" text="LinkedIn: [Your LinkedIn]" />
          </View>

          <Text style={styles.thanksNote}>
            Special thanks to my project guide and mentors{'\n'}
            for their invaluable support and guidance
          </Text>
        </LinearGradient>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 TravelMate Technologies Pvt. Ltd.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

// Helper Components
const SectionHeader = ({ icon, title, isDark = false }) => (
  <View style={styles.sectionHeader}>
    <Ionicons name={icon} size={28} color={isDark ? colors.primary : '#fff'} />
    <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>{title}</Text>
  </View>
);

const CardHeader = ({ icon, title, color }) => (
  <View style={styles.cardHeader}>
    <Ionicons name={icon} size={24} color={color} />
    <Text style={[styles.cardTitle, { color }]}>{title}</Text>
  </View>
);

const BulletPoint = ({ icon, text, color = colors.primary, isLight = false, isDark = false }) => (
  <View style={styles.bulletPoint}>
    <Ionicons name={icon} size={16} color={color} style={styles.bulletIcon} />
    <Text style={[
      styles.bulletText, 
      isLight && styles.bulletTextDark,
      isDark && styles.bulletTextDark
    ]}>{text}</Text>
  </View>
);

const FeatureCard = ({ icon, title, desc }) => (
  <View style={styles.featureCard}>
    <Ionicons name={icon} size={32} color={colors.primary} />
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDesc}>{desc}</Text>
  </View>
);

const TechCard = ({ icon, title, items }) => (
  <View style={styles.techCard}>
    <View style={styles.techHeader}>
      <Ionicons name={icon} size={26} color="#FFFFFF" />
      <Text style={styles.techTitle}>{title}</Text>
    </View>
    {items.map((item, index) => (
      <BulletPoint key={index} icon="chevron-forward" text={item} color="#FFFFFF" />
    ))}
  </View>
);

const TimelineItem = ({ number, icon, title, desc }) => (
  <View style={styles.timelineItem}>
    <View style={styles.timelineNumber}>
      <Ionicons name={icon} size={24} color="#fff" />
    </View>
    <View style={styles.timelineContent}>
      <Text style={styles.timelineTitle}>{title}</Text>
      <Text style={styles.timelineDesc}>{desc}</Text>
    </View>
  </View>
);

const WorkflowStep = ({ number, icon, label }) => (
  <View style={styles.workflowStep}>
    <View style={styles.workflowNumber}>
      <Ionicons name={icon} size={28} color={colors.primary} />
    </View>
    <Text style={styles.workflowLabel}>{label}</Text>
  </View>
);

const WorkflowArrow = () => (
  <Ionicons name="chevron-down" size={28} color={colors.primary} style={styles.workflowArrow} />
);

const ScreenCard = ({ icon, title, items }) => (
  <View style={styles.screenCard}>
    <View style={styles.screenHeader}>
      <Ionicons name={icon} size={24} color={colors.primary} />
      <Text style={styles.screenTitle}>{title}</Text>
    </View>
    {items.map((item, index) => (
      <BulletPoint key={index} icon="chevron-forward" text={item} color={colors.primary} isLight={true} />
    ))}
  </View>
);

const SecurityCard = ({ icon, title, desc }) => (
  <View style={styles.securityCard}>
    <Ionicons name={icon} size={28} color={colors.primary} />
    <View style={styles.securityContent}>
      <Text style={styles.securityTitle}>{title}</Text>
      <Text style={styles.securityDesc}>{desc}</Text>
    </View>
  </View>
);

const FutureCard = ({ phase, icon, title, desc }) => (
  <View style={styles.futureCard}>
    <View style={styles.futureHeader}>
      <Ionicons name={icon} size={28} color={colors.primary} />
      <View style={styles.futureTextContainer}>
        <Text style={styles.futurePhase}>{phase}</Text>
        <Text style={styles.futureTitle}>{title}</Text>
      </View>
    </View>
    <Text style={styles.futureDesc}>{desc}</Text>
  </View>
);

const StatCard = ({ number, label }) => (
  <View style={styles.statCard}>
    <Text style={styles.statNumber}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ContactItem = ({ icon, text }) => (
  <View style={styles.contactItem}>
    <Ionicons name={icon} size={18} color="#fff" />
    <Text style={styles.contactText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  backText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },

  // Title Section
  titleSection: {
    padding: 40,
    alignItems: 'center',
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  projectType: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 1,
    marginVertical: 18,
  },
  authorInfo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },

  // Section Styles
  section: {
    padding: 20,
    backgroundColor: colors.primary,
  },
  lightSection: {
    backgroundColor: colors.background,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
  },
  sectionTitleDark: {
    color: colors.text,
  },

  // Cards
  problemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  solutionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1.5,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  // Bullet Points
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  bulletText: {
    color: '#fff',
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
  },
  bulletTextDark: {
    color: colors.textSecondary,
  },

  // Feature Cards
  objectivesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
  },

  // Tech Cards
  techCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  techHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 12,
  },
  techTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#fff',
  },

  // Timeline
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  timelineNumber: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 5,
  },
  timelineDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // Workflow
  workflowContainer: {
    alignItems: 'center',
  },
  workflowStep: {
    alignItems: 'center',
    marginVertical: 10,
  },
  workflowNumber: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  workflowLabel: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  workflowArrow: {
    marginVertical: 5,
  },
  aiMagicCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
    alignItems: 'center',
    width: '100%',
  },
  aiMagicTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginVertical: 10,
  },
  aiMagicDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Screen Cards
  screenCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },

  // Security Cards
  securityCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 3,
  },
  securityDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },

  // Future Cards
  futureCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  futureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  futureTextContainer: {
    flex: 1,
  },
  futurePhase: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 3,
  },
  futureTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  futureDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },

  // Conclusion
  conclusionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  conclusionSubtitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  quoteCard: {
    backgroundColor: colors.card,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderRadius: 8,
    padding: 18,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quoteIcon: {
    marginBottom: 8,
  },
  quoteText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },

  // Thank You
  thankYouSection: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  thankYouTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 10,
  },
  thankYouSubtitle: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 30,
    fontWeight: '500',
  },
  contactCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  contactText: {
    fontSize: 14,
    color: '#fff',
  },
  thanksNote: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Footer
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  footerText: {
    fontSize: 11,
    color: colors.muted,
  },
});