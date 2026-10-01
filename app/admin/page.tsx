"use client";







import { useCallback, useEffect, useMemo, useState } from "react";



import { motion } from "framer-motion";



import {



  CalendarDays,



  CheckCircle2,



  ChevronRight,



  Clock3,



  LayoutDashboard,



  RefreshCw,



  Search,



  Sparkles,



  Users,



  XCircle,

LogOut,

} from "lucide-react";







type ReservationStatus =



  | "PENDING"



  | "CONFIRMED"



  | "REJECTED"



  | "CANCELLED"



  | "COMPLETED";







type Reservation = {



  id: string;



  firstName: string;



  lastName: string;



  email: string;



  phone: string;



  date: string;



  time: string;



  guests: number;



  occasion: string | null;



  notes: string | null;



  status: ReservationStatus;



  createdAt: string;



  updatedAt: string;



};







type Filter = "ALL" | ReservationStatus;







function statusLabel(status: ReservationStatus, isIt: boolean) {
  const labels: Record<ReservationStatus, { it: string; en: string }> = {
    PENDING: { it: "In attesa", en: "Pending" },
    CONFIRMED: { it: "Confermata", en: "Confirmed" },
    REJECTED: { it: "Rifiutata", en: "Rejected" },
    CANCELLED: { it: "Annullata", en: "Cancelled" },
    COMPLETED: { it: "Completata", en: "Completed" },
  };
  return labels[status][isIt ? "it" : "en"];
}







const statusClasses: Record<ReservationStatus, string> = {



  PENDING:



    "border-amber-400/20 bg-amber-400/10 text-amber-200",



  CONFIRMED:



    "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",



  REJECTED:



    "border-red-400/20 bg-red-400/10 text-red-200",



  CANCELLED:



    "border-white/10 bg-white/5 text-white/45",



  COMPLETED:



    "border-blue-400/20 bg-blue-400/10 text-blue-200",



};







function formatDate(date: string, isIt: boolean) {



  return new Intl.DateTimeFormat(isIt ? "it-IT" : "en-GB", {



    weekday: "short",



    day: "numeric",



    month: "short",



    year: "numeric",



    timeZone: "UTC",



  }).format(new Date(date));



}







function localDateKey(date: Date) {



  const year = date.getFullYear();



  const month = String(date.getMonth() + 1).padStart(2, "0");



  const day = String(date.getDate()).padStart(2, "0");







  return `${year}-${month}-${day}`;



}







function reservationDateKey(date: string) {



  return date.slice(0, 10);



}







