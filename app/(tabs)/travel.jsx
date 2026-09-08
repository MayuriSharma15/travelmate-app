import { auth, db } from "@/configs/FirebaseConfig";
import { useTheme } from "@/context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ACHIEVEMENTS = [
  {
    id: "1",
    icon: "airplane",
    title: "First Flight",
    desc: "Complete your first trip",
    threshold: 1,
    type: "trips",
    color: "#4FC3F7",
    unlocked: false,
  },
  {
    id: "2",
    icon: "earth",
    title: "Globe Trotter",
    desc: "Visit 3 countries",
    threshold: 3,
    type: "countries",
    color: "#BA68C8",
    unlocked: false,
  },
  {
    id: "3",
    icon: "location",
    title: "City Explorer",
    desc: "Visit 5 cities",
    threshold: 5,
    type: "cities",
    color: "#FFB74D",
    unlocked: false,
  },
  {
    id: "4",
    icon: "trail-sign",
    title: "Adventurer",
    desc: "Complete 10 trips",
    threshold: 10,
    type: "trips",
    color: "#81C784",
    unlocked: false,
  },
  {
    id: "5",
    icon: "map",
    title: "World Traveler",
    desc: "Visit 10 countries",
    threshold: 10,
    type: "countries",
    color: "#F06292",
    unlocked: false,
  },
  {
    id: "6",
    icon: "trophy",
    title: "Travel Master",
    desc: "Complete 20 trips",
    threshold: 20,
    type: "trips",
    color: "#FFD700",
    unlocked: false,
  },
];

const TRAVEL_MILESTONES = [
  { trips: 5, title: "Getting Started", icon: "star", color: "#4FC3F7" },
  { trips: 10, title: "Travel Enthusiast", icon: "airplane", color: "#81C784" },
  { trips: 15, title: "Adventure Seeker", icon: "map", color: "#FFB74D" },
  { trips: 20, title: "Globe Trotter", icon: "earth", color: "#BA68C8" },
  { trips: 30, title: "Travel Master", icon: "trophy", color: "#FFD700" },
];

const isWeb = Platform.OS === "web";

