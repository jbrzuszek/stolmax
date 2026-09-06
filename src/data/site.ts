export const siteConfig = {
  name: "Stolmax",
  legalName: "P.H.U. STOLMAX Jarosław Brzuszek",
  tagline: "Producent stołów loftowych na wymiar",
  url: "https://stoly.rzeszow.pl",
  email: "j.brzuszek@vp.pl",
  phone: "604 905 090",
  phoneHref: "+48604905090",
  address: {
    street: "Jasionka 709a",
    city: "Jasionka",
    postalCode: "36-002",
    region: "Podkarpacie",
    country: "PL",
  },
  geo: {
    latitude: 50.1238687,
    longitude: 22.0688852,
  },
  maps: {
    placeUrl: "https://maps.app.goo.gl/D86ogDju9d5vbXKS9",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2560!2d22.0688852!3d50.1238687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473ce5e5e00db59f%3A0xcf6a953fd60447a5!2sStolmax%20Producent%20Sto%C5%82%C3%B3w!5e0!3m2!1spl!2spl!4v1710000000000!5m2!1spl!2spl",
  },
  colorsLink:
    "https://kronosfera.pl/p/dla-meblarstwa-plyty-meblowe-plyty-laminowane-wiorowe,104",
  founded: 2008,
  description:
    "Stolmax - rodzinna firma produkująca stoły loftowe na wymiar w Jasionce koło Rzeszowa. Stoły z laminatu, forniru i forniru dębowego dla klientów indywidualnych oraz hurtowych na Podkarpaciu.",
  footerDescription:
    "Polska produkcja stołów loftowych od 2008 roku. Tworzymy stoły na wymiar idealnie dopasowane do Twoich oczekiwań. Blaty powstają z wysokiej jakości płyty laminowanej lub forniru dębowego.",
  aboutText: [
    "Jesteśmy firmą rodzinną istniejącą od 2008 roku. Zajmujemy się produkcją stołów wykonywanych z wysokiej jakości materiałów - aby nasze wyroby mogły trafić w gusta nawet najbardziej wymagających użytkowników.",
    "Z powodzeniem łączymy realizację unikalnych, indywidualnych zamówień z produkcją seryjną dla partnerów handlowych. Niezależnie od tego, czy szukasz jednego, perfekcyjnego stołu do swojego salonu, czy wyposażasz całą sieć sklepów lub restauracji, gwarantujemy pełną elastyczność i wykonanie projektu dokładnie na wymiar.",
    "Naszą ofertę kierujemy zarówno do klientów prywatnych pragnących odmienić swoje wnętrza, jak i do właścicieli salonów meblowych, projektantów oraz branży gastronomicznej (restauracje, kawiarnie, puby).",
  ],
  nav: [
    { label: "Home", href: "/" },
    { label: "Oferta", href: "/oferta" },
    { label: "Realizacje", href: "/realizacje" },
    { label: "Poproś o wycenę", href: "/wycena" },
    { label: "Kontakt", href: "/kontakt" },
  ],
} as const;

export const quoteSources = [
  { value: "strona", label: "Strona internetowa" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "ulotka", label: "Ulotka" },
  { value: "inne", label: "Inne" },
] as const;

export const featuredSlugs = ["pajak", "x", "rama_prostokat", "y"] as const;

/** Kolejność stołów metalowych w ofercie (warianty zaraz po bazowych modelach) */
export const offerPrioritySlugs = [
  "pajak",
  "pajak_8_nog",
  "x",
  "kolo_x_2d",
  "rama_prostokat",
  "rama_bez_poprzeczki",
  "rama_8x8",
  "kolo_lamele",
  "y",
  "krzyz",
] as const;

/** Pierwsze wśród stołów z nogami drewnianymi */
export const woodPrioritySlugs = [
  "prostokat_l_prosta",
  "kolo_l_diament",
  "owal_l_diament",
] as const;

export const metalLegSlugs = [
  ...offerPrioritySlugs,
  "pajak_wykrecany",
  "stol_v",
] as const;
