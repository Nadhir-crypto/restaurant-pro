
"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChefHat,
  Leaf,
  Search,
  Sparkles,
  X,
} from "lucide-react";

type Category = "Tout" | "Entrées" | "Plats" | "Desserts" | "Boissons";

type Dish = {
  id: number;
  name: string;
  category: Exclude<Category, "Tout">;
  description: string;
  price: number;
  image: string;
  label?: string;
  vegetarian?: boolean;
  signature?: boolean;
};

const categories: Category[] = [
  "Tout",
  "Entrées",
  "Plats",
  "Desserts",
  "Boissons",
];

const dishes: Dish[] = [
  {
    id: 1,
    name: "Burrata & Tomates",
    category: "Entrées",
    description:
      "Burrata crémeuse, tomates anciennes, basilic frais et huile d'olive vierge.",
    price: 18,
    image:
      "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=1200&q=85",
    label: "Fraîcheur",
    vegetarian: true,
  },
  {
    id: 2,
    name: "Salade du Jardin",
    category: "Entrées",
    description:
      "Légumes de saison, herbes fraîches, vinaigrette maison et graines torréfiées.",
    price: 16,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=85",
    vegetarian: true,
  },
  {
    id: 3,
    name: "Velouté de Saison",
    category: "Entrées",
    description:
      "Une création délicate inspirée des produits frais du marché.",
    price: 15,
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=85",
    vegetarian: true,
  },
  {
    id: 4,
    name: "L'Art du Bœuf",
    category: "Plats",
    description:
      "Pièce de bœuf sélectionnée, légumes de saison et jus réduit aux herbes.",
    price: 38,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=85",
    label: "Signature",
    signature: true,
  },
  {
    id: 5,
    name: "Poulet aux Herbes",
    category: "Plats",
    description:
      "Poulet rôti, pommes de terre fondantes et sauce parfumée aux herbes.",
    price: 29,
    image:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=1200&q=85",
  },
  {
    id: 6,
    name: "Pasta à la Crème",
    category: "Plats",
    description:
      "Pâtes généreuses, sauce crémeuse, parmesan et touche de basilic.",
    price: 26,
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&q=85",
    vegetarian: true,
  },
  {
    id: 7,
    name: "Douceur Chocolat",
    category: "Desserts",
    description:
      "Chocolat intense, textures délicates et pointe de fleur de sel.",
    price: 14,
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&q=85",
    label: "Coup de cœur",
  },
  {
    id: 8,
    name: "Tarte aux Fruits",
    category: "Desserts",
    description:
      "Pâte croustillante, crème légère et fruits frais de saison.",
    price: 13,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&q=85",
  },
  {
    id: 9,
    name: "Café Gourmand",
    category: "Desserts",
    description:
      "Un café accompagné d'une sélection de petites douceurs maison.",
    price: 12,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=85",
  },
  {
    id: 10,
    name: "Citronnade Maison",
    category: "Boissons",
    description:
      "Citron frais, menthe et une touche de douceur.",
    price: 7,
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?w=1200&q=85",
  },
  {
    id: 11,
    name: "Jus de Fruits Frais",
    category: "Boissons",
    description:
      "Une sélection de fruits frais préparés à la demande.",
    price: 8,
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=1200&q=85",
  },
  {
    id: 12,
    name: "Café Signature",
    category: "Boissons",
    description:
      "Un café soigneusement préparé pour prolonger l'instant.",
    price: 5,
    image:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&q=85",
  },
];
function getDishText(id: number, isIt: boolean) {
  const translations: Record<
    number,
    {
      it: { name: string; description: string; label?: string };
      en: { name: string; description: string; label?: string };
    }
  > = {
    1: {
      it: {
        name: "Burrata e Pomodori",
        description:
          "Burrata cremosa, pomodori antichi, basilico fresco e olio extravergine d'oliva.",
        label: "Freschezza",
      },
      en: {
        name: "Burrata & Tomatoes",
        description:
          "Creamy burrata, heirloom tomatoes, fresh basil and extra virgin olive oil.",
        label: "Fresh",
      },
    },
    2: {
      it: {
        name: "Insalata dell'Orto",
        description:
          "Verdure di stagione, erbe fresche, vinaigrette della casa e semi tostati.",
      },
      en: {
        name: "Garden Salad",
        description:
          "Seasonal vegetables, fresh herbs, house vinaigrette and toasted seeds.",
      },
    },
    3: {
      it: {
        name: "Vellutata di Stagione",
        description:
          "Una creazione delicata ispirata ai prodotti freschi del mercato.",
      },
      en: {
        name: "Seasonal Velouté",
        description:
          "A delicate creation inspired by fresh market ingredients.",
      },
    },
    4: {
      it: {
        name: "L'Arte del Manzo",
        description:
          "Taglio di manzo selezionato, verdure di stagione e jus ristretto alle erbe.",
        label: "Signature",
      },
      en: {
        name: "The Art of Beef",
        description:
          "Selected cut of beef, seasonal vegetables and herb-infused reduced jus.",
        label: "Signature",
      },
    },
    5: {
      it: {
        name: "Pollo alle Erbe",
        description:
          "Pollo arrosto, patate fondenti e salsa aromatica alle erbe.",
      },
      en: {
        name: "Herb-Roasted Chicken",
        description:
          "Roasted chicken, tender potatoes and aromatic herb sauce.",
      },
    },
    6: {
      it: {
        name: "Pasta alla Crema",
        description:
          "Pasta avvolgente, salsa cremosa, parmigiano e un tocco di basilico.",
      },
      en: {
        name: "Creamy Pasta",
        description:
          "Generous pasta, creamy sauce, Parmesan and a touch of basil.",
      },
    },
    7: {
      it: {
        name: "Delizia al Cioccolato",
        description:
          "Cioccolato intenso, consistenze delicate e un tocco di fleur de sel.",
        label: "Preferito",
      },
      en: {
        name: "Chocolate Delight",
        description:
          "Intense chocolate, delicate textures and a touch of fleur de sel.",
        label: "Favourite",
      },
    },
    8: {
      it: {
        name: "Crostata di Frutta",
        description:
          "Pasta croccante, crema leggera e frutta fresca di stagione.",
      },
      en: {
        name: "Fresh Fruit Tart",
        description:
          "Crisp pastry, light cream and fresh seasonal fruit.",
      },
    },
    9: {
      it: {
        name: "Caffè Gourmet",
        description:
          "Un caffè accompagnato da una selezione di piccole delizie della casa.",
      },
      en: {
        name: "Gourmet Coffee",
        description:
          "Coffee served with a selection of small house-made treats.",
      },
    },
    10: {
      it: {
        name: "Limonata della Casa",
        description:
          "Limone fresco, menta e un delicato tocco di dolcezza.",
      },
      en: {
        name: "Homemade Lemonade",
        description:
          "Fresh lemon, mint and a delicate touch of sweetness.",
      },
    },
    11: {
      it: {
        name: "Succo di Frutta Fresca",
        description:
          "Una selezione di frutta fresca preparata al momento.",
      },
      en: {
        name: "Fresh Fruit Juice",
        description:
          "A selection of fresh fruit prepared to order.",
      },
    },
    12: {
      it: {
        name: "Caffè Signature",
        description:
          "Un caffè preparato con cura per prolungare il piacere del momento.",
      },
      en: {
        name: "Signature Coffee",
        description:
          "Carefully prepared coffee to extend the pleasure of the moment.",
      },
    },
  };

  return translations[id][isIt ? "it" : "en"];
}
function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function MenuPage() {
  const [language, setLanguage] = useState<"it" | "en">("it");
  const [activeCategory, setActiveCategory] = useState<Category>("Tout");
  const [search, setSearch] = useState("");
  const [vegetarianOnly, setVegetarianOnly] = useState(false);

 const isIt = language === "it";
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const matchesCategory =
        activeCategory === "Tout" || dish.category === activeCategory;

      const matchesSearch =
        dish.name.toLowerCase().includes(search.toLowerCase()) ||
        dish.description.toLowerCase().includes(search.toLowerCase());

      const matchesVegetarian = !vegetarianOnly || dish.vegetarian;

      return matchesCategory && matchesSearch && matchesVegetarian;
    });
  }, [activeCategory, search, vegetarianOnly]);

  function clearFilters() {
    setActiveCategory("Tout");
    setSearch("");
    setVegetarianOnly(false);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#11120f] text-[#f4eee4]">
      {/* NAVBAR */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#11120f]/80 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-20 max-w-[1500px] items-center justify-between gap-5 px-5 md:min-h-24 md:px-12">
          <a href="/" className="flex min-w-0 flex-col">
            <span className="font-serif text-xl tracking-[0.04em] sm:text-2xl lg:text-3xl">
              MAISON{" "}
              <span className="text-[#d9b27c]">ÉMERAUDE</span>
            </span>

            <span className="mt-1 hidden text-[8px] uppercase tracking-[0.4em] text-white/45 sm:block">
              {isIt
  ? "Ristorante & Arte di Vivere"
  : "Restaurant & Art of Living"}
            </span>
          </a>
<div className="hidden items-center rounded-full border border-white/15 p-1 sm:flex">
  <button
    type="button"
    onClick={() => setLanguage("it")}
    className={`rounded-full px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] transition ${
      isIt
        ? "bg-[#d9b27c] text-[#11120f]"
        : "text-white/45 hover:text-white"
    }`}
  >
    IT
  </button>

  <button
    type="button"
    onClick={() => setLanguage("en")}
    className={`rounded-full px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] transition ${
      !isIt
        ? "bg-[#d9b27c] text-[#11120f]"
        : "text-white/45 hover:text-white"
    }`}
  >
    EN
  </button>
</div>
          <a
            href="/reservation"
            className="group hidden items-center gap-3 rounded-full border border-[#d9b27c]/60 px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-[#d9b27c] transition-all hover:bg-[#d9b27c] hover:text-[#11120f] sm:inline-flex"
          >
            {isIt ? "Prenota un tavolo" : "Book a table"}
            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>

          <a
            href="/"
            aria-label={isIt ? "Torna alla home" : "Back to home"}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-[#d9b27c] hover:text-[#d9b27c] sm:hidden"
          >
            <ArrowLeft size={18} />
          </a>
        </div>
      </header>

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=2000&q=85')",
          }}
        />

        <div className="absolute inset-0 bg-[#11120f]/75" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#11120f] via-transparent to-[#11120f]/50" />

        <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#d9b27c]/15 blur-[120px]" />

        <div className="relative mx-auto flex min-h-[550px] max-w-[1400px] flex-col items-center justify-center px-6 py-28 text-center md:min-h-[650px]">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-4"
          >
            <span className="h-px w-9 bg-[#d9b27c]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#d9b27c]">
            {isIt ? "Un invito al gusto" : "An invitation to taste"}
            </span>

            <span className="h-px w-9 bg-[#d9b27c]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 65 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="mt-9 font-serif text-[clamp(5rem,12vw,11rem)] leading-[0.9] tracking-[-0.065em]"
          >
           {isIt ? "Il nostro" : "Our"}
<br />
<span className="italic text-[#d9b27c]">menu.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 max-w-xl text-sm leading-8 text-white/65 md:text-base"
          >
           {isIt
  ? "Una cucina autentica, prodotti selezionati e creazioni pensate per risvegliare i vostri sensi."
  : "Honest cuisine, selected ingredients and creations designed to awaken your senses."}
          </motion.p>

          <motion.a
            href="#decouvrir"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="group mt-11 inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-[#d9b27c]"
          >
           {isIt ? "Esplora il menu" : "Explore the menu"}
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-2"
            />
          </motion.a>
        </div>
      </section>

      {/* INTRO */}

      <section className="border-b border-white/10 bg-[#171913] px-6 py-10">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-16 gap-y-6">
          {[
  isIt ? "Prodotti selezionati" : "Selected ingredients",
  isIt ? "Cucina di stagione" : "Seasonal cuisine",
  isIt ? "Fatto con passione" : "Made with passion",
].map((item) => (
            <div key={item} className="flex items-center gap-4">
              <Sparkles size={15} className="text-[#d9b27c]" />

              <span className="font-serif text-lg italic text-white/75">
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* MENU */}

      <section
        id="decouvrir"
        className="relative px-5 py-24 md:px-12 md:py-32"
      >
        <div className="pointer-events-none absolute right-[-200px] top-20 h-[500px] w-[500px] rounded-full bg-[#a77943]/10 blur-[150px]" />

        <div className="relative mx-auto max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end"
          >
            <div>
              <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d9b27c]">
                <span className="h-px w-8 bg-[#d9b27c]" />
              {isIt ? "La selezione dello chef" : "The chef’s selection"}
              </div>

              <h2 className="mt-7 font-serif text-[clamp(3.3rem,6vw,6rem)] leading-[1.02] tracking-[-0.05em]">
                {isIt ? "Scopri le nostre" : "Discover our"}
<br />
<span className="italic text-[#d9b27c]">
  {isIt ? "creazioni." : "creations."}
</span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-8 text-white/55">
             {isIt
  ? "Ogni piatto racconta una storia di sapori, savoir-faire e piacere condiviso."
  : "Every plate tells a story of flavour, craftsmanship and shared pleasure."}
            </p>
          </motion.div>

          {/* FILTERS */}

          <div className="mb-12 border-y border-white/10 py-7">
            <div className="flex flex-col justify-between gap-7 xl:flex-row xl:items-center">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const isActive = activeCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      aria-pressed={isActive}
                      className={`relative overflow-hidden rounded-full px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${
                        isActive
                          ? "text-[#171711]"
                          : "border border-white/15 text-white/60 hover:border-[#d9b27c]/60 hover:text-[#d9b27c]"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="active-category"
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 30,
                          }}
                          className="absolute inset-0 bg-[#d9b27c]"
                        />
                      )}

                      <span className="relative z-10">
                        {category === "Tout"
  ? isIt
    ? "Tutto"
    : "All"
  : category === "Entrées"
    ? isIt
      ? "Antipasti"
      : "Starters"
    : category === "Plats"
      ? isIt
        ? "Piatti"
        : "Main courses"
      : category === "Desserts"
        ? isIt
          ? "Dessert"
          : "Desserts"
        : category === "Boissons"
          ? isIt
            ? "Bevande"
            : "Drinks"
          : category}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <label className="flex min-h-12 items-center gap-3 rounded-full border border-white/15 px-5 transition-colors focus-within:border-[#d9b27c]/70">
                  <Search
                    size={17}
                    className="shrink-0 text-[#d9b27c]"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                   placeholder={isIt ? "Cerca un piatto..." : "Search dishes..."}
                   aria-label={isIt ? "Cerca un piatto" : "Search dishes"}
                    className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/35 sm:w-44"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setVegetarianOnly(!vegetarianOnly)}
                  aria-pressed={vegetarianOnly}
                  className={`flex min-h-12 items-center justify-center gap-2 rounded-full border px-5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all ${
                    vegetarianOnly
                      ? "border-[#d9b27c] bg-[#d9b27c] text-[#171711]"
                      : "border-white/15 text-white/60 hover:border-[#d9b27c]/60"
                  }`}
                >
                  <Leaf size={15} />
                  {isIt ? "Vegetariano" : "Vegetarian"}
                </button>
              </div>
            </div>
          </div>

          {/* RESULTS */}

          <div
            aria-live="polite"
            className="mb-9 flex items-center justify-between gap-4"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">
              {filteredDishes.length}{" "}
              {filteredDishes.length === 1
  ? isIt
    ? "creazione"
    : "creation"
  : isIt
    ? "creazioni"
    : "creations"}
            </p>

            {(search ||
              vegetarianOnly ||
              activeCategory !== "Tout") && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-2 text-xs text-[#d9b27c] transition-colors hover:text-[#f0d3aa]"
              >
                <X size={15} />
                {isIt ? "Cancella filtri" : "Clear filters"}
              </button>
            )}
          </div>

          {/* DISH CARDS */}

          <motion.div
            layout
            className="grid gap-7 md:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredDishes.map((dish) => (
                <motion.article
                  key={dish.id}
                  layout
                  initial={{
                    opacity: 0,
                    y: 35,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -15,
                    scale: 0.96,
                  }}
                  transition={{
                    duration: 0.35,
                    layout: {
                      duration: 0.4,
                    },
                  }}
                  className="group overflow-hidden border border-white/10 bg-[#191b16] transition-colors hover:border-[#d9b27c]/40"
                >
                  <div className="relative h-[300px] overflow-hidden sm:h-[360px]">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                    {dish.label && (
                      <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-[#11120f]/65 px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-[#e9c99c] backdrop-blur-xl">
                        {getDishText(dish.id, isIt).label ?? dish.label}
                      </div>
                    )}

                    {dish.vegetarian && (
                      <div className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-[#11120f]/55 text-[#d9b27c] backdrop-blur-xl">
                        <Leaf size={17} />
                      </div>
                    )}
                  </div>

                  <div className="p-7 md:p-9">
                    <div className="mb-5 flex items-center gap-3">
                      <span className="h-px w-6 bg-[#d9b27c]" />

                      <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d9b27c]">
                        {dish.category === "Entrées"
  ? isIt
    ? "Antipasti"
    : "Starters"
  : dish.category === "Plats"
    ? isIt
      ? "Piatti"
      : "Main courses"
    : dish.category === "Desserts"
      ? "Dessert"
      : dish.category === "Boissons"
        ? isIt
          ? "Bevande"
          : "Drinks"
        : dish.category}
                      </span>

                      {dish.signature && (
                        <ChefHat
                          size={16}
                          className="ml-auto text-[#d9b27c]"
                        />
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-serif text-[29px] leading-tight tracking-[-0.03em]">
                        {getDishText(dish.id, isIt).name}
                      </h3>

                      <span className="shrink-0 font-serif text-xl text-[#d9b27c]">
                        {formatPrice(dish.price)}
                      </span>
                    </div>

                    <p className="mt-5 min-h-20 text-sm leading-7 text-white/50">
                      {getDishText(dish.id, isIt).description}
                    </p>

                    <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-6">
                      <span className="text-[10px] uppercase tracking-[0.17em] text-white/40">
                        Maison Émeraude
                      </span>

                      <Sparkles
                        size={17}
                        className="text-[#d9b27c] transition-transform duration-300 group-hover:rotate-45"
                      />
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* EMPTY STATE */}

          {filteredDishes.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex min-h-80 flex-col items-center justify-center border border-white/10 bg-[#191b16] px-6 text-center"
            >
              <Search size={35} className="text-[#d9b27c]" />

              <h3 className="mt-6 font-serif text-3xl">
              {isIt ? "Nessun risultato" : "No results"}
              </h3>

              <p className="mt-3 text-sm text-white/50">
                {isIt
  ? "Prova un'altra ricerca o modifica i filtri."
  : "Try another search or adjust your filters."}
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-7 rounded-full bg-[#d9b27c] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#11120f]"
              >
               {isIt ? "Vedi tutto il menu" : "View full menu"}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* RESERVATION CTA */}

      <section className="relative overflow-hidden bg-[#d9b27c] px-6 py-24 text-[#242018] md:py-32">
        <div className="absolute -left-24 -top-32 h-96 w-96 rounded-full border border-[#242018]/15" />

        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full border border-[#242018]/15" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-[1000px] text-center"
        >
          <Sparkles size={25} className="mx-auto mb-8" />

          <h2 className="font-serif text-[clamp(3.5rem,7vw,7rem)] leading-[1.03] tracking-[-0.05em]">
           {isIt ? "Vuoi" : "Ready to"}
<br />
<span className="italic">
  {isIt ? "scoprire di più?" : "discover more?"}
</span>
          </h2>

          <p className="mx-auto mt-7 max-w-md text-sm leading-8 text-[#242018]/70">
           {isIt
  ? "I momenti più belli iniziano intorno a una tavola. Saremo lieti di accoglierti."
  : "The best moments begin around a table. We would be delighted to welcome you."}
          </p>

          <motion.a
            href="/reservation"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="mt-10 inline-flex min-h-14 items-center gap-7 rounded-full bg-[#242018] px-8 text-[11px] font-semibold uppercase tracking-[0.15em] text-white"
          >
            {isIt ? "Prenota un tavolo" : "Book a table"}
            <ArrowUpRight size={18} />
          </motion.a>
        </motion.div>
      </section>

      {/* FOOTER */}

      <footer className="px-6 py-12 md:px-12">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-7 text-center md:flex-row md:text-left">
          <div>
            <p className="font-serif text-2xl tracking-wide">
              MAISON{" "}
              <span className="text-[#d9b27c]">ÉMERAUDE</span>
            </p>

            <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-white/40">
              {isIt
  ? "Ristorante & Arte di Vivere"
  : "Restaurant & Art of Living"}
            </p>
          </div>

          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} Maison Émeraude.
           {isIt ? "Sito dimostrativo." : "Demo website."}
          </p>

          <a
            href="/"
            className="inline-flex items-center gap-3 text-xs text-[#d9b27c] transition-colors hover:text-[#f0d3aa]"
          >
            <ArrowLeft size={17} />
            {isIt ? "Torna alla home" : "Back to home"}
          </a>
        </div>
      </footer>
    </main>
  );
}