export const site = {
  name: "Gomzi Life Science LLP",
  phone: "+91 96646 06980",
  phoneHref: "+919664606980",
  phoneSecondary: "+91 7600 788 188",
  phoneSecondaryHref: "+917600788188",
  whatsappHref: "919664606980",
  email: "exports@gomzilifescience.com",
  address:
    "443, 444, 445, 1st Floor, RJD Textile Park, At. Ichchhapor, Hazira Road, Surat - 394510, Gujarat, India.",
  corporateAddress:
    "2'nd Floor, Ripple Mall, opposite Iscon Mall, Piplod, Surat, Gujarat, India 395007",
  // Add a self-hosted MP4 here when the approved company video is supplied.
  heroVideo: "/assets/video/export-video.mp4",
  heroPoster: "",
  catalogue: "/Gomzi-Company-Profile.pdf",
};
export const expertise = [
  { title: "Food Fortification", path: "/expertise/food-fortification" },
  {
    title: "Private Label Services",
    path: "/expertise/private-label-services",
  },
  {
    title: "Spray Dried Fat Powder",
    path: "/expertise/spray-dried-fat-powder",
  },
  {
    title: "Micronutrient Vitamin & Mineral Custom Premix",
    path: "/expertise/micronutrient-vitamin-mineral-custom-premix",
  },
  {
    title: "API & Supplement Premixes",
    path: "/expertise/api-supplement-premixes",
  },
  {
    title: "Bulk Supplements Manufacturing",
    path: "/expertise/bulk-supplements-manufacturing",
  },
];
export const navigation = [
  { title: "About Us", path: "/about-us" },
  { title: "Expertise", path: "/expertise" },
  { title: "Download Catalogues", path: "/download-catalogues" },
  { title: "Health Categories", path: "/health-categories" },
  { title: "Solutions", path: "/solutions" },
  { title: "Blog", path: "/blog" },
  { title: "Contact", path: "/contact" },
];
export const moreLinks = [
  {
    title: "Third Party Nutraceutical Manufacturing in India",
    path: "/third-party-nutraceutical-manufacturing-in-india",
  },
  {
    title: "Global Nutraceutical CDMO & Export Manufacturer",
    path: "/global-nutraceutical-cdmo-and-export-manufacturer",
  },
  {
    title: "Vitamin & Mineral Premix Manufacturer in India",
    path: "/vitamin-mineral-premix-manufacturer-in-india",
  },
  {
    title: "Softgel Manufacturer in India",
    path: "/softgel-manufacturer-in-india",
  },
  {
    title: "Ayurvedic Nutraceutical CDMO in India",
    path: "/ayurvedic-nutraceutical-cdmo-in-india",
  },
  {
    title: "Protein Powder Manufacturer in India",
    path: "/protein-powder-manufacturer-in-india",
  },
  {
    title: "CDMO Nutraceutical Manufacturer India",
    path: "/cdmo-nutraceutical-manufacturer-india",
  },
  { title: "Blog", path: "/blog" },
];
export const routePages = [
  ...navigation,
  ...expertise,
  ...moreLinks,
  { title: "Privacy Policy", path: "/privacy-policy" },
].filter(
  (item, index, all) =>
    all.findIndex((other) => other.path === item.path) === index,
);
