import { auth, db } from "@/configs/FirebaseConfig";
import { useTheme } from "@/context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { sendEmailVerification, signOut, updateProfile } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const isWeb = Platform.OS === "web";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ trips: 0, places: 0, saved: 0 });
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);

  const router = useRouter();
  const { theme, isDarkMode, toggleTheme } = useTheme();

  const languages = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Hindi", "Chinese", "Japanese"];

  useEffect(() => {
    loadUserData();
    loadUserStats();
    const sub = Dimensions.addEventListener("change", ({ window }) => setScreenWidth(window.width));
    return () => sub?.remove?.();
  }, []);

  const contentMaxWidth = isWeb ? Math.min(screenWidth, 800) : screenWidth;

  const loadUserData = () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userData = {
        displayName: currentUser.displayName || extractNameFromEmail(currentUser.email),
        email: currentUser.email,
        photoURL: currentUser.photoURL,
        emailVerified: currentUser.emailVerified,
        createdAt: currentUser.metadata.creationTime,
      };
      setUser(userData);
      setDisplayName(userData.displayName);
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      const tripsQuery = query(collection(db, "UserTrips"), where("userEmail", "==", currentUser.email));
      const tripsSnapshot = await getDocs(tripsQuery);
      const tripCount = tripsSnapshot.size;
      let totalPlaces = 0;
      tripsSnapshot.forEach((doc) => {
        const tripData = doc.data();
        if (tripData.tripPlan?.trip) totalPlaces += tripData.tripPlan.trip.length;
      });
      setStats({ trips: tripCount, places: totalPlaces, saved: 0 });
    } catch (error) {
      console.log("Error loading stats:", error);
    }
  };

  const extractNameFromEmail = (email) => {
    if (!email) return "User";
    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const handleEditProfile = () => setEditModalVisible(true);

  const handleSaveProfile = async () => {
    try {
      const currentUser = auth.currentUser;
      await updateProfile(currentUser, { displayName: displayName });
      setUser({ ...user, displayName: displayName });
      Alert.alert("Success", "Profile updated successfully!");
      setEditModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const currentUser = auth.currentUser;
      await sendEmailVerification(currentUser);
      Alert.alert("Verification Email Sent", "Please check your inbox and verify your email address.", [{ text: "OK" }]);
    } catch (error) {
      Alert.alert("Error", "Failed to send verification email. Please try again.");
    }
  };

  const handleSecurityPrivacy = () => {
    Alert.alert("Security & Privacy", "Choose an option:", [
      { text: "Change Password", onPress: () => handleChangePassword() },
      { text: "Privacy Settings", onPress: () => Alert.alert("Privacy Settings", "Privacy settings coming soon!") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleChangePassword = () => {
    Alert.alert("Change Password", "A password reset link will be sent to your email.", [
      { text: "Cancel", style: "cancel" },
      { text: "Send Link", onPress: () => Alert.alert("Success", "Password reset link sent to your email!") },
    ]);
  };

  const handleNotifications = () => {
    Alert.alert("Notifications", "Configure your notification preferences:", [
      { text: "Trip Updates", onPress: () => Alert.alert("Enabled", "Trip updates enabled") },
      { text: "Promotions", onPress: () => Alert.alert("Enabled", "Promotions enabled") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setLanguageModalVisible(false);
    Alert.alert("Language Changed", `Language set to ${language}`);
  };

  const handleHelpCenter = () => {
    Alert.alert("Help Center", "How can we help you?", [
      { text: "FAQs", onPress: () => Alert.alert("FAQs", "Frequently asked questions coming soon!") },
      { text: "Contact Support", onPress: () => Alert.alert("Contact", "Email: support@travelapp.com") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleTermsPrivacy = () => {
    Alert.alert("Terms & Privacy", "View our policies:", [
      { text: "Terms of Service", onPress: () => Linking.openURL("https://example.com/terms") },
      { text: "Privacy Policy", onPress: () => Linking.openURL("https://example.com/privacy") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleAbout = () => {
    Alert.alert("About", "AI Travel Planner\nVersion 1.0.0\n\nYour intelligent travel companion for planning amazing trips!", [{ text: "OK" }]);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            router.replace("/auth/sign-in");
          } catch (error) {
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const getInitials = (name, email) => {
    if (name && name !== "User") return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "U";
  };

  const getJoinedDate = (timestamp) => {
    if (!timestamp) return "Recently";
    const date = new Date(timestamp);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={[styles.loadingText, { fontFamily: "Outfit-Regular", color: theme.colors.text }]}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={[styles.loadingText, { fontFamily: "Outfit-Regular", color: theme.colors.text }]}>Please sign in</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={{ maxWidth: contentMaxWidth, width: "100%", alignSelf: "center" }}>
        <View style={styles.header}>
          <Text style={[styles.heading, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>Profile</Text>
          <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.colors.card }]} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.profileCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.profileHeader}>
            {user.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.avatarText, { fontFamily: "Outfit-Bold" }]}>{getInitials(user.displayName, user.email)}</Text>
              </View>
            )}
            <View style={styles.profileInfo}>
              <View style={styles.nameContainer}>
                <Text style={[styles.name, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>{user.displayName}</Text>
                {user.emailVerified && (
                  <Ionicons name="checkmark-circle" size={18} color={theme.colors.verified || "#4CAF50"} />
                )}
              </View>
              <Text style={[styles.email, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>{user.email}</Text>
              <View style={styles.joinedContainer}>
                <Ionicons name="calendar-outline" size={14} color={theme.colors.textTertiary || theme.colors.textSecondary} />
                <Text style={[styles.joinedText, { fontFamily: "Outfit-Regular", color: theme.colors.textTertiary || theme.colors.textSecondary }]}>
                  Joined {getJoinedDate(user.createdAt)}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.statsContainer, { borderTopColor: theme.colors.border }]}>
            <TouchableOpacity style={styles.statItem} onPress={() => router.push("/(tabs)/mytrip")}>
              <Ionicons name="airplane" size={22} color="#007bff" />
              <Text style={[styles.statNumber, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>{stats.trips}</Text>
              <Text style={[styles.statLabel, { fontFamily: "Outfit-Regular", color: theme.colors.textTertiary || theme.colors.textSecondary }]}>Trips</Text>
            </TouchableOpacity>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
            <TouchableOpacity style={styles.statItem}>
              <Ionicons name="location" size={22} color="#ff6b6b" />
              <Text style={[styles.statNumber, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>{stats.places}</Text>
              <Text style={[styles.statLabel, { fontFamily: "Outfit-Regular", color: theme.colors.textTertiary || theme.colors.textSecondary }]}>Places</Text>
            </TouchableOpacity>
            <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
            <TouchableOpacity style={styles.statItem}>
              <Ionicons name="heart" size={22} color="#ff4081" />
              <Text style={[styles.statNumber, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>{stats.saved}</Text>
              <Text style={[styles.statLabel, { fontFamily: "Outfit-Regular", color: theme.colors.textTertiary || theme.colors.textSecondary }]}>Saved</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: "Outfit-Medium", color: theme.colors.textTertiary || theme.colors.textSecondary }]}>ACCOUNT</Text>

          <TouchableOpacity style={[styles.option, { backgroundColor: theme.colors.card }]} onPress={handleEditProfile}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: "#007bff15" }]}>
                <Ionicons name="person-outline" size={20} color="#007bff" />
              </View>
              <Text style={[styles.optionText, { fontFamily: "Outfit-Regular", color: theme.colors.text }]}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.option, { backgroundColor: theme.colors.card }]} onPress={handleSecurityPrivacy}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: "#ff6b6b15" }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#ff6b6b" />
              </View>
              <Text style={[styles.optionText, { fontFamily: "Outfit-Regular", color: theme.colors.text }]}>Security & Privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          {!user.emailVerified && (
            <TouchableOpacity style={[styles.option, { backgroundColor: theme.colors.card }]} onPress={handleVerifyEmail}>
              <View style={styles.optionLeft}>
                <View style={[styles.iconContainer, { backgroundColor: "#ffa50015" }]}>
                  <Ionicons name="mail-outline" size={20} color="#ffa500" />
                </View>
                <View>
                  <Text style={[styles.optionText, { fontFamily: "Outfit-Regular", color: theme.colors.text }]}>Verify Email</Text>
                  <Text style={[styles.optionSubtext, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>Confirm your email address</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: "Outfit-Medium", color: theme.colors.textTertiary || theme.colors.textSecondary }]}>TRAVEL</Text>

          <TouchableOpacity style={[styles.option, { backgroundColor: theme.colors.card }]} onPress={() => router.push("/(tabs)/mytrip")}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: "#9c27b015" }]}>
                <Ionicons name="map-outline" size={20} color="#9c27b0" />
              </View>
              <Text style={[styles.optionText, { fontFamily: "Outfit-Regular", color: theme.colors.text }]}>My Trips</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.badgeText, { fontFamily: "Outfit-Medium" }]}>{stats.trips}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.option, { backgroundColor: theme.colors.card }]} onPress={() => router.push("/(tabs)/discover")}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: "#4caf5015" }]}>
                <Ionicons name="bookmark-outline" size={20} color="#4caf50" />
              </View>
              <Text style={[styles.optionText, { fontFamily: "Outfit-Regular", color: theme.colors.text }]}>Saved Places</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.badgeText, { fontFamily: "Outfit-Medium" }]}>{stats.saved}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.option, { backgroundColor: theme.colors.card }]} onPress={() => Alert.alert("Favorites", "Favorites feature coming soon!")}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: "#ff980015" }]}>
                <Ionicons name="star-outline" size={20} color="#ff9800" />
              </View>
              <Text style={[styles.optionText, { fontFamily: "Outfit-Regular", color: theme.colors.text }]}>Favorites</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: "Outfit-Medium", color: theme.colors.textTertiary || theme.colors.textSecondary }]}>PREFERENCES</Text>

          <TouchableOpacity style={[styles.option, { backgroundColor: theme.colors.card }]} onPress={handleNotifications}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: "#00bcd415" }]}>
                <Ionicons name="notifications-outline" size={20} color="#00bcd4" />
              </View>
              <Text style={[styles.optionText, { fontFamily: "Outfit-Regular", color: theme.colors.text }]}>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.option, { backgroundColor: theme.colors.card }]} onPress={() => setLanguageModalVisible(true)}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: "#ff4c7015" }]}>
                <Ionicons name="language-outline" size={20} color="#ff4c70" />
              </View>
              <Text style={[styles.optionText, { fontFamily: "Outfit-Regular", color: theme.colors.text }]}>Language</Text>
            </View>
            <View style={styles.optionRight}>
              <Text style={[styles.optionValue, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>{selectedLanguage}</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.option, { backgroundColor: theme.colors.card }]} onPress={toggleTheme} activeOpacity={0.7}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: "#673ab715" }]}>
                <Ionicons name="moon-outline" size={20} color="#673ab7" />
              </View>
              <Text style={[styles.optionText, { fontFamily: "Outfit-Regular", color: theme.colors.text }]}>Dark Mode</Text>
            </View>
            <View style={[styles.switch, { backgroundColor: isDarkMode ? "#007bff" : "#ccc" }]}>
              <View style={[styles.switchKnob, { backgroundColor: "#fff", transform: [{ translateX: isDarkMode ? 20 : 0 }] }]} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: "Outfit-Medium", color: theme.colors.textTertiary || theme.colors.textSecondary }]}>SUPPORT</Text>

          <TouchableOpacity style={[styles.option, { backgroundColor: theme.colors.card }]} onPress={handleHelpCenter}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: "#3f51b515" }]}>
                <Ionicons name="help-circle-outline" size={20} color="#3f51b5" />
              </View>
              <Text style={[styles.optionText, { fontFamily: "Outfit-Regular", color: theme.colors.text }]}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.option, { backgroundColor: theme.colors.card }]} onPress={handleTermsPrivacy}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: "#00968815" }]}>
                <Ionicons name="document-text-outline" size={20} color="#009688" />
              </View>
              <Text style={[styles.optionText, { fontFamily: "Outfit-Regular", color: theme.colors.text }]}>Terms & Privacy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.option, { backgroundColor: theme.colors.card }]} onPress={handleAbout}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconContainer, { backgroundColor: "#ff572215" }]}>
                <Ionicons name="information-circle-outline" size={20} color="#ff5722" />
              </View>
              <Text style={[styles.optionText, { fontFamily: "Outfit-Regular", color: theme.colors.text }]}>About</Text>
            </View>
            <View style={styles.optionRight}>
              <Text style={[styles.optionValue, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>v1.0.0</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.colors.card }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ff4444" />
          <Text style={[styles.logoutText, { fontFamily: "Outfit-Medium" }]}>Logout</Text>
        </TouchableOpacity>

        <Modal visible={editModalVisible} animationType="slide" transparent={true} onRequestClose={() => setEditModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.modalTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>Edit Profile</Text>
              <Text style={[styles.inputLabel, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>Display Name</Text>
              <TextInput
                style={[styles.input, { fontFamily: "Outfit-Regular", backgroundColor: theme.colors.inputBg || theme.colors.background, borderColor: theme.colors.inputBorder || theme.colors.border, color: theme.colors.inputText || theme.colors.text }]}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your name"
                placeholderTextColor={theme.colors.placeholder || theme.colors.textSecondary}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton, { borderColor: theme.colors.border }]} onPress={() => setEditModalVisible(false)}>
                  <Text style={[styles.cancelButtonText, { fontFamily: "Outfit-Medium", color: theme.colors.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveProfile}>
                  <Text style={[styles.saveButtonText, { fontFamily: "Outfit-Medium" }]}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={languageModalVisible} animationType="slide" transparent={true} onRequestClose={() => setLanguageModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.modalTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>Select Language</Text>
              <ScrollView style={styles.languageList}>
                {languages.map((language) => (
                  <TouchableOpacity key={language} style={[styles.languageOption, { borderBottomColor: theme.colors.border }]} onPress={() => handleLanguageSelect(language)}>
                    <Text style={[styles.languageText, { fontFamily: "Outfit-Regular", color: selectedLanguage === language ? theme.colors.primary : theme.colors.text }]}>{language}</Text>
                    {selectedLanguage === language && <Ionicons name="checkmark" size={22} color={theme.colors.primary} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton, { borderColor: theme.colors.border, marginTop: 16 }]} onPress={() => setLanguageModalVisible(false)}>
                <Text style={[styles.cancelButtonText, { fontFamily: "Outfit-Medium", color: theme.colors.textSecondary }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={{ height: 60 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 40, paddingBottom: 24 },
  heading: { fontSize: 30, fontWeight: "700" },
  editButton: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 16 },
  profileCard: { borderRadius: 20, padding: 22, marginBottom: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  profileHeader: { flexDirection: "row", marginBottom: 24 },
  avatar: { width: 76, height: 76, borderRadius: 38 },
  avatarPlaceholder: { width: 76, height: 76, borderRadius: 38, justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 30, fontWeight: "700", color: "#FFFFFF" },
  profileInfo: { flex: 1, marginLeft: 16, justifyContent: "center" },
  nameContainer: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  name: { fontSize: 21, fontWeight: "700" },
  email: { fontSize: 14, marginBottom: 8 },
  joinedContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  joinedText: { fontSize: 12 },
  statsContainer: { flexDirection: "row", justifyContent: "space-around", paddingTop: 20, borderTopWidth: 1 },
  statItem: { alignItems: "center", gap: 6 },
  statNumber: { fontSize: 19, fontWeight: "700" },
  statLabel: { fontSize: 12 },
  statDivider: { width: 1 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 },
  option: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 16, paddingHorizontal: 16, borderRadius: 14, marginBottom: 8 },
  optionLeft: { flexDirection: "row", alignItems: "center", flex: 1, gap: 12 },
  iconContainer: { width: 38, height: 38, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  optionText: { fontSize: 15 },
  optionSubtext: { fontSize: 12, marginTop: 2 },
  optionRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  optionValue: { fontSize: 13 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, minWidth: 30, alignItems: "center" },
  badgeText: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },
  switch: { width: 46, height: 26, borderRadius: 13, padding: 2, justifyContent: "center" },
  switchKnob: { width: 22, height: 22, borderRadius: 11 },
  logoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, borderRadius: 14, borderWidth: 1, borderColor: "#ff444420", gap: 8 },
  logoutText: { fontSize: 15, color: "#ff4444", fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "center", alignItems: "center", padding: 20 },
  modalContent: { width: "100%", maxWidth: 420, borderRadius: 20, padding: 24, maxHeight: "80%" },
  modalTitle: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  inputLabel: { fontSize: 14, marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 24 },
  modalButtons: { flexDirection: "row", gap: 12 },
  modalButton: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  cancelButton: { borderWidth: 1 },
  cancelButtonText: { fontSize: 15 },
  saveButton: { backgroundColor: "#007bff" },
  saveButtonText: { fontSize: 15, color: "#FFFFFF" },
  languageList: { maxHeight: 380 },
  languageOption: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1 },
  languageText: { fontSize: 15 },
});
