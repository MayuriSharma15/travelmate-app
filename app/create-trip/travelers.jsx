// // import React, { useState, useRef, useContext, useEffect } from "react";
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   StyleSheet,
// //   Animated,
// // } from "react-native";
// // import { useRouter } from "expo-router";
// // import { Ionicons } from "@expo/vector-icons";
// // import Colors from "../../constants/colors";
// // import { CreateTripContext } from "../../context/CreateTripContext";

// // const TRAVELERS = [
// //   {
// //     label: "Just Me",
// //     desc: "A solo traveler in exploration",
// //     icon: "person-outline",
// //     people: "1 Person",
// //   },
// //   {
// //     label: "A Couple",
// //     desc: "Two travelers in tandem",
// //     icon: "heart-outline",
// //     people: "2 People",
// //   },
// //   {
// //     label: "Family",
// //     desc: "A group of fun loving adventurers",
// //     icon: "home-outline",
// //     people: "3 to 5 People",
// //   },
// //   {
// //     label: "Friends",
// //     desc: "A bunch of thrill-seekers",
// //     icon: "people-outline",
// //     people: "5 to 10 People",
// //   },
// // ];

// // export default function Travelers() {
// //   const router = useRouter();
// //   const [selected, setSelected] = useState(null);
// //   const { tripData, setTripData } = useContext(CreateTripContext);
// //   const scaleAnim = useRef(new Animated.Value(1)).current;

// //   useEffect(() => {
// //     console.log(tripData);
// //   }, [tripData]);

// //   const handleSelect = (index) => {
// //     setSelected(index);

// //     Animated.sequence([
// //       Animated.timing(scaleAnim, {
// //         toValue: 0.96,
// //         duration: 120,
// //         useNativeDriver: true,
// //       }),
// //       Animated.timing(scaleAnim, {
// //         toValue: 1,
// //         duration: 120,
// //         useNativeDriver: true,
// //       }),
// //     ]).start();
// //   };

// //   return (
// //     <View style={styles.container}>
// //       {/* Header */}
// //       <Text style={styles.title}>Who's Traveling</Text>
// //       <Text style={styles.subtitle}>Choose your travelers</Text>

// //       {/* Traveler Cards */}
// //       {TRAVELERS.map((item, index) => (
// //         <Animated.View
// //           key={index}
// //           style={[
// //             styles.card,
// //             selected === index && styles.activeCard,
// //             selected === index && { transform: [{ scale: scaleAnim }] },
// //           ]}
// //         >
// //           <TouchableOpacity
// //             style={styles.cardContent}
// //             activeOpacity={0.8}
// //             onPress={() => handleSelect(index)}
// //           >
// //             <View>
// //               <Text style={styles.cardTitle}>{item.label}</Text>
// //               <Text style={styles.cardDesc}>{item.desc}</Text>
// //             </View>

// //             <Ionicons
// //               name={item.icon}
// //               size={28}
// //               color={selected === index ? Colors.primary : "#777"}
// //             />
// //           </TouchableOpacity>
// //         </Animated.View>
// //       ))}

// //       {/* Next Button */}
// //       <TouchableOpacity
// //         style={[
// //           styles.button,
// //           { opacity: selected === null ? 0.5 : 1 },
// //         ]}
// //         disabled={selected === null}
// //         onPress={() => {
// //           setTripData({ ...tripData, traveler: TRAVELERS[selected] });
// //           router.push("/create-trip/budget");
// //         }}
// //       >
// //         <Text style={styles.buttonText}>Next</Text>
// //       </TouchableOpacity>

// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#fff",
// //     padding: 20,
// //   },

// //   title: {
// //     fontSize: 26,
// //     fontWeight: "700",
// //     marginTop: 10,
// //   },

// //   subtitle: {
// //     fontSize: 15,
// //     color: "#666",
// //     marginVertical: 10,
// //   },

// //   card: {
// //     backgroundColor: "#f4f4f4",
// //     borderRadius: 16,
// //     padding: 16,
// //     marginVertical: 8,
// //   },

