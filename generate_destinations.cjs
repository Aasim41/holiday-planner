const fs = require('fs');
const path = require('path');

const destinations = [
    // Mixed Initial Preview (Indian and International)
    { id: "goa", name: "Goa Beaches", tag: "Beach Getaways", img: "/images/goa.png", desc: "Experience the ultimate beach vibe in Goa. Enjoy sun-kissed sands, thrilling water sports, and vibrant nightlife. Top spots: Baga Beach, Fort Aguada, Dudhsagar Falls.", category: "beach", groups: ["friends", "family"] },
    { id: "maldives", name: "Maldives Retreat", tag: "Beach Getaways", img: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1968&auto=format&fit=crop", desc: "Experience ultimate luxury in hand-picked water villas. Enjoy crystal clear waters, private beaches, and world-class snorkeling. Top spots: Male, Banana Reef, Maafushi.", category: "beach", groups: ["family", "individuals"] },
    { id: "jaipur", name: "Jaipur Palaces", tag: "City Explorations", img: "/images/jaipur.png", desc: "Step back in time in the Pink City. Explore majestic forts, royal palaces, and vibrant bazaars full of heritage. Top spots: Amber Fort, Hawa Mahal, City Palace.", category: "city", groups: ["family", "friends"] },
    { id: "swiss-alps", name: "Swiss Alps", tag: "Mountain Retreats", img: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2076&auto=format&fit=crop", desc: "Breathe in fresh mountain air exploring the majestic Swiss Alps. Perfect for skiing or summer hiking. Top spots: Matterhorn, Jungfraujoch, Lake Geneva.", category: "mountain", groups: ["family", "individuals"] },
    { id: "kerala", name: "Kerala Backwaters", tag: "Nature Retreats", img: "/images/kerala.png", desc: "Cruise through the serene backwaters of 'God's Own Country' on a traditional houseboat surrounded by lush greenery. Top spots: Alleppey, Munnar, Wayanad.", category: "nature", groups: ["family", "individuals"] },
    { id: "paris", name: "Paris Getaway", tag: "City Explorations", img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop", desc: "Fall in love with the city of lights. Enjoy exquisite cuisine, art museums, and iconic architecture. Top spots: Eiffel Tower, Louvre, Notre-Dame.", category: "city", groups: ["family", "friends", "individuals"] },
    
    // Remaining Core
    { id: "ladakh", name: "Ladakh Valley", tag: "Mountain Retreats", img: "/images/ladakh.png", desc: "Embark on an adventure of a lifetime through the breathtaking high-altitude passes, crystal clear lakes, and monasteries.", category: "mountain", groups: ["friends", "individuals"] },
    { id: "agra", name: "Taj Mahal, Agra", tag: "Heritage Sites", img: "/images/agra.png", desc: "Witness the magnificent Taj Mahal, a universal symbol of love and one of the Seven Wonders of the World.", category: "heritage", groups: ["family", "friends"] },
    { id: "manali", name: "Manali Escapade", tag: "Mountain Retreats", img: "/images/manali.png", desc: "A high-altitude Himalayan resort town known for its cool climate, snow-capped peaks, and adventure sports.", category: "mountain", groups: ["family", "friends"] },
    { id: "dubai", name: "Dubai Escapade", tag: "City Explorations", img: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1974&auto=format&fit=crop", desc: "Discover modern marvels, luxurious shopping, and breathtaking architecture.", category: "city", groups: ["family", "friends"] },
    { id: "bali", name: "Bali Paradise", tag: "Beach Getaways", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1938&auto=format&fit=crop", desc: "A tropical paradise featuring ancient temples, lush jungles, and vibrant culture.", category: "beach", groups: ["friends", "individuals"] },
    { id: "banff", name: "Banff National Park", tag: "Mountain Retreats", img: "https://images.unsplash.com/photo-1583489812496-e24c5523d44f?q=80&w=1974&auto=format&fit=crop", desc: "Explore the stunning turquoise lakes and rugged mountain peaks of the Canadian Rockies.", category: "mountain", groups: ["family", "individuals"] }
];

const categories = ["beach", "nature", "mountain", "city", "heritage"];
const tags = {
    beach: "Beach Getaways",
    nature: "Nature Retreats",
    mountain: "Mountain Retreats",
    city: "City Explorations",
    heritage: "Heritage Sites"
};

const images = {
    beach: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?q=80&w=2072&auto=format&fit=crop"
    ],
    nature: [
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2174&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=2076&auto=format&fit=crop"
    ],
    mountain: [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2076&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
    ],
    city: [
        "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1477959858617-679af054b028?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2156&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?q=80&w=1931&auto=format&fit=crop"
    ],
    heritage: [
        "https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560930950-5cb2066f25b6?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?q=80&w=2070&auto=format&fit=crop"
    ]
};

const locations = [
    "Santorini, Greece", "Kyoto, Japan", "Rome, Italy", "Maui, Hawaii", "Phuket, Thailand", 
    "Rio de Janeiro, Brazil", "Sydney, Australia", "Cape Town, South Africa", "Barcelona, Spain",
    "Amalfi Coast, Italy", "Tulum, Mexico", "Bora Bora", "Queenstown, NZ", "Machu Picchu, Peru",
    "Reykjavik, Iceland", "Havana, Cuba", "Venice, Italy", "Prague, Czechia", "Amsterdam, NLD",
    "Dubrovnik, Croatia", "Banff, Canada", "Yosemite, USA", "Himalayas, Nepal", "Petra, Jordan",
    "Rishikesh, India", "Varanasi, India", "Andaman Islands, India", "Udaipur, India",
    "Darjeeling, India", "Ooty, India", "Mysore, India", "Hampi, India", "Pondicherry, India",
    "Gokarna, India", "Munnar, India", "Srinagar, India", "Leh, India", "Ranthambore, India", "Auli, India",
    "Spiti Valley, India"
];

for(let i = 0; i < 40; i++) {
    const locName = locations[i];
    // Randomly assign 1-3 categories to make distribution nice
    const cat = categories[i % categories.length];
    
    // Determine group suitability
    let groups = [];
    if(i % 3 === 0) groups.push("family");
    if(i % 2 === 0) groups.push("friends");
    if(i % 4 === 0 || groups.length === 0) groups.push("individuals");

    destinations.push({
        id: locName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: locName,
        tag: tags[cat],
        img: images[cat][i % images[cat].length],
        desc: "Discover the breathtaking beauty and unique culture of " + locName + ". A perfect destination for " + groups.join(' and ') + " with amazing tourist spots, historical monuments, local cuisine, and stunning photography locations.",
        category: cat,
        groups: groups
    });
}

const obj = {
  destinations: destinations,
  services: {
    flights: { title: "Flight Tickets", icon: "✈️", desc: "We provide competitive rates and seamless booking experiences for international and domestic flights.", perks: [ { title: "24/7 Support", desc: "Flight changes and rebookings handled by our team." }, { title: "Best Rates", desc: "Access to exclusive airline discounts." } ] },
    cruises: { title: "Cruise Packages", icon: "🚢", desc: "Sail across oceans in unparalleled luxury. We partner with top cruise lines to bring you incredible oceanic adventures.", perks: [ { title: "All-Inclusive", desc: "Food, drinks, and entertainment included." }, { title: "Shore Excursions", desc: "Curated experiences at every port of call." } ] },
    visas: { title: "Visa Services", icon: "🛂", desc: "Skip the red tape. Our visa experts ensure your paperwork is flawless, expediting your travel approvals.", perks: [ { title: "Expert Guidance", desc: "We review every document before submission." }, { title: "Fast Processing", desc: "Priority pathways for eligible applications." } ] },
    packages: { title: "Complete Trip Packages", icon: "🧳", desc: "Leave the planning to us. We offer fully curated, end-to-end trip packages including flights, hotels, transfers, and daily itineraries.", perks: [ { title: "Zero Stress", desc: "Everything is organized before you arrive." }, { title: "Tailored to You", desc: "Customized itineraries based on your budget and interests." } ] }
  }
};

const dataJsContent = "export const travelData = " + JSON.stringify(obj, null, 4) + ";";
fs.writeFileSync(path.join(__dirname, 'data.js'), dataJsContent);
console.log('Successfully generated data.js with ' + destinations.length + ' destinations.');
