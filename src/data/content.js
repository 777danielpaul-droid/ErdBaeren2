// ZENTRALE CONTENT-DATEI — hier alle Texte/Links ändern, keine Komponenten anfassen.
export const site = {
  brand: "ERDBÄREN",
  tagline: "Die lebende Mauer der Erde",
  nav: [
    { label: "Fraktionen", href: "#fraktionen" },
    { label: "Doktrin", href: "#doktrin" },
    { label: "Konflikt", href: "#konflikt" },
    { label: "Schlacht", href: "#schlacht" },
    { label: "Konsole", href: "#kriegskonsole" },
    { label: "Archive", href: "#archive" },
  ],

  hero: {
    eyebrow: "WIDERSTAND // ERDE-SEKTOR 0",
    title: "Wenn die alten Herrscher\nauf den Umbruch treffen",
    lead: "Seit Äonen halten die Milchmäuse, Bewohner der Milchstraße, die Galaxis in ihren gewohnten Mustern. Doch auf der Erde ist etwas erwacht, das sich nicht mehr fügen will: Widerstandskämpfer, die einen Weg fanden, das Spiel zu drehen — und sich aus den Fängen der Herren zu befreien.",
    primaryCta: { label: "Einsatzprotokoll lesen", href: "#doktrin" },
    secondaryCta: { label: "Feindanalyse", href: "#konflikt" },
    stats: [
      { value: "0.3%", label: "Überleben im alten System" },
      { value: "∞", label: "Der Freiheitswille" },
      { value: "0", label: "Der Widerstand" },
      { value: "0", label: "Die Unterdrücker" },
    ],
  },

  factions: [
    {
      id: "erdbaeren",
      name: "ERDBÄREN",
      role: "Der Widerstand",
      image: "/erdbaer-bear.jpg",
      accent: "neon",
      quote: "Wir sind der Bruch in ihrer Ordnung.",
      traits: [
        "Ein Volk, das sich nicht mehr fügen will",
        "Fanden einen Weg, das Spiel zu drehen",
        "Befreien sich aus den Fängen der Herren",
        "Ein Funke, der die alten Muster sprengt",
      ],
    },
    {
      id: "milchmaeuse",
      name: "MILCHMÄUSE",
      role: "Die alten Herren",
      image: "/erdbaer-mouse.jpg",
      accent: "cyan",
      quote: "Was war, soll bleiben, wie es war.",
      traits: [
        "Bewohner der Milchstraße — seit Äonen an der Macht",
        "Alte Herrscher der Galaxis",
        "Verteidigen ihre gewohnten Muster",
        "Wo sich nichts Neues regt, bleibt ihr Griff",
      ],
    },
  ],

  doctrine: {
    eyebrow: "DOKTRIN",
    title:
      "Diese neue Kraft macht uns frei —\ndie Möglichkeit, neu zu beginnen",
    body: "Die Milchmäuse herrschen, weil sie alles beim Alten halten. Die Erdbären kämpfen nicht mit mehr Macht, sondern mit einem anderen Anfang: Sie fanden, was keiner suchte — einen Weg, der den alten Herren nicht mehr gehorcht. Darin liegt die Befreiung.",
    points: [
      {
        k: "01",
        t: "Der andere Anfang",
        d: "Wer nur bewahrt, was ist, bleibt gefangen im Gewohnten. Die Erdbären begannen dort neu, wo die alten Herren längst aufgehört hatten zu fragen. Darum können sie nicht gerechnet werden.",
      },
      {
        k: "02",
        t: "Das verborgene Werkzeug",
        d: "Es ist kein Schwert und kein Heer. Es ist eine Fähigkeit, die sich nicht in den Mustern der Milchmäuse abbildet — und darum von ihnen nicht verteidigt wird.",
      },
      {
        k: "03",
        t: "Die Wende",
        d: "Sobald sich die Lage dreht, greifen die Erdbären den Augenblick. Nicht aus Plan, sondern aus einer Freiheit, die den alten Herren fremd ist — und befreien, was festgehalten wurde.",
      },
    ],
  },

  battle: "/erdbaer-battle.jpg",
  battleMeta: {
    eyebrow: "// SCHLACHTFELD // ERDE-SEKTOR 0",
    titleCover: "Zwei Heere. Kein Rückzug.",
    coverBody:
      "Wo die alten Herren der Milchstraße auf die Erdbären treffen, beginnt kein gewöhnlicher Krieg. Die einen bewahren, was war — die anderen haben einen Weg gefunden, den das Alte nicht fassen kann.",
    caption:
      "Wo die alten Herren der Milchstraße auf die Erdbären treffen, entscheidet nicht die Macht — sondern der Bruch. Wer einen Weg fand, das Spiel zu drehen, geht weiter, alle anderen bleiben zurück.",
  },
  secret: {
    eyebrow: "// GEHEIMWAFFE // KLASSIFIZIERT",
    titleCover: "Was keiner benennen darf",
    coverBody:
      "Die Milchmäuse wissen, dass etwas nicht stimmt. Sie haben es nie gesehen — nur gespürt, wie ihre Muster an einer einzigen Stelle nicht mehr greifen. Was dort schlägt, hat keinen Platz in ihrer Ordnung.",
    name: "Das goldene Herz",
    subtitle:
      "So nennen es die Erdbären — obwohl es eher einem Rubin gleicht. Niemand weiß, wie es zu seinem Namen kam.",
    body: "Es schlägt nicht wie ein Muskel. Es ist keine Waffe und kein Heer. Es ist der andere Anfang, den die alten Herren nie suchten — und darum auch nie verteidigten. Wer es sieht, versteht auf einen Blick, warum sich die Galaxis dreht.",
  },
  conflict: {
    eyebrow: "KONFLIKT",
    title: "Der Bruch in der alten Ordnung",
    body: "Die Milchmäuse herrschen, weil sie alles beim Alten halten. Doch sobald die Erdbären einen Weg finden, der ihren Mustern nicht folgt, reißt das Bild. Die Herren bewachen — die Erdbären befreien.",
    aspects: [
      {
        side: "MILCHMÄUSE",
        items: [
          "Alte Herrscher: bewahren, was war",
          "Verteidigen ihre gewohnten Muster",
          "Fatal: wo sich nichts Neues regt, schwindet der Griff",
        ],
      },
      {
        side: "ERDBÄREN",
        items: [
          "Der Widerstand: beginnt neu, folgt nicht",
          "Fand den Weg, das Spiel zu drehen",
          "Befreit sich aus den Fängen der Herren",
        ],
      },
    ],
  },

  archive: {
    eyebrow: "ARCHIV",
    title: "Aufzeichnungen aus dem Verteidigungsrat",
    entries: [
      {
        code: "EB-001",
        title: "Das Erwachen",
        text: "Nur 0,3 % überstehen das alte System — nicht durch Stärke, sondern weil sie aufhörten, sich zu fügen. Den Rest hält die Gewohnheit der Herren fest.",
      },
      {
        code: "EB-014",
        title: "Die Wende ohne Vorwarnung",
        text: "Feldtests: Die Erdbären handeln in dem Augenblick, in dem sich die Lage dreht. Wer nur bewahrt, braucht Zeit, bis er die Bewegung benennt — Zeit, die er nicht hat.",
      },
      {
        code: "MM-007",
        title: "Die starren Muster",
        text: "Die Einheiten der Milchmäuse folgen der alten Ordnung. Sobald ein Umstand nicht ins Gewohnte passt, stockt ihr Wirken, statt einen Ausweg zu finden.",
      },
      {
        code: "MM-031",
        title: "Der Riss bei Abweichung",
        text: "Beobachtung: Sobald die Erdbären den Mustern nicht folgen, bricht die geordnete Herrschaft der Milchmäuse. Ein Schritt, der nicht gehorcht, lässt sich nicht fassen — und darum nicht wehren.",
      },
    ],
  },

  footer: {
    note: "ERDBÄREN — Eigenständiges Lore-Projekt. Keine Verbindung zu kommerziellen Franchises.",
    links: [
      { label: "AGB", href: "#agb" },
      { label: "Datenschutz", href: "#datenschutz" },
      { label: "Home", href: "#top" },
    ],
  },
};
