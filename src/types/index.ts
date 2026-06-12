export interface MenuItem {
  name: string;
  description: string;
  price: string;
  category: string;
  signature?: boolean;
  tag?: string;
  image?: string;
  veg?: boolean;
  vegan?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  aspect: "portrait" | "landscape" | "square";
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
  rating?: string;
  reviewCount?: string;
  menu: MenuItem[];
  gallery: GalleryImage[];
}
