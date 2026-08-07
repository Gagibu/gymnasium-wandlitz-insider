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
      kind: "path",
      d: "M 83.293099,65.853988 94.517521,79.564869 83.276292,88.767509 66.597331,68.393787 77.83856,59.191147 81.939956,64.201093 z",
    },
    floors: {
      1: { visual: "disabled", clickable: false },
      2: { visual: "none", clickable: true },
      3: { visual: "disabled", clickable: false },
    },
  },
  {
    id: "feldschuleHausmeister",
    name: "Feldschule – Hausmeister / Haustechnik",
    shortName: "Hausmeister FS",
    description: "Hausmeister- und Haustechnikraum im Gebäude Feldschule.",
    rooms: [],
    ariaLabel: "Feldschule – Hausmeister / Haustechnik",
    geometry: {
      kind: "path",
      d: "m 75.405509,70.989399 l -1.461546,1.196496 l 0.786354,0.960773 l -2.5547,2.088031 l -1.514478,-1.876879 l 4.004689,-3.270409 l 0.102171,0.124805 l 0.616543,-0.504734 c 0.317093,0.380426 0.278128,0.75211 -0.116907,1.115062 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "feldschuleRaum050",
    name: "Feldschule – Raum 050",
    shortName: "Raum 050",
    description: "Klassenraum 050 im Gebäude Feldschule, kombinierbar mit Raum 051.",
    rooms: [],
    ariaLabel: "Feldschule – Raum 050",
    geometry: {
      kind: "path",
      d: "m 83.288006,88.650034 l 4.506983,-3.689645 l -3.026247,-3.696627 c -0.416656,0.341933 -0.803967,0.26461 -1.128215,-0.082016 l 0.636507,-0.518617 l -0.75557,-0.922946 l -4.506983,3.689644 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "feldschuleRaum051",
    name: "Feldschule – Raum 051",
    shortName: "Raum 051",
    description: "Klassenraum 051 im Gebäude Feldschule, kombinierbar mit Raum 050.",
    rooms: [],
    ariaLabel: "Feldschule – Raum 051",
    geometry: {
      kind: "path",
      d: "m 79.014481,83.429828 l 4.506983,-3.689644 l -2.926696,-3.575025 c -0.416661,0.341928 -0.805831,0.262334 -1.132977,-0.087831 l 0.63652,-0.518603 l -0.609295,-0.744266 l -4.506983,3.689645 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "feldschuleRaum052",
    name: "Feldschule – Raum 052",
    shortName: "Raum 052",
    description: "Klassenraum 052 im Gebäude Feldschule.",
    rooms: [],
    ariaLabel: "Feldschule – Raum 052",
    geometry: {
      kind: "path",
      d: "m 66.699414,68.374197 l 4.506983,-3.689644 l 2.837438,3.465993 c -0.417472,0.340936 -0.419836,0.733834 -0.146673,1.116961 l 0.634106,-0.52155 l 0.707577,0.864321 l -4.506983,3.689644 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "feldschuleRaum053",
    name: "Feldschule – Raum 053",
    shortName: "Raum 053",
    description: "Klassenraum 053 im Gebäude Feldschule.",
    rooms: [],
    ariaLabel: "Feldschule – Raum 053",
    geometry: {
      kind: "path",
      d: "m 77.80161,59.290299 l -4.506983,3.689645 l 2.837438,3.465993 c 0.416661,-0.341927 0.802289,-0.266659 1.12393,0.076781 l -0.636497,0.51863 l 0.707577,0.864321 l 4.506983,-3.689645 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "feldschuleRaum054",
    name: "Feldschule – Raum 054",
    shortName: "Raum 054",
    description: "Klassenraum 054 im Gebäude Feldschule.",
    rooms: [],
    ariaLabel: "Feldschule – Raum 054",
    geometry: {
      kind: "path",
      d: "m 86.106974,69.411886 l -4.506983,3.689645 l 2.777127,3.392323 c 0.416661,-0.341927 0.803942,-0.264641 1.128153,0.081938 l -0.636505,0.51862 l 0.763675,0.932846 l 4.506983,-3.689644 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "feldschuleRaum055",
    name: "Feldschule – Raum 055",
    shortName: "Raum 055",
    description: "Klassenraum 055 im Gebäude Feldschule.",
    rooms: [],
    ariaLabel: "Feldschule – Raum 055",
    geometry: {
      kind: "path",
      d: "m 94.412949,79.557818 l -4.506983,3.689645 l -3.026246,-3.696627 c 0.417476,-0.34093 0.418158,-0.735883 0.142387,-1.122196 l -0.634096,0.521563 l -0.75557,-0.922946 l 4.506983,-3.689645 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "feldschuleLehrerzimmer",
    name: "Feldschule – Lehrerzimmer",
    shortName: "Lehrerzimmer FS",
    description: "Lehrerzimmer im Gebäude Feldschule.",
    rooms: [],
    ariaLabel: "Feldschule – Lehrerzimmer",
    geometry: {
      kind: "path",
      d: "m 71.208868,64.687505 l 2.630174,3.212817 l 0.928402,-0.760037 c -0.32624,-0.397497 -0.24342,-0.77442 0.101326,-1.095269 l 0.49473,0.607308 l 0.561327,-0.459531 l -2.630174,-3.212817 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "feldschuleVorbereitungsraum",
    name: "Feldschule – Vorbereitungsraum",
    shortName: "Vorbereitungsraum FS",
    description: "Vorbereitungsraum im Gebäude Feldschule.",
    rooms: [],
    ariaLabel: "Feldschule – Vorbereitungsraum",
    geometry: {
      kind: "path",
      d: "m 87.795202,84.958257 l -2.902893,-3.545948 l 0.851901,-0.697409 c 0.358969,0.439612 0.776566,0.43892 1.185986,0.146375 l -0.549207,-0.667675 l 0.612489,-0.501415 l 2.902894,3.545948 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "feldschuleMusikschuleBarnim",
    name: "Feldschule – Musikschule Barnim",
    shortName: "Musikschule Barnim",
    description: "Von der Musikschule Barnim genutzter Raum im Gebäude Feldschule.",
    rooms: [],
    ariaLabel: "Feldschule – Musikschule Barnim",
    geometry: {
      kind: "path",
      d: "m 79.041095,69.975782 l -0.160666,-0.196256 l 4.518952,-3.699443 l 2.741884,3.349272 l -3.492595,2.841626 l -1.908326,-2.329098 l -1.034015,0.846497 l -0.121173,-0.148015 c 0.349763,-0.398777 0.380481,-0.794442 0.092156,-1.186997 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "feldschulePutzmittelraum",
    name: "Feldschule – Putzmittelraum",
    shortName: "Putzmittelraum FS",
    description: "Putzmittelraum im Gebäude Feldschule.",
    rooms: [],
    ariaLabel: "Feldschule – Putzmittelraum",
    geometry: {
      kind: "path",
      d: "m 82.634006,72.255034 l -1.034015,0.846496 l -0.40948,-0.500189 l 0.572125,-0.46723 c -0.293728,-0.311428 -0.626676,-0.329434 -0.998844,-0.054018 l -1.057462,-1.291713 l -0.121173,-0.148015 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "feldschuleWcJungen",
    name: "Feldschule – WC Jungen",
    shortName: "WC Jungen FS",
    description: "Toiletten für Jungen im Gebäude Feldschule.",
    rooms: [],
    ariaLabel: "Feldschule – WC Jungen",
    geometry: {
      kind: "path",
      d: "m 77.305689,76.292541 l 0.151644,0.185236 l 1.457642,-1.193299 l -0.147489,-0.180161 l -0.594815,0.489199 c -0.274541,-0.390108 -0.228175,-0.738731 0.139097,-1.045869 l -0.690709,-0.843716 l -1.457642,1.193299 l 0.69415,0.847919 c -0.33121,0.327642 -0.370128,0.666569 -0.116751,1.016783 z M 73.924563,76.942274 l 2.339853,-1.915798 l 0.588986,0.713278 c -0.332712,0.353583 -0.362352,0.636028 -0.112585,1.022179 l 0.56487,-0.469396 l 0.145817,0.183996 l -2.479444,2.029798 l -1.18709,-1.450056 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "feldschuleWcMaedchen",
    name: "Feldschule – WC Mädchen",
    shortName: "WC Mädchen FS",
    description: "Toiletten für Mädchen im Gebäude Feldschule.",
    rooms: [],
    ariaLabel: "Feldschule – WC Mädchen",
    geometry: {
      kind: "path",
      d: "m 74.949555,73.414471 l -0.219237,-0.267804 l 1.460767,-1.195858 l 0.215083,0.262728 l -0.597025,0.4865 c 0.328213,0.34617 0.679127,0.36956 1.052743,0.07017 l 0.712164,0.876318 l -1.459971,1.195206 l -0.716403,-0.879867 c -0.386594,0.259989 -0.726533,0.231212 -1.019817,-0.086333 z M 73.924563,76.942274 l 2.340169,-1.915412 l -0.867053,-1.065002 c -0.362043,0.279235 -0.79514,0.190074 -1.019817,-0.086333 l 0.571693,-0.461061 l -0.219237,-0.267799 l -2.483978,2.030133 l 1.538947,1.879858 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "feldschuleWcLehrer",
    name: "Feldschule – WC Lehrer (barrierefrei)",
    shortName: "WC Lehrer FS",
    description: "Barrierefreie Toilette für Lehrkräfte im Gebäude Feldschule.",
    rooms: [],
    ariaLabel: "Feldschule – WC Lehrer (barrierefrei)",
    geometry: {
      kind: "path",
      d: "m 74.730315,73.146669 l -0.786353,-0.960774 l 1.461552,-1.196501 l 0.092579,0.113087 l -0.596409,0.494332 c 0.301386,0.366914 0.656793,0.393431 1.06622,0.079553 l 0.223186,0.274436 z",
    },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "feldschuleFeuerloescher1",
    name: "Feldschule – Feuerlöscher 1",
    shortName: "Feuerlöscher 1 FS",
    description: "Standort eines Feuerlöschers im Gebäude Feldschule.",
    rooms: [],
    ariaLabel: "Feldschule – Feuerlöscher 1",
    geometry: { kind: "ellipse", cx: 80.280214, cy: 68.360661, rx: 0.116134, ry: 0.115093 },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "feldschuleFeuerloescher2",
    name: "Feldschule – Feuerlöscher 2",
    shortName: "Feuerlöscher 2 FS",
    description: "Standort eines Feuerlöschers im Gebäude Feldschule.",
    rooms: [],
    ariaLabel: "Feldschule – Feuerlöscher 2",
    geometry: { kind: "ellipse", cx: 85.005852, cy: 81.098805, rx: 0.116134, ry: 0.115093 },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "feldschuleFeuermelder1",
    name: "Feldschule – Feuermelder 1",
    shortName: "Feuermelder 1 FS",
    description: "Standort eines Feuermelders im Gebäude Feldschule.",
    rooms: [],
    ariaLabel: "Feldschule – Feuermelder 1",
    geometry: { kind: "ellipse", cx: 79.558907, cy: 68.948493, rx: 0.116134, ry: 0.115093 },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "hidden", clickable: false },
    },
  },
  {
    id: "feldschuleFeuermelder2",
    name: "Feldschule – Feuermelder 2",
    shortName: "Feuermelder 2 FS",
    description: "Standort eines Feuermelders im Gebäude Feldschule.",
    rooms: [],
    ariaLabel: "Feldschule – Feuermelder 2",
    geometry: { kind: "ellipse", cx: 83.972279, cy: 76.270384, rx: 0.116134, ry: 0.115093 },
    floors: {
      1: { visual: "hidden", clickable: false },
      2: { visual: "visible", clickable: true },
      3: { visual: "hidden", clickable: false },
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