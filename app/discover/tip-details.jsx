import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/context/ThemeContext";

// Detailed content for ALL 20 tips with UNIQUE related articles
const TIP_CONTENT = {
  "1": {
    keyTakeaways: [
      "Spring (April-June) offers mild weather and blooming landscapes",
      "Fall (September-October) has fewer crowds and lower prices",
      "Summer (July-August) is peak season with highest prices",
      "Winter travel can be magical but check weather conditions",
      "Book flights 6-8 weeks in advance for best deals"
    ],
    sections: [
      {
        title: "Best Months to Visit",
        content: "Spring months (April through June) are ideal for visiting Europe. The weather is pleasant, flowers are blooming, and you'll avoid the summer tourist rush. Popular destinations like Paris, Rome, and Barcelona are much more enjoyable without the heavy crowds. Hotels and flights are also 30-40% cheaper compared to peak summer months."
      },
      {
        title: "Fall Travel Advantages",
        content: "September and October offer the perfect combination of good weather and value. You'll experience local culture more authentically as cities return to their normal rhythm after summer tourism. Wine harvest season in France and Italy adds special experiences, and autumn foliage makes destinations like Switzerland and Germany particularly stunning."
      },
      {
        title: "What to Avoid",
        content: "Skip July and August unless you must travel then. Prices skyrocket, attractions have long lines, and cities can be uncomfortably hot. Christmas markets (late November to December) are beautiful but crowded and expensive. January and February offer the lowest prices but expect cold weather and shorter daylight hours."
      }
    ],
    relatedTips: [
      { title: "European Rail Pass Guide", icon: "train", url: "https://www.google.com/search?q=european+rail+pass+guide+2026" },
      { title: "Best European Cities for First-Timers", icon: "map", url: "https://www.google.com/search?q=best+european+cities+for+first+time+travelers" },
      { title: "Travel During Holidays", icon: "gift", url: "https://www.google.com/search?q=european+holiday+travel+tips" }
    ]
  },
  "2": {
    keyTakeaways: [
      "Book flights on Tuesday or Wednesday for lowest prices",
      "Use incognito mode when searching for flights",
      "Stay in hostels, guesthouses, or Airbnb instead of hotels",
      "Eat where locals eat - avoid tourist trap restaurants",
      "Use public transportation and walking instead of taxis"
    ],
    sections: [
      {
        title: "Flight Booking Strategies",
        content: "Airlines typically release deals on Tuesday mornings, making it the best day to book. Always search in incognito mode to avoid price increases based on your search history. Set up price alerts on Google Flights and Skyscanner. Consider flying mid-week and during off-peak hours - red-eye and early morning flights are often 40% cheaper."
      },
      {
        title: "Accommodation Savings",
        content: "Hostels aren't just for backpackers - many offer private rooms at fraction of hotel prices. Airbnb can be cost-effective, especially for groups. Look for accommodations slightly outside city centers where prices drop significantly. Consider house-sitting or home exchange programs for free accommodation."
      },
      {
        title: "Food and Activities",
        content: "Eat your main meal at lunch when restaurants offer cheaper set menus. Shop at local markets and grocery stores for snacks and picnic supplies. Many museums offer free admission days - research before visiting. Walking tours are often free (tip-based), and hiking is always budget-friendly entertainment."
      }
    ],
    relatedTips: [
      { title: "Travel Credit Cards for Rewards", icon: "card", url: "https://www.google.com/search?q=best+travel+credit+cards+rewards+2026" },
      { title: "Booking Accommodations Guide", icon: "bed", url: "https://www.google.com/search?q=how+to+book+cheap+accommodation" },
      { title: "Travel Apps to Save Money", icon: "phone-portrait", url: "https://www.google.com/search?q=budget+travel+apps+2026" }
    ]
  },
  "3": {
    keyTakeaways: [
      "Pack versatile, mix-and-match clothing in neutral colors",
      "Always carry medications in original containers in carry-on",
      "Bring a universal power adapter and portable charger",
      "Pack a small first-aid kit with basic supplies",
      "Use packing cubes to organize and maximize space"
    ],
    sections: [
      {
        title: "Clothing Strategy",
        content: "The key to efficient packing is versatility. Choose clothing that can be mixed and matched in neutral colors like black, navy, and gray. Pack layers instead of bulky items - a lightweight jacket, cardigan, and scarves adapt to changing weather. Stick to one color scheme so everything coordinates. Wear your bulkiest items (shoes, jacket) during travel to save luggage space."
      },
      {
        title: "Essential Tech and Documents",
        content: "A universal power adapter is non-negotiable for international travel. Bring a portable charger with at least 10,000mAh capacity. Take photos of important documents (passport, insurance, credit cards) and email them to yourself. Download offline maps, translation apps, and entertainment before your trip. Consider a local SIM card or international data plan."
      },
      {
        title: "Health and Safety Items",
        content: "Pack a small first-aid kit with band-aids, pain relievers, antihistamines, and anti-diarrheal medication. Bring prescription medications in original bottles with doctor's notes for customs. Include hand sanitizer, wet wipes, and a reusable water bottle. A small padlock secures hostel lockers and backpack zippers."
      }
    ],
    relatedTips: [
      { title: "Carry-On Only Travel Guide", icon: "airplane", url: "https://www.google.com/search?q=carry+on+only+packing+tips" },
      { title: "Airport Security Tips", icon: "shield-checkmark", url: "https://www.google.com/search?q=tsa+airport+security+tips" },
      { title: "Travel Gear Recommendations", icon: "bag-handle", url: "https://www.google.com/search?q=best+travel+gear+2026" }
    ]
  },
  "4": {
    keyTakeaways: [
      "Always share your itinerary with family or friends back home",
      "Research local customs, laws, and scams before traveling",
      "Keep copies of important documents in multiple locations",
      "Trust your instincts - if something feels wrong, leave",
      "Stay in well-reviewed accommodations in safe neighborhoods"
    ],
    sections: [
      {
        title: "Pre-Trip Preparation",
        content: "Research your destination thoroughly. Understand local laws, customs, and cultural norms - what's acceptable at home may be offensive elsewhere. Register with your embassy's travel program. Share detailed itinerary with family including accommodation addresses and contact numbers. Save emergency numbers (police, embassy, accommodation) in your phone."
      },
      {
        title: "Daily Safety Practices",
        content: "Dress modestly and blend in with locals to avoid standing out as a tourist. Keep valuables hidden - use a money belt or hidden pocket for passport and cash. Don't flash expensive jewelry, cameras, or phones unnecessarily. Stay aware of surroundings, especially in crowded areas where pickpockets operate. Avoid walking alone late at night in unfamiliar areas."
      },
      {
        title: "Accommodation and Transportation",
        content: "Book accommodations with good reviews in safe neighborhoods. Tell reception if you're traveling alone and request rooms on middle floors (not ground or top floors). Use official taxis or reputable ride-sharing apps - never accept rides from strangers. On public transport, keep bags in front where you can see them. Avoid empty train cars late at night."
      }
    ],
    relatedTips: [
      { title: "Travel Scams to Avoid", icon: "warning", url: "https://www.google.com/search?q=common+travel+scams+how+to+avoid" },
      { title: "Female Solo Travel Safety", icon: "woman", url: "https://www.google.com/search?q=women+solo+travel+safety+tips" },
      { title: "Travel Insurance Guide", icon: "shield", url: "https://www.google.com/search?q=travel+insurance+what+to+buy" }
    ]
  },
  "5": {
    keyTakeaways: [
      "Wake up early for golden hour shots (first hour after sunrise)",
      "Always ask permission before photographing people",
      "Shoot in RAW format for maximum editing flexibility",
      "Research photo spots but also explore off-the-beaten-path",
      "Learn basic composition rules: rule of thirds, leading lines"
    ],
    sections: [
      {
        title: "Best Times for Photography",
        content: "Golden hour (first hour after sunrise and last hour before sunset) provides the most beautiful natural light. Blue hour (just before sunrise and after sunset) creates magical, moody shots. Harsh midday sun creates unflattering shadows - use this time for indoor shots, architecture details, or food photography. Overcast days are perfect for portraits and capturing true colors without harsh shadows."
      },
      {
        title: "Composition Techniques",
        content: "Master the rule of thirds - place subjects at intersection points rather than dead center. Use leading lines (roads, rivers, fences) to draw viewers into your image. Frame your subject using natural elements like doorways or trees. Include foreground elements for depth in landscape shots. Get low or climb high for unique perspectives - avoid eye-level shots everyone takes."
      },
      {
        title: "Cultural Sensitivity",
        content: "Always ask permission before photographing people, especially in religious sites or traditional communities. Some cultures consider photography intrusive or believe it captures their soul. Research photography restrictions at monuments and museums - many ban tripods or flash. In markets, ask vendors before shooting their goods. Offer to share photos with subjects - it creates positive interactions."
      }
    ],
    relatedTips: [
      { title: "Best Travel Cameras 2026", icon: "camera", url: "https://www.google.com/search?q=best+travel+camera+2026" },
      { title: "Mobile Photo Editing Apps", icon: "phone-portrait", url: "https://www.google.com/search?q=mobile+photo+editing+apps+travel" },
      { title: "Instagram Travel Photography", icon: "logo-instagram", url: "https://www.google.com/search?q=instagram+travel+photography+tips" }
    ]
  },
  "6": {
    keyTakeaways: [
      "Find coworking spaces or cafes with reliable wifi",
      "Use time zone converters to schedule meetings properly",
      "Set clear boundaries between work and exploration time",
      "Have backup internet options (mobile hotspot, SIM card)",
      "Join digital nomad communities for networking and tips"
    ],
    sections: [
      {
        title: "Finding Workspaces",
        content: "Research coworking spaces before arrival using platforms like Coworker.com or WeWork. Many offer day passes if you don't need monthly membership. Scout cafes with good wifi, comfortable seating, and power outlets. Hotel lobbies often have quiet spaces with reliable internet. Consider staying in accommodations with dedicated workspaces and fast wifi."
      },
      {
        title: "Managing Time Zones",
        content: "Use tools like World Time Buddy to coordinate across time zones. Schedule meetings during overlap hours when possible. Communicate your availability clearly to clients and colleagues. Set 'do not disturb' hours on Slack/email to protect sleep and personal time. Consider choosing destinations 3-6 hours different from your main time zone for easier overlap."
      },
      {
        title: "Work-Life Balance",
        content: "Establish a routine with set work hours to avoid burnout. Take advantage of location independence by working during your most productive hours. Plan exploration activities after work or on weekends. Use the Pomodoro technique for focused work sessions. Join local nomad meetups for social connection and community."
      }
    ],
    relatedTips: [
      { title: "Best Cities for Digital Nomads", icon: "business", url: "https://www.google.com/search?q=best+cities+digital+nomads+2026" },
      { title: "Remote Work Tools", icon: "laptop", url: "https://www.google.com/search?q=best+remote+work+tools+apps" },
      { title: "Digital Nomad Visas", icon: "document-text", url: "https://www.google.com/search?q=digital+nomad+visa+countries+2026" }
    ]
  },
  "7": {
    keyTakeaways: [
      "Look for cards with no foreign transaction fees (saves 3%)",
      "Chase Sapphire and Amex Platinum offer excellent travel perks",
      "Use points for business class upgrades and hotel stays",
      "Airport lounge access saves money on food and drinks",
      "Travel insurance coverage included with premium cards"
    ],
    sections: [
      {
        title: "Top Cards for 2026",
        content: "Chase Sapphire Preferred and Reserve offer excellent points earning on travel and dining. American Express Platinum provides airport lounge access worldwide and hotel elite status. Capital One Venture X offers flexible redemption and no foreign fees. Consider your spending patterns - if you dine out frequently, cards with bonus dining rewards maximize value."
      },
      {
        title: "Maximizing Rewards",
        content: "Use cards strategically - travel cards for flights and hotels, dining cards for restaurants, cash back cards for everything else. Transfer points to airline partners for better value than booking through card portals. Take advantage of sign-up bonuses by timing applications before big trips. Use shopping portals for additional points on online purchases."
      },
      {
        title: "Hidden Benefits",
        content: "Premium cards often include trip delay protection, lost baggage reimbursement, and rental car insurance. Some offer annual travel credits that effectively reduce annual fees. Priority Pass membership gives airport lounge access globally. Purchase protection and extended warranty on items bought with the card. Cell phone insurance when you pay your bill with the card."
      }
    ],
    relatedTips: [
      { title: "Credit Score for Travel Cards", icon: "trending-up", url: "https://www.google.com/search?q=credit+score+needed+travel+cards" },
      { title: "Points vs Cash Back", icon: "cash", url: "https://www.google.com/search?q=travel+points+vs+cash+back" },
      { title: "Credit Card Annual Fees Worth It", icon: "card", url: "https://www.google.com/search?q=are+travel+card+annual+fees+worth+it" }
    ]
  },
  "8": {
    keyTakeaways: [
      "Learn 20-30 essential phrases before departure",
      "Use Duolingo or Babbel for basic language practice",
      "Google Translate works offline with downloaded languages",
      "Learn numbers, greetings, please/thank you, and directions",
      "Locals appreciate attempts to speak their language"
    ],
    sections: [
      {
        title: "Essential Phrases",
        content: "Focus on practical phrases: greetings (hello, goodbye), politeness (please, thank you, excuse me), questions (where is, how much, do you speak English), numbers (for prices and addresses), and food terms (I'm vegetarian, water please, check please). Learn to read basic signs like bathroom, exit, entrance, closed, and open."
      },
      {
        title: "Translation Apps",
        content: "Google Translate offers camera translation for signs and menus, plus offline mode with downloaded languages. iTranslate provides voice-to-voice translation for conversations. Microsoft Translator works offline and handles multiple languages simultaneously in group conversations. Papago excels for Asian languages. Always download languages before traveling."
      },
      {
        title: "Cultural Etiquette",
        content: "Attempt local language first before switching to English - it shows respect. Learn the proper greeting (handshake, bow, kiss) for the culture. Understand volume expectations - some cultures value quiet, others animated conversation. Know taboo topics and gestures. When struggling, use hand gestures, write numbers, or draw pictures to communicate."
      }
    ],
    relatedTips: [
      { title: "Best Language Learning Apps", icon: "school", url: "https://www.google.com/search?q=best+language+learning+apps+2026" },
      { title: "Translation Device Reviews", icon: "hardware-chip", url: "https://www.google.com/search?q=translation+device+reviews" },
      { title: "Cultural Customs by Country", icon: "globe", url: "https://www.google.com/search?q=cultural+customs+etiquette+guide" }
    ]
  },
  "9": {
    keyTakeaways: [
      "Choose direct flights when possible to reduce carbon footprint",
      "Support local businesses and guides instead of chains",
      "Bring reusable water bottle, bags, and utensils",
      "Respect wildlife - observe from distance, don't touch/feed",
      "Leave destinations better than you found them"
    ],
    sections: [
      {
        title: "Reducing Carbon Footprint",
        content: "Consider train travel instead of flying for shorter distances - trains emit 90% less CO2 than planes. When flying is necessary, choose direct flights and economy class (business class has 3x larger footprint). Pack light to reduce fuel consumption. Offset carbon through verified programs. Use public transportation, bike, or walk at destinations instead of renting cars or taking taxis."
      },
      {
        title: "Supporting Communities",
        content: "Stay in locally-owned accommodations instead of international hotel chains. Eat at family restaurants using local ingredients. Buy souvenirs from artisans, not mass-produced items. Hire local guides who share authentic cultural knowledge. Tip appropriately but don't inflate local economy artificially. Learn about fair trade and responsible tourism certifications."
      },
      {
        title: "Plastic-Free Travel",
        content: "Bring collapsible reusable water bottle with filter. Pack cloth shopping bags for markets and stores. Carry metal straws and bamboo utensils. Refuse single-use plastics - say no to plastic bags, bottles, and straws. Choose accommodations that minimize plastic use. Use reef-safe sunscreen and biodegradable toiletries. Properly dispose of any waste generated."
      }
    ],
    relatedTips: [
      { title: "Eco-Friendly Destinations", icon: "leaf", url: "https://www.google.com/search?q=most+sustainable+travel+destinations" },
      { title: "Carbon Offset Programs", icon: "cloud", url: "https://www.google.com/search?q=best+carbon+offset+programs+travel" },
      { title: "Zero-Waste Travel Kit", icon: "trash", url: "https://www.google.com/search?q=zero+waste+travel+kit+essentials" }
    ]
  },
  "10": {
    keyTakeaways: [
      "Medical coverage is most important - check coverage limits",
      "Trip cancellation protects against unexpected changes",
      "Emergency evacuation essential for adventure/remote travel",
      "Read exclusions carefully - pre-existing conditions often excluded",
      "Compare policies - don't just choose cheapest option"
    ],
    sections: [
      {
        title: "What's Covered",
        content: "Medical insurance covers emergency treatment abroad - crucial since US insurance often doesn't work internationally. Trip cancellation reimburses pre-paid expenses if you must cancel for covered reasons (illness, natural disaster, work). Trip interruption covers costs to return home early. Baggage coverage reimburses lost or delayed luggage. Emergency evacuation covers medical transport costs which can exceed $100,000."
      },
      {
        title: "When You Need It",
        content: "Always get insurance for international trips - medical costs abroad can be astronomical. Consider comprehensive coverage for expensive trips where cancellation would cause financial hardship. Adventure activities (skiing, scuba diving) often require special coverage. Cruise travel benefits from insurance due to weather and health vulnerabilities. Annual plans make sense for frequent travelers."
      },
      {
        title: "Choosing a Policy",
        content: "Compare multiple providers using aggregators like Squaremouth or InsureMyTrip. Read the fine print on exclusions and coverage limits. Verify medical coverage is adequate ($100,000+ recommended). Check if pre-existing conditions are covered with proper timing. Understand the claims process and customer service reputation. Consider 'Cancel for Any Reason' upgrade for flexibility."
      }
    ],
    relatedTips: [
      { title: "Travel Insurance Providers Comparison", icon: "list", url: "https://www.google.com/search?q=best+travel+insurance+companies+2026" },
      { title: "Credit Card Travel Insurance", icon: "card", url: "https://www.google.com/search?q=credit+card+travel+insurance+coverage" },
      { title: "Medical Evacuation Coverage", icon: "medkit", url: "https://www.google.com/search?q=medical+evacuation+insurance+explained" }
    ]
  },
  "11": {
    keyTakeaways: [
      "Stick to busy, popular street food vendors with high turnover",
      "Avoid raw or undercooked meat, seafood, and eggs",
      "Peel fruits yourself - don't eat pre-cut fruit",
      "Drink bottled water in developing countries",
      "Pack anti-diarrheal medication and rehydration salts"
    ],
    sections: [
      {
        title: "Street Food Safety",
        content: "Choose vendors with long lines of locals - high turnover means fresh food. Watch food preparation to ensure proper cooking. Hot, freshly cooked food is safest - avoid anything sitting out. Fried foods are generally safer than raw or room temperature items. Look for clean preparation areas and vendor hygiene. Avoid salads and raw vegetables unless you can peel them yourself."
      },
      {
        title: "Water and Beverages",
        content: "In developing countries, drink only bottled water with sealed cap. Use bottled water for brushing teeth. Avoid ice in drinks - it's often made from tap water. Hot beverages like coffee and tea are generally safe. Be cautious with fruit juices that may be diluted with tap water. Alcohol doesn't purify contaminated water. Consider bringing water purification tablets or SteriPEN."
      },
      {
        title: "When You Get Sick",
        content: "Traveler's diarrhea is common - stay hydrated with oral rehydration solution. Take anti-diarrheal medication for symptom relief. Rest and eat bland foods (rice, bananas, toast). See a doctor if symptoms persist beyond 3 days, you have bloody stools, high fever, or severe dehydration. Keep travel insurance information accessible. Know location of nearest hospital or clinic."
      }
    ],
    relatedTips: [
      { title: "Traveler's Diarrhea Treatment", icon: "medkit", url: "https://www.google.com/search?q=travelers+diarrhea+treatment+prevention" },
      { title: "Water Purification for Travel", icon: "water", url: "https://www.google.com/search?q=water+purification+methods+travel" },
      { title: "Travel Vaccinations Guide", icon: "fitness", url: "https://www.google.com/search?q=travel+vaccinations+by+country" }
    ]
  },
  "12": {
    keyTakeaways: [
      "Google Maps works offline - download maps before traveling",
      "WhatsApp for free international messaging with wifi",
      "XE Currency for real-time exchange rates",
      "TripIt organizes all travel confirmations in one place",
      "Citymapper for public transportation in major cities"
    ],
    sections: [
      {
        title: "Navigation Apps",
        content: "Google Maps is essential - download offline maps for areas you'll visit. Maps.me offers detailed offline maps worldwide. Citymapper excels for public transportation in 50+ cities with real-time updates. Rome2Rio shows all transport options between destinations. Waze helps with driving navigation and traffic alerts. What3Words provides precise location sharing using three-word addresses."
      },
      {
        title: "Communication and Translation",
        content: "WhatsApp for messaging and calls over wifi. Google Translate for text, voice, and camera translation with offline mode. Duolingo for learning basic phrases. Skype or FaceTime for video calls home. iMessage works over wifi for Apple users. Consider local SIM card or eSIM for data access."
      },
      {
        title: "Travel Organization",
        content: "TripIt consolidates all bookings and confirmations automatically. Hopper predicts flight price changes. Skyscanner and Google Flights for flight comparisons. Booking.com and Airbnb for accommodations. Trail Wallet tracks spending in multiple currencies. PackPoint creates packing lists based on destination and weather. TripAdvisor for reviews and recommendations."
      }
    ],
    relatedTips: [
      { title: "eSIM vs Local SIM Cards", icon: "phone-portrait", url: "https://www.google.com/search?q=esim+vs+local+sim+card+travel" },
      { title: "Offline Travel Apps", icon: "cloud-offline", url: "https://www.google.com/search?q=best+offline+travel+apps" },
      { title: "VPN for Travel Safety", icon: "shield-checkmark", url: "https://www.google.com/search?q=vpn+for+international+travel" }
    ]
  },
  "13": {
    keyTakeaways: [
      "Arrive 3 hours early for international flights, 2 for domestic",
      "Enroll in TSA PreCheck or Global Entry for faster security",
      "Wear slip-on shoes and minimal jewelry for quick screening",
      "Use airport apps to track flights and find amenities",
      "Credit card lounge access makes layovers more comfortable"
    ],
    sections: [
      {
        title: "Security and Check-in",
        content: "Check in online 24 hours before flight to choose seats and get boarding pass. Enroll in TSA PreCheck ($85/5 years) or Global Entry ($100/5 years) for expedited security. Pack 3-1-1 liquids properly - 3.4oz containers in 1 quart bag. Remove laptops and liquids for screening. Wear shoes easy to remove. Keep boarding pass and ID accessible. Consider CLEAR for even faster security."
      },
      {
        title: "Lounge Access",
        content: "Premium credit cards like Amex Platinum offer Priority Pass membership. Day passes available for purchase at most airline lounges. Chase Sapphire Reserve includes Priority Pass. Some lounges accessible with same-day boarding pass even without membership. Lounges offer free food, drinks, wifi, and quiet space. Download LoungeBuddy app to find and access lounges."
      },
      {
        title: "Dealing with Delays",
        content: "Download airline app for real-time updates and rebooking. Know your rights - EU261 for European flights requires compensation for delays. Travel insurance may cover extended delays. Be proactive - call airline while waiting in rebooking line. Have backup flight options ready. Keep snacks and entertainment in carry-on. Maximize layovers in interesting airports by leaving and exploring the city."
      }
    ],
    relatedTips: [
      { title: "TSA PreCheck vs Global Entry", icon: "checkmark-circle", url: "https://www.google.com/search?q=tsa+precheck+vs+global+entry+which+better" },
      { title: "Airport Lounge Access Guide", icon: "business", url: "https://www.google.com/search?q=how+to+get+airport+lounge+access" },
      { title: "Flight Delay Compensation Rights", icon: "time", url: "https://www.google.com/search?q=flight+delay+compensation+rights" }
    ]
  },
  "14": {
    keyTakeaways: [
      "Choose destinations with kid-friendly activities and amenities",
      "Pack entertainment for flights and long waits",
      "Bring snacks - hungry kids are unhappy kids",
      "Adjust itinerary pace - kids need downtime",
      "Consider all-inclusive resorts for stress-free vacation"
    ],
    sections: [
      {
        title: "Choosing Destinations",
        content: "Look for destinations with kid-friendly attractions - theme parks, beaches, interactive museums. Choose accommodations with pools, kids clubs, or babysitting services. Consider all-inclusive resorts that handle meals and activities. National parks offer outdoor adventure suitable for families. Cities like Orlando, San Diego, and Copenhagen are particularly family-friendly. Avoid overly ambitious itineraries - kids need downtime."
      },
      {
        title: "Packing and Planning",
        content: "Pack extra outfits, snacks, and entertainment in carry-on. Bring familiar comfort items from home. Download movies, games, and books to tablets before departure. Pack small new toys to reveal during flights. Bring hand sanitizer and wipes. Consider renting cribs, strollers, and car seats at destination. Make copies of important documents including children's medical records and insurance."
      },
      {
        title: "Managing Jet Lag",
        content: "Adjust sleep schedules gradually before departure. Use flight time to sleep or stay awake based on destination arrival time. Get sunshine upon arrival to reset body clock. Keep kids active during day but ensure naps if needed. Stick to bedtime routines even while traveling. Be patient - kids take 1-2 days per time zone to adjust. Melatonin supplements (with pediatrician approval) can help."
      }
    ],
    relatedTips: [
      { title: "Best Family-Friendly Destinations", icon: "home", url: "https://www.google.com/search?q=best+family+travel+destinations+2026" },
      { title: "Flying with Toddlers Tips", icon: "airplane", url: "https://www.google.com/search?q=tips+for+flying+with+toddlers" },
      { title: "Kids Travel Entertainment Ideas", icon: "game-controller", url: "https://www.google.com/search?q=entertainment+kids+long+flights" }
    ]
  },
  "15": {
    keyTakeaways: [
      "Passport must be valid 6 months beyond travel dates",
      "Check visa requirements 3+ months before departure",
      "Some countries offer visa-on-arrival or e-visas",
      "Schengen visa allows travel across 27 European countries",
      "Expedited passport services available for urgent needs"
    ],
    sections: [
      {
        title: "Passport Basics",
        content: "Most countries require passports valid for 6 months beyond travel dates. Process new passports 3-6 months before travel (normal processing takes 8-11 weeks). Expedited service available in 5-7 weeks for extra fee. For emergencies, same-day service possible at passport agencies with proof of travel within 14 days. Check passport pages - some countries require blank pages for entry stamps."
      },
      {
        title: "Visa Requirements",
        content: "Research visa requirements using official government websites - don't rely on third parties. US citizens can visit 185+ countries visa-free or with visa-on-arrival. Popular destinations requiring advance visas: China, Russia, India, Vietnam, Egypt, Turkey. Schengen visa allows 90 days in 27 European countries. Apply 3 months in advance - some countries take 4-6 weeks to process. Keep copies of visa approval with passport."
      },
      {
        title: "Special Situations",
        content: "Children need their own passports regardless of age. Name changes require updated passport - airlines check name matches ticket exactly. Some countries don't allow entry with passport damage or missing pages. Dual citizens should travel with both passports where allowed. Digital nomad visas now available in 30+ countries for remote workers. Transit visas sometimes required even for airport connections."
      }
    ],
    relatedTips: [
      { title: "Expedited Passport Services", icon: "time", url: "https://www.google.com/search?q=expedited+passport+services+how+to" },
      { title: "Visa-Free Countries for Americans", icon: "globe", url: "https://www.google.com/search?q=visa+free+countries+us+passport" },
      { title: "Digital Nomad Visas 2026", icon: "laptop", url: "https://www.google.com/search?q=digital+nomad+visa+countries+2026" }
    ]
  },
  "16": {
    keyTakeaways: [
      "Book early for best selection and prices",
      "Read recent reviews carefully - focus on patterns not single complaints",
      "Location matters - walkable to attractions saves money and time",
      "Contact host/hotel directly for better rates than booking sites",
      "Understand cancellation policies before booking"
    ],
    sections: [
      {
        title: "Hotels vs Airbnb vs Hostels",
        content: "Hotels offer consistency, daily cleaning, and loyalty points. Airbnb provides local experience, kitchen access, and better value for groups. Hostels are budget-friendly with social atmosphere - many have private rooms. Consider location, amenities, and value. Vacation rentals work well for families needing space and kitchens. Boutique hotels offer unique character. Read reviews across multiple platforms."
      },
      {
        title: "Finding Best Deals",
        content: "Compare prices across Booking.com, Expedia, Hotels.com, and Airbnb. Check hotel website directly - often cheaper than booking sites. Use incognito mode to avoid price increases. Book refundable rates when uncertain about plans. Join hotel loyalty programs for discounts and perks. Consider longer stays - many offer weekly/monthly discounts. Last-minute apps like HotelTonight for spontaneous travel."
      },
      {
        title: "Spotting Scams",
        content: "Be wary of properties with few reviews or only 5-star reviews. Check if photos match reality - reverse image search suspicious pictures. Verify location on map - some listings misrepresent proximity to attractions. Read negative reviews carefully - consistent complaints about cleanliness or safety are red flags. Don't wire money or pay outside platform. Trust your instincts - if deal seems too good, it probably is."
      }
    ],
    relatedTips: [
      { title: "Hotel Loyalty Programs Worth It", icon: "star", url: "https://www.google.com/search?q=hotel+loyalty+programs+comparison" },
      { title: "Airbnb vs Hotels Cost Comparison", icon: "cash", url: "https://www.google.com/search?q=airbnb+vs+hotel+cost+comparison" },
      { title: "Hostel Safety and Reviews", icon: "bed", url: "https://www.google.com/search?q=hostel+safety+tips+solo+travelers" }
    ]
  },
  "17": {
    keyTakeaways: [
      "Adjust sleep schedule 2-3 days before departure",
      "Stay hydrated during flight - avoid alcohol",
      "Get sunlight upon arrival to reset circadian rhythm",
      "Short naps okay (20-30min) but avoid long sleep during day",
      "Melatonin supplements can help but consult doctor first"
    ],
    sections: [
      {
        title: "Pre-Flight Preparation",
        content: "Start adjusting sleep schedule 3 days before departure - shift by 1-2 hours daily toward destination time. Choose flights arriving in evening when possible - allows normal bedtime. Stay hydrated days before travel. Avoid alcohol and caffeine 24 hours before flight. Pack sleep essentials - eye mask, earplugs, neck pillow. Download sleep/meditation apps like Calm or Headspace."
      },
      {
        title: "During Flight",
        content: "Set watch to destination time immediately. Try to sleep if it's nighttime at destination, stay awake if daytime. Drink water every hour - dehydration worsens jet lag. Walk around cabin every 2 hours. Avoid alcohol and caffeine. Use eye mask and earplugs for sleep. Take natural supplements like melatonin 30 minutes before desired sleep time. Do light stretching exercises."
      },
      {
        title: "Post-Arrival Recovery",
        content: "Get outdoor sunlight immediately upon arrival - resets body clock. Stay awake until local bedtime even if exhausted. Take only brief naps (20-30 minutes) if absolutely needed. Exercise lightly to boost energy. Eat meals at local times. Stay hydrated. Melatonin at local bedtime can help first few nights. Full recovery takes 1 day per time zone crossed."
      }
    ],
    relatedTips: [
      { title: "Melatonin for Travel", icon: "moon", url: "https://www.google.com/search?q=melatonin+dosage+jet+lag" },
      { title: "Best Time to Fly East vs West", icon: "airplane", url: "https://www.google.com/search?q=flying+east+vs+west+jet+lag" },
      { title: "Jet Lag Apps and Tools", icon: "phone-portrait", url: "https://www.google.com/search?q=jet+lag+apps+2026" }
    ]
  },
  "18": {
    keyTakeaways: [
      "Taxi scams: always use meter or agree on price beforehand",
      "Fake police asking for passport and wallet to 'check'",
      "Closed attraction scam - tout says it's closed, offers alternative tour",
      "Friendship bracelet/flower scam - demands payment after giving",
      "ATM skimmers and card cloning at tourist areas"
    ],
    sections: [
      {
        title: "Transportation Scams",
        content: "Taxi drivers claiming meter is broken or taking long routes - insist on meter or use Uber/Lyft. Airport taxis charging 10x normal fare - research standard rates before arrival. Fake ride-share drivers - verify license plate and driver photo match app. Train station hustlers offering 'help' then demanding tips. Rental car damage scams - document all damage before leaving lot."
      },
      {
        title: "Attraction Scams",
        content: "Closed attraction scam - ignore strangers claiming popular sites are closed today. Unofficial 'tour guides' at free sites demanding payment after unwanted tour. Skip-the-line tickets that don't work. Fake tickets sold on street instead of official channels. Overpriced tourist menu when cheaper local menu exists. Photography scams at landmarks - costumes characters demand payment for photos."
      },
      {
        title: "Money Scams",
        content: "ATM skimmers capturing card data - use ATMs inside banks. Dynamic currency conversion costing 10-15% more - always pay in local currency. Bill padding at restaurants - review bills carefully. Change making errors shorting you money. Fake police asking to check wallet for counterfeit money. Money exchange scams offering poor rates or sleight of hand."
      }
    ],
    relatedTips: [
      { title: "Country-Specific Common Scams", icon: "warning", url: "https://www.google.com/search?q=travel+scams+by+country" },
      { title: "Protecting Your Cards Abroad", icon: "card", url: "https://www.google.com/search?q=credit+card+safety+international+travel" },
      { title: "What to Do If Scammed", icon: "help-circle", url: "https://www.google.com/search?q=what+to+do+if+scammed+abroad" }
    ]
  },
  "19": {
    keyTakeaways: [
      "Book flights and hotels 6+ months in advance for holidays",
      "Expect crowds at major attractions - visit early morning",
      "Prices surge 50-100% during peak holiday seasons",
      "Some countries shut down for certain holidays",
      "Cultural experiences enhanced during festive periods"
    ],
    sections: [
      {
        title: "Planning Holiday Travel",
        content: "Major holidays include Christmas/New Year, Spring Break, Summer vacation, and Thanksgiving. Book flights and accommodations 6-12 months in advance for best prices. Expect to pay 50-100% more than off-season. Consider shoulder seasons (just before/after holidays) for savings. Research local holidays - some countries close shops and services. Set price alerts months ahead."
      },
      {
        title: "Managing Crowds",
        content: "Visit popular attractions at opening time or late afternoon. Consider lesser-known alternatives to famous sites. Book skip-the-line tickets in advance. Have backup plans if sites are too crowded. Explore neighborhoods away from tourist centers. Take breaks in quieter locations. Use apps to check real-time crowd levels. Reserve restaurants and activities ahead."
      },
      {
        title: "Unique Holiday Experiences",
        content: "Christmas markets in Europe offer magical winter atmosphere. New Year's Eve celebrations in Times Square, Sydney, or Rio. Cherry blossoms in Japan during spring. Diwali celebrations in India. Carnival in Brazil. Thanksgiving provides quiet time to visit US national parks. Research local festivals and celebrations for authentic cultural experiences. Some experiences only available during holidays."
      }
    ],
    relatedTips: [
      { title: "Best Holiday Destinations", icon: "gift", url: "https://www.google.com/search?q=best+holiday+travel+destinations" },
      { title: "Skip-the-Line Tickets Guide", icon: "time", url: "https://www.google.com/search?q=skip+the+line+tickets+worth+it" },
      { title: "World Holiday Calendar", icon: "calendar", url: "https://www.google.com/search?q=international+holidays+calendar+2026" }
    ]
  },
  "20": {
    keyTakeaways: [
      "Research destinations known for female solo traveler safety",
      "Stay in well-reviewed accommodations in safe areas",
      "Share your itinerary with someone back home",
      "Trust your instincts - if uncomfortable, leave immediately",
      "Join female travel communities for advice and meetups"
    ],
    sections: [
      {
        title: "Safe Destinations",
        content: "Top-rated countries for solo female travelers: Iceland, New Zealand, Japan, Portugal, Switzerland, Singapore, Canada, and Scandinavian countries. Research safety ratings using Solo Female Traveler World. Read blogs and forums from women who've traveled there. Consider guided group tours for first solo trip. Stay in women-only accommodations or hostels with female dorms. Major cities generally safer than remote areas."
      },
      {
        title: "Safety Strategies",
        content: "Book accommodation in safe, central neighborhoods - check reviews from solo women. Share live location with trusted contact. Dress modestly respecting local culture. Avoid walking alone at night. Use official transportation - no unmarked taxis. Keep emergency cash hidden separately. Wear wedding ring even if single (cultural shield). Have confidence - project awareness not fear. Join Facebook groups for solo female travelers."
      },
      {
        title: "Building Community",
        content: "Use apps like Bumble BFF or Tourlina to meet other female travelers. Join free walking tours to meet people. Stay in social hostels even if booking private room. Attend meetup.com events at destination. Take group classes (cooking, yoga, language). Connect with locals through Couchsurfing (meet in public, don't stay with strangers). Join online communities before travel for advice and possible meetups."
      }
    ],
    relatedTips: [
      { title: "Safest Countries for Solo Women", icon: "shield-checkmark", url: "https://www.google.com/search?q=safest+countries+solo+female+travelers+2026" },
      { title: "Solo Female Travel Blogs", icon: "book", url: "https://www.google.com/search?q=best+solo+female+travel+blogs" },
      { title: "Women-Only Travel Groups", icon: "people", url: "https://www.google.com/search?q=women+only+travel+groups+tours" }
    ]
  },
};

