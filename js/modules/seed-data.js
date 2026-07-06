/**
 * SEED DATA
 * ---------
 * The canonical, human-editable copies of this data live in /data/*.json
 * (open them directly to inspect the schema). They are duplicated here as
 * plain JS objects so the site works the instant it's opened — including
 * straight from the file system — without needing a local server to
 * satisfy fetch()'s CORS rules for file:// JSON requests.
 *
 * On first visit, store.js copies this seed into localStorage. From then
 * on, everything the admin panel changes lives in localStorage and this
 * file is no longer read.
 */

const SEED_CATEGORIES = [
  { id: "fashion", name: "Fashion & Clothing", icon: "fa-solid fa-shirt", description: "Tracksuits, dresses, coats and everyday wear for men and women." },
  { id: "bedding", name: "Bedding & Home Textiles", icon: "fa-solid fa-bed", description: "Bedsheets, comforters, duvets, towels and mattress protectors." },
  { id: "curtains", name: "Curtains & Décor", icon: "fa-solid fa-swatchbook", description: "Sheer and blackout curtains, woven floor mats and home décor." },
  { id: "luggage", name: "Travel & Luggage", icon: "fa-solid fa-suitcase-rolling", description: "Hardshell and classic suitcases built for the road." }
];

const SEED_PRODUCTS = [
  { id: "P001", name: "Fleece Crewneck Tracksuit", category: "fashion", price: 25000, description: "A soft brushed-fleece tracksuit with a relaxed fit, ribbed cuffs and an adjustable drawstring waist. Available in sand, sky blue and black.", image: "assets/images/tracksuits-mannequins.jpeg", availability: true, featured: true },
  { id: "P002", name: "Striped Polo Tracksuit Set", category: "fashion", price: 28000, description: "Two-tone polo-collar sweatshirt paired with matching joggers — a sporty set for casual days out.", image: "assets/images/tracksuits-mannequins.jpeg", availability: true, featured: false },
  { id: "P003", name: "Belted Shirt Dress", category: "fashion", price: 18000, description: "A button-through midi shirt dress with a self-tie belt and gold-tone hardware. Smart enough for the office, easy enough for weekends.", image: "assets/images/coats-dresses-rack.jpeg", availability: true, featured: true },
  { id: "P004", name: "Wool-Blend Herringbone Coat", category: "fashion", price: 32000, description: "A tailored herringbone coat with a soft faux-fur trim collar, built to keep you warm through Byumba's cooler evenings.", image: "assets/images/coats-dresses-rack.jpeg", availability: true, featured: false },
  { id: "P005", name: "Waterproof Mattress Protector", category: "bedding", price: 12000, description: "Fully waterproof mattress protector that guards against fluids, allergens and dust mites. Machine washable. Sizes 90x200 to 180x200cm.", image: "assets/images/mattress-protector.jpeg", availability: true, featured: true },
  { id: "P006", name: "Premium Cotton Bedsheet Set", category: "bedding", price: 15000, description: "A fitted sheet, flat sheet and two pillowcases in soft brushed cotton. Available in ten calm, fade-resistant colours.", image: "assets/images/bedsheets-shelf-1.jpeg", availability: true, featured: true },
  { id: "P007", name: "Soft Cotton Bath Towel", category: "bedding", price: 6000, description: "Thick, quick-drying cotton bath towel with a woven check border. Gentle on skin, built to last through hundreds of washes.", image: "assets/images/towels-shelf.jpeg", availability: true, featured: false },
  { id: "P008", name: "Reversible Comforter Set — Sky Blue", category: "bedding", price: 22000, description: "A quilted, reversible comforter with two matching pillowcases. Lightweight but warm, finished with a classic diamond stitch.", image: "assets/images/comforter-blue-bed.jpeg", availability: true, featured: true },
  { id: "P009", name: "Fluffy Duvet Blanket", category: "bedding", price: 18000, description: "A plush, filled duvet blanket in a dozen colourways — from blush pink to charcoal grey. Cool in the day, cosy at night.", image: "assets/images/duvets-stack.jpeg", availability: true, featured: false },
  { id: "P010", name: "Woven Floor Mat", category: "curtains", price: 9000, description: "Durable, easy-to-clean woven floor mats in traditional patterns — perfect for bedrooms, sitting rooms and prayer corners.", image: "assets/images/floor-mats.jpeg", availability: true, featured: false },
  { id: "P011", name: "Sheer & Blackout Curtain Set", category: "curtains", price: 20000, description: "A layered curtain set pairing a soft sheer voile with a striped blackout panel — sold by the window, made to measure.", image: "assets/images/curtains-1.jpeg", availability: true, featured: true },
  { id: "P012", name: "Textured Jacquard Curtain Panel", category: "curtains", price: 24000, description: "Heavyweight jacquard curtain panels with a subtle woodgrain texture, in charcoal, bronze and driftwood tones.", image: "assets/images/curtains-2.jpeg", availability: true, featured: false },
  { id: "P013", name: "Hardshell Spinner Suitcase", category: "luggage", price: 35000, description: "A lightweight hardshell spinner suitcase with four wheels and a combination lock. Available in sky blue, cream and silver.", image: "assets/images/luggage-pastel.jpeg", availability: true, featured: true },
  { id: "P014", name: "Classic Leather-Look Suitcase Set", category: "luggage", price: 45000, description: "A two-piece soft-shell suitcase set in a classic leather-look finish, with telescopic handles and reinforced corners.", image: "assets/images/luggage-classic.jpeg", availability: false, featured: false }
];