export default function Travel() {
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    completedTrips: 0,
    citiesVisited: 0,
    countriesVisited: 0,
    continentsVisited: 0,
    totalDays: 0,
  });
  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const [loading, setLoading] = useState(true);
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width,
  );
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    loadTravelData();
    const sub = Dimensions.addEventListener("change", ({ window }) =>
      setScreenWidth(window.width),
    );
    return () => sub?.remove?.();
  }, []);

  const loadTravelData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const tripsQuery = query(
        collection(db, "UserTrips"),
        where("userEmail", "==", user.email),
      );
      const querySnapshot = await getDocs(tripsQuery);
      const tripsData = [];
      querySnapshot.forEach((doc) =>
        tripsData.push({ id: doc.id, ...doc.data() }),
      );
      setTrips(tripsData);

      const uniqueCities = new Set(
        tripsData.map((t) => t.tripData?.locationInfo?.name).filter(Boolean),
      );
      const uniqueCountries = new Set(
        tripsData
          .map((t) => {
            const address = t.tripData?.locationInfo?.address || "";
            const parts = address.split(",");
            return parts[parts.length - 1]?.trim();
          })
          .filter(Boolean),
      );
      const totalDays = tripsData.reduce(
        (sum, t) => sum + (t.tripData?.totalDays || 0),
        0,
      );
      const now = new Date();
      const upcomingCount = tripsData.filter((t) => {
        const sd = t.tripData?.startDate;
        if (!sd) return false;
        const d = sd.toDate ? sd.toDate() : new Date(sd);
        return d > now;
      }).length;
      const completedCount = tripsData.filter((t) => {
        const ed = t.tripData?.endDate;
        if (!ed) return false;
        const d = ed.toDate ? ed.toDate() : new Date(ed);
        return d < now;
      }).length;

      const calculatedStats = {
        totalTrips: tripsData.length,
        upcomingTrips: upcomingCount,
        completedTrips: completedCount,
        citiesVisited: uniqueCities.size,
        countriesVisited: uniqueCountries.size,
        continentsVisited: Math.min(Math.floor(uniqueCountries.size / 3), 6),
        totalDays,
      };
      setStats(calculatedStats);

      const milestone =
        TRAVEL_MILESTONES.slice()
          .reverse()
          .find((m) => calculatedStats.totalTrips >= m.trips) ||
        TRAVEL_MILESTONES[0];
      setCurrentMilestone(milestone);

      const updatedAchievements = ACHIEVEMENTS.map((a) => {
        let unlocked = false,
          progress = 0;
        if (a.type === "countries") {
          progress = calculatedStats.countriesVisited;
          unlocked = progress >= a.threshold;
        } else if (a.type === "trips") {
          progress = calculatedStats.totalTrips;
          unlocked = progress >= a.threshold;
        } else if (a.type === "cities") {
          progress = calculatedStats.citiesVisited;
          unlocked = progress >= a.threshold;
        }
        return { ...a, unlocked, progress };
      });
      setAchievements(updatedAchievements);
    } catch (error) {
      console.error("Error loading travel data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTripPress = (trip) => {
    router.push({
      pathname: "/trip-details/index",
      params: { tripId: trip.id },
    });
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const handleShare = () => {
    const message = `My 2026 Travel Stats\n\n${stats.totalTrips} trips completed\n${stats.citiesVisited} cities explored\n${stats.countriesVisited} countries visited\n${stats.totalDays} days of adventure\n\n${unlockedCount}/${achievements.length} achievements unlocked`;
    Alert.alert("Share Your Journey", message, [
      { text: "Copy to Clipboard", onPress: () => console.log("Copied!") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const isNarrow = screenWidth < 700;
  const contentMaxWidth = isWeb ? Math.min(screenWidth, 1100) : screenWidth;
  const statCardMinWidth = isNarrow ? "47%" : 220;

  const StatCard = ({ icon, value, label, color, subtitle }) => (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: theme.colors.card,
          minWidth: statCardMinWidth,
          flexGrow: 1,
        },
      ]}
    >
      <View
        style={[styles.statIconContainer, { backgroundColor: color + "20" }]}
      >
        <Ionicons name={icon} size={26} color={color} />
      </View>
      <Text
        style={[
          styles.statValue,
          { fontFamily: "Outfit-Bold", color: theme.colors.text },
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          styles.statLabel,
          { fontFamily: "Outfit-Medium", color: theme.colors.text },
        ]}
      >
        {label}
      </Text>
      {subtitle && (
        <Text
          style={[
            styles.statSubtitle,
            { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary },
          ]}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );

  const AchievementCard = ({ item }) => {
    const progressPercent =
      item.progress && item.threshold
        ? Math.min((item.progress / item.threshold) * 100, 100)
        : 0;
    return (
      <TouchableOpacity
        style={[
          styles.achievementCard,
          {
            backgroundColor: theme.colors.card,
            borderWidth: item.unlocked ? 2 : 1,
            borderColor: item.unlocked ? item.color : theme.colors.border,
          },
        ]}
        activeOpacity={0.75}
      >
        <View
          style={[
            styles.achievementIconContainer,
            {
              backgroundColor: item.unlocked
                ? item.color + "20"
                : theme.colors.surface,
            },
          ]}
        >
          <Ionicons
            name={item.icon}
            size={30}
            color={item.unlocked ? item.color : theme.colors.textSecondary}
          />
        </View>
        <View style={styles.achievementInfo}>
          <Text
            style={[
              styles.achievementTitle,
              { fontFamily: "Outfit-Bold", color: theme.colors.text },
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.achievementDesc,
              {
                fontFamily: "Outfit-Regular",
                color: theme.colors.textSecondary,
              },
            ]}
          >
            {item.desc}
          </Text>
          {!item.unlocked && item.progress !== undefined && (
            <View style={styles.achievementProgressContainer}>
              <View
                style={[
                  styles.achievementProgressBar,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <View
                  style={[
                    styles.achievementProgressFill,
                    {
                      backgroundColor: item.color,
                      width: `${progressPercent}%`,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.achievementProgressText,
                  {
                    fontFamily: "Outfit-Regular",
                    color: theme.colors.textSecondary,
                  },
                ]}
              >
                {item.progress}/{item.threshold}
              </Text>
            </View>
          )}
        </View>
        {item.unlocked ? (
          <View style={[styles.unlockedBadge, { backgroundColor: item.color }]}>
            <Ionicons name="checkmark-circle" size={26} color="#fff" />
          </View>
        ) : (
          <Ionicons
            name="lock-closed"
            size={18}
            color={theme.colors.textSecondary}
          />
        )}
      </TouchableOpacity>
    );
  };

  const TripMemoryCard = ({ trip }) => {
    const images = [
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&q=80",
      "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=500&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
    ];
    const img = images[Math.floor(Math.random() * images.length)];
    return (
      <TouchableOpacity
        style={[
          styles.memoryCard,
          { backgroundColor: theme.colors.card, width: isNarrow ? 260 : 300 },
        ]}
        activeOpacity={0.92}
        onPress={() => handleTripPress(trip)}
      >
        <Image
          source={{ uri: img }}
          style={styles.memoryImage}
          resizeMode="cover"
        />
        <View style={styles.memoryGradient}>
          <View style={styles.memoryInfo}>
            <Text
              style={[styles.memoryLocation, { fontFamily: "Outfit-Bold" }]}
              numberOfLines={2}
            >
              {trip.tripData?.locationInfo?.name || "Unknown Location"}
            </Text>
            <View style={styles.memoryMetaRow}>
              <View style={styles.memoryMeta}>
                <Ionicons name="calendar" size={14} color="#fff" />
                <Text
                  style={[styles.memoryText, { fontFamily: "Outfit-Regular" }]}
                >
                  {trip.tripData?.totalDays || "N/A"} days
                </Text>
              </View>
              <View style={styles.memoryMeta}>
                <Ionicons name="location" size={14} color="#fff" />
                <Text
                  style={[styles.memoryText, { fontFamily: "Outfit-Regular" }]}
                >
                  {trip.tripData?.travelerInfo?.title || "Solo"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View
          style={[
            styles.header,
            { maxWidth: contentMaxWidth, width: "100%", alignSelf: "center" },
          ]}
        >
          <View>
            <Text
              style={[
                styles.greeting,
                {
                  fontFamily: "Outfit-Regular",
                  color: theme.colors.textSecondary,
                },
              ]}
            >
              Your Journey
            </Text>
            <Text
              style={[
                styles.heading,
                { fontFamily: "Outfit-Bold", color: theme.colors.text },
              ]}
            >
              Travel Stats
            </Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[
              styles.loadingText,
              {
                fontFamily: "Outfit-Regular",
                color: theme.colors.textSecondary,
              },
            ]}
          >
            Loading your travel data...
          </Text>
        </View>
      </View>
    );
  }

  const nextMilestone = TRAVEL_MILESTONES.find(
    (m) => m.trips > stats.totalTrips,
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={{
            maxWidth: contentMaxWidth,
            width: "100%",
            alignSelf: "center",
          }}
        >
          <View style={styles.header}>
            <View>
              <Text
                style={[
                  styles.greeting,
                  {
                    fontFamily: "Outfit-Regular",
                    color: theme.colors.textSecondary,
                  },
                ]}
              >
                Your Journey
              </Text>
              <Text
                style={[
                  styles.heading,
                  { fontFamily: "Outfit-Bold", color: theme.colors.text },
                ]}
              >
                Travel Stats
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.shareButton,
                { backgroundColor: theme.colors.primary },
              ]}
              activeOpacity={0.8}
              onPress={handleShare}
            >
              <Ionicons name="share-social" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {currentMilestone && (
            <TouchableOpacity
              style={[
                styles.milestoneBanner,
                { backgroundColor: theme.colors.primary },
              ]}
              activeOpacity={0.92}
            >
              <View style={styles.milestoneContent}>
                <View style={styles.milestoneIconCircle}>
                  <Ionicons
                    name={currentMilestone.icon}
                    size={28}
                    color="#fff"
                  />
                </View>
                <View style={styles.milestoneText}>
                  <Text
                    style={[
                      styles.milestoneTitle,
                      { fontFamily: "Outfit-Bold" },
                    ]}
                  >
                    {currentMilestone.title}
                  </Text>
                  <Text
                    style={[
                      styles.milestoneDesc,
                      { fontFamily: "Outfit-Regular" },
                    ]}
                  >
                    You've completed {stats.totalTrips} trips in 2026!
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#fff" />
            </TouchableOpacity>
          )}

          <View style={styles.statsContainer}>
            <Text
              style={[
                styles.sectionTitle,
                { fontFamily: "Outfit-Bold", color: theme.colors.text },
              ]}
            >
              Your Travel Summary
            </Text>
            <View style={styles.statsGrid}>
              <StatCard
                icon="airplane"
                value={stats.totalTrips}
                label="Total Trips"
                subtitle={`${stats.upcomingTrips} upcoming`}
                color="#4FC3F7"
              />
              <StatCard
                icon="location"
                value={stats.citiesVisited}
                label="Cities Visited"
                subtitle="Unique destinations"
                color="#FFB74D"
              />
              <StatCard
                icon="earth"
                value={stats.countriesVisited}
                label="Countries"
                subtitle={`${stats.continentsVisited} continents`}
                color="#BA68C8"
              />
              <StatCard
                icon="calendar"
                value={stats.totalDays}
                label="Days Traveled"
                subtitle="Total adventure time"
                color="#81C784"
              />
            </View>
          </View>

          {nextMilestone && (
            <View
              style={[
                styles.progressCard,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <View style={styles.progressHeader}>
                <View style={styles.progressTitleContainer}>
                  <Ionicons
                    name="trophy"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={[
                      styles.progressTitle,
                      { fontFamily: "Outfit-Bold", color: theme.colors.text },
                    ]}
                  >
                    Next Milestone: {nextMilestone.title}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.progressPercent,
                    { fontFamily: "Outfit-Bold", color: theme.colors.primary },
                  ]}
                >
                  {Math.round((stats.totalTrips / nextMilestone.trips) * 100)}%
                </Text>
              </View>
              <View
                style={[
                  styles.progressBar,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: theme.colors.primary,
                      width: `${Math.min((stats.totalTrips / nextMilestone.trips) * 100, 100)}%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.progressFooter}>
                <Text
                  style={[
                    styles.progressText,
                    {
                      fontFamily: "Outfit-Regular",
                      color: theme.colors.textSecondary,
                    },
                  ]}
                >
                  {stats.totalTrips} of {nextMilestone.trips} trips completed
                </Text>
                <Text
                  style={[
                    styles.progressRemaining,
                    {
                      fontFamily: "Outfit-Medium",
                      color: theme.colors.primary,
                    },
                  ]}
                >
                  {nextMilestone.trips - stats.totalTrips} trips to go!
                </Text>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWithIcon}>
                <Ionicons
                  name="trophy"
                  size={22}
                  color={theme.colors.primary}
                />
                <Text
                  style={[
                    styles.sectionTitleText,
                    { fontFamily: "Outfit-Bold", color: theme.colors.text },
                  ]}
                >
                  Achievements
                </Text>
              </View>
              <View
                style={[
                  styles.achievementBadge,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.achievementBadgeText,
                    { fontFamily: "Outfit-Bold" },
                  ]}
                >
                  {unlockedCount}/{achievements.length}
                </Text>
              </View>
            </View>
            <View style={styles.achievementsContainer}>
              {achievements.map((a) => (
                <AchievementCard key={a.id} item={a} />
              ))}
            </View>
          </View>

          {trips.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWithIcon}>
                  <Ionicons
                    name="images"
                    size={22}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={[
                      styles.sectionTitleText,
                      { fontFamily: "Outfit-Bold", color: theme.colors.text },
                    ]}
                  >
                    Travel Memories
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push("/(tabs)/mytrip")}>
                  <Text
                    style={[
                      styles.seeAllText,
                      {
                        fontFamily: "Outfit-Medium",
                        color: theme.colors.primary,
                      },
                    ]}
                  >
                    View All
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.memoriesContainer}
              >
                {trips.slice(0, 10).map((t) => (
                  <TripMemoryCard key={t.id} trip={t} />
                ))}
              </ScrollView>
            </View>
          ) : (
            <View
              style={[
                styles.emptyState,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <Ionicons
                name="airplane-outline"
                size={72}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.emptyTitle,
                  { fontFamily: "Outfit-Bold", color: theme.colors.text },
                ]}
              >
                No Trips Yet
              </Text>
              <Text
                style={[
                  styles.emptyDesc,
                  {
                    fontFamily: "Outfit-Regular",
                    color: theme.colors.textSecondary,
                  },
                ]}
              >
                Start planning your first adventure!
              </Text>
            </View>
          )}

          <View
            style={[
              styles.quickActions,
              isNarrow ? {} : { flexDirection: "row" },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.primary, flex: 1 },
              ]}
              onPress={() => router.push("/create-trip/searchplace")}
              activeOpacity={0.85}
            >
              <Ionicons name="add-circle" size={22} color="#fff" />
              <Text
                style={[styles.actionButtonText, { fontFamily: "Outfit-Bold" }]}
              >
                Plan New Adventure
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButtonSecondary,
                {
                  backgroundColor: theme.colors.card,
                  borderWidth: 2,
                  borderColor: theme.colors.primary,
                  flex: 1,
                },
              ]}
              onPress={() => router.push("/(tabs)/mytrip")}
              activeOpacity={0.85}
            >
              <Ionicons name="map" size={22} color={theme.colors.primary} />
              <Text
                style={[
                  styles.actionButtonTextSecondary,
                  { fontFamily: "Outfit-Bold", color: theme.colors.primary },
                ]}
              >
                View All Trips
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 20, paddingHorizontal: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingTop: 100,
  },
  loadingText: { fontSize: 14 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 24,
  },
  greeting: { fontSize: 14, marginBottom: 4 },
  heading: { fontSize: 30, fontWeight: "700" },
  shareButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  milestoneBanner: {
    padding: 22,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  milestoneContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 16,
  },
  milestoneIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  milestoneText: { flex: 1 },
  milestoneTitle: { fontSize: 19, color: "#fff", marginBottom: 4 },
  milestoneDesc: { fontSize: 13, color: "#fff", opacity: 0.9 },
  statsContainer: { marginBottom: 28 },
  sectionTitle: { fontSize: 19, fontWeight: "700", marginBottom: 16 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  statCard: {
    padding: 22,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  statIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: { fontSize: 30, fontWeight: "700", marginBottom: 4 },
  statLabel: { fontSize: 13, marginBottom: 4 },
  statSubtitle: { fontSize: 11, textAlign: "center", opacity: 0.8 },
  progressCard: {
    padding: 22,
    borderRadius: 18,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  progressTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  progressTitle: { fontSize: 14, flex: 1 },
  progressPercent: { fontSize: 19 },
  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: { height: "100%", borderRadius: 5 },
  progressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  progressText: { fontSize: 12 },
  progressRemaining: { fontSize: 12 },
  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 8,
  },
  sectionTitleWithIcon: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitleText: { fontSize: 19, fontWeight: "700" },
  achievementBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  achievementBadgeText: { fontSize: 12, color: "#fff" },
  seeAllText: { fontSize: 14 },
  achievementsContainer: { gap: 14 },
  achievementCard: {
    flexDirection: "row",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  achievementIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
  },
  achievementInfo: { flex: 1 },
  achievementTitle: { fontSize: 16, marginBottom: 4 },
  achievementDesc: { fontSize: 13 },
  achievementProgressContainer: { marginTop: 10, gap: 4 },
  achievementProgressBar: { height: 5, borderRadius: 3, overflow: "hidden" },
  achievementProgressFill: { height: "100%", borderRadius: 3 },
  achievementProgressText: { fontSize: 11 },
  unlockedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  memoriesContainer: { gap: 16, paddingBottom: 4 },
  memoryCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  memoryImage: { width: "100%", height: 200 },
  memoryGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%",
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  memoryInfo: { padding: 16 },
  memoryLocation: { fontSize: 18, color: "#fff", marginBottom: 8 },
  memoryMetaRow: { flexDirection: "row", gap: 14, flexWrap: "wrap" },
  memoryMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  memoryText: { fontSize: 12, color: "#fff", opacity: 0.9 },
  emptyState: {
    padding: 44,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 28,
  },
  emptyTitle: { fontSize: 22, marginTop: 16, marginBottom: 8 },
  emptyDesc: { fontSize: 14, textAlign: "center" },
  quickActions: { gap: 14 },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 14,
    gap: 8,
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonText: { fontSize: 15, color: "#fff" },
  actionButtonSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 14,
    gap: 8,
  },
  actionButtonTextSecondary: { fontSize: 15 },
});