export default function TipDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  
  const tip = params.tip ? JSON.parse(params.tip) : null;

  if (!tip) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          Tip not found
        </Text>
      </View>
    );
  }

  // Get specific content for this tip
  const tipContent = TIP_CONTENT[tip.id] || TIP_CONTENT["1"];

  const handleRelatedArticlePress = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error("Error opening URL:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header Image */}
      <Image 
        source={{ uri: tip.image }}
        style={styles.headerImage}
        resizeMode="cover"
      />

      {/* Back Button */}
      <TouchableOpacity 
        style={[styles.backButton, { backgroundColor: theme.colors.card }]}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Content Card */}
        <View style={[styles.contentCard, { backgroundColor: theme.colors.background }]}>
          {/* Category Badge */}
          <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primary + "20" }]}>
            <Ionicons name={tip.icon} size={16} color={theme.colors.primary} />
            <Text style={[styles.categoryText, { fontFamily: "Outfit-Medium", color: theme.colors.primary }]}>
              {tip.category}
            </Text>
          </View>

          {/* Title */}
          <Text style={[styles.title, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
            {tip.title}
          </Text>

          {/* Meta Info */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.metaText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
                {tip.readTime}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="bookmark-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.metaText, { fontFamily: "Outfit-Regular", color: theme.colors.textSecondary }]}>
                Save for later
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={[styles.description, { fontFamily: "Outfit-Regular", color: theme.colors.text }]}>
            {tip.desc}
          </Text>

          {/* Full Content */}
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
              Key Takeaways
            </Text>
            <View style={styles.bulletList}>
              {tipContent.keyTakeaways.map((point, index) => (
                <BulletPoint key={index} text={point} theme={theme} />
              ))}
            </View>

            {/* Dynamic Sections */}
            {tipContent.sections.map((section, index) => (
              <View key={index}>
                <Text style={[styles.sectionTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
                  {section.title}
                </Text>
                <Text style={[styles.paragraph, { fontFamily: "Outfit-Regular", color: theme.colors.text }]}>
                  {section.content}
                </Text>
              </View>
            ))}
          </View>

          {/* Related Content */}
          <View style={styles.relatedSection}>
            <Text style={[styles.sectionTitle, { fontFamily: "Outfit-Bold", color: theme.colors.text }]}>
              Related Articles
            </Text>
            {tipContent.relatedTips.map((item, index) => (
              <TouchableOpacity 
                key={index}
                style={[styles.relatedCard, { backgroundColor: theme.colors.card }]}
                activeOpacity={0.7}
                onPress={() => handleRelatedArticlePress(item.url)}
              >
                <View style={[styles.relatedIcon, { backgroundColor: theme.colors.primary + "20" }]}>
                  <Ionicons name={item.icon} size={20} color={theme.colors.primary} />
                </View>
                <Text style={[styles.relatedTitle, { fontFamily: "Outfit-Medium", color: theme.colors.text }]}>
                  {item.title}
                </Text>
                <Ionicons name="open-outline" size={18} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const BulletPoint = ({ text, theme }) => (
  <View style={styles.bulletItem}>
    <View style={[styles.bullet, { backgroundColor: theme.colors.primary }]} />
    <Text style={[styles.bulletText, { fontFamily: "Outfit-Regular", color: theme.colors.text }]}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerImage: {
    width: "100%",
    height: 300,
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  scrollView: {
    flex: 1,
    marginTop: -30,
  },

  contentCard: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    minHeight: "100%",
  },

  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },

  categoryText: {
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: "600",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    lineHeight: 34,
  },

  metaRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  metaText: {
    fontSize: 13,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },

  content: {
    marginBottom: 32,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    marginTop: 8,
  },

  bulletList: {
    marginBottom: 24,
  },

  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 12,
  },

  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },

  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },

  relatedSection: {
    marginTop: 8,
  },

  relatedCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },

  relatedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  relatedTitle: {
    flex: 1,
    fontSize: 14,
  },

  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
  },
});