// //   activeCard: {
// //     backgroundColor: "#fff",
// //     borderWidth: 2,
// //     borderColor: Colors.primary,
// //   },

// //   cardContent: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //   },

// //   cardTitle: {
// //     fontSize: 16,
// //     fontWeight: "600",
// //   },

// //   cardDesc: {
// //     fontSize: 13,
// //     color: "#777",
// //     marginTop: 4,
// //     maxWidth: 220,
// //   },

// //   button: {
// //     marginTop: "auto",
// //     backgroundColor: Colors.primary,
// //     paddingVertical: 14,
// //     borderRadius: 14,
// //     alignItems: "center",
// //   },

// //   buttonText: {
// //     color: "#fff",
// //     fontSize: 16,
// //     fontWeight: "600",
// //   },
// // });



// import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
// import { useRouter } from "expo-router";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { useContext, useState } from "react";
// import { CreateTripContext } from "@/context/CreateTripContext";
// import { useTheme } from "@/context/ThemeContext";

// const TRAVELER_OPTIONS = [
//   {
//     id: "1",
//     title: "Just Me",
//     description: "A solo traveler in exploration",
//     icon: "person",
//     people: "1 Person",
//   },
//   {
//     id: "2",
//     title: "A Couple",
//     description: "Two travelers in tandem",
//     icon: "people",
//     people: "2 People",
//   },
//   {
//     id: "3-5",
//     title: "Family",
//     description: "A group of fun loving adventurers",
//     icon: "home",
//     people: "3 to 5 People",
//   },
//   {
//     id: "6+",
//     title: "Friends",
//     description: "A bunch of thrill seekers",
//     icon: "people-circle",
//     people: "6+ People",
//   },
// ];

// export default function Travelers() {
//   const router = useRouter();
//   const { tripData, setTripData } = useContext(CreateTripContext);
//   const { theme } = useTheme();
//   const [selectedTraveler, setSelectedTraveler] = useState(tripData?.travelerCount || null);

//   const handleSelectTraveler = (option) => {
//     setSelectedTraveler(option.id);
//     setTripData({
//       travelerCount: option.id,
//       travelerInfo: {
//         title: option.title,
//         people: option.people,
//         description: option.description,
//       },
//     });
//   };

//   const handleNext = () => {
//     if (!selectedTraveler) {
//       alert("Please select number of travelers");
//       return;
//     }
//     router.push("/create-trip/budget");
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
//       {/* Back Button */}
//       <TouchableOpacity 
//         style={styles.backButton}
//         onPress={() => router.back()}
//       >
//         <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
//       </TouchableOpacity>

//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={[styles.heading, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
//           Who's traveling?
//         </Text>
//         <Text style={[styles.subText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
//           Choose your travelers
//         </Text>
//       </View>

//       {/* Progress Indicator */}
//       <View style={styles.progressContainer}>
//         <View style={styles.progressBar}>
//           <View style={[styles.progressFill, { width: "25%", backgroundColor: theme.colors.primary }]} />
//         </View>
//         <Text style={[styles.progressText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
//           Step 1 of 4
//         </Text>
//       </View>

//       {/* Traveler Options */}
//       <View style={styles.optionsContainer}>
//         {TRAVELER_OPTIONS.map((option) => (
//           <TouchableOpacity
//             key={option.id}
//             style={[
//               styles.optionCard,
//               { 
//                 backgroundColor: theme.colors.card,
//                 borderColor: selectedTraveler === option.id ? theme.colors.primary : theme.colors.border,
//                 borderWidth: selectedTraveler === option.id ? 2 : 1,
//               }
//             ]}
//             onPress={() => handleSelectTraveler(option)}
//             activeOpacity={0.7}
//           >
//             {/* Icon */}
//             <View style={[
//               styles.iconContainer,
//               { backgroundColor: selectedTraveler === option.id ? theme.colors.primary + "20" : theme.colors.surface }
//             ]}>
//               <Ionicons 
//                 name={option.icon} 
//                 size={32} 
//                 color={selectedTraveler === option.id ? theme.colors.primary : theme.colors.textSecondary} 
//               />
//             </View>

