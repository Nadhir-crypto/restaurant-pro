

"use client";



import { useState } from "react";

import { motion, useScroll, useTransform } from "framer-motion";

import {

  ArrowDown,

  ArrowRight,

  ArrowUpRight,

  CalendarDays,

  ChevronRight,

  Clock3,

  MapPin,

  Menu,

  Phone,

  Sparkles,

  X,

} from "lucide-react";



function getDishes(language: "it" | "en") {
  const isIt = language === "it";

  return [
    {
      number: "01",
      category: isIt ? "ANTIPASTO" : "STARTER",
      name: isIt ? "Burrata & Pomodori" : "Burrata & Tomatoes",
      description: isIt
        ? "Burrata cremosa, pomodori antichi, basilico fresco e olio d'oliva."
        : "Creamy burrata, heirloom tomatoes, fresh basil and olive oil.",
      price: "18€",
      image:
        "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=1200&q=85",
    },
    {
      number: "02",
      category: isIt ? "PIATTO SIGNATURE" : "SIGNATURE DISH",
      name: isIt ? "L'Arte del Manzo" : "The Art of Beef",
      description: isIt
        ? "Taglio di manzo selezionato, verdure di stagione e jus ristretto."
        : "Selected cut of beef, seasonal vegetables and reduced jus.",
      price: "38€",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=85",
    },
    {
      number: "03",
      category: "DESSERT",
      name: isIt ? "Dolcezza al Cioccolato" : "Chocolate Delight",
      description: isIt
        ? "Cioccolato intenso, consistenze delicate e un tocco di fleur de sel."
        : "Intense chocolate, delicate textures and a touch of fleur de sel.",
      price: "14€",
      image:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&q=85",
    },
  ];
}



const reveal = {

  hidden: { opacity: 0, y: 55 },

  visible: { opacity: 1, y: 0 },

};



function SectionLabel({

  children,

  light = false,

}: {

  children: React.ReactNode;

  light?: boolean;

}) {

  return (

    <div

      className={`flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.35em] ${

        light ? "text-[#a36f3b]" : "text-[#d8ad76]"

      }`}

    >

      <span className="h-px w-8 bg-current" />

      {children}

    </div>

  );

}



function GoldButton({

  children,

  href,

  dark = false,

}: {

  children: React.ReactNode;

  href: string;

  dark?: boolean;

}) {

  return (

    <motion.a

      href={href}

      whileHover={{ y: -3, scale: 1.02 }}

      whileTap={{ scale: 0.98 }}

      className={`group inline-flex min-h-14 items-center justify-center gap-8 rounded-full px-7 text-[11px] font-semibold uppercase tracking-[0.17em] transition-all duration-300 ${

        dark

          ? "bg-[#191a17] text-white hover:bg-[#34372c]"

          : "bg-[#d9b27c] text-[#181812] hover:bg-[#efd0a2]"

      }`}

    >

      {children}

      <ArrowUpRight

        size={17}

        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"

      />

    </motion.a>

  );

}



