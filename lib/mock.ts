export type PropertyType = "Apartment" | "House" | "Land" | "Commercial";

export type Property = {
  id: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  status: "Active" | "Pending" | "Open House";
  address: string;
  area: string;
  zip: string;
  type: PropertyType;
  image: string;
  tag?: string;
  tagColor?: "brand" | "orange";
  ownerName?: string;
  agent?: {
    id: string;
    displayName?: string | null;
    avatarUrl?: string | null;
    phone?: string | null;
    bio?: string | null;
  } | null;
};

export type Agent = {
  id: string;
  name: string;
  company: string;
  priceRange: string;
  salesLast12: number;
  salesArea: string;
  area: string;
  image: string;
};

export type Category = {
  id: string;
  name: string;
  image: string;
};

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

export const areaZipMap: Record<string, string> = {
  Dhanmondi: "1209",
  Gulshan: "1212",
  Banani: "1213",
  Bashundhara: "1229",
  Uttara: "1230",
  Mirpur: "1216",
  Tejgaon: "1208",
};

export const properties: Property[] = [
  { id: "1", price: 29500000, beds: 3, baths: 2, sqft: 1292, status: "Active", address: "House 12, Road 4, Dhanmondi, Dhaka 1209", area: "Dhanmondi", zip: "1209", type: "House", image: img("photo-1568605114967-8130f3a36994"), tag: "Modern design", tagColor: "brand" },
  { id: "2", price: 27500000, beds: 3, baths: 2, sqft: 1292, status: "Active", address: "House 31, Gulshan-2, Dhaka 1212", area: "Gulshan", zip: "1212", type: "Apartment", image: img("photo-1600585154340-be6161a56a0c"), tag: "Modern design", tagColor: "brand" },
  { id: "3", price: 25990000, beds: 4, baths: 2, sqft: 1216, status: "Open House", address: "Plot 22, Bashundhara R/A, Dhaka 1229", area: "Bashundhara", zip: "1229", type: "House", image: img("photo-1570129477492-45c003edd2be"), tag: "Open: Sat 10:30am", tagColor: "orange" },
  { id: "4", price: 27500000, beds: 3, baths: 3, sqft: 2646, status: "Active", address: "House 9, Banani, Dhaka 1213", area: "Banani", zip: "1213", type: "House", image: img("photo-1605276374104-dee2a0ed3cd6"), tag: "Granite countertops", tagColor: "orange" },
  { id: "5", price: 18900000, beds: 2, baths: 2, sqft: 1100, status: "Active", address: "Road 7, Uttara Sector 4, Dhaka 1230", area: "Uttara", zip: "1230", type: "Apartment", image: img("photo-1502672260266-1c1ef2d93688"), tag: "New listing", tagColor: "brand" },
  { id: "6", price: 32000000, beds: 4, baths: 3, sqft: 1850, status: "Pending", address: "Mirpur DOHS, Dhaka 1216", area: "Mirpur", zip: "1216", type: "House", image: img("photo-1592595896616-c37162298647"), tag: "Pending", tagColor: "orange" },
  { id: "7", price: 14500000, beds: 2, baths: 1, sqft: 950, status: "Active", address: "Road 11, Banani, Dhaka 1213", area: "Banani", zip: "1213", type: "Apartment", image: img("photo-1502672023488-70e25813eb80"), tag: "Cozy", tagColor: "brand" },
  { id: "8", price: 41000000, beds: 5, baths: 4, sqft: 2980, status: "Active", address: "Plot 5, Gulshan-1, Dhaka 1212", area: "Gulshan", zip: "1212", type: "House", image: img("photo-1613490493576-7fde63acd811"), tag: "Luxury", tagColor: "orange" },
  { id: "9", price: 8900000, beds: 0, baths: 0, sqft: 2400, status: "Active", address: "Sector 11, Uttara, Dhaka 1230", area: "Uttara", zip: "1230", type: "Land", image: img("photo-1500382017468-9049fed747ef"), tag: "Land plot", tagColor: "brand" },
  { id: "10", price: 22000000, beds: 3, baths: 2, sqft: 1380, status: "Open House", address: "Road 27, Dhanmondi, Dhaka 1209", area: "Dhanmondi", zip: "1209", type: "Apartment", image: img("photo-1493809842364-78817add7ffb"), tag: "Open Sun", tagColor: "orange" },
  { id: "11", price: 55000000, beds: 0, baths: 2, sqft: 3200, status: "Active", address: "Tejgaon Commercial Area, Dhaka 1208", area: "Tejgaon", zip: "1208", type: "Commercial", image: img("photo-1486406146926-c627a92ad1ab"), tag: "Office space", tagColor: "brand" },
  { id: "12", price: 19500000, beds: 3, baths: 2, sqft: 1240, status: "Active", address: "Mirpur 11, Dhaka 1216", area: "Mirpur", zip: "1216", type: "Apartment", image: img("photo-1522708323590-d24dbb6b0267"), tag: "Move-in ready", tagColor: "brand" },
  { id: "13", price: 36500000, beds: 4, baths: 3, sqft: 2100, status: "Active", address: "Block J, Bashundhara R/A, Dhaka 1229", area: "Bashundhara", zip: "1229", type: "House", image: img("photo-1512917774080-9991f1c4c750"), tag: "Premium", tagColor: "orange" },
  { id: "14", price: 11900000, beds: 2, baths: 2, sqft: 880, status: "Pending", address: "Sector 7, Uttara, Dhaka 1230", area: "Uttara", zip: "1230", type: "Apartment", image: img("photo-1493606371202-6008ef0a8b86") },
];

