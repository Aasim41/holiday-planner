const fs = require('fs');
const path = require('path');

const destinations = [
  // 20 Indian Destinations (AI Generated)
  { location: "domestic", id: "goa", name: "Goa Beaches", tag: "Beach", img: "/images/generated/goa_beach_1781625737650.png", desc: "Experience the ultimate beach vibe in Goa with its golden sands, vibrant nightlife, and Portuguese heritage. Perfect for friends and family.", price: 400, days: 5, category: "beach", groups: ["friends", "families"] },
  { location: "domestic", id: "kerala", name: "Kerala Backwaters", tag: "Nature", img: "/images/generated/kerala_backwaters_1781625752905.png", desc: "Cruise through the serene backwaters of Kerala in a traditional houseboat surrounded by lush greenery.", price: 600, days: 6, category: "nature", groups: ["families", "solo"] },
  { location: "domestic", id: "jaipur", name: "Jaipur Palace", tag: "Heritage", img: "/images/generated/jaipur_palace_1781625768904.png", desc: "Explore the Pink City's majestic forts, vibrant markets, and royal heritage at the Hawa Mahal.", price: 450, days: 4, category: "heritage", groups: ["families", "friends"] },
  { location: "domestic", id: "ladakh", name: "Ladakh Valley", tag: "Adventure", img: "/images/generated/ladakh_valley_1781625783923.png", desc: "Experience the ultimate adventure in the rugged terrain of Ladakh. Marvel at Pangong Lake and barren mountains.", price: 800, days: 8, category: "mountain", groups: ["friends", "solo"] },
  { location: "domestic", id: "agra", name: "Taj Mahal", tag: "Heritage", img: "/images/generated/agra_taj_mahal_1781625795904.png", desc: "Witness the magnificent Taj Mahal at sunrise, a symbol of love and a UNESCO World Heritage site.", price: 300, days: 3, category: "heritage", groups: ["families", "friends", "solo"] },
  { location: "domestic", id: "manali", name: "Manali Mountains", tag: "Mountain", img: "/images/generated/manali_mountains_1781625818558.png", desc: "A high-altitude Himalayan resort town known for its snow-capped peaks, pine forests, and adventure sports.", price: 500, days: 5, category: "mountain", groups: ["friends", "families"] },
  { location: "domestic", id: "munnar", name: "Munnar Tea Estates", tag: "Nature", img: "/images/generated/munnar_tea_estates_1781625832687.png", desc: "Rolling hills covered in emerald green tea plantations and mist, offering a perfect romantic or family retreat.", price: 450, days: 4, category: "nature", groups: ["families"] },
  { location: "domestic", id: "spiti", name: "Spiti Valley", tag: "Adventure", img: "/images/generated/spiti_valley_1781625848306.png", desc: "A cold desert mountain valley located high in the Himalayas, perfect for thrill-seekers and road trips.", price: 700, days: 7, category: "mountain", groups: ["friends", "solo"] },
  { location: "domestic", id: "varanasi", name: "Varanasi Ghats", tag: "Spiritual", img: "/images/generated/varanasi_ghats_1781625861823.png", desc: "Experience the spiritual heart of India along the sacred ghats of the Ganges River at sunrise.", price: 350, days: 3, category: "heritage", groups: ["solo", "families"] },
  { location: "domestic", id: "andaman", name: "Andaman Islands", tag: "Beach", img: "/images/generated/andaman_islands_1781630247127.png", desc: "Pristine white sand beaches and turquoise waters with world-class scuba diving and coral reefs.", price: 900, days: 6, category: "beach", groups: ["families", "friends"] },
  { location: "domestic", id: "udaipur", name: "Udaipur Lake Palace", tag: "Heritage", img: "/images/generated/udaipur_lake_1781630263742.png", desc: "The City of Lakes, known for its lavish palaces, beautiful lakes, and romantic sunset boat rides.", price: 550, days: 4, category: "heritage", groups: ["families"] },
  { location: "domestic", id: "darjeeling", name: "Darjeeling", tag: "Mountain", img: "/images/generated/darjeeling_tea_1781630275358.png", desc: "Famous for its tea industry and the Darjeeling Himalayan Railway, offering spectacular views of Kangchenjunga.", price: 400, days: 5, category: "mountain", groups: ["families", "friends"] },
  { location: "domestic", id: "ooty", name: "Ooty Hills", tag: "Nature", img: "/images/generated/ooty_hills_1781630288104.png", desc: "The Queen of Hill Stations, featuring misty landscapes, botanical gardens, and charming colonial architecture.", price: 350, days: 4, category: "nature", groups: ["families"] },
  { location: "domestic", id: "mysore", name: "Mysore Palace", tag: "Heritage", img: "/images/generated/mysore_palace_1781630305298.png", desc: "A city renowned for its rich heritage and the incredibly grand, illuminated Mysore Palace.", price: 300, days: 3, category: "heritage", groups: ["families", "solo"] },
  { location: "domestic", id: "hampi", name: "Hampi Ruins", tag: "Heritage", img: "/images/generated/hampi_ruins_1781630348551.png", desc: "An ancient village with stunning ruins of the Vijayanagara Empire, featuring intricately carved temples.", price: 350, days: 4, category: "heritage", groups: ["friends", "solo"] },
  { location: "domestic", id: "pondicherry", name: "Pondicherry", tag: "Culture", img: "/images/generated/pondicherry_street_1781630378598.png", desc: "A charming coastal town with a French colonial legacy, tree-lined streets, mustard-yellow villas and chic boutiques.", price: 450, days: 4, category: "beach", groups: ["friends", "solo"] },
  { location: "domestic", id: "gokarna", name: "Gokarna Beach", tag: "Beach", img: "/images/generated/gokarna_beach_1781630399206.png", desc: "A laid-back beach town known for the uniquely shaped Om Beach and pristine, less-crowded shores.", price: 300, days: 4, category: "beach", groups: ["friends", "solo"] },
  { location: "domestic", id: "srinagar", name: "Srinagar Dal Lake", tag: "Nature", img: "/images/generated/srinagar_dal_lake_1781630414577.png", desc: "The summer capital of Jammu and Kashmir, famous for its colorful shikaras floating on the calm Dal Lake.", price: 650, days: 5, category: "nature", groups: ["families", "friends"] },
  { location: "domestic", id: "leh", name: "Leh Monastery", tag: "Adventure", img: "/images/generated/leh_monastery_1781630428172.png", desc: "High-desert city in the Himalayas known for its stunning Buddhist monasteries and dramatic landscapes.", price: 750, days: 6, category: "mountain", groups: ["friends", "solo"] },
  { location: "domestic", id: "ranthambore", name: "Ranthambore", tag: "Wildlife", img: "/images/generated/ranthambore_tiger_1781630445717.png", desc: "One of the largest national parks in northern India, renowned for its majestic Bengal tiger population.", price: 600, days: 3, category: "nature", groups: ["families", "friends"] },

  // 15 International Destinations
  // (6 AI Generated, 9 Wiki Verified)
  { location: "international", id: "maldives", name: "Maldives", tag: "Luxury", img: "/images/generated/maldives_water_villa_1781630466772.png", desc: "Experience ultimate luxury in overwater bungalows above crystal-clear turquoise waters.", price: 2500, days: 5, category: "beach", groups: ["families"] },
  { location: "international", id: "swiss_alps", name: "Swiss Alps", tag: "Mountain", img: "/images/generated/swiss_alps_1781630479845.png", desc: "Snow-capped peaks and quaint alpine villages perfect for skiing and winter sports.", price: 3000, days: 7, category: "mountain", groups: ["families", "friends"] },
  { location: "international", id: "dubai", name: "Dubai", tag: "City", img: "/images/generated/dubai_skyline_1781630504306.png", desc: "A futuristic metropolis featuring the towering Burj Khalifa, luxury shopping, and desert safaris.", price: 1500, days: 5, category: "city", groups: ["families", "friends"] },
  { location: "international", id: "paris", name: "Paris", tag: "Romance", img: "/images/generated/paris_eiffel_1781630518608.png", desc: "The City of Light, famous for the Eiffel Tower, art museums, and charming cafes.", price: 2000, days: 6, category: "city", groups: ["families"] },
  { location: "international", id: "bali", name: "Bali", tag: "Tropical", img: "/images/generated/bali_rice_terraces_1781630538897.png", desc: "Lush green rice terraces, beautiful beaches, and unique cultural temples.", price: 1200, days: 7, category: "nature", groups: ["friends", "solo"] },
  { location: "international", id: "banff", name: "Banff", tag: "Nature", img: "/images/generated/banff_lake_1781630563144.png", desc: "A stunning national park in Canada featuring bright turquoise glacial lakes and pine forests.", price: 1800, days: 6, category: "mountain", groups: ["friends", "families"] },
  { location: "international", id: "turkey", name: "Turkey", tag: "Culture", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Bosphorus_Bridge_%28235499411%29.jpg/330px-Bosphorus_Bridge_%28235499411%29.jpg", desc: "Experience the crossroads of Europe and Asia, featuring ancient ruins, vibrant bazaars, and hot air balloons.", price: 1800, days: 6, category: "heritage", groups: ["friends", "families"] },
  { location: "international", id: "kyoto", name: "Kyoto", tag: "Culture", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Golden_Pavilion_Kinkaku-ji_water_mirror_2024.jpg/330px-Golden_Pavilion_Kinkaku-ji_water_mirror_2024.jpg", desc: "The cultural heart of Japan, featuring classic Buddhist temples, gardens, and imperial palaces.", price: 2500, days: 7, category: "heritage", groups: ["solo", "families"] },
  { location: "international", id: "rome", name: "Rome", tag: "History", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/330px-Colosseo_2020.jpg", desc: "The capital of Italy, filled with nearly 3,000 years of globally influential art, architecture and culture.", price: 1900, days: 6, category: "heritage", groups: ["families", "friends"] },
  { location: "international", id: "maui", name: "Maui", tag: "Tropical", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Maui_Landsat_Photo.jpg/330px-Maui_Landsat_Photo.jpg", desc: "A beautiful Hawaiian island known for its volcanic landscapes, waterfalls, and stunning beaches.", price: 2800, days: 7, category: "beach", groups: ["families", "friends"] },
  { location: "international", id: "phuket", name: "Phuket", tag: "Beach", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Phuket_Aerial.jpg/330px-Phuket_Aerial.jpg", desc: "Thailand's largest island, famous for its white sand beaches, vibrant nightlife, and luxurious resorts.", price: 1100, days: 5, category: "beach", groups: ["friends", "solo"] },
  { location: "international", id: "cape_town", name: "Cape Town", tag: "Coastal", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Camps_bay_%2853460319478%29_%28cropped%29.jpg/330px-Camps_bay_%2853460319478%29_%28cropped%29.jpg", desc: "A port city on South Africa's southwest coast, crowned by the majestic Table Mountain.", price: 1700, days: 6, category: "nature", groups: ["friends", "solo"] },
  { location: "international", id: "mecca", name: "Mecca", tag: "Spiritual", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Great_Mosque_of_Mecca1.jpg/330px-Great_Mosque_of_Mecca1.jpg", desc: "The holiest city in Islam, a deeply spiritual destination for the Hajj and Umrah pilgrimages.", price: 2100, days: 7, category: "heritage", groups: ["families", "solo"] },
  { location: "international", id: "venice", name: "Venice", tag: "City", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Venezia_aerial_view.jpg/330px-Venezia_aerial_view.jpg", desc: "The city of canals, featuring stunning Gothic architecture and romantic gondola rides.", price: 2300, days: 4, category: "city", groups: ["families"] },
  { location: "international", id: "prague", name: "Prague", tag: "City", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Prague_%286365119737%29.jpg/330px-Prague_%286365119737%29.jpg", desc: "Known as the City of a Hundred Spires, featuring colorful baroque buildings and Gothic churches.", price: 1600, days: 5, category: "city", groups: ["friends", "solo"] }
];

const services = {
  flights: {
    id: "flights",
    icon: "✈️",
    title: "Flight Booking",
    desc: "We offer competitive rates on domestic and international flights. Experience hassle-free booking, flexible dates, and premium seating options.",
    perks: [
      { title: "Best Price Guarantee", desc: "We match any lower price found within 24 hours." },
      { title: "24/7 Support", desc: "Round-the-clock assistance for all your flight needs." },
      { title: "Flexible Cancellations", desc: "Cancel or modify your flights with minimal fees." },
      { title: "Lounge Access", desc: "Enjoy complimentary airport lounge access on premium bookings." }
    ],
    dropdownLabel: "Select Seating Class",
    dropdownOptions: ["Economy", "Premium Economy", "Business", "First Class"]
  },
  cruises: {
    id: "cruises",
    icon: "🚢",
    title: "Cruise Packages",
    desc: "Set sail on luxury cruise lines exploring breathtaking oceans and rivers around the globe. All-inclusive packages available.",
    perks: [
      { title: "All-Inclusive Dining", desc: "Gourmet meals and drinks included on board." },
      { title: "Ocean View Cabins", desc: "Wake up to stunning views of the sea." },
      { title: "Onboard Entertainment", desc: "Broadway-style shows, casinos, and live music." },
      { title: "Guided Shore Excursions", desc: "Curated experiences at every port of call." }
    ],
    dropdownLabel: "Select Cruise Duration",
    dropdownOptions: ["3-5 Days (Short Getaway)", "7 Days (Standard)", "10-14 Days (Extended)", "14+ Days (Grand Voyage)"]
  },
  hotels: {
    id: "hotels",
    icon: "🏨",
    title: "Hotel Booking",
    desc: "From budget-friendly stays to 5-star luxury resorts, we find the perfect accommodation tailored to your needs.",
    perks: [
      { title: "Free Upgrades", desc: "Complimentary room upgrades when available." },
      { title: "Early Check-in", desc: "Start your vacation sooner with priority check-in." },
      { title: "Exclusive Amenities", desc: "Spa credits, complimentary breakfast, and more." },
      { title: "Loyalty Points", desc: "Earn points with every stay towards future trips." }
    ],
    dropdownLabel: "Select Accommodation Type",
    dropdownOptions: ["Budget / Hostel", "Standard Hotel", "Luxury Resort", "Private Villa"]
  },
  tours: {
    id: "tours",
    icon: "🗺️",
    title: "Guided Tours",
    desc: "Immerse yourself in local culture with our expert-led guided tours. Perfect for solo travelers, couples, and groups.",
    perks: [
      { title: "Expert Local Guides", desc: "Learn from passionate, knowledgeable locals." },
      { title: "Small Group Sizes", desc: "Intimate experiences away from the crowds." },
      { title: "Skip-the-line Access", desc: "Priority entry to popular museums and landmarks." },
      { title: "Customizable Itineraries", desc: "Tailor your tour to your specific interests." }
    ],
    dropdownLabel: "Select Tour Focus",
    dropdownOptions: ["Historical / Cultural", "Adventure / Wildlife", "Food & Culinary", "Photography"]
  },
  visa: {
    id: "visa",
    icon: "🛂",
    title: "Visa Assistance",
    desc: "Navigate the complexities of international travel with our expert visa assistance services. Fast, reliable, and hassle-free processing.",
    perks: [
      { title: "Expert Guidance", desc: "Step-by-step assistance through the entire visa process." },
      { title: "Document Verification", desc: "Thorough review of your documents before submission." },
      { title: "Fast Processing", desc: "Expedited services available for urgent travel needs." },
      { title: "High Success Rate", desc: "Maximize your chances of approval with our experience." }
    ],
    dropdownLabel: "Select Visa Type",
    dropdownOptions: ["Tourist Visa", "Business Visa", "Student Visa", "Transit Visa"]
  }
};

const obj = { destinations, services };
const dataJsContent = "export const travelData = " + JSON.stringify(obj, null, 4) + ";";
fs.writeFileSync(path.join(__dirname, 'data.js'), dataJsContent);
console.log('Successfully generated data.js with ' + destinations.length + ' destinations.');
