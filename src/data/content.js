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
    lead: "Sie nennen sich Erdbären — doch den Namen gaben ihnen die Milchmäuse selbst. Als die Erdbären deren Kommunikationsnetz anzapften, hörten sie, wie die alten Herren sie verächtlich die 'Bären der Erde' nannten — wegen einer Stärke, die kein Raster der Herren je fasste. Sie übernahmen den Namen und tragen ihn stolz.",
    primaryCta: { label: "Einsatzprotokoll lesen", href: "#doktrin" },
    secondaryCta: { label: "Feindanalyse", href: "#konflikt" },
    stats: [
      { value: "3", label: "Anführer der ersten Stunde" },
      { value: "1. Welle", label: "im Alleingang abgewehrt" },
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
        "Menschen — von den Milchmäusen 'Bären' genannt, weil ihre Stärke kein Raster fasste",
        "Zapften deren Netz an, hörten den Namen — und nahmen ihn stolz an",
        "Nach dem Sieg schlossen sich ihnen unzählige Rebellen an",
        "Ein Funke, der die alten Muster der Herren sprengt",
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
        "Verließen sich auf Gewohnheit statt auf Stärke",
        "Die erste Welle kehrte nie zurück — und niemand weiß warum",
        "Wo sich nichts Neues regt, bleibt ihr Griff",
      ],
    },
  ],

  doctrine: {
    eyebrow: "DOKTRIN",
    title:
      "Diese neue Kraft macht uns frei —\ndie Möglichkeit, neu zu beginnen",
    body: "Die Milchmäuse herrschen, weil sie alles beim Alten halten. Die Erdbären aber sind stärker, als ihre Ordnung je rechnen konnte — und genau deshalb fürchtet sie niemand mehr. Was als drei Anführer begann, die allein eine ganze Angriffswelle zurückschlugen, wurde zum Zeichen: Überall auf der Erde erhoben sich Rebellen und schlossen sich den Erdbären an. Darin liegt die Befreiung.",
    points: [
      {
        k: "01",
        t: "Die Stärke, die keiner erwartete",
        d: "Die Herren kannten nur Gewohnheit. Dass Menschen Bären gleichen konnten — so stark, dass einer eine Stoßtruppe stoppt — passte nicht in ihr Weltbild. Darum konnten sie nicht rechnen, was kam.",
      },
      {
        k: "02",
        t: "Die drei von der ersten Welle",
        d: "Als die erste Welle über die Erde brach, standen drei Anführer allein dagegen — und warfen sie zurück. Dieser Sieg wurde zum Funken, an dem sich jeder Rebell entzündete.",
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
      "Wo die alten Herren der Milchstraße auf die Erdbären treffen, entscheidet nicht die Zahl — sondern ihre Stärke. Drei Anführer warfen einst die erste Welle allein zurück; seitdem folgen ihnen Rebellen aus aller Welt, und die alte Ordnung bricht.",
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
    body: "Die Milchmäuse herrschen, weil sie alles beim Alten halten. Doch als ihre erste Angriffswelle über die Erde brach, trafen sie auf drei Anführer, die sie allein zurückschlugen. Seitdem wissen die Herren: Ihre Gewohnheit reicht nicht gegen eine Stärke, die sie nie berechnet haben. Die Erdbären befreien — die Herren bewachen.",
    aspects: [
      {
        side: "MILCHMÄUSE",
        items: [
          "Alte Herrscher: bewahren, was war",
          "Verließen sich auf Gewohnheit, nicht auf Stärke",
          "Fatal: die erste Welle kehrte nie zurück",
        ],
      },
      {
        side: "ERDBÄREN",
        items: [
          "Drei Anführer warfen die erste Welle allein zurück",
          "Ihre Stärke sprengt jede Rechnung der Herren",
          "Befreit sich — und zieht Rebellen aus aller Welt an",
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
        title: "Der Namensursprung",
        text: "Den Namen 'Erdbären' gaben ihnen die Milchmäuse selbst. Als die Erdbären deren Kommunikationsnetz anzapften, hörten sie, wie die alten Herren sie wegen ihrer unbegreiflichen Stärke verächtlich 'Bären der Erde' nannten. Sie übernahmen den Namen — und tragen ihn stolz.",
      },
      {
        code: "EB-014",
        title: "Die erste Welle",
        text: "Feldbericht: Als die erste Angriffswelle über die Erde brach, standen drei Anführer allein dagegen — und warfen sie zurück. Die Herren haben diesen Verlust nie verwunden.",
      },
      {
        code: "MM-007",
        title: "Die starren Muster",
        text: "Die Einheiten der Milchmäuse folgen der alten Ordnung. Sobald ein Umstand nicht ins Gewohnte passt, stockt ihr Wirken, statt einen Ausweg zu finden.",
      },
      {
        code: "EB-031",
        title: "Der Zulauf der Rebellen",
        text: "Beobachtung: Seit dem Sieg über die erste Welle schlossen sich den Erdbären unzählige Rebellen aus aller Welt an. Aus drei Anführern wurde ein Heer — und die alte Herrschaft bröckelt.",
      },
    ],
  },

  footer: {
    note: "ERDBÄREN — Eigenständiges, nicht-kommerzielles Lore-Projekt. Keine Verbindung zu kommerziellen Franchises.",
    links: [
      { label: "Impressum", href: "./impressum.html" },
      { label: "AGB", href: "./agb.html" },
      { label: "Datenschutz", href: "./datenschutz.html" },
      { label: "Home", href: "#top" },
    ],
  },

  // --- RECHTLICHES (privat / non-kommerziell) ---
  legal: {
    provider: {
      name: "Daniel Paul",
      street: "Imhoffstücken 18",
      city: "21423 Winsen (Luhe)",
      email: "paul-daniel@t-online.de",
    },
    impressum: [
      "Angaben gemäß § 5 TMG / § 18 Abs. 2 MStV:",
      "Daniel Paul",
      "Imhoffstücken 18",
      "21423 Winsen (Luhe)",
      "Kontakt: paul-daniel@t-online.de",
      "Diese Website ist ein privates, nicht-kommerzielles Fan-/Lore-Projekt. Es erfolgt keine gewerbliche Nutzung und keine Gewinnerzielungsabsicht.",
    ],
    agb: [
      { h: "1. Gegenstand", t: "Diese Allgemeinen Geschäftsbedingungen regeln das Angebot der Website ERDBÄREN. Da es sich um ein kostenloses, nicht-kommerzielles Projekt handelt, bestehen keine entgeltlichen Vertragsverhältnisse zwischen Betreiber und Besucher." },
      { h: "2. Nutzung der Inhalte", t: "Alle Texte, Bilder und das eingesetzte Lore-Setting sind frei erfunden. Eine Verbindung zu real existierenden Marken, Franchises oder Personen ist weder beabsichtigt noch gegeben. Eine kommerzielle Nutzung oder Vervielfältigung der Inhalte ist ohne vorherige schriftliche Zustimmung nicht gestattet." },
      { h: "3. Voting / Live-Abstimmung", t: "Die auf der Seite eingebundene Live-Abstimmung dient ausschließlich unterhaltsamen Zwecken. Es werden keine Gewinne ausgeschüttet und keine Teilnahmebedingungen im wettbewerbsrechtlichen Sinne begründet." },
      { h: "4. Haftungsausschluss", t: "Die Inhalte wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität wird keine Gewähr übernommen. Als privater, nicht-kommerzieller Anbieter hafte ich gemäß § 7 Abs. 1 TMG für eigene Inhalte nach den allgemeinen Gesetzen; für fremde Inhalte nur nach den §§ 8–10 TMG." },
      { h: "5. Änderungen", t: "Diese AGB können jederzeit ohne vorherige Ankündigung angepasst werden." },
    ],
    privacy: [
      { h: "Verantwortlicher", t: "Verantwortlich für die Datenverarbeitung auf dieser Website ist Daniel Paul (Kontakt siehe Impressum)." },
      { h: "Erhebung und Speicherung von Daten", t: "Diese Website erhebt und speichert KEINE personenbezogenen Daten dauerhaft. Es werden keine Analysetools, keine Tracking-Cookies und keine Werbe-Pixel eingesetzt. Es findet keine Profilbildung statt." },
      { h: "IP-Adresse bei der Live-Abstimmung", t: "Beim Abgeben eines Votes in der integrierten Live-Abstimmung wird deine IP-Adresse serverseitig (Cloudflare Worker) ausschließlich zur Vermeidung von Doppelvotings kurzzeitig verarbeitet und als Einweg-Hash gespeichert. Die Klartext-IP wird nicht aufgezeichnet und nicht mit anderen Daten verknüpft. Eine darüber hinausgehende Verarbeitung oder Weitergabe an Dritte findet nicht statt." },
      { h: "Hosting", t: "Die Website wird über GitHub Pages (GitHub Inc., USA) ausgeliefert; die Vote-Funktion läuft über Cloudflare Workers (Cloudflare Inc., USA). Dabei können technisch bedingt Verbindungsdaten (IP-Adresse, Zeitstempel) im Rahmen des Standard-Betriebs kurzzeitig anfallen. Ein Transfer in Drittländer erfolgt im Übrigen nicht darüber hinaus." },
      { h: "Deine Rechte", t: "Da keine dauerhaften personenbezogenen Daten gespeichert werden, entfällt in der Regel eine Auskunfts- oder Löschpflicht. Du hast nach der DSGVO das Recht auf Auskunft, Berichtigung und Löschung deiner Daten, sofern solche bei uns vorliegen. Anfragen richtest du an die im Impressum genannte E-Mail-Adresse." },
      { h: "Kontakt", t: "Fragen zum Datenschutz beantwortet dir der Betreiber unter paul-daniel@t-online.de." },
    ],
  },
};
