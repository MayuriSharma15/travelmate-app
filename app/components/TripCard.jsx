import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";

export default function TripCard({ trip }) {
  return (
    <View style={styles.card}>
      <Image source={trip.image} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{trip.title}</Text>
        <Text style={styles.subtitle}>{trip.subtitle}</Text>

        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={16} color={Colors.textLight} />
          <Text style={styles.date}>{trip.date}</Text>

          <View
            style={[
              styles.badge,
              trip.status === "Completed"
                ? styles.completed
                : styles.planned,
            ]}
          >
            <Text style={styles.badgeText}>{trip.status}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    marginBottom: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 160,
  },
  content: {
    padding: 14,
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    color: Colors.textDark,
  },
  subtitle: {
    fontFamily: "outfit",
    color: Colors.textLight,
    marginVertical: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  date: {
    marginLeft: 6,
    fontFamily: "outfit",
    color: Colors.textLight,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  completed: {
    backgroundColor: "#1E40AF",
  },
  planned: {
    backgroundColor: "#2563EB",
  },
  badgeText: {
    fontFamily: "outfit",
    fontSize: 12,
    color: "#fff",
  },
});
