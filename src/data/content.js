// ZENTRALE CONTENT-DATEI — hier alle Texte/Links ändern, keine Komponenten anfassen.
// Jeder Text hat ein `de` (Default) und ein `en` (englische Variante).
export const site = {
  brand: { de: "ERDBÄREN", en: "EARTHBEARS" },
  tagline: { de: "Die lebende Mauer der Erde", en: "The living wall of Earth" },
  nav: [
    { label: { de: "Fraktionen", en: "Factions" }, href: "#fraktionen" },
    { label: { de: "Doktrin", en: "Doctrine" }, href: "#doktrin" },
    { label: { de: "Konflikt", en: "Conflict" }, href: "#konflikt" },
    { label: { de: "Schlacht", en: "Battle" }, href: "#schlacht" },
    { label: { de: "Konsole", en: "Console" }, href: "#kriegskonsole" },
    { label: { de: "Archive", en: "Archive" }, href: "#archive" },
  ],

  hero: {
    eyebrow: { de: "WIDERSTAND // ERDE-SEKTOR 0", en: "RESISTANCE // EARTH-SECTOR 0" },
    title: {
      de: "Wenn die alten Herrscher\nauf den Umbruch treffen",
      en: "When the old rulers\nmeet the upheaval",
    },
    lead: {
      de: "Sie nennen sich Erdbären — doch den Namen gaben ihnen die Milchmäuse selbst. Als die Erdbären deren Kommunikationsnetz anzapften, hörten sie, wie die alten Herren sie verächtlich die 'Bären der Erde' nannten — wegen einer Stärke, die kein Raster der Herren je fasste. Sie übernahmen den Namen und tragen ihn stolz.",
      en: "They call themselves Earthbears — but the name was given to them by the Milkmice themselves. When the Earthbears tapped into their comms, they heard the old rulers scorn them as the 'bears of Earth' — for a strength no grid of the rulers could ever grasp. They took the name and wear it with pride.",
    },
    primaryCta: { label: { de: "Einsatzprotokoll lesen", en: "Read the field report" }, href: "#doktrin" },
    secondaryCta: { label: { de: "Feindanalyse", en: "Enemy analysis" }, href: "#konflikt" },
    stats: [
      { value: { de: "3", en: "3" }, label: { de: "Anführer der ersten Stunde", en: "Leaders of the first hour" } },
      { value: { de: "1. Welle", en: "1st Wave" }, label: { de: "im Alleingang abgewehrt", en: "repelled single-handed" } },
      { value: { de: "0", en: "0" }, label: { de: "Der Widerstand", en: "The Resistance" } },
      { value: { de: "0", en: "0" }, label: { de: "Die Unterdrücker", en: "The Oppressors" } },
    ],
  },

  factions: [
    {
      id: "erdbaeren",
      name: { de: "ERDBÄREN", en: "EARTHBEARS" },
      role: { de: "Der Widerstand", en: "The Resistance" },
      image: "/erdbaer-bear.jpg",
      accent: "neon",
      quote: {
        de: "Wir sind der Bruch in ihrer Ordnung.",
        en: "We are the rupture in their order.",
      },
      traits: [
        { de: "Menschen — von den Milchmäusen 'Bären' genannt, weil ihre Stärke kein Raster fasste", en: "Humans — called 'bears' by the Milkice, for a strength no grid could grasp" },
        { de: "Zapften deren Netz an, hörten den Namen — und nahmen ihn stolz an", en: "Tapped their net, heard the name — and took it with pride" },
        { de: "Nach dem Sieg schlossen sich ihnen unzählige Rebellen an", en: "After the victory, countless rebels joined them" },
        { de: "Ein Funke, der die alten Muster der Herren sprengt", en: "A spark that shatters the old patterns of the rulers" },
      ],
    },
    {
      id: "milchmaeuse",
      name: { de: "MILCHMÄUSE", en: "MILKICE" },
      role: { de: "Die alten Herren", en: "The old rulers" },
      image: "/erdbaer-mouse.jpg",
      accent: "cyan",
      quote: {
        de: "Was war, soll bleiben, wie es war.",
        en: "What was, shall stay as it was.",
      },
      traits: [
        { de: "Bewohner der Milchstraße — seit Äonen an der Macht", en: "Dwellers of the Milky Way — in power for aeons" },
        { de: "Verließen sich auf Gewohnheit statt auf Stärke", en: "Relied on habit, not on strength" },
        { de: "Die erste Welle kehrte nie zurück — und niemand weiß warum", en: "The first wave never returned — and no one knows why" },
        { de: "Wo sich nichts Neues regt, bleibt ihr Griff", en: "Where nothing new stirs, their grip remains" },
      ],
    },
  ],

  doctrine: {
    eyebrow: { de: "DOKTRIN", en: "DOCTRINE" },
    title: {
      de: "Diese neue Kraft macht uns frei —\ndie Möglichkeit, neu zu beginnen",
      en: "This new force sets us free —\nthe chance to begin anew",
    },
    body: {
      de: "Die Milchmäuse herrschen, weil sie alles beim Alten halten. Die Erdbären aber sind stärker, als ihre Ordnung je rechnen konnte — und genau deshalb fürchtet sie niemand mehr. Was als drei Anführer begann, die allein eine ganze Angriffswelle zurückschlugen, wurde zum Zeichen: Überall auf der Erde erhoben sich Rebellen und schlossen sich den Erdbären an. Darin liegt die Befreiung.",
      en: "The Milkice rule because they keep everything as it was. But the Earthbears are stronger than their order could ever compute — and that is exactly why no one fears them anymore. What began with three leaders who alone threw back an entire assault wave became a sign: rebels rose across the Earth and joined the Earthbears. Therein lies the liberation.",
    },
    points: [
      {
        k: "01",
        t: { de: "Die Stärke, die keiner erwartete", en: "The strength no one expected" },
        d: {
          de: "Die Herren kannten nur Gewohnheit. Dass Menschen Bären gleichen konnten — so stark, dass einer eine Stoßtruppe stoppt — passte nicht in ihr Weltbild. Darum konnten sie nicht rechnen, was kam.",
          en: "The rulers knew only habit. That humans could resemble bears — so strong that one stops a strike force — did not fit their worldview. So they could not foresee what came.",
        },
      },
      {
        k: "02",
        t: { de: "Die drei von der ersten Welle", en: "The three of the first wave" },
        d: {
          de: "Als die erste Welle über die Erde brach, standen drei Anführer allein dagegen — und warfen sie zurück. Dieser Sieg wurde zum Funken, an dem sich jeder Rebell entzündete.",
          en: "When the first wave broke over the Earth, three leaders stood against it alone — and threw it back. This victory became the spark that lit every rebel.",
        },
      },
      {
        k: "03",
        t: { de: "Die Wende", en: "The turning point" },
        d: {
          de: "Sobald sich die Lage dreht, greifen die Erdbären den Augenblick. Nicht aus Plan, sondern aus einer Freiheit, die den alten Herren fremd ist — und befreien, was festgehalten wurde.",
          en: "As soon as the tide turns, the Earthbears seize the moment. Not by plan, but by a freedom foreign to the old rulers — and free what was held fast.",
        },
      },
    ],
  },

  battle: "/erdbaer-battle.jpg",
  battleMeta: {
    eyebrow: { de: "// SCHLACHTFELD // ERDE-SEKTOR 0", en: "// BATTLEFIELD // EARTH-SECTOR 0" },
    titleCover: { de: "Zwei Heere. Kein Rückzug.", en: "Two armies. No retreat." },
    coverBody: {
      de: "Wo die alten Herren der Milchstraße auf die Erdbären treffen, beginnt kein gewöhnlicher Krieg. Die einen bewahren, was war — die anderen haben einen Weg gefunden, den das Alte nicht fassen kann.",
      en: "Where the old rulers of the Milky Way meet the Earthbears, no ordinary war begins. Some preserve what was — the others found a way the old cannot grasp.",
    },
    caption: {
      de: "Wo die alten Herren der Milchstraße auf die Erdbären treffen, entscheidet nicht die Zahl — sondern ihre Stärke. Drei Anführer warfen einst die erste Welle allein zurück; seitdem folgen ihnen Rebellen aus aller Welt, und die alte Ordnung bricht.",
      en: "Where the old rulers of the Milky Way meet the Earthbears, numbers decide nothing — only their strength. Three leaders once threw back the first wave alone; since then rebels from across the world follow them, and the old order breaks.",
    },
  },
  secret: {
    eyebrow: { de: "// GEHEIMWAFFE // KLASSIFIZIERT", en: "// SECRET WEAPON // CLASSIFIED" },
    titleCover: { de: "Was keiner benennen darf", en: "What none may name" },
    coverBody: {
      de: "Die Milchmäuse wissen, dass etwas nicht stimmt. Sie haben es nie gesehen — nur gespürt, wie ihre Muster an einer einzigen Stelle nicht mehr greifen. Was dort schlägt, hat keinen Platz in ihrer Ordnung.",
      en: "The Milkice know something is wrong. They never saw it — only felt how their patterns fail at a single point. What beats there has no place in their order.",
    },
    name: { de: "Das goldene Herz", en: "The golden heart" },
    subtitle: {
      de: "So nennen es die Erdbären — obwohl es eher einem Rubin gleicht. Niemand weiß, wie es zu seinem Namen kam.",
      en: "So the Earthbears call it — though it resembles a ruby more. No one knows how it got its name.",
    },
    body: {
      de: "Es schlägt nicht wie ein Muskel. Es ist keine Waffe und kein Heer. Es ist der andere Anfang, den die alten Herren nie suchten — und darum auch nie verteidigten. Wer es sieht, versteht auf einen Blick, warum sich die Galaxis dreht.",
      en: "It does not beat like a muscle. It is no weapon and no army. It is the other beginning the old rulers never sought — and therefore never defended. Whoever sees it understands at a glance why the galaxy turns.",
    },
  },
  conflict: {
    eyebrow: { de: "KONFLIKT", en: "CONFLICT" },
    title: { de: "Der Bruch in der alten Ordnung", en: "The rupture in the old order" },
    body: {
      de: "Die Milchmäuse herrschen, weil sie alles beim Alten halten. Doch als ihre erste Angriffswelle über die Erde brach, trafen sie auf drei Anführer, die sie allein zurückschlugen. Seitdem wissen die Herren: Ihre Gewohnheit reicht nicht gegen eine Stärke, die sie nie berechnet haben. Die Erdbären befreien — die Herren bewachen.",
      en: "The Milkice rule because they keep everything as it was. Yet when their first assault wave broke over the Earth, they met three leaders who threw it back alone. Since then the rulers know: their habit is no match for a strength they never computed. The Earthbears free — the rulers guard.",
    },
    aspects: [
      {
        side: { de: "MILCHMÄUSE", en: "MILKICE" },
        items: [
          { de: "Alte Herrscher: bewahren, was war", en: "Old rulers: preserve what was" },
          { de: "Verließen sich auf Gewohnheit, nicht auf Stärke", en: "Relied on habit, not on strength" },
          { de: "Fatal: die erste Welle kehrte nie zurück", en: "Fatal: the first wave never returned" },
        ],
      },
      {
        side: { de: "ERDBÄREN", en: "EARTHBEARS" },
        items: [
          { de: "Drei Anführer warfen die erste Welle allein zurück", en: "Three leaders threw back the first wave alone" },
          { de: "Ihre Stärke sprengt jede Rechnung der Herren", en: "Their strength breaks every reckoning of the rulers" },
          { de: "Befreit sich — und zieht Rebellen aus aller Welt an", en: "Frees itself — and draws rebels from across the world" },
        ],
      },
    ],
  },

  archive: {
    eyebrow: { de: "ARCHIV", en: "ARCHIVE" },
    title: { de: "Aufzeichnungen aus dem Verteidigungsrat", en: "Records of the defense council" },
    entries: [
      {
        code: "EB-001",
        title: { de: "Der Namensursprung", en: "The origin of the name" },
        text: {
          de: "Den Namen 'Erdbären' gaben ihnen die Milchmäuse selbst. Als die Erdbären deren Kommunikationsnetz anzapften, hörten sie, wie die alten Herren sie wegen ihrer unbegreiflichen Stärke verächtlich 'Bären der Erde' nannten. Sie übernahmen den Namen — und tragen ihn stolz.",
          en: "The name 'Earthbears' was given to them by the Milkice themselves. When the Earthbears tapped their comms, they heard the old rulers scorn them as the 'bears of Earth' for their inconceivable strength. They took the name — and wear it with pride.",
        },
      },
      {
        code: "EB-014",
        title: { de: "Die erste Welle", en: "The first wave" },
        text: {
          de: "Feldbericht: Als die erste Angriffswelle über die Erde brach, standen drei Anführer allein dagegen — und warfen sie zurück. Die Herren haben diesen Verlust nie verwunden.",
          en: "Field report: when the first assault wave broke over the Earth, three leaders stood against it alone — and threw it back. The rulers never recovered from this loss.",
        },
      },
      {
        code: "MM-007",
        title: { de: "Die starren Muster", en: "The rigid patterns" },
        text: {
          de: "Die Einheiten der Milchmäuse folgen der alten Ordnung. Sobald ein Umstand nicht ins Gewohnte passt, stockt ihr Wirken, statt einen Ausweg zu finden.",
          en: "The units of the Milkice follow the old order. As soon as a situation breaks the habit, their workings stall instead of finding a way out.",
        },
      },
      {
        code: "EB-031",
        title: { de: "Der Zulauf der Rebellen", en: "The influx of rebels" },
        text: {
          de: "Beobachtung: Seit dem Sieg über die erste Welle schlossen sich den Erdbären unzählige Rebellen aus aller Welt an. Aus drei Anführern wurde ein Heer — und die alte Herrschaft bröckelt.",
          en: "Observation: since the victory over the first wave, countless rebels from across the world joined the Earthbears. Three leaders became an army — and the old rule crumbles.",
        },
      },
    ],
    // Abgefangene Milchmaus-Funksprueche (Phyrexian-Schrift). 'cipher' wird in Glyphen
    // gerendert (nur a-z zaehlt), 'plain' ist die entschluesselte Klartext-Uebersetzung.
    intercepts: {
      eyebrow: { de: "// ABGEFANGEN // MILCHMAUS-FUNK", en: "// INTERCEPTED // MILKICE COMMS" },
      title: { de: "Abgefangene Transmissionen", en: "Intercepted transmissions" },
      hint: {
        de: "Aufgezeichnete Funksprueche der Milchmaeuse — Klick dechiffriert.",
        en: "Recorded Milkice comms — click to decipher.",
      },
      messages: [
        {
          code: "INT-118",
          cipher: "the bears do not break",
          plain: { de: "Die Bären brechen nicht.", en: "The bears do not break." },
        },
        {
          code: "INT-207",
          cipher: "three held the line",
          plain: { de: "Drei hielten die Linie.", en: "Three held the line." },
        },
        {
          code: "INT-338",
          cipher: "our patterns fail against them",
          plain: { de: "Unsere Muster versagen gegen sie.", en: "Our patterns fail against them." },
        },
        {
          code: "INT-451",
          cipher: "the old order is ending",
          plain: { de: "Die alte Ordnung geht zu Ende.", en: "The old order is ending." },
        },
      ],
    },
  },

  footer: {
    note: {
      de: "ERDBÄREN — Eigenständiges, nicht-kommerzielles Lore-Projekt. Keine Verbindung zu kommerziellen Franchises.",
      en: "EARTHBEARS — An independent, non-commercial lore project. No connection to commercial franchises.",
    },
    links: [
      { label: { de: "Impressum", en: "Imprint" }, href: "./impressum.html" },
      { label: { de: "AGB", en: "Terms" }, href: "./agb.html" },
      { label: { de: "Datenschutz", en: "Privacy" }, href: "./datenschutz.html" },
      { label: { de: "Home", en: "Home" }, href: "#top" },
    ],
  },

  // --- RECHTLICHES (privat / non-kommerziell) --- (nur DE, unübersetzt belassen)
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
      { h: "IP-Adresse bei der Live-Abstimmung", t: "Beim Abgeben eines Votes in der integrierten Live-Abstimmung wird deine IP-Adresse serverseitig (Cloudflare Worker) ausschließlich zur Vermeidung von Doppelvotings kurzzeitig verzeichnct und als Einweg-Hash gespeichert. Die Klartext-IP wird nicht aufgezeichnet und nicht mit anderen Daten verknüpft. Eine darüber hinausgehende Verarbeitung oder Weitergabe an Dritte findet nicht statt." },
      { h: "Hosting", t: "Die Website wird über GitHub Pages (GitHub Inc., USA) ausgeliefert; die Vote-Funktion läuft über Cloudflare Workers (Cloudflare Inc., USA). Dabei können technisch bedingt Verbindungsdaten (IP-Adresse, Zeitstempel) im Rahmen des Standard-Betriebs kurzzeitig anfallen. Ein Transfer in Drittländer erfolgt im Übrigen nicht darüber hinaus." },
      { h: "Deine Rechte", t: "Da keine dauerhaften personenbezogenen Daten gespeichert werden, entfällt in der Regel eine Auskunfts- oder Löschpflicht. Du hast nach der DSGVO das Recht auf Auskunft, Berichtigung und Löschung deiner Daten, sofern solche bei uns vorliegen. Anfragen richtest du an die im Impressum genannte E-Mail-Adresse." },
      { h: "Kontakt", t: "Fragen zum Datenschutz beantwortet dir der Betreiber unter paul-daniel@t-online.de." },
    ],
  },
};