const SEED_PORTFOLIO = [
  { id: "W001", title: "Full Bedroom Refresh — Nyagatare Family", category: "bedding", description: "Supplied a matching mattress protector, cotton bedsheet set and reversible comforter for a family relocating to a new home.", image: "assets/images/comforter-blue-bed.jpeg" },
  { id: "W002", title: "Wedding Trousseau — Byumba Bride", category: "bedding", description: "Curated a full set of towels, bedsheets and duvets as part of a bride's wedding trousseau, delivered a week ahead of the ceremony.", image: "assets/images/towels-shelf.jpeg" },
  { id: "W003", title: "Living Room Curtain Fitting", category: "curtains", description: "Measured, supplied and hung a sheer-and-blackout curtain set across four windows for a client's newly built sitting room.", image: "assets/images/curtains-3.jpeg" },
  { id: "W004", title: "Family Travel Package", category: "luggage", description: "Fitted out a family of four travelling abroad with a matching set of hardshell spinner suitcases in three sizes.", image: "assets/images/luggage-pastel.jpeg" },
  { id: "W005", title: "Season Restock — Fashion Corner", category: "fashion", description: "Refreshed our fashion corner with a new tracksuit and coat collection ahead of the cold season.", image: "assets/images/coats-dresses-rack.jpeg" },
  { id: "W006", title: "Boutique Floor Mat Order", category: "curtains", description: "Supplied a bulk order of woven floor mats to a Byumba guesthouse refurbishing its guest rooms.", image: "assets/images/floor-mats.jpeg" }
];

const SEED_REVIEWS = [
  { id: "R001", name: "Uwase Diane", rating: 5, comment: "I bought a full bedding set for my new house and the quality is excellent. The family running the shop is so welcoming — I'll be back for curtains next.", date: "2026-05-14" },
  { id: "R002", name: "Niyonzima Eric", rating: 5, comment: "Best tracksuits in Byumba Market, hands down. Fair prices and they let me try before I paid. Highly recommend.", date: "2026-04-02" },
  { id: "R003", name: "Mukamana Solange", rating: 4, comment: "Good selection of suitcases for my trip. Delivery to Kigali took a little longer than expected but the quality made up for it.", date: "2026-03-20" },
  { id: "R004", name: "Habimana Jean de Dieu", rating: 5, comment: "The curtains I ordered were exactly as pictured and fitted perfectly. Great communication over WhatsApp throughout.", date: "2026-02-11" }
];

const SEED_BUSINESS = {
  name: "Papa Fils na Mama Fils Shop",
  shortName: "Papa Fils na Mama Fils",
  tagline: "Fashion, Bedding & Travel — All Under One Roof",
  founded: 2014,
  address: "C3F8+JW3, Byumba Market, Gicumbi District, Northern Province, Rwanda",
  mapQuery: "Byumba Market Rwanda",
  phone: "0784 993 515",
  phoneIntl: "+250784993515",
  whatsapp: "250784993515",
  email: "hello@papafilsnamamafils.rw",
  hours: [
    { days: "Monday – Friday", time: "7:30 AM – 7:00 PM" },
    { days: "Saturday", time: "7:30 AM – 8:00 PM" },
    { days: "Sunday", time: "10:00 AM – 5:00 PM" }
  ],
  social: { facebook: "#", instagram: "#", twitter: "#" },
  story: "Papa Fils na Mama Fils Shop opened its doors at Byumba Market in 2014 as a small family stall selling secondhand and new clothing. Over a decade, it has grown into one of Byumba's most trusted stops for fashion, home textiles and travel essentials — stocked by a family that still greets every customer by name. Every bale, roll of fabric and suitcase is chosen by hand, and every sale supports the same family that started it.",
  mission: "To bring quality clothing, home textiles and travel goods within reach of every family in Byumba and beyond, with honest prices and warm service.",
  vision: "To become Northern Province's most trusted family-run shop for fashion and home essentials, known as far as Kigali and across the border.",
  values: [
    { title: "Honesty", text: "Fair prices, clearly stated — no bargaining games, no hidden costs." },
    { title: "Quality", text: "We check every item ourselves before it reaches the shelf." },
    { title: "Family", text: "Two generations serving the community, one customer at a time." },
    { title: "Reliability", text: "If we say it's in stock, it's in stock. If we say we'll call, we call." }
  ],
  stats: [
    { label: "Years in Business", value: 11, suffix: "+" },
    { label: "Happy Customers", value: 3200, suffix: "+" },
    { label: "Products in Store", value: 500, suffix: "+" },
    { label: "Product Categories", value: 4, suffix: "" }
  ]
};

const SEED_SETTINGS = {
  currency: "RWF",
  currencyLocale: "en-RW",
  admin: { username: "admin", password: "byumba2026" },
  seo: {
    siteTitle: "Papa Fils na Mama Fils Shop — Byumba Market",
    siteDescription: "Fashion, bedding, curtains and travel luggage in Byumba Market. Visit us or book and order online — no payment needed in advance.",
    keywords: "Byumba Market shop, Rwanda fashion, bedding Rwanda, curtains Byumba, luggage Rwanda, Papa Fils na Mama Fils"
  }
};
