import type { CafeInfo } from "@/types";

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
    { day: "Monday", open: "8:00 AM", close: "11:45 PM" },
    { day: "Tuesday", open: "8:00 AM", close: "11:45 PM" },
    { day: "Wednesday", open: "8:00 AM", close: "11:45 PM" },
    { day: "Thursday", open: "8:00 AM", close: "11:45 PM" },
    { day: "Friday", open: "8:00 AM", close: "11:45 PM" },
    { day: "Saturday", open: "8:00 AM", close: "11:45 PM" },
    { day: "Sunday", open: "8:00 AM", close: "11:45 PM" },
  ],
  social: {
    instagram: "https://www.instagram.com/coffeesince1999/",
  },
  zomato: "https://www.zomato.com/chennai/coffee-since-1999-2-thousand-lights/order",
  swiggy: "https://www.swiggy.com/city/chennai/coffee-since-1999-thousand-lights-rest368887",
  mapsUrl: "https://maps.app.goo.gl/9cAn6RbpJD6o3kSAA",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.6!2d80.2565!3d13.0669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zQ29mZmVlPyBTaW5jZSAxOTk5!5e0!3m2!1sen!2sin!4v1",
  rating: "4.4",
  reviewCount: "1500+",
  priceForTwo: "₹1,400",
  menu: [
    // Signatures
    {
      name: "Churros",
      description: "Crispy cinnamon churros with chocolate & caramel dipping sauce. Chennai's best.",
      price: "₹320",
      category: "food",
      signature: true,
      tag: "Fan Favourite",
    },
    {
      name: "Panko Crusted Paneer Fingers",
      description: "Crispy paneer in a golden panko crust, served with mint mayo.",
      price: "₹310",
      category: "food",
      signature: true,
      tag: "Most Ordered",
    },
    {
      name: "Grilled Chicken Sandwich",
      description: "Char-grilled chicken with basil pesto on sourdough. A timeless classic.",
      price: "₹395",
      category: "food",
      signature: true,
      tag: "Classic",
    },
    {
      name: "Spanish Latte",
      description: "Silky espresso with sweetened condensed milk. Strong, smooth, indulgent.",
      price: "₹295",
      category: "coffee",
      signature: true,
      tag: "Must Try",
    },
    {
      name: "Biscoff Latte",
      description: "Espresso blended with Lotus Biscoff spread. Caramelised and dreamy.",
      price: "₹310",
      category: "coffee",
      signature: true,
    },
    {
      name: "Malibu Latte",
      description: "Our signature latte with a tropical coconut rum twist.",
      price: "₹320",
      category: "coffee",
      signature: true,
    },
    {
      name: "Lotus Biscoff Cheesecake",
      description: "Cold cheesecake on a Biscoff biscuit base. No-bake, all flavour.",
      price: "₹375",
      category: "food",
      signature: true,
    },
    {
      name: "Tiramisu",
      description: "Classic Italian tiramisu with espresso-soaked ladyfingers and mascarpone.",
      price: "₹380",
      category: "food",
      signature: true,
    },
    // More food
    {
      name: "Madras Masala Fries",
      description: "Crispy fries tossed in our house Madras masala spice blend.",
      price: "₹220",
      category: "food",
    },
    {
      name: "Pesto Veg Flatbread",
      description: "Toasted flatbread with basil pesto, roasted vegetables, and cheese.",
      price: "₹360",
      category: "food",
    },
    {
      name: "Crispy Chicken Peri Peri",
      description: "Golden fried chicken coated in peri peri masala. Spicy and satisfying.",
      price: "₹385",
      category: "food",
    },
    {
      name: "Chicken Ghee Roast with Parotta",
      description: "South Indian spiced ghee roast chicken served with flaky parotta.",
      price: "₹420",
      category: "food",
    },
    {
      name: "Keema & Paneer Pav",
      description: "Spiced minced meat and paneer served with butter-toasted pav.",
      price: "₹340",
      category: "food",
    },
    // More beverages
    {
      name: "Belgian Hot Chocolate",
      description: "Rich Belgian dark chocolate made into a thick, warming indulgence.",
      price: "₹280",
      category: "coffee",
    },
    {
      name: "Cold Brew",
      description: "Medium-light roast beans cold-steeped for 24 hours. Dense, smooth, intense.",
      price: "₹260",
      category: "coffee",
    },
    {
      name: "Salted Caramel Frappuccino",
      description: "Blended iced coffee with salted caramel and whipped cream.",
      price: "₹290",
      category: "coffee",
    },
    {
      name: "Caramel Thickshake",
      description: "Thick, creamy caramel milkshake made with premium ice cream.",
      price: "₹270",
      category: "other",
    },
  ],
};

export const signatureItems = cafe.menu.filter((item) => item.signature);
