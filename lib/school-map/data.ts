import type { BuildingData } from "./types"

export const buildings: BuildingData[] = [
  {
    id: "building1",
    name: "Turnhalle – ???",
    shortName: "Turnhalle",
    description:
      "Die Turnhalle beherbergt die große Halle, die Umkleiden und Toiletten. In der Sporthalle wird vorallem das Fach Sport unterrichtet.",
    rooms: ["Große Halle (gH1 / gH2)", "Umkleiden", "Toiletten"],
    ariaLabel: "Gebäude A – Turnhalle",
    geometry: {
      kind: "path",
      d: "m 20.758603,14.902796 8.333045,10.131956 2.187088,-1.79046 6.076279,7.422309 -2.187088,1.790461 8.017415,9.840493 -20.61788,16.878842 -22.426739,-27.39476 z",
    },
    floors: {
      1: { visual: "visible", clickable: true },
      2: { visual: "disabled", clickable: false },
      3: { visual: "disabled", clickable: false },
    },
  },
  {
    id: "building2",
    name: "Feldschule – ???",
    shortName: "Feldschule",
    description:
      "Hier liegen die Fachräume für Gesellschaftswissenschaften mit den dazugehörigen Fluren und Nebenräumen. (Geschichts-Fachräume, Politische Bildung, Erdkunde, Toiletten)",
    rooms: [
      "050",
      "051",
      "052",
      "053",
      "054",
      "055",
      "WC-Behindert / Lehrer-FS",
      "WC-Frauen-FS",
      "WC-Männer-FS",
      "Lehrerzimmer-FS",
      "Vorbereitungsraum-FS",
      "Haustechnik-FS",
      "Musikschule-Barnim",
    ],
    ariaLabel: "Gebäude B – Feldschule",
    geometry: {
      kind: "rect",
      width: 26.458336,
      height: 14.552083,
      x: 95.044033,
      y: -22.734944,
      transform: "rotate(50.694505)",
    },
    floors: {
      1: { visual: "disabled", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "disabled", clickable: false },
    },
  },
  {
    id: "haus2",
    name: "Haus 2 – ???",
    shortName: "Haus 2",
    description:
      "Sprachenbereich und zugehörige Unterrichtsräume. Hier werden die Sprachen Deutsch, Englisch, Französisch, Spanisch und selten auch (Latein) unterrichtet",
    rooms: [],
    ariaLabel: "Haus 2",
    geometry: {
      kind: "path",
      d: "m 92.950537,44.197492 8.208613,-6.719943 -1.253784,-1.531517 1.505004,-1.23207 1.25378,1.531517 24.37892,-19.957817 6.28091,7.672271 -25.87108,21.199412 11.37814,13.89862 0.65774,-0.47475 6.35514,7.762944 -15.81274,12.945112 -6.35513,-7.762938 8.58764,-7.030278 -11.40936,-13.936773 -1.622844,1.308499 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "hidden", clickable: true },
      3: { visual: "hidden", clickable: true },
    },
    floorDetails: {
      2: {
        description:
          "Im Erdgeschoss liegt die kleine Sporthalle, das Sekretariat direkt am Durchgang zum Foyer und die Unterrichtsräume vorallem für die Sprachen Französisch und Spanisch.",
        rooms: ["130", "131", "132", "133", "134", "kleine Sporthalle", "Sekretariat", "Toiletten"],
      },
      3: {
        description:
          "Im 1. Obergeschoss von Haus 2 liegen weitere Unterrichtsräume, sowie die Aula. Hier werden vorallem die Sprachen Deutsch und Englisch unterrichtet",
        rooms: ["230", "231", "232", "233", "234", "Toiletten"],
      },
    },
  },
  {
    id: "haus3",
    name: "Haus 3 - ???",
    shortName: "Haus 3",
    description: "Neben- und Fachbereich im Campusplan.",
    rooms: [],
    ariaLabel: "Haus 3",
    geometry: {
      kind: "path",
      d: "m 72.634817,1.240357 5.92951,7.243026 -1.68526,1.379636 7.10362,8.67723 -2.18719,1.790646 -7.103671,-8.677288 -23.55778,19.285593 -9.745532,-11.904383 13.195222,-10.802278 3.816023,4.661358 z",
    },
    floors: {
      1: { visual: "hidden", clickable: true },
      2: { visual: "hidden", clickable: false },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "haus5",
    name: "Haus 5 - ???",
    shortName: "Haus 5",
    description: "Weitere Unterrichts- und Funktionsräume.",
    rooms: [],
    ariaLabel: "Haus 5",
    geometry: {
      kind: "path",
      d: "m 131.86145,16.945308 -2.56258,2.09786 8.38633,10.24409 -4.48684,3.673151 7.36895,9.001338 -8.01148,6.558608 6.51667,7.960264 16.58077,-13.573856 -13.88512,-16.962021 -1.52037,1.244655 z",
    },
    floors: {
      1: { visual: "disabled", clickable: false },
      2: { visual: "hidden", clickable: true },
      3: { visual: "hidden", clickable: true },
    },
    floorDetails: {
      2: {
        description:
          "Auf Etage 2 von Haus 5 liegen die naturwissenschaftlichen Fachräume für Biologie und Chemie samt Vorbereitungsraum und Sammlung.",
        rooms: ["Biologie-Fachraum", "Chemie-Fachraum", "Vorbereitungsraum", "Sammlung", "Toiletten"],
      },
      3: {
        description:
          "Etage 3 von Haus 5 umfasst die Physikräume sowie die beiden Informatikkabinette mit dem angrenzenden Technikraum.",
        rooms: ["Physik-Fachraum", "Informatik 1", "Informatik 2", "Technikraum", "Toiletten"],
      },
    },
  },
  {
    id: "foyer",
    name: "Foyer - ???",
    shortName: "Foyer",
    description: "Zentraler Übergangsbereich.",
    rooms: [],
    ariaLabel: "Foyer",
    geometry: {
      kind: "path",
      d: "m 93.038647,24.481535 1.23287,1.505975 -1.50501,1.23207 8.392663,10.257969 -4.409283,3.609657 -9.62854,-11.761473 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "hidden", clickable: true },
      3: { visual: "disabled", clickable: false },
    },
  },
  {
    id: "essenraum",
    name: "Essenraum - ???",
    shortName: "Essenraum",
    description: "Speisebereich und Aufenthaltszone.",
    rooms: [],
    ariaLabel: "Essenraum",
    geometry: {
      kind: "path",
      d: "m 85.739717,17.101957 -1.75703,1.438292 -4.90281,-5.988508 2.99211,-2.449495 -3.00303,-3.709023 7.63757,-6.2525 4.75544,5.808876 -8.89199,7.280459 z",
    },
    floors: {
      1: { visual: "hidden", clickable: true },
      2: { visual: "hidden", clickable: false },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "haus1",
    name: "Haus 1 - ???",
    shortName: "Haus 1",
    description: "Verbindungs- und Unterrichtsbereich.",
    rooms: [],
    ariaLabel: "Haus 1",
    geometry: {
      kind: "path",
      d: "m 95.922977,8.765417 6.545953,7.996014 -32.557785,26.65342 -6.545929,-7.995997 11.007967,-9.01168 -1.52641,-1.864544 6.346614,-5.195658 1.52641,1.864544 z",
    },
    floors: {
      1: { visual: "hidden", clickable: true },
      2: { visual: "hidden", clickable: true },
      3: { visual: "visible", clickable: true },
    },
    floorDetails: {
      1: {
        description:
          "Auf Etage 1 befindet sich der Haupteingang von Haus 1 mit der Verwaltung, der Schulleitung und dem Hausmeisterbüro.",
        rooms: ["Haupteingang", "Sekretariat", "Schulleitung", "Hausmeisterbüro", "Toiletten"],
      },
      2: {
        description:
          "Etage 2 von Haus 1 beherbergt die Klassenräume der Sekundarstufe I sowie das Lehrerzimmer und den Beratungsraum.",
        rooms: ["Klassenräume 1.01 – 1.06", "Lehrerzimmer", "Beratungsraum", "Kopierraum", "Toiletten"],
      },
      3: {
        description:
          "Auf Etage 3 liegen die Kursräume der Oberstufe, der Fachraum Mathematik und der Selbstlernbereich.",
        rooms: ["Kursräume 2.01 – 2.05", "Fachraum Mathematik", "Selbstlernbereich", "Toiletten"],
      },
    },
  },
  {
    id: "Archiv",
    name: "Archiv - ???",
    shortName: "Archiv",
    description: "Archivbereich der Schule.",
    rooms: [],
    ariaLabel: "Archiv",
    geometry: {
      kind: "path",
      d: "m 98.039777,33.667165 6.427703,7.845426 5.58487,-4.572056 2.98541,3.646745 -5.58487,4.572056 2.8777,3.515172 -6.59858,5.40193 -2.8777,-3.515171 -1.622843,1.308513 -6.28092,-7.672279 3.72702,-3.117557 -3.04712,-3.803166 z",
    },
    floors: {
      1: { visual: "hidden", clickable: true },
      2: { visual: "hidden", clickable: false },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "Foyer2",
    name: "unterm Foyer - Mappenmörder",
    shortName: "Foyer 2",
    description: "Zweiter Foyerbereich.",
    rooms: [],
    ariaLabel: "Foyer 2",
    geometry: {
      kind: "path",
      d: "m 87.121345,29.325734 5.917301,-4.844198 1.232871,1.505973 -1.505001,1.23207 5.27326,6.447586 -4.409329,3.609612 z",
    },
    floors: {
      1: { visual: "hidden", clickable: true },
      2: { visual: "hidden", clickable: false },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "Bibliothek",
    name: "Bibliothek - ???",
    shortName: "Bibliothek",
    description: "Bibliotheksbereich.",
    rooms: [],
    ariaLabel: "Bibliothek",
    geometry: {
      kind: "path",
      d: "m 112.135567,28.491709 3.00377,3.669169 9.40648,-7.700637 3.27714,4.003094 5.50101,-4.503411 -6.28089,-7.672254 z",
    },
    floors: {
      1: { visual: "visible", clickable: true },
      2: { visual: "hidden", clickable: false },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "uUukH",
    name: "uUukH",
    shortName: "uUukH",
    description: "Spezialbereich uUukH.",
    rooms: [],
    ariaLabel: "uUukH",
    geometry: {
      kind: "path",
      d: "m 110.330587,48.674508 8.50042,10.383439 0.65775,-0.474754 6.35514,7.762942 -15.81278,12.945078 -6.3551,-7.76291 8.58761,-7.030312 -8.53163,-10.421568 z",
    },
    floors: {
      1: { visual: "disabled", clickable: false },
      2: { visual: "hidden", clickable: false },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "L1oB",
    name: "L1oB",
    shortName: "L1oB",
    description: "Bereich L1oB.",
    rooms: [],
    ariaLabel: "L1oB",
    geometry: {
      kind: "path",
      d: "m 110.052347,36.940535 2.98541,3.646745 -5.58487,4.572056 2.8777,3.515172 -6.59858,5.40193 -2.89566,-3.53713 -1.60485,1.330486 -6.28094,-7.672285 3.7271,-3.117492 -9.55631,-11.754267 -17.210167,14.089147 -6.545974,-7.996052 11.007969,-9.011681 -1.526411,-1.864545 6.346613,-5.195658 1.52641,1.864545 1.0757,-0.880621 -7.103661,-8.677278 -23.55778,19.285593 -9.745532,-11.904383 13.195222,-10.802278 3.816023,4.661358 14.235058,-11.65354 5.92951,7.243026 -1.68526,1.379636 7.10362,8.67723 -4.90281,-5.988508 2.99211,-2.449495 -3.00303,-3.709023 7.63757,-6.2525 4.75544,5.808876 -8.89199,7.280459 3.16974,3.871899 10.18327,-8.336542 6.54594,7.996014 -9.43028,7.720105 1.23287,1.505975 -1.505,1.23207 11.70096,14.29301 z",
    },
    floors: {
      1: { visual: "visible", clickable: false },
      2: { visual: "hidden", clickable: false },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "zaub",
    name: "zaub",
    shortName: "zaub",
    description: "Sonderbereich zaub.",
    rooms: [],
    ariaLabel: "zaub",
    geometry: {
      kind: "path",
      d: "m 110.052347,36.940535 2.98541,3.646745 14.7852,-12.123945 -3.27714,-4.003094 -9.40648,7.700637 -3.00377,-3.669169 -10.97641,8.985848 3.30832,4.035034 z",
    },
    floors: {
      1: { visual: "disabled", clickable: false },
      2: { visual: "hidden", clickable: false },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "Bergs-komp",
    name: "Bergs-komp",
    shortName: "Bergs-komp",
    description: "Bereich Bergs-komp.",
    rooms: [],
    ariaLabel: "Bergs-komp",
    geometry: {
      kind: "path",
      d: "m 63.365215,35.418855 11.007968,-9.011682 -1.526421,-1.864553 6.346624,-5.195648 1.526411,1.864544 15.203188,-12.4461011 6.545945,7.9960161 -9.430284,7.720102 1.232871,1.505976 -1.505011,1.23207 7.13886,8.726453 1.505004,-1.23207 1.25378,1.531517 24.37893,-19.957809 2.25579,2.755498 2.56258,-2.09786 8.38633,10.24409 1.52037,-1.244656 13.88512,16.962019 -16.58077,13.573858 -6.51667,-7.960264 8.01148,-6.558616 -7.36896,-9.00134 4.48685,-3.673141 -4.36123,-5.327335 -25.8086,21.194672 11.31567,13.90337 0.65774,-0.47475 6.35508,7.762875 -15.81268,12.945181 -6.35513,-7.762938 8.58764,-7.030278 -11.40936,-13.936773 -1.622884,1.308446 -6.280909,-7.672236 3.799348,-3.110286 -9.62854,-11.761472 -17.210201,14.089117 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: false },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "nTal",
    name: "nTal",
    shortName: "nTal",
    description: "Bereich nTal.",
    rooms: [],
    ariaLabel: "nTal",
    geometry: {
      kind: "path",
      d: "m 85.739717,17.101959 -3.16974,-3.871901 8.89199,-7.2804586 -4.75544,-5.80887595 -7.63757,6.25249995 3.00303,3.7090226 -2.99211,2.449495 4.90282,5.988509 -7.10363,-8.6772316 1.68526,-1.379635 -5.92951,-7.243026 L 58.399759,12.893897 54.583736,8.2325394 41.388514,19.034817 51.134046,30.9392 l 23.55778,-19.285593 7.103671,8.677289 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "disabled", clickable: false },
      3: { visual: "disabled", clickable: false },
    },
  },
  {
    id: "haus25",
    name: "haus25",
    shortName: "haus25",
    description: "Bereich haus25.",
    rooms: [],
    ariaLabel: "haus25",
    geometry: {
      kind: "path",
      d: "m 137.6852,29.287258 -4.36122,-5.327325 -25.87108,21.199411 11.37814,13.898623 0.65774,-0.474751 6.35514,7.762943 -15.81274,12.945114 -6.35513,-7.76294 8.58764,-7.030276 -11.40936,-13.936775 -1.622843,1.308501 -6.28095,-7.67229 8.208613,-6.719944 -1.253783,-1.531518 1.505003,-1.232069 1.25378,1.531518 24.37892,-19.957818 2.25579,2.755499 2.56258,-2.097861 8.38633,10.244089 1.52038,-1.244655 13.88511,16.962021 -16.58076,13.573856 -6.51668,-7.960264 8.01149,-6.558608 -7.36896,-9.001338 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "hidden", clickable: false },
      3: { visual: "visible", clickable: false },
    },
  },
]

export const buildingsById = Object.fromEntries(buildings.map((b) => [b.id, b])) as Record<
  BuildingData["id"],
  BuildingData
>