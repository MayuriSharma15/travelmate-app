import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/configs/FirebaseConfig";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(width * 0.7, 320);
const MAX_CONTENT_WIDTH = 900;

const ACHIEVEMENTS = [
  { id: "1", icon: "airplane", title: "First Flight", desc: "Complete your first trip", threshold: 1, type: "trips", color: "#4FC3F7", unlocked: false },
  { id: "2", icon: "earth", title: "Globe Trotter", desc: "Visit 3 countries", threshold: 3, type: "countries", color: "#BA68C8", unlocked: false },
  { id: "3", icon: "location", title: "City Explorer", desc: "Visit 5 cities", threshold: 5, type: "cities", color: "#FFB74D", unlocked: false },
  { id: "4", icon: "trail-sign", title: "Adventurer", desc: "Complete 10 trips", threshold: 10, type: "trips", color: "#81C784", unlocked: false },
  { id: "5", icon: "map", title: "World Traveler", desc: "Visit 10 countries", threshold: 10, type: "countries", color: "#F06292", unlocked: false },
  { id: "6", icon: "trophy", title: "Travel Master", desc: "Complete 20 trips", threshold: 20, type: "trips", color: "#FFD700", unlocked: false },
];

const TRAVEL_MILESTONES = [
  { trips: 5, title: "Getting Started", emoji: "🌟", color: "#4FC3F7" },
  { trips: 10, title: "Travel Enthusiast", emoji: "✈️", color: "#81C784" },
  { trips: 15, title: "Adventure Seeker", emoji: "🗺️", color: "#FFB74D" },
  { trips: 20, title: "Globe Trotter", emoji: "🌍", color: "#BA68C8" },
  { trips: 30, title: "Travel Master", emoji: "👑", color: "#FFD700" },
];

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
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    loadTravelData();
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
        where("userEmail", "==", user.email)
      );

      const querySnapshot = await getDocs(tripsQuery);
      const tripsData = [];

      querySnapshot.forEach((doc) => {
        tripsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setTrips(tripsData);
      
      const uniqueCities = new Set(
        tripsData.map(trip => trip.tripData?.locationInfo?.name).filter(Boolean)
      );
      
      const uniqueCountries = new Set(
        tripsData.map(trip => {
          const address = trip.tripData?.locationInfo?.address || "";
          const parts = address.split(",");
          return parts[parts.length - 1]?.trim();
        }).filter(Boolean)
      );

      const totalDays = tripsData.reduce((sum, trip) => {
        return sum + (trip.tripData?.totalDays || 0);
      }, 0);

      const now = new Date();
      const upcomingCount = tripsData.filter(trip => {
        const startDate = trip.tripData?.startDate;
        if (!startDate) return false;
        const tripDate = startDate.toDate ? startDate.toDate() : new Date(startDate);
        return tripDate > now;
      }).length;

      const completedCount = tripsData.filter(trip => {
        const endDate = trip.tripData?.endDate;
        if (!endDate) return false;
        const tripDate = endDate.toDate ? endDate.toDate() : new Date(endDate);
        return tripDate < now;
      }).length;
      
      const calculatedStats = {
        totalTrips: tripsData.length,
        upcomingTrips: upcomingCount,
        completedTrips: completedCount,
        citiesVisited: uniqueCities.size,
        countriesVisited: uniqueCountries.size,
        continentsVisited: Math.min(Math.floor(uniqueCountries.size / 3), 6),
        totalDays: totalDays,
      };

      setStats(calculatedStats);
      
      const milestone = TRAVEL_MILESTONES
        .slice()
        .reverse()
        .find(m => calculatedStats.totalTrips >= m.trips) || TRAVEL_MILESTONES[0];
      setCurrentMilestone(milestone);
      
      const updatedAchievements = ACHIEVEMENTS.map(achievement => {
        let unlocked = false;
        let progress = 0;
        
        if (achievement.type === "countries") {
          progress = calculatedStats.countriesVisited;
          unlocked = calculatedStats.countriesVisited >= achievement.threshold;
        } else if (achievement.type === "trips") {
          progress = calculatedStats.totalTrips;
          unlocked = calculatedStats.totalTrips >= achievement.threshold;
        } else if (achievement.type === "cities") {
          progress = calculatedStats.citiesVisited;
          unlocked = calculatedStats.citiesVisited >= achievement.threshold;
        } else if (achievement.type === "continents") {
          progress = calculatedStats.continentsVisited;
          unlocked = calculatedStats.continentsVisited >= achievement.threshold;
        }
        
        return { ...achievement, unlocked, progress };
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

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const handleShare = () => {
    const message = `🌍 My 2026 Travel Stats!\n\n✈️ ${stats.totalTrips} trips completed\n🏙️ ${stats.citiesVisited} cities explored\n🌏 ${stats.countriesVisited} countries visited\n📅 ${stats.totalDays} days of adventure\n\n${unlockedCount}/${achievements.length} achievements unlocked! 🏆`;
    
    Alert.alert(
      "Share Your Journey",
      message,
      [
        { text: "Copy to Clipboard", onPress: () => console.log("Copied!") },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const StatCard = ({ icon, value, label, color, subtitle }) => (
    <View style={[styles.statCard, { backgroundColor: theme.colors.card, borderColor: color + "30" }]}>
      <View style={[styles.statIconContainer, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={[styles.statValue, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { fontFamily: "Outfit-Medium", color: theme.colors.text }]}>
        {label}
      </Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );

  const AchievementCard = ({ item }) => {
    const progressPercent = item.progress && item.threshold 
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
          }
        ]}
        activeOpacity={0.7}
      >
        <View style={[styles.achievementIconContainer, { backgroundColor: item.unlocked ? item.color + "20" : theme.colors.surface }]}>
          <Ionicons name={item.icon} size={32} color={item.unlocked ? item.color : theme.colors.textSecondary} />
        </View>
        <View style={styles.achievementInfo}>
          <Text style={[styles.achievementTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.achievementDesc, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
            {item.desc}
          </Text>
          {!item.unlocked && item.progress !== undefined && (
            <View style={styles.achievementProgressContainer}>
              <View style={[styles.achievementProgressBar, { backgroundColor: theme.colors.surface }]}>
                <View 
                  style={[
                    styles.achievementProgressFill, 
                    { backgroundColor: item.color, width: `${progressPercent}%` }
                  ]} 
                />
              </View>
              <Text style={[styles.achievementProgressText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
                {item.progress}/{item.threshold}
              </Text>
            </View>
          )}
        </View>
        {item.unlocked ? (
          <View style={[styles.unlockedBadge, { backgroundColor: item.color }]}>
            <Ionicons name="checkmark-circle" size={28} color="#fff" />
          </View>
        ) : (
          <View style={styles.lockedBadge}>
            <Ionicons name="lock-closed" size={20} color={theme.colors.textSecondary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const TripMemoryCard = ({ trip }) => {
    const getRandomImage = () => {
      const images = [
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80",
        "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&q=80",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      ];
      return images[Math.floor(Math.random() * images.length)];
    };

    return (
      <TouchableOpacity 
        style={[styles.memoryCard, { backgroundColor: theme.colors.card }]} 
        activeOpacity={0.9}
        onPress={() => handleTripPress(trip)}
      >
        <Image 
          source={{ uri: getRandomImage() }} 
          style={styles.memoryImage}
          resizeMode="cover"
        />
        <View style={styles.memoryGradient}>
          <View style={styles.memoryInfo}>
            <Text style={[styles.memoryLocation, { fontFamily: "Outfit-Bold" }]} numberOfLines={2}>
              {trip.tripData?.locationInfo?.name || "Unknown Location"}
            </Text>
            <View style={styles.memoryMetaRow}>
              <View style={styles.memoryMeta}>
                <Ionicons name="calendar" size={14} color="#fff" />
                <Text style={[styles.memoryText, { fontFamily: "Outfit-Regular" }]}>
                  {trip.tripData?.totalDays || "N/A"} days
                </Text>
              </View>
              <View style={styles.memoryMeta}>
                <Ionicons name="location" size={14} color="#fff" />
                <Text style={[styles.memoryText, { fontFamily: "Outfit-Regular" }]}>
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
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.centeredContent}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
                Your Journey
              </Text>
              <Text style={[styles.heading, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
                Travel Stats
              </Text>
            </View>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
              Loading your travel data...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const nextMilestone = TRAVEL_MILESTONES.find(m => m.trips > stats.totalTrips);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.centeredContent}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
                Your Journey
              </Text>
              <Text style={[styles.heading, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
                Travel Stats
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.shareButton, { backgroundColor: theme.colors.primary }]}
              activeOpacity={0.7}
              onPress={handleShare}
            >
              <Ionicons name="share-social" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {currentMilestone && (
            <TouchableOpacity 
              style={[styles.milestoneBanner, { backgroundColor: theme.colors.primary }]}
              activeOpacity={0.9}
            >
              <View style={styles.milestoneContent}>
                <Text style={styles.milestoneEmoji}>{currentMilestone.emoji}</Text>
                <View style={styles.milestoneText}>
                  <Text style={[styles.milestoneTitle, { fontFamily: "Outfit-Bold" }]}>
                    {currentMilestone.title}
                  </Text>
                  <Text style={[styles.milestoneDesc, { fontFamily: "Outfit-Regular" }]}>
                    You've completed {stats.totalTrips} trips in 2026!
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#fff" />
            </TouchableOpacity>
          )}

          <View style={styles.statsContainer}>
            <Text style={[styles.sectionTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
              Your Travel Summary
            </Text>
            <View style={styles.statsGrid}>
              <StatCard icon="airplane" value={stats.totalTrips} label="Total Trips" subtitle={`${stats.upcomingTrips} upcoming`} color="#4FC3F7" />
              <StatCard icon="location" value={stats.citiesVisited} label="Cities Visited" subtitle="Unique destinations" color="#FFB74D" />
              <StatCard icon="earth" value={stats.countriesVisited} label="Countries" subtitle={`${stats.continentsVisited} continents`} color="#BA68C8" />
              <StatCard icon="calendar" value={stats.totalDays} label="Days Traveled" subtitle="Total adventure time" color="#81C784" />
            </View>
          </View>

          {nextMilestone && (
            <View style={[styles.progressCard, { backgroundColor: theme.colors.card }]}>
              <View style={styles.progressHeader}>
                <View style={styles.progressTitleContainer}>
                  <Ionicons name="trophy" size={20} color={theme.colors.primary} />
                  <Text style={[styles.progressTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
                    Next Milestone: {nextMilestone.title}
                  </Text>
                </View>
                <Text style={[styles.progressPercent, { fontFamily: "Outfit-Bold", color: theme.colors.primary }]}>
                  {Math.round((stats.totalTrips / nextMilestone.trips) * 100)}%
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.progressFill, { backgroundColor: theme.colors.primary, width: `${Math.min((stats.totalTrips / nextMilestone.trips) * 100, 100)}%` }]} />
              </View>
              <View style={styles.progressFooter}>
                <Text style={[styles.progressText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
                  {stats.totalTrips} of {nextMilestone.trips} trips completed
                </Text>
                <Text style={[styles.progressRemaining, { fontFamily: "Outfit-Medium", color: theme.colors.primary }]}>
                  {nextMilestone.trips - stats.totalTrips} trips to go!
                </Text>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWithIcon}>
                <Ionicons name="trophy" size={24} color={theme.colors.primary} />
                <Text style={[styles.sectionTitleText, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
                  Achievements
                </Text>
              </View>
              <View style={[styles.achievementBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.achievementBadgeText, { fontFamily: "Outfit-Bold" }]}>
                  {unlockedCount}/{achievements.length}
                </Text>
              </View>
            </View>
            
            <View style={styles.achievementsContainer}>
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} item={achievement} />
              ))}
            </View>
          </View>

          {trips.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleWithIcon}>
                  <Ionicons name="images" size={24} color={theme.colors.primary} />
                  <Text style={[styles.sectionTitleText, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
                    Travel Memories
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push("/(tabs)/mytrip")}>
                  <Text style={[styles.seeAllText, { fontFamily: "Outfit-Medium", color: theme.colors.primary }]}>
                    View All
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.memoriesContainer}
                snapToInterval={CARD_WIDTH + 16}
                decelerationRate="fast"
              >
                {trips.slice(0, 10).map((trip) => (
                  <TripMemoryCard key={trip.id} trip={trip} />
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.card }]}>
              <Ionicons name="airplane-outline" size={80} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
                No Trips Yet
              </Text>
              <Text style={[styles.emptyDesc, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
                Start planning your first adventure!
              </Text>
            </View>
          )}

          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => router.push("/create-trip/searchplace")}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={[styles.actionButtonText, { fontFamily: "Outfit-Bold" }]}>
                Plan New Adventure
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButtonSecondary, { backgroundColor: theme.colors.card, borderWidth: 2, borderColor: theme.colors.primary }]}
              onPress={() => router.push("/(tabs)/mytrip")}
              activeOpacity={0.8}
            >
              <Ionicons name="map" size={24} color={theme.colors.primary} />
              <Text style={[styles.actionButtonTextSecondary, { fontFamily: "Outfit-Bold", color: theme.colors.primary }]}>
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
  scrollContent: { paddingBottom: 20, alignItems: "center" },
  centeredContent: { width: "100%", maxWidth: MAX_CONTENT_WIDTH },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16, paddingVertical: 100 },
  loadingText: { fontSize: 14 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 60, paddingBottom: 24 },
  greeting: { fontSize: 14, marginBottom: 4 },
  heading: { fontSize: 34, fontWeight: "700" },
  shareButton: { width: 48, height: 48, borderRadius: 24, justifyContent: "center", alignItems: "center", shadowColor: "#007bff", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 },
  milestoneBanner: { marginHorizontal: 20, padding: 22, borderRadius: 22, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 28, shadowColor: "#007bff", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 6 },
  milestoneContent: { flexDirection: "row", alignItems: "center", flex: 1, gap: 16 },
  milestoneEmoji: { fontSize: 48 },
  milestoneText: { flex: 1 },
  milestoneTitle: { fontSize: 20, color: "#fff", marginBottom: 4 },
  milestoneDesc: { fontSize: 14, color: "#fff", opacity: 0.9 },
  statsContainer: { marginBottom: 28 },
  sectionTitle: { fontSize: 21, fontWeight: "700", paddingHorizontal: 20, marginBottom: 18 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, gap: 14 },
  statCard: { width: (Math.min(width, MAX_CONTENT_WIDTH) - 20 * 2 - 14) / 2, padding: 22, borderRadius: 20, alignItems: "center", borderWidth: 1.5, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  statIconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", marginBottom: 14 },
  statValue: { fontSize: 34, fontWeight: "700", marginBottom: 4 },
  statLabel: { fontSize: 14, marginBottom: 4 },
  statSubtitle: { fontSize: 11, textAlign: "center" },
  progressCard: { marginHorizontal: 20, padding: 22, borderRadius: 20, marginBottom: 28, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  progressTitleContainer: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  progressTitle: { fontSize: 15, flex: 1 },
  progressPercent: { fontSize: 20 },
  progressBar: { height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 14 },
  progressFill: { height: "100%", borderRadius: 5 },
  progressFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  progressText: { fontSize: 13 },
  progressRemaining: { fontSize: 13 },
  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 18 },
  sectionTitleWithIcon: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitleText: { fontSize: 21, fontWeight: "700" },
  achievementBadge: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 14 },
  achievementBadgeText: { fontSize: 12, color: "#fff" },
  seeAllText: { fontSize: 14 },
  achievementsContainer: { paddingHorizontal: 20, gap: 14 },
  achievementCard: { flexDirection: "row", padding: 18, borderRadius: 18, alignItems: "center", gap: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  achievementIconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center" },
  achievementInfo: { flex: 1 },
  achievementTitle: { fontSize: 16, marginBottom: 4 },
  achievementDesc: { fontSize: 13 },
  achievementProgressContainer: { marginTop: 8, gap: 4 },
  achievementProgressBar: { height: 5, borderRadius: 3, overflow: "hidden" },
  achievementProgressFill: { height: "100%", borderRadius: 3 },
  achievementProgressText: { fontSize: 11 },
  unlockedBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  lockedBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", backgroundColor: "transparent" },
  memoriesContainer: { paddingHorizontal: 20, gap: 18 },
  memoryCard: { width: CARD_WIDTH, borderRadius: 22, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 5 },
  memoryImage: { width: "100%", height: 220 },
  memoryGradient: { position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  memoryInfo: { padding: 18 },
  memoryLocation: { fontSize: 20, color: "#fff", marginBottom: 8 },
  memoryMetaRow: { flexDirection: "row", gap: 16 },
  memoryMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  memoryText: { fontSize: 13, color: "#fff", opacity: 0.9 },
  emptyState: { marginHorizontal: 20, padding: 48, borderRadius: 24, alignItems: "center", marginBottom: 28 },
  emptyTitle: { fontSize: 24, marginTop: 18, marginBottom: 8 },
  emptyDesc: { fontSize: 14, textAlign: "center" },
  quickActions: { paddingHorizontal: 20, gap: 14 },
  actionButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 20, borderRadius: 16, gap: 8, shadowColor: "#007bff", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  actionButtonText: { fontSize: 16, color: "#fff" },
  actionButtonSecondary: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 20, borderRadius: 16, gap: 8 },
  actionButtonTextSecondary: { fontSize: 16 },
});
