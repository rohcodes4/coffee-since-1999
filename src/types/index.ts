export interface MenuItem {
  name: string;
  description: string;
  price: string;
  category: "coffee" | "tea" | "food" | "other";
  signature?: boolean;
  tag?: string;
}

export interface Hours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface CafeInfo {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  hours: Hours[];
  social: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  zomato?: string;
  swiggy?: string;
  mapsUrl?: string;
  mapsEmbed?: string;
  rating?: string;
  reviewCount?: string;
  priceForTwo?: string;
  menu: MenuItem[];
}