export default function Home() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<"it" | "en">("it");
  const isIt = language === "it";
  const dishes = getDishes(language);

  const { scrollY } = useScroll();



  const heroY = useTransform(scrollY, [0, 850], [0, 230]);

  const heroOpacity = useTransform(scrollY, [0, 650], [1, 0.25]);



  const navigation = [
    { label: "Home", href: "#accueil" },
    { label: isIt ? "La nostra storia" : "Our story", href: "#histoire" },
    { label: "Menu", href: "/menu" },
    { label: isIt ? "Contatti" : "Contact", href: "#contact" },
  ];



  return (

    <main className="overflow-hidden bg-[#11120f] text-[#f4eee4]">

      {/* NAVIGATION */}



      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#11120f]/65 backdrop-blur-2xl">

        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-6 md:h-24 md:px-12">

          <a href="#accueil" className="relative z-50 flex flex-col">

            <span className="font-serif text-2xl tracking-[0.08em] md:text-3xl">

              MAISON

              <span className="text-[#d9b27c]"> ÉMERAUDE</span>

            </span>

            <span className="mt-1 text-[8px] uppercase tracking-[0.48em] text-white/50">

              {isIt ? "Ristorante & Arte di Vivere" : "Restaurant & Art of Living"}

            </span>

          </a>



          <nav className="hidden items-center gap-9 lg:flex">

            {navigation.map((item) => (

              <a

                key={item.label}

                href={item.href}

                className="text-[11px] uppercase tracking-[0.16em] text-white/65 transition-colors hover:text-[#d9b27c]"

              >

                {item.label}

              </a>

            ))}

          </nav>
          <div className="hidden items-center rounded-full border border-white/15 p-1 lg:flex">
            {(["it", "en"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`rounded-full px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] transition ${language === lang ? "bg-[#d9b27c] text-[#11120f]" : "text-white/45 hover:text-white"}`}
              >
                {lang}
              </button>
            ))}
          </div>




          <a

            href="/reservation"

            className="hidden items-center gap-3 rounded-full border border-[#d9b27c]/60 px-6 py-3 text-[10px] uppercase tracking-[0.18em] text-[#e8c99c] transition-all hover:bg-[#d9b27c] hover:text-[#11120f] lg:flex"

          >

            {isIt ? "Prenota un tavolo" : "Book a table"}

            <ArrowUpRight size={15} />

          </a>



          <button

            type="button"

            aria-label={menuOpen ? (isIt ? "Chiudi il menu" : "Close menu") : (isIt ? "Apri il menu" : "Open menu")}

            aria-expanded={menuOpen}

            onClick={() => setMenuOpen(!menuOpen)}

            className="relative z-50 rounded-full border border-white/20 p-3 lg:hidden"

          >

            {menuOpen ? <X size={20} /> : <Menu size={20} />}

          </button>

        </div>



        {menuOpen && (

          <motion.div

            initial={{ opacity: 0, y: -15 }}

            animate={{ opacity: 1, y: 0 }}

            className="border-t border-white/10 bg-[#151610] px-7 py-10 lg:hidden"

          >

            <nav className="flex flex-col gap-7">

              {navigation.map((item) => (

                <a

                  key={item.label}

                  href={item.href}

                  onClick={() => setMenuOpen(false)}

                  className="font-serif text-3xl"

                >

                  {item.label}

                </a>

              ))}
              <div className="flex w-fit items-center rounded-full border border-white/15 p-1">
                {(["it", "en"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-widest ${language === lang ? "bg-[#d9b27c] text-[#11120f]" : "text-white/50"}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>




              <a

                href="/reservation"

                onClick={() => setMenuOpen(false)}

                className="mt-4 text-sm uppercase tracking-widest text-[#d9b27c]"

              >

                {isIt ? "Prenota un tavolo" : "Book a table"} →

              </a>

            </nav>

          </motion.div>

        )}

      </header>



      {/* HERO */}



      <section

        id="accueil"

        className="relative flex min-h-[850px] items-center overflow-hidden pt-24 md:min-h-screen"

      >

        <motion.div

          style={{ y: heroY, opacity: heroOpacity }}

          className="absolute inset-0"

        >

          <div

            className="absolute inset-0 scale-110 bg-cover bg-center"

            style={{

              backgroundImage:

                "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=2200&q=90')",

            }}

          />



          <div className="absolute inset-0 bg-gradient-to-r from-[#10110e]/95 via-[#10110e]/65 to-[#10110e]/25" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#11120f] via-transparent to-[#11120f]/45" />

        </motion.div>



        <div className="pointer-events-none absolute left-[-160px] top-[25%] h-[400px] w-[400px] rounded-full bg-[#b98b4f]/15 blur-[120px]" />



        <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 py-24 md:px-12">

          <motion.div

            initial={{ opacity: 0, y: 35 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: 0.9 }}

            className="mb-9 flex items-center gap-4"

          >

            <span className="h-px w-12 bg-[#d9b27c]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#e8c99c]">

              {isIt ? "Un’esperienza unica" : "A unique experience"}

            </span>

          </motion.div>



          <div className="max-w-[1050px]">

            <motion.h1

              initial={{ opacity: 0, y: 65 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 1.1, delay: 0.15 }}

              className="font-serif text-[clamp(4.3rem,10vw,10rem)] leading-[0.87] tracking-[-0.055em]"

            >

              {isIt ? "L’arte di" : "The art of"}

              <br />

              <span className="italic text-[#d9b27c]">{isIt ? "assaporare" : "savouring"}</span>

              <br />

              {isIt ? "il momento." : "the moment."}

            </motion.h1>



            <motion.div

              initial={{ opacity: 0, y: 30 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.9, delay: 0.55 }}

              className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:gap-16"

            >

              <p className="max-w-[390px] text-sm leading-8 text-white/65 md:text-base">

                {isIt ? "Una cucina autentica, sapori audaci e momenti preziosi. Benvenuti in un luogo dove ogni dettaglio racconta una storia." : "Honest cuisine, bold flavours and precious moments. Welcome to a place where every detail tells a story."}

              </p>



              <GoldButton href="/reservation">

                {isIt ? "Vivi l’esperienza" : "Live the experience"}

              </GoldButton>

            </motion.div>

          </div>

        </div>



        <div className="absolute bottom-10 left-6 z-10 hidden items-center gap-4 md:left-12 md:flex">

          <motion.div

            animate={{ y: [0, 9, 0] }}

            transition={{ repeat: Infinity, duration: 2 }}

          >

            <ArrowDown size={17} className="text-[#d9b27c]" />

          </motion.div>

          <span className="text-[9px] uppercase tracking-[0.35em] text-white/50">

            {isIt ? "Scopri il nostro universo" : "Discover our world"}

          </span>

        </div>



        <div className="absolute bottom-10 right-12 z-10 hidden text-[10px] uppercase tracking-[0.3em] text-white/40 md:block">

          {isIt ? "Gastronomia • Passione • Emozione" : "Gastronomy • Passion • Emotion"}

        </div>

      </section>



      {/* INTRO STRIP */}



      <div className="relative border-y border-white/10 bg-[#171913] py-7">

        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-center gap-x-16 gap-y-5 px-6 text-center">

          {[
            isIt ? "Cucina di stagione" : "Seasonal cuisine",
            isIt ? "Prodotti selezionati" : "Selected ingredients",
            isIt ? "Momenti indimenticabili" : "Unforgettable moments",
          ].map((item, index) => (

            <div key={item} className="flex items-center gap-5">

              <Sparkles size={15} className="text-[#d9b27c]" />

              <span className="font-serif text-lg italic text-white/75">

                {item}

              </span>

              {index < 2 && (

                <span className="hidden h-1 w-1 rounded-full bg-[#d9b27c]/50 lg:block" />

              )}

            </div>

          ))}

        </div>

      </div>



      {/* STORY */}



      <section

        id="histoire"

        className="relative overflow-hidden px-6 py-28 md:px-12 md:py-44"

      >

        <div className="absolute right-[-180px] top-0 h-[500px] w-[500px] rounded-full bg-[#b98b4f]/10 blur-[140px]" />



        <div className="relative mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-2 lg:gap-28">

          <motion.div

            initial="hidden"

            whileInView="visible"

            viewport={{ once: true, amount: 0.2 }}

            variants={reveal}

            transition={{ duration: 0.9 }}

            className="relative"

          >

            <div className="relative h-[520px] overflow-hidden rounded-t-[180px] md:h-[670px]">

              <img

                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1300&q=85"

                alt={isIt ? "Atmosfera elegante del ristorante" : "Elegant restaurant atmosphere"}

                className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"

              />



              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            </div>



            <div className="absolute -bottom-8 -right-3 flex h-36 w-36 flex-col items-center justify-center rounded-full border border-[#d9b27c]/40 bg-[#1c1e17] text-center shadow-2xl md:-right-10 md:h-44 md:w-44">

              <span className="font-serif text-4xl italic text-[#d9b27c]">

                M.

              </span>

              <span className="mt-2 text-[8px] uppercase leading-5 tracking-[0.2em] text-white/65">

                {isIt ? "L’arte di" : "The art of"}

                <br />

                {isIt ? "accogliere" : "welcoming"}

              </span>

            </div>

          </motion.div>



          <motion.div

            initial="hidden"

            whileInView="visible"

            viewport={{ once: true, amount: 0.25 }}

            variants={reveal}

            transition={{ duration: 0.9 }}

          >

            <SectionLabel>{isIt ? "La nostra filosofia" : "Our philosophy"}</SectionLabel>



            <h2 className="mt-8 font-serif text-[clamp(3.2rem,5.5vw,6.5rem)] leading-[1.02] tracking-[-0.04em]">

              {isIt ? "Molto più" : "Much more"}
              <br />
              {isIt ? "di un" : "than a"}
              <br />
              <span className="italic text-[#d9b27c]">restaurant.</span>

            </h2>



            <div className="mt-10 h-px w-20 bg-[#d9b27c]/70" />



            <p className="mt-9 max-w-lg text-base leading-9 text-white/60">

              {isIt ? "Da Maison Émeraude crediamo che i ricordi più belli nascano intorno a una tavola. Ogni piatto celebra la semplicità delle buone materie prime, il savoir-faire e il piacere di condividere." : "At Maison Émeraude, we believe the finest memories are made around a table. Every plate celebrates quality ingredients, craftsmanship and the pleasure of sharing."}

            </p>



            <p className="mt-5 max-w-lg text-base leading-9 text-white/60">

              {isIt ? "Un’atmosfera accogliente, una cucina ispirata e un’attenzione speciale che trasforma un semplice pasto in un momento eccezionale." : "A warm atmosphere, inspired cuisine and thoughtful attention that turns a simple meal into an exceptional moment."}

            </p>



            <a

              href="#carte"

              className="group mt-12 inline-flex items-center gap-5 border-b border-[#d9b27c] pb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d9b27c]"

            >

              {isIt ? "Scopri la nostra cucina" : "Discover our cuisine"}

              <ArrowRight

                size={17}

                className="transition-transform group-hover:translate-x-2"

              />

            </a>

          </motion.div>

        </div>

      </section>



      {/* QUOTE */}



      <section className="relative overflow-hidden bg-[#d9b27c] px-6 py-24 text-[#242018] md:py-32">

        <div className="absolute -left-20 -top-36 h-96 w-96 rounded-full border border-[#242018]/10" />

        <div className="absolute -right-20 -bottom-36 h-96 w-96 rounded-full border border-[#242018]/10" />



        <motion.div

          initial={{ opacity: 0, y: 40 }}

          whileInView={{ opacity: 1, y: 0 }}

          viewport={{ once: true }}

          transition={{ duration: 0.9 }}

          className="relative mx-auto max-w-[1100px] text-center"

        >

          <Sparkles size={25} className="mx-auto mb-8" />



          <p className="font-serif text-[clamp(2.4rem,5.5vw,5.5rem)] italic leading-[1.16] tracking-[-0.035em]">

            {isIt ? "« Le storie più belle" : "“The most beautiful stories"}
            <br />
            {isIt ? "iniziano intorno" : "begin around"}
            <br />
            {isIt ? "a una tavola. »" : "a table.”"}

          </p>



          <p className="mt-9 text-[10px] font-semibold uppercase tracking-[0.35em]">

            {isIt ? "Lo spirito di Maison Émeraude" : "The spirit of Maison Émeraude"}

          </p>

        </motion.div>

      </section>



      {/* MENU */}



      <section

        id="carte"

        className="relative px-6 py-28 md:px-12 md:py-40"

      >

        <div className="mx-auto max-w-[1400px]">

          <motion.div

            initial={{ opacity: 0, y: 35 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true }}

            transition={{ duration: 0.8 }}

            className="mb-16 flex flex-col justify-between gap-8 md:mb-20 md:flex-row md:items-end"

          >

            <div>

              <SectionLabel>{isIt ? "Un invito al gusto" : "An invitation to taste"}</SectionLabel>



              <h2 className="mt-7 font-serif text-[clamp(3.5rem,7vw,7rem)] leading-none tracking-[-0.05em]">

                {isIt ? "Il nostro " : "Our "}<span className="italic text-[#d9b27c]">menu.</span>

              </h2>

            </div>



            <p className="max-w-[340px] text-sm leading-8 text-white/55">

              {isIt ? "Creazioni nate dalla passione, ispirate alle stagioni e pensate per risvegliare i vostri sensi." : "Creations made with passion, inspired by the seasons and designed to awaken your senses."}

            </p>

          </motion.div>



          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">

            {dishes.map((dish, index) => (

              <motion.article

                key={dish.number}

                initial={{ opacity: 0, y: 65 }}

                whileInView={{ opacity: 1, y: 0 }}

                viewport={{ once: true, amount: 0.15 }}

                transition={{

                  duration: 0.75,

                  delay: index * 0.13,

                }}

                className="group overflow-hidden border border-white/10 bg-[#191b16]"

              >

                <div className="relative h-[340px] overflow-hidden md:h-[410px]">

                  <img

                    src={dish.image}

                    alt={dish.name}

                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"

                  />



                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />



                  <div className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-black/20 text-xs backdrop-blur-lg">

                    {dish.number}

                  </div>



                  <div className="absolute bottom-6 left-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-white">

                    {dish.category}

                  </div>

                </div>



                <div className="p-7 md:p-9">

                  <div className="flex items-start justify-between gap-4">

                    <h3 className="font-serif text-3xl tracking-[-0.03em]">

                      {dish.name}

                    </h3>



                    <span className="font-serif text-xl text-[#d9b27c]">

                      {dish.price}

                    </span>

                  </div>



                  <p className="mt-5 min-h-16 text-sm leading-7 text-white/50">

                    {dish.description}

                  </p>



                  <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-6">

                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#d9b27c]">

                      {isIt ? "Creazione della casa" : "House creation"}

                    </span>



                    <ArrowUpRight

                      size={20}

                      className="text-[#d9b27c] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"

                    />

                  </div>

                </div>

              </motion.article>

            ))}

          </div>



          <div className="mt-14 text-center">

            <GoldButton href="/menu">

  {isIt ? "Scopri tutto il menu" : "Explore the full menu"}

</GoldButton>

          </div>

        </div>

      </section>



      {/* EXPERIENCE */}



      <section className="relative min-h-[650px] overflow-hidden md:min-h-[760px]">

        <div

          className="absolute inset-0 bg-cover bg-center bg-fixed"

          style={{

            backgroundImage:

              "url('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=2200&q=85')",

          }}

        />



        <div className="absolute inset-0 bg-[#11120f]/65" />



        <div className="relative mx-auto flex min-h-[650px] max-w-[1200px] flex-col items-center justify-center px-6 py-24 text-center md:min-h-[760px]">

          <motion.div

            initial={{ opacity: 0, y: 50 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true }}

            transition={{ duration: 0.9 }}

          >

            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d9b27c]">

              {isIt ? "L’esperienza Émeraude" : "The Émeraude experience"}

            </span>



            <h2 className="mt-9 font-serif text-[clamp(3.5rem,8vw,8rem)] leading-[0.98] tracking-[-0.05em]">

              {isIt ? "Prenditi il tempo" : "Take the time"}
              <br />
              {isIt ? "di " : "to "}<span className="italic text-[#d9b27c]">{isIt ? "vivere." : "live."}</span>

            </h2>



            <p className="mx-auto mt-9 max-w-xl text-sm leading-8 text-white/70 md:text-base">

              {isIt ? "Una cena per due, un’occasione speciale o semplicemente il piacere di ritrovarsi. Ogni momento merita una bella tavola." : "Dinner for two, a special occasion or simply the pleasure of being together. Every moment deserves a beautiful table."}

            </p>



            <div className="mt-11">

              <GoldButton href="/reservation">

                {isIt ? "Prenota un tavolo" : "Book a table"}

              </GoldButton>

            </div>

          </motion.div>

        </div>

      </section>



      {/* RESERVATION */}



      <section

        id="reservation"

        className="relative overflow-hidden bg-[#e9e2d5] px-6 py-28 text-[#23241d] md:px-12 md:py-40"

      >

        <div className="absolute -right-36 top-0 h-[500px] w-[500px] rounded-full bg-[#cba46b]/20 blur-[100px]" />



        <div className="relative mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-2 lg:gap-24">

          <motion.div

            initial={{ opacity: 0, x: -40 }}

            whileInView={{ opacity: 1, x: 0 }}

            viewport={{ once: true }}

            transition={{ duration: 0.8 }}

          >

            <SectionLabel light>{isIt ? "Il tuo momento inizia qui" : "Your moment starts here"}</SectionLabel>



            <h2 className="mt-8 font-serif text-[clamp(3.8rem,7vw,7.5rem)] leading-[0.98] tracking-[-0.055em]">

              {isIt ? "Un tavolo." : "One table."}
              <br />
              <span className="italic text-[#a77943]">
                {isIt ? "Mille ricordi." : "A thousand memories."}
              </span>

            </h2>



            <p className="mt-9 max-w-md text-base leading-9 text-[#23241d]/65">

              {isIt ? "Saremo felici di accoglierti e rendere la tua visita un momento unico." : "We would be delighted to welcome you and make your visit a unique moment."}

            </p>



            <div className="mt-11">

              <GoldButton href="/reservation" dark>

                {isIt ? "Richiedi una prenotazione" : "Request a reservation"}

              </GoldButton>

            </div>



            <p className="mt-5 text-xs text-[#23241d]/45">

              {isIt ? "Demo — sistema di prenotazione funzionante." : "Demo — functional reservation system."}

            </p>

          </motion.div>



          <motion.div

            initial={{ opacity: 0, x: 40 }}

            whileInView={{ opacity: 1, x: 0 }}

            viewport={{ once: true }}

            transition={{ duration: 0.8 }}

            className="relative"

          >

            <div className="relative h-[500px] overflow-hidden rounded-t-[220px] md:h-[650px]">

              <img

                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1300&q=85"

                alt={isIt ? "Tavola elegantemente apparecchiata" : "Elegantly set table"}

                className="h-full w-full object-cover"

              />

            </div>



            <div className="absolute -bottom-7 -left-4 flex items-center gap-4 border border-[#d5c3a8] bg-[#f7f1e8] px-7 py-6 shadow-xl md:-left-12">

              <CalendarDays size={27} className="text-[#a77943]" />



              <div>

                <p className="font-serif text-xl">

                  {isIt ? "Un momento da condividere" : "A moment to share"}

                </p>

                <p className="mt-1 text-xs text-[#23241d]/55">

                  {isIt ? "Ti aspettiamo" : "We look forward to welcoming you"}

                </p>

              </div>

            </div>

          </motion.div>

        </div>

      </section>



      {/* CONTACT */}



      <section

        id="contact"

        className="border-b border-white/10 px-6 py-24 md:px-12 md:py-32"

      >

        <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-2">

          <div>

            <SectionLabel>{isIt ? "Dove trovarci" : "Find us"}</SectionLabel>



            <h2 className="mt-7 font-serif text-[clamp(3.5rem,6vw,6.5rem)] leading-[1.02] tracking-[-0.05em]">

              {isIt ? "A " : "See you "}<span className="italic text-[#d9b27c]">{isIt ? "presto." : "soon."}</span>

            </h2>



            <p className="mt-7 max-w-md text-sm leading-8 text-white/55">

              {isIt ? "Una domanda, un’occasione speciale o semplicemente voglia di venirci a trovare?" : "A question, a special occasion or simply planning to visit us?"}

            </p>

          </div>



          <div className="grid gap-9 sm:grid-cols-2">

            <div>

              <MapPin size={22} className="mb-5 text-[#d9b27c]" />

              <h3 className="font-serif text-2xl">{isIt ? "Indirizzo" : "Address"}</h3>

              <p className="mt-3 text-sm leading-7 text-white/50">

                {isIt ? "Indirizzo del ristorante" : "Restaurant address"}
                <br />
                {isIt ? "Da personalizzare" : "To be customized"}

              </p>

            </div>



            <div>

              <Clock3 size={22} className="mb-5 text-[#d9b27c]" />

              <h3 className="font-serif text-2xl">{isIt ? "Orari" : "Opening hours"}</h3>

              <p className="mt-3 text-sm leading-7 text-white/50">

                {isIt ? "Orari di apertura" : "Opening hours"}
                <br />
                {isIt ? "Da personalizzare" : "To be customized"}

              </p>

            </div>



            <div>

              <Phone size={22} className="mb-5 text-[#d9b27c]" />

              <h3 className="font-serif text-2xl">Contact</h3>

              <p className="mt-3 text-sm leading-7 text-white/50">

                {isIt ? "Contatti da personalizzare" : "Contact details to be customized"}

              </p>

            </div>



            <div>

              <Sparkles size={22} className="mb-5 text-[#d9b27c]" />

              <h3 className="font-serif text-2xl">{isIt ? "Seguici" : "Follow us"}</h3>

              <p className="mt-3 text-sm leading-7 text-white/50">

                Social media
                <br />
                {isIt ? "Da personalizzare" : "To be customized"}

              </p>

            </div>

          </div>

        </div>

      </section>



      {/* FOOTER */}



      <footer className="px-6 py-12 md:px-12">

        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">

          <div>

            <p className="font-serif text-2xl tracking-wide">

              MAISON <span className="text-[#d9b27c]">ÉMERAUDE</span>

            </p>



            <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-white/40">

              {isIt ? "Ristorante & Arte di Vivere" : "Restaurant & Art of Living"}

            </p>

          </div>



          <p className="text-xs text-white/35">

            © {new Date().getFullYear()} Maison Émeraude.

            {isIt ? "Demo di sito per ristorante." : "Restaurant website demo."}

          </p>



          <a

            href="#accueil"

            aria-label={isIt ? "Torna in alto" : "Back to top"}

            className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d9b27c]/40 text-[#d9b27c] transition-colors hover:bg-[#d9b27c] hover:text-[#11120f]"

          >

            <ChevronRight size={20} className="-rotate-90" />

          </a>

        </div>

      </footer>

    </main>

  );

}