export default function AdminPage() {
  const [language, setLanguage] = useState<"it" | "en">("it");
  const isIt = language === "it";



  const [reservations, setReservations] = useState<Reservation[]>([]);



  const [loading, setLoading] = useState(true);



  const [error, setError] = useState("");



  const [search, setSearch] = useState("");



  const [filter, setFilter] = useState<Filter>("ALL");



  const [selected, setSelected] = useState<Reservation | null>(null);

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [actionError, setActionError] = useState("");







  const loadReservations = useCallback(async () => {



    try {



      setLoading(true);



      setError("");







      const response = await fetch("/api/admin/reservations", {



        cache: "no-store",



      });







      const result = await response.json();







      if (!response.ok) {



        throw new Error(



          result.error || (isIt ? "Impossibile caricare le prenotazioni." : "Unable to load reservations.")



        );



      }







      setReservations(result.reservations ?? []);



    } catch (err) {



      setError(



        err instanceof Error



          ? err.message



          : isIt ? "Si è verificato un errore." : "An error occurred."



      );



    } finally {



      setLoading(false);



    }



  }, []);



  async function updateReservationStatus(

    reservationId: string,

    status: "CONFIRMED" | "REJECTED"

  ) {

    try {

      setUpdatingId(reservationId);

      setActionError("");



      const response = await fetch(

        `/api/admin/reservations/${reservationId}`,

        {

          method: "PATCH",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify({ status }),

        }

      );



      const result = await response.json();



      if (!response.ok) {

        throw new Error(

          result.error || (isIt ? "Impossibile modificare la prenotazione." : "Unable to update the reservation.")

        );

      }



      const updatedReservation = result.reservation as Reservation;



      setReservations((current) =>

        current.map((reservation) =>

          reservation.id === updatedReservation.id

            ? updatedReservation

            : reservation

        )

      );



      setSelected(updatedReservation);

    } catch (err) {

      setActionError(

        err instanceof Error ? err.message : isIt ? "Si è verificato un errore." : "An error occurred."

      );

    } finally {

      setUpdatingId(null);

    }

  }







  useEffect(() => {



    void loadReservations();



  }, [loadReservations]);







  const today = localDateKey(new Date());







  const stats = useMemo(() => {



    return {



      today: reservations.filter(



        (reservation) =>



          reservationDateKey(reservation.date) === today



      ).length,







      pending: reservations.filter(



        (reservation) => reservation.status === "PENDING"



      ).length,







      confirmed: reservations.filter(



        (reservation) => reservation.status === "CONFIRMED"



      ).length,







      total: reservations.length,



    };



  }, [reservations, today]);







  const filteredReservations = useMemo(() => {



    const query = search.trim().toLowerCase();







    return reservations.filter((reservation) => {



      const matchesFilter =



        filter === "ALL" || reservation.status === filter;







      const searchable = [



        reservation.firstName,



        reservation.lastName,



        reservation.email,



        reservation.phone,



        reservation.time,



        reservation.occasion ?? "",



      ]



        .join(" ")



        .toLowerCase();







      const matchesSearch =



        !query || searchable.includes(query);







      return matchesFilter && matchesSearch;



    });



  }, [reservations, search, filter]);







  const cards = [



    {



      label: isIt ? "Oggi" : "Today",



      value: stats.today,



      icon: CalendarDays,



    },



    {



      label: isIt ? "In attesa" : "Pending",



      value: stats.pending,



      icon: Clock3,



    },



    {



      label: isIt ? "Confermate" : "Confirmed",



      value: stats.confirmed,



      icon: CheckCircle2,



    },



    {



      label: "Total",



      value: stats.total,



      icon: Users,



    },



  ];


async function handleLogout() {
  await fetch("/api/admin/logout", {
    method: "POST",
  });

  window.location.href = "/admin/login";
}




  return (



    <main className="min-h-screen bg-[#0e0f0c] text-[#f4eee4]">



      {/* TOP BAR */}







      <header className="border-b border-white/10 bg-[#11120f]/95 backdrop-blur-xl">



        <div className="mx-auto flex min-h-24 max-w-[1600px] items-center justify-between gap-6 px-5 md:px-10">



          <div>



            <div className="flex items-center gap-3">



              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9b27c]/30 bg-[#d9b27c]/10 text-[#d9b27c]">



                <LayoutDashboard size={18} />



              </div>







              <div>



                <p className="font-serif text-xl sm:text-2xl">



                  MAISON{" "}



                  <span className="text-[#d9b27c]">



                    ÉMERAUDE



                  </span>



                </p>







                <p className="mt-1 text-[8px] uppercase tracking-[0.3em] text-white/35">



                  {isIt ? "Amministrazione" : "Administration"}



                </p>



              </div>



            </div>



          </div>







          <div className="flex items-center gap-3">
            <div className="flex rounded-full border border-white/10 p-1">
              <button type="button" onClick={() => setLanguage("it")} className={`rounded-full px-3 py-2 text-[9px] font-semibold ${isIt ? "bg-[#d9b27c] text-[#11120f]" : "text-white/45"}`}>IT</button>
              <button type="button" onClick={() => setLanguage("en")} className={`rounded-full px-3 py-2 text-[9px] font-semibold ${!isIt ? "bg-[#d9b27c] text-[#11120f]" : "text-white/45"}`}>EN</button>
            </div>
<button
  type="button"
  onClick={() => void handleLogout()}
  className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-[10px] uppercase tracking-[0.15em] text-white/55 transition hover:border-red-300/40 hover:text-red-300"
>
  <LogOut size={14} />
  {isIt ? "Esci" : "Logout"}
</button>
          <a

            href="/"



            className="rounded-full border border-white/10 px-5 py-3 text-[10px] uppercase tracking-[0.15em] text-white/55 transition hover:border-[#d9b27c]/50 hover:text-[#d9b27c]"



          >



            {isIt ? "Vedi il sito" : "View site"}



          </a>
          </div>



        </div>



      </header>







      <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-10 md:py-14">



        {/* INTRO */}







        <div className="flex flex-col justify-between gap-8 xl:flex-row xl:items-end">



          <div>



            <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d9b27c]">



              <span className="h-px w-8 bg-[#d9b27c]" />



              Dashboard



            </div>







            <h1 className="mt-6 font-serif text-[clamp(3.3rem,6vw,6rem)] leading-[0.95] tracking-[-0.05em]">



              {isIt ? "Le tue" : "Your"}

              <br />

              <span className="italic text-[#d9b27c]">

                {isIt ? "prenotazioni." : "reservations."}



              </span>



            </h1>







            <p className="mt-6 max-w-xl text-sm leading-7 text-white/45">



              {isIt
                ? "Consulta le richieste ricevute dal sito e segui l’attività delle prenotazioni."
                : "Review requests received from the website and track reservation activity."}



            </p>



          </div>







          <button



            type="button"



            onClick={() => void loadReservations()}



            disabled={loading}



            className="flex min-h-12 items-center justify-center gap-3 self-start rounded-full border border-white/10 px-6 text-[10px] uppercase tracking-[0.15em] text-white/60 transition hover:border-[#d9b27c]/50 hover:text-[#d9b27c] disabled:opacity-40 xl:self-auto"



          >



            <RefreshCw



              size={15}



              className={loading ? "animate-spin" : ""}



            />



            {isIt ? "Aggiorna" : "Refresh"}



          </button>



        </div>







        {/* STATS */}







        <section className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">



          {cards.map((card, index) => {



            const Icon = card.icon;







            return (



              <motion.div



                key={card.label}



                initial={{ opacity: 0, y: 20 }}



                animate={{ opacity: 1, y: 0 }}



                transition={{



                  duration: 0.45,



                  delay: index * 0.07,



                }}



                className="rounded-2xl border border-white/10 bg-[#161813] p-6"



              >



                <div className="flex items-start justify-between">



                  <div>



                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">



                      {card.label}



                    </p>







                    <p className="mt-5 font-serif text-5xl">



                      {card.value}



                    </p>



                  </div>







                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d9b27c]/10 text-[#d9b27c]">



                    <Icon size={19} />



                  </div>



                </div>



              </motion.div>



            );



          })}



        </section>







        {/* TOOLBAR */}







        <section className="mt-10 rounded-2xl border border-white/10 bg-[#161813] p-5">



          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">



            <div className="relative w-full xl:max-w-md">



              <Search



                size={17}



                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d9b27c]"



              />







              <input



                value={search}



                onChange={(event) =>



                  setSearch(event.target.value)



                }



                placeholder={isIt ? "Cerca un cliente..." : "Search for a guest..."}



                className="min-h-12 w-full rounded-full border border-white/10 bg-[#0e0f0c] pl-11 pr-5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#d9b27c]/60"



              />



            </div>







            <div className="flex gap-2 overflow-x-auto pb-1">



              {(



                [



                  ["ALL", isIt ? "Tutte" : "All"],



                  ["PENDING", isIt ? "In attesa" : "Pending"],



                  ["CONFIRMED", isIt ? "Confermate" : "Confirmed"],



                  ["REJECTED", isIt ? "Rifiutate" : "Rejected"],



                ] as [Filter, string][]



              ).map(([value, label]) => (



                <button



                  key={value}



                  type="button"



                  onClick={() => setFilter(value)}



                  className={`whitespace-nowrap rounded-full border px-5 py-3 text-[10px] uppercase tracking-[0.12em] transition ${



                    filter === value



                      ? "border-[#d9b27c] bg-[#d9b27c] text-[#11120f]"



                      : "border-white/10 text-white/45 hover:border-[#d9b27c]/40"



                  }`}



                >



                  {label}



                </button>



              ))}



            </div>



          </div>



        </section>







        {/* CONTENT */}







        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_390px]">



          {/* RESERVATION LIST */}







          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#161813]">



            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">



              <div>



                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d9b27c]">



                  {isIt ? "Prenotazioni" : "Reservations"}



                </p>







                <p className="mt-2 text-xs text-white/35">



                  {filteredReservations.length} résultat



                  {filteredReservations.length !== 1



                    ? "s"



                    : ""}



                </p>



              </div>







              <Sparkles



                size={18}



                className="text-[#d9b27c]"



              />



            </div>







            {loading ? (



              <div className="flex min-h-[400px] items-center justify-center">



                <div className="text-center">



                  <RefreshCw



                    size={25}



                    className="mx-auto animate-spin text-[#d9b27c]"



                  />







                  <p className="mt-5 text-sm text-white/40">



                    {isIt ? "Caricamento prenotazioni..." : "Loading reservations..."}



                  </p>



                </div>



              </div>



            ) : error ? (



              <div className="flex min-h-[400px] items-center justify-center p-8 text-center">



                <div>



                  <XCircle



                    size={35}



                    className="mx-auto text-red-300"



                  />







                  <p className="mt-5 text-sm text-red-200">



                    {error}



                  </p>







                  <button



                    type="button"



                    onClick={() =>



                      void loadReservations()



                    }



                    className="mt-6 rounded-full border border-white/10 px-6 py-3 text-xs"



                  >



                    {isIt ? "Riprova" : "Try again"}



                  </button>



                </div>



              </div>



            ) : filteredReservations.length === 0 ? (



              <div className="flex min-h-[400px] items-center justify-center p-8 text-center">



                <div>



                  <CalendarDays



                    size={38}



                    className="mx-auto text-[#d9b27c]/60"



                  />







                  <p className="mt-5 font-serif text-2xl">



                    {isIt ? "Nessuna prenotazione" : "No reservations"}



                  </p>







                  <p className="mt-3 text-sm text-white/35">



                    {isIt ? "Nessuna richiesta corrisponde alla ricerca." : "No requests match your search."}



                  </p>



                </div>



              </div>



            ) : (



              <div className="divide-y divide-white/10">



                {filteredReservations.map(



                  (reservation) => (



                    <button



                      key={reservation.id}



                      type="button"



                      onClick={() =>



                        setSelected(reservation)



                      }



                      className={`group grid w-full gap-5 p-6 text-left transition hover:bg-white/[0.025] md:grid-cols-[1fr_150px_120px_130px_30px] md:items-center ${



                        selected?.id === reservation.id



                          ? "bg-[#d9b27c]/5"



                          : ""



                      }`}



                    >



                      <div>



                        <p className="font-serif text-xl">



                          {reservation.firstName}{" "}



                          {reservation.lastName}



                        </p>







                        <p className="mt-2 text-xs text-white/35">



                          {reservation.email}



                        </p>



                      </div>







                      <div>



                        <p className="text-xs text-white/35">



                          Date



                        </p>







                        <p className="mt-2 text-sm capitalize text-white/75">



                          {formatDate(reservation.date, isIt)}



                        </p>



                      </div>







                      <div>



                        <p className="text-xs text-white/35">



                          Table



                        </p>







                        <p className="mt-2 text-sm text-white/75">



                          {reservation.time} ·{" "}



                          {reservation.guests} pers.



                        </p>



                      </div>







                      <div>



                        <span



                          className={`inline-flex rounded-full border px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] ${statusClasses[reservation.status]}`}



                        >



                          {statusLabel(reservation.status, isIt)}



                        </span>



                      </div>







                      <ChevronRight



                        size={17}



                        className="hidden text-white/25 transition group-hover:translate-x-1 group-hover:text-[#d9b27c] md:block"



                      />



                    </button>



                  )



                )}



              </div>



            )}



          </div>







          {/* DETAILS */}







          <aside>



            <div className="sticky top-6 overflow-hidden rounded-2xl border border-white/10 bg-[#161813]">



              {!selected ? (



                <div className="flex min-h-[520px] flex-col items-center justify-center p-8 text-center">



                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#d9b27c]/25 bg-[#d9b27c]/10 text-[#d9b27c]">



                    <CalendarDays size={26} />



                  </div>







                  <h2 className="mt-7 font-serif text-3xl">



                    {isIt ? "Dettagli" : "Details"}



                  </h2>







                  <p className="mt-4 max-w-xs text-sm leading-7 text-white/40">



                    {isIt ? "Seleziona una prenotazione per vedere tutte le informazioni del cliente." : "Select a reservation to view all guest information."}



                  </p>



                </div>



              ) : (



                <>



                  <div className="border-b border-white/10 bg-[#d9b27c]/5 p-7">



                    <div className="flex items-start justify-between gap-5">



                      <div>



                        <p className="text-[9px] uppercase tracking-[0.25em] text-[#d9b27c]">



                          Réservation



                        </p>







                        <h2 className="mt-4 font-serif text-3xl">



                          {selected.firstName}{" "}



                          {selected.lastName}



                        </h2>



                      </div>







                      <span



                        className={`rounded-full border px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] ${statusClasses[selected.status]}`}



                      >



                        {statusLabel(selected.status, isIt)}



                      </span>



                    </div>



                  </div>







                  <div className="p-7">



                    <div className="grid grid-cols-2 gap-6">



                      <div>



                        <p className="text-[10px] uppercase tracking-wider text-white/30">



                          Date



                        </p>







                        <p className="mt-2 text-sm capitalize">



                          {formatDate(selected.date, isIt)}



                        </p>



                      </div>







                      <div>



                        <p className="text-[10px] uppercase tracking-wider text-white/30">

                          {isIt ? "Ora" : "Time"}



                        </p>







                        <p className="mt-2 text-sm">



                          {selected.time}



                        </p>



                      </div>







                      <div>



                        <p className="text-[10px] uppercase tracking-wider text-white/30">



                          Convives



                        </p>







                        <p className="mt-2 text-sm">



                          {selected.guests} personne



                          {selected.guests > 1 ? "s" : ""}



                        </p>



                      </div>







                      <div>



                        <p className="text-[10px] uppercase tracking-wider text-white/30">



                          Occasion



                        </p>







                        <p className="mt-2 text-sm">



                          {selected.occasion || "—"}



                        </p>



                      </div>



                    </div>







                    <div className="mt-8 border-t border-white/10 pt-7">



                      <p className="text-[10px] uppercase tracking-wider text-white/30">



                        Contact



                      </p>







                      <a



                        href={`mailto:${selected.email}`}



                        className="mt-4 block break-all text-sm text-[#d9b27c]"



                      >



                        {selected.email}



                      </a>







                      <a



                        href={`tel:${selected.phone}`}



                        className="mt-3 block text-sm text-white/65"



                      >



                        {selected.phone}



                      </a>



                    </div>







                    <div className="mt-8 border-t border-white/10 pt-7">



                      <p className="text-[10px] uppercase tracking-wider text-white/30">



                        {isIt ? "Richieste speciali" : "Special requests"}



                      </p>







                      <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-white/55">



                        {selected.notes ||



                          isIt ? "Nessuna richiesta speciale." : "No special requests."}



                      </p>



                    </div>







                    {selected.status === "PENDING" && (

                      <div className="mt-8 border-t border-white/10 pt-7">

                        <div className="grid grid-cols-2 gap-3">

                          <button

                            type="button"

                            disabled={updatingId === selected.id}

                            onClick={() =>

                              void updateReservationStatus(selected.id, "CONFIRMED")

                            }

                            className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#d9b27c] px-4 text-[10px] font-semibold uppercase tracking-wider text-[#11120f] transition hover:bg-[#efd0a2] disabled:cursor-not-allowed disabled:opacity-40"

                          >

                            <CheckCircle2 size={15} />

                            {updatingId === selected.id

                              ? (isIt ? "Elaborazione..." : "Processing...")
                              : (isIt ? "Conferma" : "Confirm")}

                          </button>



                          <button

                            type="button"

                            disabled={updatingId === selected.id}

                            onClick={() =>

                              void updateReservationStatus(selected.id, "REJECTED")

                            }

                            className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-red-300/20 px-4 text-[10px] font-semibold uppercase tracking-wider text-red-200 transition hover:border-red-300/50 hover:bg-red-400/5 disabled:cursor-not-allowed disabled:opacity-40"

                          >

                            <XCircle size={15} />

                            {updatingId === selected.id

                              ? (isIt ? "Elaborazione..." : "Processing...")
                              : (isIt ? "Rifiuta" : "Reject")}

                          </button>

                        </div>



                        {actionError && (

                          <p className="mt-4 text-center text-xs leading-6 text-red-300">

                            {actionError}

                          </p>

                        )}

                      </div>

                    )}



                  </div>



                </>



              )}



            </div>



          </aside>



        </section>







        <p className="mt-10 text-center text-[10px] uppercase tracking-[0.2em] text-white/20">



          Maison Émeraude · {isIt ? "Interfaccia dimostrativa" : "Demo interface"}



        </p>



      </div>



    </main>



  );



}