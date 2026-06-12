import type { CafeInfo, MenuCategory } from "@/types";

const U = "https://images.unsplash.com";

export const menuCategories: MenuCategory[] = [
  { id: "espresso",    name: "Espresso Drinks"  },
  { id: "cold-coffee", name: "Cold Coffee"       },
  { id: "chocolate",   name: "Chocolate"         },
  { id: "thickshakes", name: "Thickshakes"       },
  { id: "teas",        name: "Teas & Matcha"     },
  { id: "breakfast",   name: "Breakfast"         },
  { id: "starters",    name: "Starters"          },
  { id: "sandwiches",  name: "Sandwiches"        },
  { id: "mains",       name: "Mains"             },
  { id: "pasta",       name: "Pasta"             },
  { id: "bowls",       name: "Bowls"             },
  { id: "desserts",    name: "Desserts"          },
];

export const cafe: CafeInfo = {
  name: "Coffee? Since 1999",
  tagline: "Chennai's OG Hangout",
  description:
    "One of Chennai's oldest coffee shops. Since 1999, a cozy escape in Thousand Lights where the entire place smells like coffee and every visit feels like coming home.",
  phone: "+91 80564 02888",
  email: "",
  address: {
    street: "1, Pycrofts Garden Road, Subba Road Avenue",
    city: "Thousand Lights, Chennai",
    state: "Tamil Nadu",
    zip: "600006",
  },
  hours: [
    { day: "Monday",    open: "8:00 AM", close: "11:45 PM" },
    { day: "Tuesday",   open: "8:00 AM", close: "11:45 PM" },
    { day: "Wednesday", open: "8:00 AM", close: "11:45 PM" },
    { day: "Thursday",  open: "8:00 AM", close: "11:45 PM" },
    { day: "Friday",    open: "8:00 AM", close: "11:45 PM" },
    { day: "Saturday",  open: "8:00 AM", close: "11:45 PM" },
    { day: "Sunday",    open: "8:00 AM", close: "11:45 PM" },
  ],
  social: {
    instagram: "https://www.instagram.com/coffeesince1999/",
  },
  zomato: "https://www.zomato.com/chennai/coffee-since-1999-2-thousand-lights/order",
  swiggy:  "https://www.swiggy.com/city/chennai/coffee-since-1999-thousand-lights-rest368887",
  mapsUrl: "https://maps.app.goo.gl/9cAn6RbpJD6o3kSAA",
  rating: "4.4",
  reviewCount: "1500+",
  priceForTwo: "₹1,400",

  gallery: [
    { src: `${U}/photo-1501339847302-ac426a4a7cbb?w=700&h=950&fit=crop&q=85`, alt: "Warm cafe interior",             aspect: "portrait"   },
    { src: `${U}/photo-1559305616-3f99cd43e353?w=900&h=600&fit=crop&q=85`,  alt: "Latte art in a cup",             aspect: "landscape"  },
    { src: `${U}/photo-1521017432531-fbd92d768814?w=650&h=850&fit=crop&q=85`, alt: "Cafe seating with sunlight",   aspect: "portrait"   },
    { src: `${U}/photo-1495474472287-4d71bcdd2085?w=850&h=600&fit=crop&q=85`, alt: "Coffee on wooden table",       aspect: "landscape"  },
    { src: `${U}/photo-1509042239860-f550ce710b93?w=650&h=850&fit=crop&q=85`, alt: "Coffee being poured",          aspect: "portrait"   },
    { src: `${U}/photo-1445116572660-236099ec97a0?w=900&h=650&fit=crop&q=85`, alt: "Cafe with warm light",         aspect: "landscape"  },
    { src: `${U}/photo-1556740767-414a9c4860c1?w=650&h=650&fit=crop&q=85`,  alt: "Barista preparing coffee",      aspect: "square"     },
    { src: `${U}/photo-1542181961-9590d0c79dab?w=900&h=600&fit=crop&q=85`,  alt: "Friends at a cafe table",       aspect: "landscape"  },
    { src: `${U}/photo-1524901548305-08eeddc35080?w=650&h=900&fit=crop&q=85`, alt: "Coffee shop atmosphere",      aspect: "portrait"   },
  ],

  menu: [
    /* ── ESPRESSO ─────────────────────────────────────────── */
    {
      name: "Americano",
      description: "A clean, bright shot of espresso stretched with hot water.",
      price: "₹220", category: "espresso", veg: true, vegan: true,
      image: `${U}/photo-1509042239860-f550ce710b93?w=600&h=600&fit=crop&q=80`,
    },
    {
      name: "Cappuccino",
      description: "Equal parts espresso, steamed milk, and silky microfoam.",
      price: "₹250", category: "espresso", veg: true,
      image: `${U}/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop&q=80`,
    },
    {
      name: "Latte",
      description: "Smooth espresso with a generous pour of steamed whole milk.",
      price: "₹250", category: "espresso", veg: true,
      image: `${U}/photo-1461023058943-07fcbe16d735?w=600&h=600&fit=crop&q=80`,
    },
    {
      name: "Spanish Latte",
      description: "Espresso pulled over sweetened condensed milk. Rich, smooth, addictive.",
      price: "₹295", category: "espresso", veg: true, signature: true, tag: "Must Try",
      image: `${U}/photo-1511920170033-f8396924c348?w=600&h=700&fit=crop&q=80`,
    },
    {
      name: "Turkish Latte",
      description: "Espresso with cardamom and warm spices — an Eastern twist on a classic.",
      price: "₹295", category: "espresso", veg: true,
      image: `${U}/photo-1514432324607-a09d9b4aefdd?w=600&h=700&fit=crop&q=80`,
    },
    {
      name: "Biscoff Latte",
      description: "Espresso blended with Lotus Biscoff spread. Caramelised, warm, and dreamy.",
      price: "₹310", category: "espresso", veg: true, signature: true,
      image: `${U}/photo-1541167760496-1628856ab772?w=600&h=700&fit=crop&q=80`,
    },
    {
      name: "Malibu Latte",
      description: "Our signature latte with a coconut-kissed tropical finish.",
      price: "₹320", category: "espresso", veg: true, signature: true,
      image: `${U}/photo-1572490122747-3968b75cc699?w=600&h=700&fit=crop&q=80`,
    },
    {
      name: "Vanilla Affogato",
      description: "A shot of hot espresso poured over vanilla ice cream. Bliss in a glass.",
      price: "₹265", category: "espresso", veg: true,
      image: `${U}/photo-1579954115545-a95591f28bfc?w=600&h=600&fit=crop&q=80`,
    },

    /* ── COLD COFFEE ──────────────────────────────────────── */
    {
      name: "Cold Brew",
      description: "Medium-light beans cold-steeped for 24 hours. Dense, smooth, intensely flavoured.",
      price: "₹260", category: "cold-coffee", veg: true,
      image: `${U}/photo-1461023058943-07fcbe16d735?w=600&h=700&fit=crop&q=80`,
    },
    {
      name: "Cold Coffee",
      description: "Chilled espresso shaken with milk and ice. Our classic.",
      price: "₹240", category: "cold-coffee", veg: true,
      image: `${U}/photo-1592663527359-cf6642f54cff?w=600&h=700&fit=crop&q=80`,
    },
    {
      name: "Salted Caramel Cold Coffee",
      description: "Cold espresso with caramel syrup and a pinch of sea salt.",
      price: "₹280", category: "cold-coffee", veg: true,
      image: `${U}/photo-1572490122747-3968b75cc699?w=600&h=700&fit=crop&q=80`,
    },
    {
      name: "Peanut Butter Cold Coffee",
      description: "Cold coffee blended with chunky peanut butter. Dangerously good.",
      price: "₹290", category: "cold-coffee", veg: true,
      image: `${U}/photo-1461023058943-07fcbe16d735?w=600&h=600&fit=crop&q=80`,
    },

    /* ── CHOCOLATE ────────────────────────────────────────── */
    {
      name: "Belgian Hot Chocolate",
      description: "Rich Belgian dark chocolate made into a thick, warming indulgence.",
      price: "₹300", category: "chocolate", veg: true, signature: true,
      image: `${U}/photo-1542990253-0d0f5be5f0ed?w=600&h=700&fit=crop&q=80`,
    },
    {
      name: "Cold Chocolate",
      description: "Thick, creamy milk chocolate served over ice.",
      price: "₹275", category: "chocolate", veg: true,
      image: `${U}/photo-1517578239113-b03992dcdd25?w=600&h=700&fit=crop&q=80`,
    },
    {
      name: "Nutella Hot Chocolate",
      description: "Belgian dark chocolate enriched with Nutella. Sinfully thick.",
      price: "₹320", category: "chocolate", veg: true,
      image: `${U}/photo-1542990253-0d0f5be5f0ed?w=600&h=700&fit=crop&q=80`,
    },

    /* ── THICKSHAKES ──────────────────────────────────────── */
    {
      name: "Biscoff Thickshake",
      description: "Dense shake blended with Biscoff biscuits and caramel. Almost a dessert.",
      price: "₹310", category: "thickshakes", veg: true,
      image: `${U}/photo-1572490122747-3968b75cc699?w=600&h=700&fit=crop&q=80`,
    },
    {
      name: "Caramel Thickshake",
      description: "Thick, creamy caramel milkshake made with premium ice cream.",
      price: "₹270", category: "thickshakes", veg: true,
      image: `${U}/photo-1572490122747-3968b75cc699?w=600&h=700&fit=crop&q=80`,
    },
    {
      name: "Berry Thickshake",
      description: "Blueberry, cranberry, raspberry and strawberry — a riot of berries.",
      price: "₹270", category: "thickshakes", veg: true,
      image: `${U}/photo-1623065422902-30a2d299bbe4?w=600&h=700&fit=crop&q=80`,
    },
    {
      name: "Peanut Butter Thickshake",
      description: "Thick vanilla shake loaded with chunky peanut butter.",
      price: "₹280", category: "thickshakes", veg: true,
      image: `${U}/photo-1572490122747-3968b75cc699?w=600&h=700&fit=crop&q=80`,
    },
    {
      name: "Vanilla Thickshake",
      description: "The classic. Real vanilla, thick as a cloud.",
      price: "₹240", category: "thickshakes", veg: true,
      image: `${U}/photo-1572490122747-3968b75cc699?w=600&h=700&fit=crop&q=80`,
    },

    /* ── TEAS ─────────────────────────────────────────────── */
    {
      name: "Matcha Latte",
      description: "Ceremonial grade matcha whisked with steamed oat milk.",
      price: "₹280", category: "teas", veg: true, vegan: true,
      image: `${U}/photo-1515823662972-da6a2e4d3002?w=600&h=700&fit=crop&q=80`,
    },
    {
      name: "Matcha Tea",
      description: "Pure matcha, whisked in hot water. Clean and grassy.",
      price: "₹240", category: "teas", veg: true, vegan: true,
      image: `${U}/photo-1515823662972-da6a2e4d3002?w=600&h=700&fit=crop&q=80`,
    },
    {
      name: "Virgin Mojito",
      description: "Lime, mint, sugar and soda. Crisp and refreshing.",
      price: "₹210", category: "teas", veg: true, vegan: true,
      image: `${U}/photo-1513558161293-cdaf765ed2fd?w=600&h=700&fit=crop&q=80`,
    },

    /* ── BREAKFAST ────────────────────────────────────────── */
    {
      name: "Scrambled Eggs & Pav",
      description: "Parsi-style creamy scrambled eggs with buttered homemade pav.",
      price: "₹280", category: "breakfast", veg: false,
      image: `${U}/photo-1525351484163-7529414344d8?w=600&h=600&fit=crop&q=80`,
    },
    {
      name: "Bagel with Cream Cheese",
      description: "Classic homemade bagel topped generously with cream cheese.",
      price: "₹260", category: "breakfast", veg: true,
      image: `${U}/photo-1550507992-eb63ffee0847?w=600&h=600&fit=crop&q=80`,
    },
    {
      name: "Keema & Paneer Pav",
      description: "Spiced minced meat and paneer served with butter-toasted pav.",
      price: "₹340", category: "breakfast", veg: false,
      image: `${U}/photo-1585937421612-70a008356fbe?w=600&h=600&fit=crop&q=80`,
    },
    {
      name: "Blueberry Smoothie Bowl",
      description: "Thick acai-style blueberry base topped with granola and fresh fruit.",
      price: "₹320", category: "breakfast", veg: true, vegan: true,
      image: `${U}/photo-1511690656952-34342bb7c2f2?w=600&h=600&fit=crop&q=80`,
    },
    {
      name: "Chicken Ghee Roast with Parotta",
      description: "South Indian spiced ghee roast chicken served with flaky layered parotta.",
      price: "₹420", category: "breakfast", veg: false,
      image: `${U}/photo-1585937421612-70a008356fbe?w=600&h=600&fit=crop&q=80`,
    },

    /* ── STARTERS ─────────────────────────────────────────── */
    {
      name: "Panko Crusted Paneer Fingers",
      description: "Crispy golden paneer in a crunchy panko crust, served with mint mayo.",
      price: "₹310", category: "starters", veg: true, signature: true, tag: "Most Ordered",
      image: `${U}/photo-1601050690597-df0568f70950?w=600&h=500&fit=crop&q=80`,
    },
    {
      name: "Madras Masala Fries",
      description: "Crispy fries tossed in our house Madras masala spice blend.",
      price: "₹220", category: "starters", veg: true,
      image: `${U}/photo-1630384060421-cb20d0e0649d?w=600&h=500&fit=crop&q=80`,
    },
    {
      name: "Goat Cheese Toast",
      description: "Sourdough topped with goat cheese, sundried tomatoes, olives and caramelised onions.",
      price: "₹340", category: "starters", veg: true,
      image: `${U}/photo-1565958011703-44f9829ba187?w=600&h=500&fit=crop&q=80`,
    },
    {
      name: "Cheese Chilli Toast",
      description: "Toasted sourdough with sliced green chillies and béchamel cheese sauce.",
      price: "₹260", category: "starters", veg: true,
      image: `${U}/photo-1528736235302-52922df5c122?w=600&h=500&fit=crop&q=80`,
    },
    {
      name: "Crispy Fried Paneer",
      description: "Spicy crumb-fried paneer with in-house mayonnaise dip.",
      price: "₹290", category: "starters", veg: true,
      image: `${U}/photo-1601050690597-df0568f70950?w=600&h=500&fit=crop&q=80`,
    },

    /* ── SANDWICHES ───────────────────────────────────────── */
    {
      name: "Grilled Chicken Sandwich",
      description: "Char-grilled chicken with basil pesto on house sourdough. Our most-loved sandwich.",
      price: "₹395", category: "sandwiches", veg: false, signature: true, tag: "Classic",
      image: `${U}/photo-1528736235302-52922df5c122?w=600&h=500&fit=crop&q=80`,
    },
    {
      name: "Pesto Chicken Sandwich",
      description: "Tender chicken breast with house-made green pesto and fresh greens.",
      price: "₹425", category: "sandwiches", veg: false,
      image: `${U}/photo-1528736235302-52922df5c122?w=600&h=500&fit=crop&q=80`,
    },
    {
      name: "Roasted Red Pepper Sandwich",
      description: "Sweet roasted peppers, hummus and rocket on toasted sourdough.",
      price: "₹360", category: "sandwiches", veg: true,
      image: `${U}/photo-1565958011703-44f9829ba187?w=600&h=500&fit=crop&q=80`,
    },
    {
      name: "Toasted Tomato Sandwich",
      description: "Heirloom tomatoes, fresh mozzarella, basil oil on grilled sourdough.",
      price: "₹340", category: "sandwiches", veg: true,
      image: `${U}/photo-1565958011703-44f9829ba187?w=600&h=500&fit=crop&q=80`,
    },
    {
      name: "Chicken Katsu Sandwich",
      description: "Panko-crusted chicken katsu with tonkatsu sauce and cabbage slaw.",
      price: "₹420", category: "sandwiches", veg: false,
      image: `${U}/photo-1528736235302-52922df5c122?w=600&h=500&fit=crop&q=80`,
    },

    /* ── MAINS ────────────────────────────────────────────── */
    {
      name: "Grilled Chicken Plate",
      description: "Herb-marinated char-grilled chicken with sweet potatoes and grilled vegetables.",
      price: "₹480", category: "mains", veg: false,
      image: `${U}/photo-1432139555190-58524dae6a55?w=600&h=500&fit=crop&q=80`,
    },
    {
      name: "Crispy Chicken Peri Peri",
      description: "Golden fried chicken thigh coated in peri peri masala. Spicy, crispy, satisfying.",
      price: "₹440", category: "mains", veg: false,
      image: `${U}/photo-1432139555190-58524dae6a55?w=600&h=500&fit=crop&q=80`,
    },
    {
      name: "Veg Stir-Fried Greens with Jasmine Rice",
      description: "Seasonal greens wok-tossed with garlic and served over fragrant jasmine rice.",
      price: "₹380", category: "mains", veg: true,
      image: `${U}/photo-1512058564366-18510be2db19?w=600&h=500&fit=crop&q=80`,
    },
    {
      name: "Chicken Chilli Oil Noodles",
      description: "Silky noodles tossed in house-made chilli oil with shredded chicken.",
      price: "₹530", category: "mains", veg: false,
      image: `${U}/photo-1569718212165-3a8278d5f624?w=600&h=500&fit=crop&q=80`,
    },

    /* ── PASTA ────────────────────────────────────────────── */
    {
      name: "Truffle Fettuccine",
      description: "Truffle cream sauce with sautéed shiitake mushrooms on ribbons of fettuccine.",
      price: "₹520", category: "pasta", veg: true,
      image: `${U}/photo-1473093226555-0465b2053ac5?w=600&h=500&fit=crop&q=80`,
    },
    {
      name: "Pesto Pasta",
      description: "Al dente pasta generously tossed with house basil pesto and parmesan.",
      price: "₹380", category: "pasta", veg: true,
      image: `${U}/photo-1473093226555-0465b2053ac5?w=600&h=500&fit=crop&q=80`,
    },
    {
      name: "Aglio e Olio",
      description: "Spaghetti tossed with extra virgin olive oil, garlic and red pepper flakes.",
      price: "₹350", category: "pasta", veg: true, vegan: true,
      image: `${U}/photo-1473093226555-0465b2053ac5?w=600&h=500&fit=crop&q=80`,
    },
    {
      name: "Classic Arrabbiata",
      description: "San Marzano tomatoes, garlic and chilli in a robust red sauce.",
      price: "₹340", category: "pasta", veg: true, vegan: true,
      image: `${U}/photo-1473093226555-0465b2053ac5?w=600&h=500&fit=crop&q=80`,
    },

    /* ── BOWLS ────────────────────────────────────────────── */
    {
      name: "Chilli Paneer Fried Rice",
      description: "Indo-Chinese classic — wok-tossed jasmine rice with crispy chilli paneer.",
      price: "₹460", category: "bowls", veg: true,
      image: `${U}/photo-1512058564366-18510be2db19?w=600&h=500&fit=crop&q=80`,
    },
    {
      name: "Veg Chilli Oil Noodles",
      description: "Noodles in house-made chilli oil with toasted sesame and crispy shallots.",
      price: "₹460", category: "bowls", veg: true, vegan: true,
      image: `${U}/photo-1569718212165-3a8278d5f624?w=600&h=500&fit=crop&q=80`,
    },

    /* ── DESSERTS ─────────────────────────────────────────── */
    {
      name: "Churros",
      description: "Crispy cinnamon churros with Belgian dark chocolate and salted caramel dipping sauces. Chennai's best, full stop.",
      price: "₹320", category: "desserts", veg: true, signature: true, tag: "Fan Favourite",
      image: `${U}/photo-1624371414361-e670edf4898d?w=600&h=600&fit=crop&q=80`,
    },
    {
      name: "Lotus Biscoff Cheesecake",
      description: "Cold no-bake cheesecake on a Biscoff biscuit base, topped with crunchy crumbs.",
      price: "₹375", category: "desserts", veg: true, signature: true,
      image: `${U}/photo-1524351199678-941a58a3df50?w=600&h=600&fit=crop&q=80`,
    },
    {
      name: "Tiramisu",
      description: "Classic Italian tiramisu with espresso-soaked ladyfingers and mascarpone cream.",
      price: "₹380", category: "desserts", veg: true, signature: true,
      image: `${U}/photo-1571877227200-a0d98ea607e9?w=600&h=600&fit=crop&q=80`,
    },
    {
      name: "Blueberry Cheesecake",
      description: "Cold Philadelphia cream cheese on a buttery crumb base with blueberry coulis.",
      price: "₹375", category: "desserts", veg: true,
      image: `${U}/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop&q=80`,
    },
    {
      name: "Chocolate Brownie",
      description: "Fudgy dark chocolate brownie, warm from the oven. Served with vanilla ice cream.",
      price: "₹300", category: "desserts", veg: true,
      image: `${U}/photo-1564355808539-22fda35bed7e?w=600&h=600&fit=crop&q=80`,
    },
    {
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with a molten dark chocolate centre. Order it hot.",
      price: "₹340", category: "desserts", veg: true,
      image: `${U}/photo-1606313564200-e75d5e30476c?w=600&h=600&fit=crop&q=80`,
    },
  ],
};

export const signatureItems = cafe.menu.filter((item) => item.signature);
