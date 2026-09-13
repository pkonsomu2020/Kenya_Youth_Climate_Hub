// ============================================================
// El Niño 23-Point Preparedness Action Guide Dataset
// Official Source: Kenya Meteorological Department (KMD) & Ministry of Environment
// ============================================================

export type PreparednessStep = {
  stepNumber: number;
  title: string;
  category: "Home & Infrastructure" | "Health & Medicine" | "Emergency Kit" | "Water & Sanitation" | "Safety & Livestock";
  description: string;
  keyAction: string;
  iconName: string;
};

export const EL_NINO_23_STEPS: PreparednessStep[] = [
  {
    stepNumber: 1,
    title: "Fix the Roof",
    category: "Home & Infrastructure",
    description: "Inspect corrugated iron sheets, replace missing nails, seal rusted ridges, and replace broken tiles to prevent heavy rain leakage.",
    keyAction: "Check loose sheets & rusted ridges.",
    iconName: "Home"
  },
  {
    stepNumber: 2,
    title: "Clear Drains & Gutters",
    category: "Home & Infrastructure",
    description: "Clear every drain, gutter, culvert, and trench you are responsible for around your house or business. Wear protective gloves and boots.",
    keyAction: "Unblock trenches & clean gutters.",
    iconName: "Droplet"
  },
  {
    stepNumber: 3,
    title: "Trim Overhanging Trees",
    category: "Home & Infrastructure",
    description: "Cut back tree branches overhanging buildings, power lines, or areas where children play. Heavy limbs can snap in high winds.",
    keyAction: "Prune heavy limbs near power lines.",
    iconName: "Scissors"
  },
  {
    stepNumber: 4,
    title: "Walk Your Evacuation Route",
    category: "Safety & Livestock",
    description: "Walk your evacuation route on foot in daylight with your whole family/team, then practice it at night to ensure familiarity.",
    keyAction: "Map route to high ground on foot.",
    iconName: "MapPin"
  },
  {
    stepNumber: 5,
    title: "Find Out Flood History",
    category: "Safety & Livestock",
    description: "Ask long-term neighbors how high floodwaters reached in past seasons and mark that flood line on a wall.",
    keyAction: "Mark past high-water line.",
    iconName: "History"
  },
  {
    stepNumber: 6,
    title: "Protect Your Water Source",
    category: "Water & Sanitation",
    description: "Raise and securely cover borehole and well heads. Ensure latrine or animal pen runoff drains far away from drinking water.",
    keyAction: "Cover wells & seal boreholes.",
    iconName: "ShieldCheck"
  },
  {
    stepNumber: 7,
    title: "List Vulnerable Household Members",
    category: "Health & Medicine",
    description: "Identify elderly relatives, pregnant women, infants, people with disabilities or daily medication, and assign a helper to each.",
    keyAction: "Assign helper for elderly & infants.",
    iconName: "Users"
  },
  {
    stepNumber: 8,
    title: "Refill 30 Days of Chronic Medicine",
    category: "Health & Medicine",
    description: "Secure a 30-day supply of daily medications for blood pressure, diabetes, epilepsy, ARVs, TB, or mental health.",
    keyAction: "Stock 30-day prescription refills.",
    iconName: "Pill"
  },
  {
    stepNumber: 9,
    title: "Service Vehicles & Water Pumps",
    category: "Home & Infrastructure",
    description: "Service household generators, water pumps, vehicles, or boats. Test run generators under load and fuel up.",
    keyAction: "Fuel & test water pumps & generators.",
    iconName: "Wrench"
  },
  {
    stepNumber: 10,
    title: "Save Documents Digitally",
    category: "Safety & Livestock",
    description: "Photograph national IDs, title deeds, birth certificates, school & medical records. Store digital backups in cloud or flash drive.",
    keyAction: "Upload digital copies of IDs & deeds.",
    iconName: "FileText"
  },
  {
    stepNumber: 11,
    title: "Buy Rain Gear & Waterproofing",
    category: "Emergency Kit",
    description: "Purchase or gather raincoats, umbrellas, gumboots, plastic buckets, and heavy-duty zip-lock bags for valuables.",
    keyAction: "Stock gumboots, raincoats & zip bags.",
    iconName: "Umbrella"
  },
  {
    stepNumber: 12,
    title: "Assemble 72-Hour Emergency Kit",
    category: "Emergency Kit",
    description: "Pack waterproof bags with clothes, non-perishable food, drinking water, medications, sanitary pads, soap, and wipes.",
    keyAction: "Pack 3-day emergency supply kit.",
    iconName: "Package"
  },
  {
    stepNumber: 13,
    title: "Fill Drinking-Water Reserves",
    category: "Water & Sanitation",
    description: "Store clean drinking water reserves — minimum 3 liters per person per day for at least 3 days in clean, sealed jerrycans.",
    keyAction: "Store 3L/person/day for 3 days.",
    iconName: "Container"
  },
  {
    stepNumber: 14,
    title: "Buy Water Treatment Supplies",
    category: "Water & Sanitation",
    description: "Stock water purification tablets (AquaTabs, WaterGuard), chlorine solution, or extra cooking fuel dedicated for boiling water.",
    keyAction: "Stock WaterGuard / chlorine tablets.",
    iconName: "Sparkles"
  },
  {
    stepNumber: 15,
    title: "Get Torch & Battery/Wind-up Radio",
    category: "Emergency Kit",
    description: "Purchase a bright LED flashlight and a battery-powered or wind-up radio. When power lines collapse, radios keep you informed.",
    keyAction: "Get radio & battery flashlight.",
    iconName: "Radio"
  },
  {
    stepNumber: 16,
    title: "Charge Power Banks & Phone Credit",
    category: "Emergency Kit",
    description: "Keep power banks fully charged, buy emergency phone airtime, keep mobile money active, and hold small denomination cash.",
    keyAction: "Charge power banks & hold small cash.",
    iconName: "BatteryCharging"
  },
  {
    stepNumber: 17,
    title: "Seal Passports & Certs in Plastic",
    category: "Safety & Livestock",
    description: "Place passports, title deeds, marriage & academic certificates in sealed plastic bags or airtight containers.",
    keyAction: "Pack certificates in sealed plastic.",
    iconName: "FolderLock"
  },
  {
    stepNumber: 18,
    title: "Restock First-Aid Kit with ORS",
    category: "Health & Medicine",
    description: "Ensure your first-aid kit includes ORS (Oral Rehydration Salts) sachets, zinc tablets for children, bandages, and antiseptics.",
    keyAction: "Stock ORS sachets & first aid.",
    iconName: "Cross"
  },
  {
    stepNumber: 19,
    title: "Hang & Repair Mosquito Nets",
    category: "Health & Medicine",
    description: "Repair or hang long-lasting insecticide-treated mosquito nets now. Mosquito populations surge 4 to 8 weeks after flooding.",
    keyAction: "Hang nets before floods begin.",
    iconName: "Shield"
  },
  {
    stepNumber: 20,
    title: "Set Up Family Communication Tree",
    category: "Safety & Livestock",
    description: "Agree on who calls whom in an emergency and designate an out-of-area relative as a central contact if local networks fail.",
    keyAction: "Designate out-of-area contact person.",
    iconName: "PhoneCall"
  },
  {
    stepNumber: 21,
    title: "Agree on 2 Meeting Points",
    category: "Safety & Livestock",
    description: "Designate two clear meeting spots for your family: one right outside your home, and one outside the neighborhood on high ground.",
    keyAction: "Pick 2 high-ground meeting spots.",
    iconName: "Compass"
  },
  {
    stepNumber: 22,
    title: "Protect Livestock & Animals",
    category: "Safety & Livestock",
    description: "Identify high-ground holding areas for cattle/goats, arrange emergency fodder, mark animals, and agree on evacuation leads.",
    keyAction: "Identify high-ground animal holding area.",
    iconName: "CheckCircle"
  },
  {
    stepNumber: 23,
    title: "Businesses & Schools Closure Triggers",
    category: "Home & Infrastructure",
    description: "Define written closure triggers for your business or local school ahead of time and communicate safety plans to all staff and parents.",
    keyAction: "Write clear closure safety triggers.",
    iconName: "AlertTriangle"
  }
];
