"use client";



import { useState, type FormEvent } from "react";



import { motion, AnimatePresence } from "framer-motion";



import {



  ArrowLeft,



  ArrowRight,



  ArrowUpRight,



  CalendarDays,



  Check,



  CheckCircle2,



  ChevronLeft,



  ChevronRight,



  Clock3,



  Heart,



  Mail,



  MapPin,



  Phone,



  Sparkles,



  Users,



  X,



} from "lucide-react";



type ReservationData = {



  date: string;



  time: string;



  guests: number;



  firstName: string;



  lastName: string;



  email: string;



  phone: string;



  occasion: string;



  notes: string;



};



const initialData: ReservationData = {



  date: "",



  time: "",



  guests: 2,



  firstName: "",



  lastName: "",



  email: "",



  phone: "",



  occasion: "",



  notes: "",



};



const timeSlots = [



  "12:00",



  "12:30",



  "13:00",



  "13:30",



  "14:00",



  "19:00",



  "19:30",



  "20:00",



  "20:30",



  "21:00",



];



const occasions = [



  "Aucune occasion particulière",



  "Anniversaire",



  "Dîner romantique",



  "Célébration",



  "Repas professionnel",



  "Autre",



];



const steps = [



  {



    number: 1,



    title: "Votre table",



    description: "Date, heure et convives",



  },



  {



    number: 2,



    title: "Vos coordonnées",



    description: "Quelques informations",



  },



  {



    number: 3,



    title: "Confirmation",



    description: "Vérifiez votre demande",



  },



];



function getLocalDateString(date: Date) {



  const year = date.getFullYear();



  const month = String(date.getMonth() + 1).padStart(2, "0");



  const day = String(date.getDate()).padStart(2, "0");



  return `${year}-${month}-${day}`;



}



function formatDate(date: string, isIt: boolean) {



  if (!date) return "";



  return new Intl.DateTimeFormat(isIt ? "it-IT" : "en-GB", {



    weekday: "long",



    day: "numeric",



    month: "long",



    year: "numeric",



    timeZone: "UTC",



  }).format(new Date(`${date}T12:00:00Z`));



}



function getOccasionLabel(occasion: string, isIt: boolean) {
  const labels: Record<string, { it: string; en: string }> = {
    "Aucune occasion particulière": { it: "Nessuna occasione particolare", en: "No special occasion" },
    "Anniversaire": { it: "Compleanno", en: "Birthday" },
    "Dîner romantique": { it: "Cena romantica", en: "Romantic dinner" },
    "Célébration": { it: "Celebrazione", en: "Celebration" },
    "Repas professionnel": { it: "Pranzo o cena di lavoro", en: "Business meal" },
    "Autre": { it: "Altro", en: "Other" },
  };

  return labels[occasion]?.[isIt ? "it" : "en"] ?? occasion;
}

function FieldLabel({



  children,



  required = false,



}: {



  children: React.ReactNode;



  required?: boolean;



}) {



  return (



    <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.15em] text-white/65">



      {children}



      {required && (



        <span className="ml-1 text-[#d9b27c]">*</span>



      )}



    </span>



  );



}



function SectionHeading({



  eyebrow,



  title,



  accent,



  description,



}: {



  eyebrow: string;



  title: string;



  accent: string;



  description: string;



}) {



  return (



    <div className="mb-10">



      <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d9b27c]">



        <span className="h-px w-8 bg-[#d9b27c]" />



        {eyebrow}



      </div>



      <h2 className="mt-6 font-serif text-[clamp(2.7rem,5vw,4.7rem)] leading-[1.05] tracking-[-0.045em]">



        {title}



        <br />



        <span className="italic text-[#d9b27c]">



          {accent}



        </span>



      </h2>



      <p className="mt-6 max-w-lg text-sm leading-8 text-white/50">



        {description}



      </p>



    </div>



  );



}



