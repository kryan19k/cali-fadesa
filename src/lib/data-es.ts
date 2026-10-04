// Spanish versions of the starter content. Matched to data.ts by id (or by position for
// reviews/FAQs). Once the owner edits things in /admin, the database copy wins.

export const servicesEs: Record<string, { name: string; blurb: string }> = {
  "skin-fade": { name: "Fade a piel (skin fade)", blurb: "Degradado de piel a largo, transición limpia con navaja y un delineado nítido. El clásico." },
  "taper-fade": { name: "Taper fade", blurb: "Un taper limpio y sutil en las patillas y la nuca. Nítido pero fácil de mantener." },
  "burst-fade": { name: "Burst / Drop fade", blurb: "Degradado curvo que rodea la oreja. Hecho para textura, ondas y rizos arriba." },
  "classic-cut": { name: "Corte clásico a tijera", blurb: "Corte con tijera y peine a la medida de tu cabeza, con toalla caliente y peinado." },
  "buzz-cut": { name: "Corte a máquina (buzz)", blurb: "Un solo número, parejo, con bordes limpios. Rápido y fresco." },
  "kids-cut": { name: "Corte para niños (hasta 12)", blurb: "Paciencia, diversión y precisión. Fades y cortes para los pequeños." },
  "line-up": { name: "Delineado / Shape up", blurb: "Línea del cabello, sienes y nuca perfiladas a navaja. Ideal entre cortes." },
  "beard-trim": { name: "Recorte y diseño de barba", blurb: "Barba esculpida según la forma de tu rostro, con toalla caliente al final." },
  "hot-shave": { name: "Afeitado con toalla caliente", blurb: "Afeitado con navaja recta, toallas calientes y loción after shave. El tratamiento completo." },
  "fade-beard": { name: "Fade + barba", blurb: "Tu fade y un recorte completo de barba, difuminados y delineados para que combinen." },
  "full-works": { name: "El paquete completo", blurb: "Fade, barba esculpida, afeitado con toalla caliente y delineado. Sales como nuevo." },
};

export const addonsEs: Record<string, { name: string; blurb: string }> = {
  "add-towel": { name: "Toalla caliente final", blurb: "Toalla de vapor y after shave" },
  "add-design": { name: "Diseño en el cabello", blurb: "Partidos, líneas y diseños a medida" },
  "add-brows": { name: "Limpieza de cejas", blurb: "Un retoque rápido con navaja" },
  "add-wash": { name: "Lavado y peinado", blurb: "Lavado, acondicionador y producto" },
};

export const looksEs: Record<string, { title: string; story: string; hours: string }> = {
  "mid-skin-fade": { title: "Skin fade medio", story: "Degradado de piel a largo desde la mitad de la sien, transición limpia con navaja y delineado nítido.", hours: "45 min" },
  "low-taper": { title: "Taper bajo", story: "Taper sutil en las patillas y la nuca. Profesional, limpio y fácil de mantener.", hours: "40 min" },
  "burst-fade": { title: "Burst fade", story: "Burst curvo alrededor de la oreja con largo y textura arriba.", hours: "45 min" },
  "high-top": { title: "High top fade", story: "Skin fade ajustado con un high top esculpido, plano y definido.", hours: "50 min" },
  "textured-crop": { title: "Crop texturizado", story: "Parte superior corta y texturizada con un taper medio limpio. Despiertas y listo.", hours: "40 min" },
  "drop-fade-waves": { title: "Drop fade + ondas", story: "Drop fade que sigue la forma de la cabeza, con ondas cepilladas arriba.", hours: "45 min" },
  "beard-sculpt": { title: "Barba esculpida", story: "Barba completa perfilada a la mandíbula, línea de mejilla limpia y difuminada con el fade.", hours: "20 min" },
  "lineup-beard": { title: "Delineado + barba", story: "Delineado a navaja en la línea del cabello y barba recortada y difuminada.", hours: "60 min" },
  "side-part": { title: "Partido clásico", story: "Partido marcado, parte superior a tijera y un taper ajustado. Atemporal.", hours: "40 min" },
  "buzz-cut": { title: "Buzz + bordes", story: "Corte parejo a máquina con bordes nítidos y una nuca limpia.", hours: "20 min" },
  "taper-curls": { title: "Taper + rizos", story: "Taper bajo con rizos definidos y largos arriba.", hours: "40 min" },
  "hot-shave": { title: "Afeitado con toalla caliente", story: "Afeitado con navaja recta y toallas de vapor. Lo más suave que hay.", hours: "30 min" },
};

export const reviewsEs: { service: string; quote: string }[] = [
  { service: "Fade a piel", quote: "El mejor fade que me han hecho en años. La transición es perfecta y el delineado se mantiene nítido dos semanas. No me voy a otro lado." },
  { service: "Fade + barba", quote: "Le enseñé una foto y lo clavó a la primera. Barbería limpia, buen ambiente y de verdad escucha." },
  { service: "Burst fade", quote: "Por fin un barbero que sabe trabajar mi textura. La curva alrededor de la oreja quedó perfecta." },
  { service: "El paquete completo", quote: "Toalla caliente, delineado a navaja, barba esculpida. Llegué cansado y salí como otro hombre." },
  { service: "Corte para niños", quote: "Mi hijo se quedó quieto todo el tiempo y le encanta su corte. Paciente y rápido. Vamos a volver cada mes." },
  { service: "Taper fade", quote: "Taper limpio, buena plática y siempre puntual. Reservar también es fácil." },
];

export const faqsEs: { q: string; a: string }[] = [
  { q: "¿Atienden sin cita?", a: "Reservar en línea te asegura tu horario. Si hay espacio atendemos sin cita, pero las citas siempre van primero." },
  { q: "¿Cada cuánto debo hacerme un fade?", a: "La mayoría de los fades se ven mejor de 2 a 3 semanas. Para skin fades y barba recomendamos cada 2 semanas; los tapers aguantan de 3 a 4." },
  { q: "¿Qué pasa si necesito cancelar o reprogramar?", a: "Sin problema. Solo avísanos con al menos 2 horas de anticipación para ofrecer tu lugar a alguien más." },
  { q: "¿Puedo traer una foto de referencia?", a: "Por favor hazlo. Muéstrala al inicio de tu corte o agrégala a las notas de tu reserva y te diremos qué funciona para tu forma de cabeza y tipo de cabello." },
  { q: "¿Cortan todo tipo de cabello?", a: "Sí. Lacio, ondulado, rizado y afro. Fades, tapers, ondas y diseños están en el menú." },
  { q: "¿Cuánto durará mi cita?", a: "La herramienta de reservas suma tus servicios y muestra la hora exacta de término antes de confirmar." },
];