export const propertyAreas = ["Dhanmondi", "Gulshan", "Banani", "Bashundhara", "Uttara", "Mirpur", "Tejgaon"] as const;
export const propertyTypes: PropertyType[] = ["Apartment", "House", "Land", "Commercial"];
export const propertyStatuses: Property["status"][] = ["Active", "Pending", "Open House"];

export const agents: Agent[] = [
  { id: "a1", name: "Rakib Hasan", company: "Panpata Realty", priceRange: "৳18L - ৳3.2Cr", salesLast12: 142, salesArea: "Dhaka", area: "Dhanmondi", image: img("photo-1507003211169-0a1dd7228f2d") },
  { id: "a2", name: "Sumaiya Ahmed", company: "Dhaka Homes", priceRange: "৳25L - ৳5.0Cr", salesLast12: 98, salesArea: "Gulshan", area: "Gulshan", image: img("photo-1573496359142-b8d87734a5a2") },
  { id: "a3", name: "Tanvir Karim", company: "Bashundhara Estate", priceRange: "৳15L - ৳2.8Cr", salesLast12: 76, salesArea: "Bashundhara", area: "Bashundhara R/A", image: img("photo-1500648767791-00dcc994a43e") },
  { id: "a4", name: "Nusrat Jahan", company: "Uttara Properties", priceRange: "৳12L - ৳1.9Cr", salesLast12: 64, salesArea: "Uttara", area: "Uttara", image: img("photo-1544005313-94ddf0286df2") },
  { id: "a5", name: "Imran Chowdhury", company: "Banani Living", priceRange: "৳30L - ৳6.5Cr", salesLast12: 120, salesArea: "Banani", area: "Banani", image: img("photo-1531427186611-ecfd6d936c79") },
];

export const categories: Category[] = [
  { id: "c1", name: "Apartment", image: img("photo-1545324418-cc1a3fa10c00") },
  { id: "c2", name: "Offices", image: img("photo-1497366216548-37526070297c") },
  { id: "c3", name: "House", image: img("photo-1564013799919-ab600027ffc6") },
  { id: "c4", name: "Land", image: img("photo-1500382017468-9049fed747ef") },
  { id: "c5", name: "Residential", image: img("photo-1486325212027-8081e485255e") },
  { id: "c6", name: "Commercial", image: img("photo-1486406146926-c627a92ad1ab") },
  { id: "c7", name: "Building", image: img("photo-1449844908441-8829872d2607") },
];

export function formatBDT(n: number) {
  if (n >= 10000000) return `৳${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `৳${(n / 100000).toFixed(1)} L`;
  return `৳${n.toLocaleString("en-BD")}`;
}