//             {/* Content */}
//             <View style={styles.optionContent}>
//               <Text style={[styles.optionTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
//                 {option.title}
//               </Text>
//               <Text style={[styles.optionDescription, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
//                 {option.description}
//               </Text>
//               <Text style={[styles.optionPeople, { fontFamily: "Outfit-Medium", color: theme.colors.primary }]}>
//                 {option.people}
//               </Text>
//             </View>

//             {/* Check Icon */}
//             {selectedTraveler === option.id && (
//               <View style={styles.checkIcon}>
//                 <Ionicons name="checkmark-circle" size={28} color={theme.colors.primary} />
//               </View>
//             )}
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Next Button */}
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={[
//             styles.button,
//             { backgroundColor: selectedTraveler ? theme.colors.primary : theme.colors.border },
//             !selectedTraveler && styles.buttonDisabled,
//           ]}
//           onPress={handleNext}
//           disabled={!selectedTraveler}
//         >
//           <Text style={[styles.buttonText, { fontFamily: "Outfit-Bold" }]}>
//             Continue
//           </Text>
//           <Ionicons name="arrow-forward" size={20} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },

//   backButton: {
//     position: "absolute",
//     top: 50,
//     left: 20,
//     zIndex: 10,
//     width: 40,
//     height: 40,
//     justifyContent: "center",
//   },

//   header: {
//     paddingHorizontal: 20,
//     paddingTop: 100,
//     paddingBottom: 20,
//   },

//   heading: {
//     fontSize: 32,
//     fontWeight: "700",
//     marginBottom: 8,
//   },

//   subText: {
//     fontSize: 16,
//     lineHeight: 24,
//   },

//   progressContainer: {
//     paddingHorizontal: 20,
//     marginBottom: 30,
//   },

//   progressBar: {
//     height: 6,
//     backgroundColor: "#333",
//     borderRadius: 3,
//     overflow: "hidden",
//     marginBottom: 8,
//   },

//   progressFill: {
//     height: "100%",
//     borderRadius: 3,
//   },

//   progressText: {
//     fontSize: 12,
//   },

//   optionsContainer: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },

//   optionCard: {
//     flexDirection: "row",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     alignItems: "center",
//   },

//   iconContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 16,
//   },

//   optionContent: {
//     flex: 1,
//   },

//   optionTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 4,
//   },

//   optionDescription: {
//     fontSize: 13,
//     marginBottom: 6,
//   },

//   optionPeople: {
//     fontSize: 14,
//     fontWeight: "600",
//   },

//   checkIcon: {
//     marginLeft: 12,
//   },

//   buttonContainer: {
//     padding: 20,
//   },

//   button: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 8,
//     padding: 18,
//     borderRadius: 14,
//     shadowColor: "#007bff",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//   },

//   buttonDisabled: {
//     shadowOpacity: 0,
//     elevation: 0,
//   },

//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//   },
// });

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext, useState, useEffect } from "react";
import { CreateTripContext } from "@/context/CreateTripContext";
import { useTheme } from "@/context/ThemeContext";

const TRAVELER_OPTIONS = [
  {
    id: "1",
    title: "Just Me",
    description: "A solo traveler in exploration",
    icon: "person",
    people: "1 Person",
    count: "1",
  },
  {
    id: "2",
    title: "A Couple",
    description: "Two travelers in tandem",
    icon: "people",
    people: "2 People",
    count: "2",
  },
  {
    id: "3-5",
    title: "Family",
    description: "A group of fun loving adventurers",
    icon: "home",
    people: "3 to 5 People",
    count: "4",
  },
  {
    id: "6+",
    title: "Friends",
    description: "A bunch of thrill seekers",
    icon: "people-circle",
    people: "6+ People",
    count: "6",
  },
];

export default function Travelers() {
  const router = useRouter();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const { theme } = useTheme();
  const [selectedTraveler, setSelectedTraveler] = useState(null);

  useEffect(() => {
    console.log("=== TRAVELERS SCREEN MOUNTED ===");
    console.log("Current tripData:", tripData);
    
    // Pre-select if already chosen
    if (tripData?.travelerCount) {
      setSelectedTraveler(tripData.travelerCount);
    }
  }, []);

  const handleSelectTraveler = (option) => {
    console.log("Selecting traveler:", option);
    setSelectedTraveler(option.id);
  };

  const handleNext = () => {
    if (!selectedTraveler) {
      alert("Please select number of travelers");
      return;
    }

    const selectedOption = TRAVELER_OPTIONS.find(opt => opt.id === selectedTraveler);
    
    console.log("=== SAVING TRAVELER DATA ===");
    console.log("Selected:", selectedOption);
    
    // Update context with ONLY traveler data, preserve existing tripData
    setTripData({
      ...tripData, // Keep existing data (location, dates, etc)
      travelerCount: selectedOption.count,
      travelerInfo: {
        id: selectedOption.id,
        title: selectedOption.title,
        people: selectedOption.people,
        description: selectedOption.description,
        count: selectedOption.count,
      },
    });

    console.log("Navigating to budget screen");
    // Small delay to ensure context updates
    setTimeout(() => {
      router.push("/create-trip/budget");
    }, 100);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.heading, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
          Who's traveling?
        </Text>
        <Text style={[styles.subText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
          Choose your travelers
        </Text>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "25%", backgroundColor: theme.colors.primary }]} />
        </View>
        <Text style={[styles.progressText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
          Step 1 of 4
        </Text>
      </View>

      {/* Traveler Options */}
      <View style={styles.optionsContainer}>
        {TRAVELER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              { 
                backgroundColor: theme.colors.card,
                borderColor: selectedTraveler === option.id ? theme.colors.primary : theme.colors.border,
                borderWidth: selectedTraveler === option.id ? 2 : 1,
              }
            ]}
            onPress={() => handleSelectTraveler(option)}
            activeOpacity={0.7}
          >
            {/* Icon */}
            <View style={[
              styles.iconContainer,
              { backgroundColor: selectedTraveler === option.id ? theme.colors.primary + "20" : theme.colors.surface }
            ]}>
              <Ionicons 
                name={option.icon} 
                size={32} 
                color={selectedTraveler === option.id ? theme.colors.primary : theme.colors.textSecondary} 
              />
            </View>

            {/* Content */}
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
                {option.title}
              </Text>
              <Text style={[styles.optionDescription, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
                {option.description}
              </Text>
              <Text style={[styles.optionPeople, { fontFamily: "Outfit-Medium", color: theme.colors.primary }]}>
                {option.people}
              </Text>
            </View>

            {/* Check Icon */}
            {selectedTraveler === option.id && (
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark-circle" size={28} color={theme.colors.primary} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Debug Info (remove in production) */}
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={[styles.debugText, { color: theme.colors.textSecondary }]}>
            Selected: {selectedTraveler || "None"}
          </Text>
        </View>
      )}

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: selectedTraveler ? theme.colors.primary : theme.colors.border },
            !selectedTraveler && styles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={!selectedTraveler}
        >
          <Text style={[styles.buttonText, { fontFamily: "Outfit-Bold" }]}>
            Continue
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 20,
  },

  heading: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },

  subText: {
    fontSize: 16,
    lineHeight: 24,
  },

  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  progressBar: {
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },

  progressFill: {
    height: "100%",
    borderRadius: 3,
  },

  progressText: {
    fontSize: 12,
  },

  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  optionCard: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  optionContent: {
    flex: 1,
  },

  optionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },

  optionDescription: {
    fontSize: 13,
    marginBottom: 6,
  },

  optionPeople: {
    fontSize: 14,
    fontWeight: "600",
  },

  checkIcon: {
    marginLeft: 12,
  },

  debugContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  debugText: {
    fontSize: 12,
  },

  buttonContainer: {
    padding: 20,
  },

  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 18,
    borderRadius: 14,
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  buttonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});