export default function ReservationPage() {

  const [language, setLanguage] = useState<"it" | "en">("it");

const isIt = language === "it";



  const [step, setStep] = useState(1);



  const [data, setData] =



    useState<ReservationData>(initialData);



  const [completed, setCompleted] = useState(false);



  const [isSubmitting, setIsSubmitting] = useState(false);



  const [submitError, setSubmitError] = useState("");



  const today = getLocalDateString(new Date());



  const maxDate = getLocalDateString(



    new Date(



      new Date().getFullYear(),



      new Date().getMonth() + 4,



      new Date().getDate()



    )



  );



  function update<K extends keyof ReservationData>(



    key: K,



    value: ReservationData[K]



  ) {



    setData((previous) => ({



      ...previous,



      [key]: value,



    }));



  }



  function validateStepOne() {



    if (!data.date || !data.time) {



      return false;



    }



    if (data.date < today || data.date > maxDate) {



      return false;



    }



    if (!timeSlots.includes(data.time)) {



      return false;



    }



    return data.guests >= 1 && data.guests <= 12;



  }



  function validateStepTwo() {



    return (



      data.firstName.trim().length >= 2 &&



      data.lastName.trim().length >= 2 &&



      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&



      data.phone.trim().length >= 6



    );



  }



  function nextStep() {



    if (step === 1 && !validateStepOne()) {



      return;



    }



    if (step === 2 && !validateStepTwo()) {



      return;



    }



    setStep((current) => Math.min(current + 1, 3));



    window.scrollTo({



      top: 0,



      behavior: "smooth",



    });



  }



  function previousStep() {



    setStep((current) => Math.max(current - 1, 1));



  }



  async function submitReservation(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();



    if (!validateStepOne() || !validateStepTwo() || isSubmitting) {

      return;

    }



    setIsSubmitting(true);

    setSubmitError("");



    try {

      const response = await fetch("/api/reservations", {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify(data),

      });



      const result = await response.json();



      if (!response.ok) {

        throw new Error(

          result.error ||
            (isIt
              ? "Si è verificato un errore durante l’invio della prenotazione."
              : "An error occurred while sending your reservation.")

        );

      }



      setCompleted(true);

      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {

      setSubmitError(

        error instanceof Error

          ? error.message

          : isIt
              ? "Si è verificato un errore. Riprova."
              : "An error occurred. Please try again."

      );

    } finally {

      setIsSubmitting(false);

    }

  }



  function resetReservation() {



    setData(initialData);



    setStep(1);



    setCompleted(false);



  }



  return (



    <main className="min-h-screen overflow-hidden bg-[#11120f] text-[#f4eee4]">



      {/* NAVIGATION */}



      <header className="relative z-50 border-b border-white/10 bg-[#11120f]/90 backdrop-blur-2xl">



        <div className="mx-auto flex min-h-20 max-w-[1500px] items-center justify-between gap-5 px-5 md:min-h-24 md:px-12">



          <a href="/" className="flex min-w-0 flex-col">



            <span className="font-serif text-xl tracking-[0.04em] sm:text-2xl lg:text-3xl">



              MAISON{" "}



              <span className="text-[#d9b27c]">



                ÉMERAUDE



              </span>



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



            href="/"



            className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] text-white/60 transition-colors hover:text-[#d9b27c]"



          >



            <ArrowLeft



              size={17}



              className="transition-transform group-hover:-translate-x-1"



            />



            <span className="hidden sm:inline">



              {isIt ? "Torna alla home" : "Back to home"}



            </span>



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



        <div className="pointer-events-none absolute -left-40 top-10 h-[450px] w-[450px] rounded-full bg-[#d9b27c]/15 blur-[130px]" />



        <div className="relative mx-auto flex min-h-[480px] max-w-[1400px] flex-col items-center justify-center px-6 py-24 text-center md:min-h-[560px]">



          <motion.div



            initial={{ opacity: 0, y: 25 }}



            animate={{ opacity: 1, y: 0 }}



            transition={{ duration: 0.7 }}



            className="flex items-center gap-4"



          >



            <span className="h-px w-8 bg-[#d9b27c]" />



            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#d9b27c]">



              {isIt ? "La tua esperienza inizia qui" : "Your experience starts here"}



            </span>



            <span className="h-px w-8 bg-[#d9b27c]" />



          </motion.div>



          <motion.h1



            initial={{ opacity: 0, y: 60 }}



            animate={{ opacity: 1, y: 0 }}



            transition={{ duration: 1, delay: 0.15 }}



            className="mt-9 font-serif text-[clamp(4.3rem,10vw,9rem)] leading-[0.95] tracking-[-0.055em]"



          >



            {isIt ? "Prenota il tuo" : "Reserve your"}

<br />

<span className="italic text-[#d9b27c]">

  {isIt ? "momento." : "moment."}

</span>



          </motion.h1>



          <motion.p



            initial={{ opacity: 0, y: 25 }}



            animate={{ opacity: 1, y: 0 }}



            transition={{ duration: 0.8, delay: 0.4 }}



            className="mt-9 max-w-lg text-sm leading-8 text-white/65 md:text-base"



          >



            {isIt

  ? "Una bella tavola, una cucina ispirata e momenti che meritano di essere condivisi."

  : "A beautiful table, inspired cuisine and moments worth sharing."}



          </motion.p>



        </div>



      </section>



      {/* MAIN CONTENT */}



      <section className="relative px-5 py-20 md:px-12 md:py-28">



        <div className="pointer-events-none absolute right-[-200px] top-20 h-[500px] w-[500px] rounded-full bg-[#b98b4f]/10 blur-[140px]" />



        <div className="relative mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[1fr_360px] lg:gap-20">



          {/* FORM */}



          <div className="min-w-0">



            {!completed ? (



              <>



                {/* STEP INDICATOR */}



                <div className="mb-14 grid grid-cols-3 gap-3 border-b border-white/10 pb-10 sm:gap-6">



                  {steps.map((item) => {



                    const isActive = step === item.number;



                    const isDone = step > item.number;



                    return (



                      <div



                        key={item.number}



                        className="relative"



                      >



                        <div className="flex items-center gap-3">



                          <div



                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs transition-colors sm:h-12 sm:w-12 ${



                              isActive || isDone



                                ? "border-[#d9b27c] bg-[#d9b27c] text-[#11120f]"



                                : "border-white/15 text-white/40"



                            }`}



                          >



                            {isDone ? (



                              <Check size={18} />



                            ) : (



                              String(item.number).padStart(2, "0")



                            )}



                          </div>



                          <div className="hidden sm:block">



                            <p



                              className={`text-xs font-semibold ${



                                isActive



                                  ? "text-[#d9b27c]"



                                  : "text-white/65"



                              }`}



                            >



                              {item.number === 1
                                  ? isIt ? "Il tuo tavolo" : "Your table"
                                  : item.number === 2
                                    ? isIt ? "I tuoi dati" : "Your details"
                                    : isIt ? "Conferma" : "Confirmation"}



                            </p>



                            <p className="mt-1 text-[10px] text-white/35">



                              {item.number === 1
                                  ? isIt ? "Data, ora e ospiti" : "Date, time and guests"
                                  : item.number === 2
                                    ? isIt ? "Alcune informazioni" : "A few details"
                                    : isIt ? "Controlla la richiesta" : "Review your request"}



                            </p>



                          </div>



                        </div>



                        {isActive && (



                          <motion.div



                            layoutId="reservation-step"



                            className="absolute -bottom-10 left-0 h-[2px] w-full bg-[#d9b27c]"



                          />



                        )}



                      </div>



                    );



                  })}



                </div>



                <form onSubmit={submitReservation}>



                  <AnimatePresence mode="wait">



                    {/* STEP ONE */}



                    {step === 1 && (



                      <motion.div



                        key="step-one"



                        initial={{ opacity: 0, x: 25 }}



                        animate={{ opacity: 1, x: 0 }}



                        exit={{ opacity: 0, x: -25 }}



                        transition={{ duration: 0.35 }}



                      >



                        <SectionHeading



                          eyebrow={isIt ? "Passaggio 01 — Il tuo tavolo" : "Step 01 — Your table"}



                          title={isIt ? "Scegli il tuo" : "Choose your"}



                          accent={isIt ? "momento." : "moment."}



                          description={isIt ? "Seleziona la data, l’ora e il numero di persone per la tua visita." : "Select the date, time and number of guests for your visit."}



                        />



                        {/* GUEST COUNT */}



                        <div className="mb-9">



                          <FieldLabel required>



                            {isIt ? "Numero di persone" : "Number of guests"}



                          </FieldLabel>



                          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#191b16] p-5 sm:p-7">



                            <div className="flex items-center gap-4">



                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d9b27c]/10 text-[#d9b27c]">



                                <Users size={21} />



                              </div>



                              <div>



                                <p className="font-serif text-xl">



                                  {data.guests}{" "}



                                  {data.guests === 1



                                    ? isIt ? "persona" : "person"
                                    : isIt ? "persone" : "people"}



                                </p>



                                <p className="mt-1 text-xs text-white/40">



                                  {isIt ? "Fino a 12 ospiti" : "Up to 12 guests"}



                                </p>



                              </div>



                            </div>



                            <div className="flex items-center gap-3">



                              <button



                                type="button"



                                aria-label={isIt ? "Rimuovi una persona" : "Remove one person"}



                                disabled={data.guests <= 1}



                                onClick={() =>



                                  update(



                                    "guests",



                                    Math.max(1, data.guests - 1)



                                  )



                                }



                                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-xl transition-colors hover:border-[#d9b27c] disabled:opacity-30"



                              >



                                −



                              </button>



                              <span className="w-5 text-center font-serif text-xl">



                                {data.guests}



                              </span>



                              <button



                                type="button"



                                aria-label={isIt ? "Aggiungi una persona" : "Add one person"}



                                disabled={data.guests >= 12}



                                onClick={() =>



                                  update(



                                    "guests",



                                    Math.min(12, data.guests + 1)



                                  )



                                }



                                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-xl transition-colors hover:border-[#d9b27c] disabled:opacity-30"



                              >



                                +



                              </button>



                            </div>



                          </div>



                        </div>



                        {/* DATE */}



                        <div className="mb-9">



                          <FieldLabel required>



                            {isIt ? "Data della prenotazione" : "Reservation date"}



                          </FieldLabel>



                          <div className="relative">




                            <input



                              type="date"



                              required



                              min={today}



                              max={maxDate}



                              value={data.date}



                              onChange={(event) =>



                                update("date", event.target.value)



                              }



                              className="reservation-input"



                            />



                          </div>



                        </div>



                        {/* TIME */}



                        <div className="mb-10">



                          <FieldLabel required>



                            {isIt ? "Orario desiderato" : "Preferred time"}



                          </FieldLabel>



                          <div className="mb-5 flex items-center gap-3">



                            <Clock3



                              size={16}



                              className="text-[#d9b27c]"



                            />



                            <span className="text-xs uppercase tracking-[0.2em] text-white/45">



                              {isIt ? "Seleziona un orario" : "Select a time"}



                            </span>



                          </div>



                          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">



                            {timeSlots.map((time) => (



                              <button



                                key={time}



                                type="button"



                                aria-pressed={data.time === time}



                                onClick={() =>



                                  update("time", time)



                                }



                                className={`min-h-14 rounded-xl border text-sm transition-all ${



                                  data.time === time



                                    ? "border-[#d9b27c] bg-[#d9b27c] font-semibold text-[#11120f]"



                                    : "border-white/10 bg-[#191b16] text-white/65 hover:border-[#d9b27c]/60"



                                }`}



                              >



                                {time}



                              </button>



                            ))}



                          </div>



                          <p className="mt-4 text-xs leading-6 text-white/40">



                            {isIt ? "Orari dimostrativi. La richiesta verrà registrata e potrà essere confermata o rifiutata dall’area amministratore." : "Demo time slots. The request will be saved and can then be confirmed or rejected from the admin area."}



                          </p>



                        </div>



                        <button



                          type="button"



                          disabled={!validateStepOne()}



                          onClick={nextStep}



                          className="group flex min-h-14 w-full items-center justify-center gap-5 rounded-full bg-[#d9b27c] px-7 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#11120f] transition-all hover:bg-[#efd0a2] disabled:opacity-35 sm:w-auto"



                        >



                          {isIt ? "Continua" : "Continue"}



                          <ArrowRight



                            size={18}



                            className="transition-transform group-hover:translate-x-1"



                          />



                        </button>



                      </motion.div>



                    )}



                    {/* STEP TWO */}



                    {step === 2 && (



                      <motion.div



                        key="step-two"



                        initial={{ opacity: 0, x: 25 }}



                        animate={{ opacity: 1, x: 0 }}



                        exit={{ opacity: 0, x: -25 }}



                        transition={{ duration: 0.35 }}



                      >



                        <SectionHeading



                          eyebrow={isIt ? "Passaggio 02 — I tuoi dati" : "Step 02 — Your details"}



                          title={isIt ? "Conosciamoci" : "Let’s get"}



                          accent={isIt ? "meglio." : "acquainted."}



                          description={isIt ? "Alcune informazioni per preparare la tua richiesta di prenotazione." : "A few details to prepare your reservation request."}



                        />



                        <div className="grid gap-7 sm:grid-cols-2">



                          <label>



                            <FieldLabel required>



                              {isIt ? "Nome" : "First name"}



                            </FieldLabel>



                            <input



                              required



                              minLength={2}



                              value={data.firstName}



                              onChange={(event) =>



                                update(



                                  "firstName",



                                  event.target.value



                                )



                              }



                              placeholder={isIt ? "Il tuo nome" : "Your first name"}



                              autoComplete="given-name"



                              className="reservation-input"



                            />



                          </label>



                          <label>



                            <FieldLabel required>



                              {isIt ? "Cognome" : "Last name"}



                            </FieldLabel>



                            <input



                              required



                              minLength={2}



                              value={data.lastName}



                              onChange={(event) =>



                                update(



                                  "lastName",



                                  event.target.value



                                )



                              }



                              placeholder={isIt ? "Il tuo cognome" : "Your last name"}



                              autoComplete="family-name"



                              className="reservation-input"



                            />



                          </label>



                          <label>



                            <FieldLabel required>



                              {isIt ? "Indirizzo e-mail" : "Email address"}



                            </FieldLabel>



                            <input



                              required



                              type="email"



                              value={data.email}



                              onChange={(event) =>



                                update(



                                  "email",



                                  event.target.value



                                )



                              }



                              placeholder={isIt ? "tu@esempio.com" : "you@example.com"}



                              autoComplete="email"



                              className="reservation-input"



                            />



                          </label>



                          <label>



                            <FieldLabel required>



                              {isIt ? "Telefono" : "Phone"}



                            </FieldLabel>



                            <input



                              required



                              type="tel"



                              minLength={6}



                              value={data.phone}



                              onChange={(event) =>



                                update(



                                  "phone",



                                  event.target.value



                                )



                              }



                              placeholder="+39 333 123 4567"



                              autoComplete="tel"



                              className="reservation-input"



                            />



                          </label>



                        </div>



                        <div className="mt-7">



                          <label>



                            <FieldLabel>



                              {isIt ? "Occasione particolare" : "Special occasion"}



                            </FieldLabel>



                            <select



                              value={getOccasionLabel(data.occasion, isIt)}



                              onChange={(event) =>



                                update(



                                  "occasion",



                                  event.target.value



                                )



                              }



                              className="reservation-input"



                            >



                              <option value="">



                                {isIt ? "Seleziona un’occasione" : "Select an occasion"}



                              </option>



                              {occasions.map((occasion) => (



                                <option



                                  key={getOccasionLabel(occasion, isIt)}



                                  value={getOccasionLabel(occasion, isIt)}



                                >



                                  {getOccasionLabel(occasion, isIt)}



                                </option>



                              ))}



                            </select>



                          </label>



                        </div>



                        <div className="mt-7">



                          <label>



                            <FieldLabel>



                              {isIt ? "Richieste particolari" : "Special requests"}



                            </FieldLabel>



                            <textarea



                              rows={5}



                              maxLength={1000}



                              value={data.notes}



                              onChange={(event) =>



                                update(



                                  "notes",



                                  event.target.value



                                )



                              }



                              placeholder={isIt ? "Un’informazione utile per preparare la tua visita..." : "Anything useful to help us prepare for your visit..."}



                              className="reservation-input min-h-36 resize-y py-5"



                            />



                          </label>



                        </div>



                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">



                          <button



                            type="button"



                            onClick={previousStep}



                            className="flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/15 px-7 text-xs uppercase tracking-wider text-white/65 transition-colors hover:border-[#d9b27c]"



                          >



                            <ChevronLeft size={18} />



                            {isIt ? "Indietro" : "Back"}



                          </button>



                          <button



                            type="button"



                            disabled={!validateStepTwo()}



                            onClick={nextStep}



                            className="group flex min-h-14 items-center justify-center gap-5 rounded-full bg-[#d9b27c] px-8 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#11120f] transition-colors hover:bg-[#efd0a2] disabled:opacity-35"



                          >



                            {isIt ? "Controlla la richiesta" : "Review my request"}



                            <ArrowRight



                              size={18}



                              className="transition-transform group-hover:translate-x-1"



                            />



                          </button>



                        </div>



                      </motion.div>



                    )}



                    {/* STEP THREE */}



                    {step === 3 && (



                      <motion.div



                        key="step-three"



                        initial={{ opacity: 0, x: 25 }}



                        animate={{ opacity: 1, x: 0 }}



                        exit={{ opacity: 0, x: -25 }}



                        transition={{ duration: 0.35 }}



                      >



                        <SectionHeading



                          eyebrow={isIt ? "Passaggio 03 — Verifica" : "Step 03 — Review"}



                          title={isIt ? "È tutto" : "Everything is"}



                          accent={isIt ? "pronto." : "ready."}



                          description={isIt ? "Controlla i dati della richiesta prima di inviarla al ristorante." : "Review your request details before sending them to the restaurant."}



                        />



                        <div className="overflow-hidden rounded-2xl border border-[#d9b27c]/30 bg-[#191b16]">



                          <div className="border-b border-white/10 bg-[#d9b27c]/10 px-7 py-6">



                            <div className="flex items-center gap-3 text-[#d9b27c]">



                              <Sparkles size={20} />



                              <span className="text-xs font-semibold uppercase tracking-[0.2em]">



                                {isIt ? "La tua richiesta" : "Your request"}



                              </span>



                            </div>



                          </div>



                          <div className="grid gap-9 p-7 sm:grid-cols-2 sm:p-9">



                            <div>



                              <p className="text-xs uppercase tracking-wider text-white/40">



                                {isIt ? "Data" : "Date"}



                              </p>



                              <p className="mt-3 font-serif text-xl capitalize">



                                {formatDate(data.date, isIt)}



                              </p>



                            </div>



                            <div>



                              <p className="text-xs uppercase tracking-wider text-white/40">



                                {isIt ? "Ora" : "Time"}



                              </p>



                              <p className="mt-3 font-serif text-xl">



                                {data.time}



                              </p>



                            </div>



                            <div>



                              <p className="text-xs uppercase tracking-wider text-white/40">



                                {isIt ? "Ospiti" : "Guests"}



                              </p>



                              <p className="mt-3 font-serif text-xl">



                                {data.guests}{" "}



                                {data.guests === 1



                                  ? isIt ? "persona" : "person"
                                    : isIt ? "persone" : "people"}



                              </p>



                            </div>



                            <div>



                              <p className="text-xs uppercase tracking-wider text-white/40">



                                {isIt ? "Cognome" : "Last name"}



                              </p>



                              <p className="mt-3 font-serif text-xl">



                                {data.firstName} {data.lastName}



                              </p>



                            </div>



                            <div>



                              <p className="text-xs uppercase tracking-wider text-white/40">



                                E-mail



                              </p>



                              <p className="mt-3 break-all text-sm text-white/75">



                                {data.email}



                              </p>



                            </div>



                            <div>



                              <p className="text-xs uppercase tracking-wider text-white/40">



                                {isIt ? "Telefono" : "Phone"}



                              </p>



                              <p className="mt-3 text-sm text-white/75">



                                {data.phone}



                              </p>



                            </div>



                            {data.occasion && (



                              <div>



                                <p className="text-xs uppercase tracking-wider text-white/40">



                                  Occasion



                                </p>



                                <p className="mt-3 text-sm text-white/75">



                                  {getOccasionLabel(data.occasion, isIt)}



                                </p>



                              </div>



                            )}



                            {data.notes && (



                              <div className="sm:col-span-2">



                                <p className="text-xs uppercase tracking-wider text-white/40">



                                  {isIt ? "Richieste particolari" : "Special requests"}



                                </p>



                                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-white/75">



                                  {data.notes}



                                </p>



                              </div>



                            )}



                          </div>



                        </div>



                        <div className="mt-7 rounded-xl border border-[#d9b27c]/20 bg-[#d9b27c]/5 p-5">



                          <p className="text-xs leading-7 text-[#e8c99c]">



                            {isIt ? "Maison Émeraude è un ristorante dimostrativo fittizio. Il sistema di prenotazione è funzionante: questa richiesta verrà registrata con lo stato «in attesa»." : "Maison Émeraude is a fictional demo restaurant. The reservation system is functional: this request will be saved with a pending status."}



                          </p>



                        </div>



                        {submitError && (

                          <div className="mt-7 rounded-xl border border-red-400/25 bg-red-400/10 p-5">

                            <p className="text-sm leading-7 text-red-200">{submitError}</p>

                          </div>

                        )}



                        <div className="mt-9 flex flex-col gap-4 sm:flex-row">



                          <button



                            type="button"



                            onClick={previousStep}



                            className="flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/15 px-7 text-xs uppercase tracking-wider text-white/65 transition-colors hover:border-[#d9b27c]"



                          >



                            <ChevronLeft size={18} />



                            {isIt ? "Modifica" : "Edit"}



                          </button>



                          <button



                            type="submit"



                            className="group flex min-h-14 items-center justify-center gap-5 rounded-full bg-[#d9b27c] px-8 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#11120f] transition-colors hover:bg-[#efd0a2]"



                          >



                            {isSubmitting
                                ? isIt ? "Invio in corso..." : "Sending..."
                                : isIt ? "Invia la richiesta" : "Send my request"}



                            <ArrowUpRight



                              size={18}



                              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"



                            />



                          </button>



                        </div>



                      </motion.div>



                    )}



                  </AnimatePresence>



                </form>



              </>



            ) : (



              /* RESERVATION SUCCESS */



              <motion.div



                initial={{ opacity: 0, y: 35 }}



                animate={{ opacity: 1, y: 0 }}



                transition={{ duration: 0.7 }}



                className="flex min-h-[570px] flex-col items-center justify-center rounded-2xl border border-[#d9b27c]/25 bg-[#191b16] px-6 py-16 text-center"



              >



                <motion.div



                  initial={{ scale: 0.5, opacity: 0 }}



                  animate={{ scale: 1, opacity: 1 }}



                  transition={{



                    type: "spring",



                    stiffness: 160,



                    damping: 15,



                  }}



                  className="flex h-24 w-24 items-center justify-center rounded-full border border-[#d9b27c]/40 bg-[#d9b27c]/10 text-[#d9b27c]"



                >



                  <CheckCircle2 size={44} />



                </motion.div>



                <span className="mt-9 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d9b27c]">



                  {isIt ? "Richiesta inviata" : "Request sent"}



                </span>



                <h2 className="mt-6 font-serif text-[clamp(3rem,5vw,5rem)] leading-[1.05]">



                  {isIt ? "Grazie" : "Thank you"}{" "}



                  <span className="italic text-[#d9b27c]">



                    {data.firstName}.



                  </span>



                </h2>



                <p className="mt-7 max-w-md text-sm leading-8 text-white/55">



                  {isIt
                    ? "La tua richiesta di prenotazione è stata registrata. Ora è in attesa di conferma."
                    : "Your reservation request has been saved. It is now awaiting confirmation."}



                </p>



                <div className="mt-7 max-w-md rounded-xl border border-[#d9b27c]/25 bg-[#d9b27c]/5 p-5 text-sm leading-7 text-[#e8c99c]">



                  {isIt ? "Maison Émeraude è fittizio, ma questo sistema è funzionante. La richiesta è stata registrata nel database come prenotazione in attesa." : "Maison Émeraude is fictional, but this system is functional. The request has been saved in the database as a pending reservation."}



                </div>



                <div className="mt-10 flex flex-wrap justify-center gap-4">



                  <button



                    type="button"



                    onClick={resetReservation}



                    className="rounded-full bg-[#d9b27c] px-7 py-4 text-xs font-semibold uppercase tracking-wider text-[#11120f]"



                  >



                    {isIt ? "Nuova prenotazione" : "New reservation"}



                  </button>



                  <a



                    href="/"



                    className="rounded-full border border-white/15 px-7 py-4 text-xs uppercase tracking-wider text-white/65"



                  >



                    {isIt ? "Home" : "Home"}



                  </a>



                </div>



              </motion.div>



            )}



          </div>



          {/* SIDEBAR */}



          <aside className="lg:pt-3">



            <div className="sticky top-8 overflow-hidden rounded-2xl border border-white/10 bg-[#191b16]">



              <div className="relative h-64 overflow-hidden">



                <img



                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=85"



                  alt={isIt ? "Atmosfera del ristorante" : "Restaurant atmosphere"}



                  className="h-full w-full object-cover"



                />



                <div className="absolute inset-0 bg-gradient-to-t from-[#191b16] to-transparent" />



                <div className="absolute bottom-5 left-6">



                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#d9b27c]">



                    Maison Émeraude



                  </span>



                  <h3 className="mt-2 font-serif text-3xl">



                    {isIt ? "La tua serata." : "Your evening."}



                  </h3>



                </div>



              </div>



              <div className="p-7">



                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d9b27c]">



                  {isIt ? "La tua esperienza" : "Your experience"}



                </p>



                <p className="mt-5 text-sm leading-8 text-white/50">



                  {isIt
                    ? "Una cucina ispirata, un’atmosfera accogliente e momenti da condividere."
                    : "Inspired cuisine, a warm atmosphere and moments to share."}



                </p>



                <div className="mt-8 space-y-6 border-t border-white/10 pt-7">



                  <div className="flex items-start gap-4">



                    <CalendarDays



                      size={19}



                      className="mt-1 shrink-0 text-[#d9b27c]"



                    />



                    <div>



                      <p className="text-xs text-white/40">



                        {isIt ? "Data" : "Date"}



                      </p>



                      <p className="mt-2 text-sm capitalize text-white/85">



                        {data.date



                          ? formatDate(data.date, isIt)



                          : isIt ? "Da selezionare" : "To be selected"}



                      </p>



                    </div>



                  </div>



                  <div className="flex items-start gap-4">



                    <Clock3



                      size={19}



                      className="mt-1 shrink-0 text-[#d9b27c]"



                    />



                    <div>



                      <p className="text-xs text-white/40">



                        {isIt ? "Ora" : "Time"}



                      </p>



                      <p className="mt-2 text-sm text-white/85">



                        {data.time || (isIt ? "Da selezionare" : "To be selected")}



                      </p>



                    </div>



                  </div>



                  <div className="flex items-start gap-4">



                    <Users



                      size={19}



                      className="mt-1 shrink-0 text-[#d9b27c]"



                    />



                    <div>



                      <p className="text-xs text-white/40">



                        {isIt ? "Ospiti" : "Guests"}



                      </p>



                      <p className="mt-2 text-sm text-white/85">



                        {data.guests}{" "}



                        {data.guests === 1



                          ? isIt ? "persona" : "person"
                                    : isIt ? "persone" : "people"}



                      </p>



                    </div>



                  </div>



                </div>



                <div className="mt-9 border-t border-white/10 pt-7">



                  <div className="flex items-center gap-3">



                    <Heart



                      size={17}



                      className="text-[#d9b27c]"



                    />



                    <span className="font-serif text-lg italic text-[#d9b27c]">



                      {isIt ? "L’arte dell’ospitalità." : "The art of hospitality."}



                    </span>



                  </div>



                </div>



              </div>



            </div>



            <p className="mt-5 text-center text-xs leading-6 text-white/35">



              {isIt ? "Ristorante fittizio • Sito dimostrativo" : "Fictional restaurant • Demo website"}



            </p>



          </aside>



        </div>



      </section>



      {/* BOTTOM CTA */}



      <section className="bg-[#d9b27c] px-6 py-20 text-center text-[#242018]">



        <Sparkles size={24} className="mx-auto" />



        <h2 className="mt-7 font-serif text-[clamp(2.5rem,6vw,5rem)] leading-tight">



          {isIt ? "Ogni momento" : "Every moment"}
          <br />
          <span className="italic">
            {isIt ? "merita il suo tavolo." : "deserves its table."}
          </span>



        </h2>



        <a



          href="/menu"



          className="mt-9 inline-flex items-center gap-4 rounded-full bg-[#242018] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-white"



        >



          {isIt ? "Scopri il nostro menu" : "Discover our menu"}



          <ArrowUpRight size={17} />



        </a>



      </section>



      {/* FOOTER */}



      <footer className="border-t border-white/10 px-6 py-10 md:px-12">



        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-6 text-center md:flex-row">



          <div>



            <p className="font-serif text-2xl">



              MAISON{" "}



              <span className="text-[#d9b27c]">



                ÉMERAUDE



              </span>



            </p>



            <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-white/40">



              {isIt ? "Ristorante & Arte di Vivere" : "Restaurant & Art of Living"}



            </p>



          </div>



          <p className="text-xs text-white/35">



            © {new Date().getFullYear()} Maison Émeraude.



            {isIt ? "Sito dimostrativo." : "Demo website."}



          </p>



          <a



            href="/"



            className="flex items-center gap-2 text-xs text-[#d9b27c]"



          >



            <ArrowLeft size={16} />



           {isIt ? "Torna alla home" : "Back to home"}



          </a>



        </div>



      </footer>



    </main>



  );



}