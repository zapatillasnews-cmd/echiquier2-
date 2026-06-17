// Cours d'ouvertures : chaque cours = une ouverture, chaque etape = une ligne
// theorique (suite de coups en SAN anglais pour chess.js) avec des notes.
// Toutes les lignes suivent la theorie principale (coups recommandes).
// L'orientation du plateau suit "side" (cote qu'on apprend).

export const COURSES = [
  {
    id: 'italienne', name: "L'Italienne", eco: 'C50', icon: '🍝',
    cover: '#d96f4c', dark: '#b5542f', side: 'white',
    tagline: "L'ouverture des débutants ambitieux",
    steps: [
      {
        title: 'Le centre et le développement', place: '1.e4 e5 2.Cf3 Cc6 3.Fc4',
        intro: "L'Italienne vise un développement rapide et naturel : on occupe le centre, on sort les pièces vers leurs meilleures cases et on vise le point faible f7.",
        line: [
          { san: 'e4', note: 'On prend le centre et on ouvre les lignes du fou et de la dame.' },
          { san: 'e5', note: 'Les Noirs répondent symétriquement.' },
          { san: 'Nf3', note: 'On attaque le pion e5 tout en développant.' },
          { san: 'Nc6', note: 'Les Noirs défendent e5.' },
          { san: 'Bc4', note: 'Le fou vise f7, la case la plus faible du camp noir.' }
        ]
      },
      {
        title: 'Le Giuoco Pianissimo', place: '3...Fc5 4.c3 Cf6 5.d3 d6 6.O-O',
        intro: '« Le jeu très tranquille » : les deux camps se développent calmement. c3 prépare d4, d3 soutient e4, puis on roque. Très solide et populaire au plus haut niveau.',
        line: [
          { san: 'e4' }, { san: 'e5' }, { san: 'Nf3' }, { san: 'Nc6' }, { san: 'Bc4' },
          { san: 'Bc5', note: 'Le fou noir occupe la diagonale opposée.' },
          { san: 'c3', note: 'On prépare d4 et on ménage une case de repli au fou.' },
          { san: 'Nf6', note: 'Les Noirs développent et pressent e4.' },
          { san: 'd3', note: 'On défend e4 solidement.' },
          { san: 'd6', note: 'Structure symétrique et saine.' },
          { san: 'O-O', note: 'Roi en sécurité ; on jouera ensuite Te1, Cbd2, b4…' }
        ]
      },
      {
        title: 'Le plan moderne (manœuvre Cbd2-f1-g3)', place: '...6.O-O O-O 7.Te1 a6 8.a4',
        intro: "Le plan typique de l'Italienne moderne : on ne se précipite pas sur d4. On réarrange ses pièces (Cbd2-f1-g3, Fc4-b3, h3) pour préparer une attaque lente au centre et à l'aile roi.",
        line: [
          { san: 'e4' }, { san: 'e5' }, { san: 'Nf3' }, { san: 'Nc6' }, { san: 'Bc4' }, { san: 'Bc5' },
          { san: 'c3' }, { san: 'Nf6' }, { san: 'd3' }, { san: 'd6' }, { san: 'O-O' },
          { san: 'O-O', note: 'Les deux rois sont à l\'abri.' },
          { san: 'Re1', note: 'On surprotège e4 avant toute action.' },
          { san: 'a6', note: 'Les Noirs préviennent Fb5 et préparent ...Fa7.' },
          { san: 'a4', note: 'On gagne de l\'espace à l\'aile dame ; le jeu de manœuvre commence.' }
        ]
      },
      {
        title: 'La défense hongroise', place: '3...Fe7 4.d4 exd4 5.Cxd4',
        intro: "3...Fe7 est modeste mais très solide : les Noirs évitent toute complication tactique. Les Blancs prennent l'espace au centre avec d4 et gardent un petit avantage de développement.",
        line: [
          { san: 'e4' }, { san: 'e5' }, { san: 'Nf3' }, { san: 'Nc6' }, { san: 'Bc4' },
          { san: 'Be7', note: 'La défense hongroise : prudente et sans risque.' },
          { san: 'd4', note: 'On occupe le centre tant qu\'on le peut.' },
          { san: 'exd4' }, { san: 'Nxd4', note: 'Centre dégagé, léger confort pour les Blancs.' }
        ]
      },
      {
        title: 'Le Gambit Evans', place: '3...Fc5 4.b4!?',
        intro: "Un gambit romantique : 4.b4 offre un pion pour gagner du temps (4...Fxb4 5.c3) et bâtir un gros centre avec d4. L'arme favorite de Morphy et... Kasparov.",
        line: [
          { san: 'e4' }, { san: 'e5' }, { san: 'Nf3' }, { san: 'Nc6' }, { san: 'Bc4' }, { san: 'Bc5' },
          { san: 'b4', note: 'Le Gambit Evans : on offre le pion b.' },
          { san: 'Bxb4', note: 'Accepter est le plus critique.' },
          { san: 'c3', note: 'On chasse le fou en gagnant un tempo.' },
          { san: 'Ba5', note: 'Le fou garde la diagonale.' },
          { san: 'd4', note: 'Le grand centre blanc se met en place : forte initiative.' }
        ]
      }
    ]
  },
  {
    id: 'deuxcavaliers', name: 'Les Deux Cavaliers', eco: 'C57', icon: '⚔️',
    cover: '#9c5050', dark: '#7a3a3a', side: 'white',
    tagline: 'La défense la plus tranchante contre 3.Fc4',
    steps: [
      {
        title: 'La Défense des deux cavaliers', place: '1.e4 e5 2.Cf3 Cc6 3.Fc4 Cf6',
        intro: "Au lieu de défendre passivement, les Noirs développent le cavalier en f6 et attaquent e4, en ignorant la menace sur f7. C'est une invitation à la bagarre.",
        line: [
          { san: 'e4' }, { san: 'e5' }, { san: 'Nf3' }, { san: 'Nc6' }, { san: 'Bc4' },
          { san: 'Nf6', note: 'On attaque e4 et on défie les Blancs : c\'est la Défense des deux cavaliers.' }
        ]
      },
      {
        title: "L'attaque 4.Cg5", place: '4.Cg5 d5 5.exd5',
        intro: "4.Cg5 attaque deux fois f7 (cavalier + fou). C'est presque forcé : les Noirs DOIVENT jouer 5...d5 pour contre-attaquer, sinon ils perdent f7.",
        line: [
          { san: 'e4' }, { san: 'e5' }, { san: 'Nf3' }, { san: 'Nc6' }, { san: 'Bc4' }, { san: 'Nf6' },
          { san: 'Ng5', note: 'Double attaque sur f7. Agressif et un peu « anti-positionnel ».' },
          { san: 'd5', note: 'Le seul bon coup : on ferme la diagonale du fou c4.' },
          { san: 'exd5', note: 'On prend le pion central et on garde la tension.' }
        ]
      },
      {
        title: 'La variante principale 5...Ca5', place: '5...Ca5 6.Fb5+ c6 7.dxc6 bxc6 8.Fe2',
        intro: "5...Ca5 chasse le fou de la diagonale a2-g8. Les Noirs sacrifient un pion mais obtiennent une avance de développement et une initiative durable (gambit Polerio).",
        line: [
          { san: 'e4' }, { san: 'e5' }, { san: 'Nf3' }, { san: 'Nc6' }, { san: 'Bc4' }, { san: 'Nf6' },
          { san: 'Ng5' }, { san: 'd5' }, { san: 'exd5' },
          { san: 'Na5', note: 'On attaque le fou c4, défenseur clé.' },
          { san: 'Bb5+', note: 'Le fou se sauve avec échec.' },
          { san: 'c6', note: 'On bloque et on prépare à récupérer du terrain.' },
          { san: 'dxc6', note: 'Les Blancs gardent le pion en plus.' },
          { san: 'bxc6', note: 'Colonnes ouvertes et avance de développement pour les Noirs.' },
          { san: 'Be2', note: 'Le fou se replie ; les Noirs ont une compensation reconnue.' }
        ]
      },
      {
        title: 'Le piège du Foie frit (Fried Liver)', place: '5...Cxd5?! 6.Cxf7!? Rxf7 7.Df3+',
        intro: "ATTENTION : 5...Cxd5 est tentant mais permet le célèbre Foie frit : 6.Cxf7 ! Le roi noir est traîné dehors. À connaître pour ne JAMAIS tomber dedans (et pour le tenter).",
        line: [
          { san: 'e4' }, { san: 'e5' }, { san: 'Nf3' }, { san: 'Nc6' }, { san: 'Bc4' }, { san: 'Nf6' },
          { san: 'Ng5' }, { san: 'd5' }, { san: 'exd5' },
          { san: 'Nxd5', note: 'Reprendre avec le cavalier est risqué !' },
          { san: 'Nxf7', note: 'Le sacrifice du Foie frit : on déloge le roi noir.' },
          { san: 'Kxf7', note: 'Forcé.' },
          { san: 'Qf3+', note: 'Double attaque : échec au roi et clouage sur le cavalier d5.' }
        ]
      },
      {
        title: 'Le Contre-gambit Traxler', place: '4.Cg5 Fc5!? 5.Fxf7+ Re7',
        intro: "Le Traxler : au lieu de 4...d5, les Noirs jouent 4...Fc5 !? et offrent f7 en retour, visant un mat sauvage. La réponse la plus saine est 5.Fxf7+ (et non 5.Cxf7 ?!).",
        line: [
          { san: 'e4' }, { san: 'e5' }, { san: 'Nf3' }, { san: 'Nc6' }, { san: 'Bc4' }, { san: 'Nf6' },
          { san: 'Ng5' },
          { san: 'Bc5', note: 'Le Contre-gambit Traxler : du tac au tac, on vise f2.' },
          { san: 'Bxf7+', note: "La réfutation de principe : on prend f7 sans s'aventurer." },
          { san: 'Ke7', note: 'Le roi noir reste au centre ; partie déséquilibrée mais saine pour les Blancs.' }
        ]
      }
    ]
  },
  {
    id: 'espagnole', name: "L'Espagnole", eco: 'C60', icon: '🏰',
    cover: '#7d9bb8', dark: '#5d7c98', side: 'white',
    tagline: 'La Ruy Lopez, reine des ouvertures',
    steps: [
      {
        title: 'La pression sur c6', place: '1.e4 e5 2.Cf3 Cc6 3.Fb5',
        intro: 'Au lieu de viser f7, le fou attaque le cavalier c6, défenseur du pion e5. Une pression à long terme, très stratégique.',
        line: [
          { san: 'e4' }, { san: 'e5' }, { san: 'Nf3' }, { san: 'Nc6' },
          { san: 'Bb5', note: 'Le fou attaque le défenseur de e5.' }
        ]
      },
      {
        title: 'La défense Morphy', place: '3...a6 4.Fa4 Cf6 5.O-O Fe7 6.Te1',
        intro: "3...a6 demande au fou de se décider. Il recule en a4, les Blancs roquent et jouent Te1 pour soutenir e4 avant c3 + d4. C'est l'épine dorsale de l'Espagnole.",
        line: [
          { san: 'e4' }, { san: 'e5' }, { san: 'Nf3' }, { san: 'Nc6' }, { san: 'Bb5' },
          { san: 'a6', note: 'On chasse le fou : la défense Morphy.' },
          { san: 'Ba4', note: 'Le fou garde le clouage le long de la diagonale.' },
          { san: 'Nf6', note: 'Les Noirs attaquent e4.' },
          { san: 'O-O', note: 'Roi en sécurité ; e4 est offert temporairement.' },
          { san: 'Be7', note: 'Développement solide.' },
          { san: 'Re1', note: 'On surprotège e4 et on prépare c3 puis d4.' }
        ]
      },
      {
        title: 'La variante fermée', place: '...6.Te1 b5 7.Fb3 d6 8.c3 O-O 9.h3',
        intro: "Le cœur de l'Espagnole : les Noirs jouent ...b5, ...d6, ...O-O et préparent ...Ca5 ou ...Cd7. 9.h3 empêche ...Fg4. S'ensuit une longue bataille de manœuvre typique des grands matchs.",
        line: [
          { san: 'e4' }, { san: 'e5' }, { san: 'Nf3' }, { san: 'Nc6' }, { san: 'Bb5' }, { san: 'a6' },
          { san: 'Ba4' }, { san: 'Nf6' }, { san: 'O-O' }, { san: 'Be7' }, { san: 'Re1' },
          { san: 'b5', note: 'On chasse définitivement le fou.' },
          { san: 'Bb3' }, { san: 'd6', note: 'On soutient e5.' }, { san: 'c3' },
          { san: 'O-O' }, { san: 'h3', note: 'Coup prophylactique clé : on empêche ...Fg4.' }
        ]
      },
      {
        title: 'La défense Berlin (le « Mur »)', place: '3...Cf6 4.O-O Cxe4 5.d4 ... finale',
        intro: "La Berlin a rendu l'Espagnole moins mortelle : les Noirs échangent les dames très tôt et visent une finale ultra-solide. C'est l'arme de Kramnik contre Kasparov en 2000.",
        line: [
          { san: 'e4' }, { san: 'e5' }, { san: 'Nf3' }, { san: 'Nc6' }, { san: 'Bb5' },
          { san: 'Nf6', note: 'La défense Berlin.' },
          { san: 'O-O' },
          { san: 'Nxe4', note: 'Les Noirs croquent e4.' },
          { san: 'd4', note: 'On ouvre le centre pour exploiter le retard noir.' },
          { san: 'Nd6' }, { san: 'Bxc6' }, { san: 'dxc6' }, { san: 'dxe5' },
          { san: 'Nf5', note: 'Le cavalier rejoint le jeu.' },
          { san: 'Qxd8+' }, { san: 'Kxd8', note: 'La fameuse finale Berlin : roi décentralisé mais position très tenace.' }
        ]
      },
      {
        title: "L'attaque Marshall", place: '...8.c3 d5!? — un gambit célèbre',
        intro: "Dans la variante fermée, les Noirs peuvent lancer le Gambit Marshall : ...d5 ! sacrifie un pion pour une attaque féroce sur le roi blanc. Beaucoup de Blancs l'évitent carrément.",
        line: [
          { san: 'e4' }, { san: 'e5' }, { san: 'Nf3' }, { san: 'Nc6' }, { san: 'Bb5' }, { san: 'a6' },
          { san: 'Ba4' }, { san: 'Nf6' }, { san: 'O-O' }, { san: 'Be7' }, { san: 'Re1' },
          { san: 'b5' }, { san: 'Bb3' }, { san: 'O-O' }, { san: 'c3' },
          { san: 'd5', note: 'Le Gambit Marshall ! On ouvre tout pour attaquer.' },
          { san: 'exd5' }, { san: 'Nxd5' }, { san: 'Nxe5' }, { san: 'Nxe5' },
          { san: 'Rxe5' }, { san: 'c6', note: 'Les Noirs vont jouer ...Fd6, ...Dh4 avec une attaque très dangereuse.' }
        ]
      }
    ]
  },
  {
    id: 'sicilienne', name: 'La Sicilienne', eco: 'B20', icon: '🗡️',
    cover: '#8aab8a', dark: '#6a8c6a', side: 'black',
    tagline: "L'arme noire la plus combative",
    steps: [
      {
        title: 'Pourquoi 1...c5 ?', place: '1.e4 c5',
        intro: "Les Noirs refusent la symétrie. Le pion c5 contrôle d4 et prépare une contre-attaque sur l'aile dame, là où les Blancs sont plus exposés. C'est l'ouverture la plus jouée au monde.",
        line: [
          { san: 'e4' },
          { san: 'c5', note: 'La Sicilienne : déséquilibre immédiat.' }
        ]
      },
      {
        title: 'La Sicilienne ouverte', place: '2.Cf3 d6 3.d4 cxd4 4.Cxd4 Cf6 5.Cc3',
        intro: 'Les Blancs ouvrent le centre. Les Noirs obtiennent une colonne c semi-ouverte et un jeu très dynamique. Position de départ de la plupart des grandes variantes.',
        line: [
          { san: 'e4' }, { san: 'c5' }, { san: 'Nf3' }, { san: 'd6' }, { san: 'd4' },
          { san: 'cxd4', note: 'On échange le pion c contre le pion d central.' },
          { san: 'Nxd4' },
          { san: 'Nf6', note: 'On attaque e4.' },
          { san: 'Nc3', note: 'On défend e4 ; position de base de la Sicilienne ouverte.' }
        ]
      },
      {
        title: 'La Najdorf', place: '5...a6',
        intro: "Le coup le plus célèbre : 5...a6 contrôle b5 et prépare ...e5 ou ...e6 avec souplesse. L'arme de Fischer et Kasparov, considérée comme l'une des meilleures défenses des Noirs.",
        line: [
          { san: 'e4' }, { san: 'c5' }, { san: 'Nf3' }, { san: 'd6' }, { san: 'd4' },
          { san: 'cxd4' }, { san: 'Nxd4' }, { san: 'Nf6' }, { san: 'Nc3' },
          { san: 'a6', note: 'La variante Najdorf : flexible et ambitieuse.' }
        ]
      },
      {
        title: 'La variante Dragon', place: '5...g6 6.Fe3 Fg7 7.f3 O-O 8.Dd2 Cc6',
        intro: "Le fou noir se fianchette en g7 et tire le long de la grande diagonale comme un dragon qui crache du feu. Les Blancs répliquent par l'attaque Yougoslave (f3, Dd2, O-O-O, h4-h5).",
        line: [
          { san: 'e4' }, { san: 'c5' }, { san: 'Nf3' }, { san: 'd6' }, { san: 'd4' },
          { san: 'cxd4' }, { san: 'Nxd4' }, { san: 'Nf6' }, { san: 'Nc3' },
          { san: 'g6', note: 'On prépare le fianchetto : la Dragon.' },
          { san: 'Be3' },
          { san: 'Bg7', note: 'Le dragon est en place sur la grande diagonale.' },
          { san: 'f3', note: 'Les Blancs préparent Dd2, O-O-O et la tempête h4-h5.' },
          { san: 'O-O' },
          { san: 'Nc6', note: 'Les deux camps vont attaquer le roi adverse à toute vitesse.' }
        ]
      },
      {
        title: 'La Sveshnikov', place: '...4.Cxd4 Cf6 5.Cc3 e5 6.Cdb5 d6 7.Fg5',
        intro: "Une approche moderne et très théorique : ...e5 chasse le cavalier et accepte un trou en d5 contre un jeu de pièces très actif. Adoubée par Kramnik, Carlsen, Radjabov.",
        line: [
          { san: 'e4' }, { san: 'c5' }, { san: 'Nf3' }, { san: 'Nc6' }, { san: 'd4' },
          { san: 'cxd4' }, { san: 'Nxd4' }, { san: 'Nf6' }, { san: 'Nc3' },
          { san: 'e5', note: 'La Sveshnikov : on chasse le cavalier d4.' },
          { san: 'Ndb5', note: 'Le cavalier saute vers d6/a3.' },
          { san: 'd6', note: 'On contrôle d6 et on assume le trou en d5.' },
          { san: 'Bg5', note: 'On presse f6/d5 ; jeu très concret pour les deux camps.' }
        ]
      },
      {
        title: "L'anti-Sicilienne Alapin", place: '2.c3 Cf6 3.e5 Cd5 4.d4 cxd4 5.Cf3',
        intro: "Beaucoup de Blancs évitent l'ouverte avec 2.c3, préparant d4 sans échanger en d4. Réponse fiable : 2...Cf6 attaque e5, puis on harcèle le centre. À connaître absolument.",
        line: [
          { san: 'e4' }, { san: 'c5' },
          { san: 'c3', note: "L'Alapin : les Blancs veulent un gros centre c3-d4." },
          { san: 'Nf6', note: 'On attaque e4 tout de suite.' },
          { san: 'e5', note: 'Le pion avance...' },
          { san: 'Nd5', note: '...et le cavalier saute sur une belle case.' },
          { san: 'd4' },
          { san: 'cxd4', note: 'On garde la tension sur le centre.' },
          { san: 'Nf3', note: 'Jeu équilibré ; les Noirs joueront ...e6, ...d6, ...Cc6.' }
        ]
      }
    ]
  },
  {
    id: 'francaise', name: 'La Française', eco: 'C00', icon: '🥖',
    cover: '#c2728f', dark: '#9c5070', side: 'black',
    tagline: 'Solide comme un roc',
    steps: [
      {
        title: 'Le plan des Noirs', place: '1.e4 e6 2.d4 d5',
        intro: 'Les Noirs construisent une chaîne de pions et contestent le centre avec ...d5. Seul souci : le fou de cases blanches, souvent enfermé — tout le plan noir tournera autour de lui.',
        line: [
          { san: 'e4' },
          { san: 'e6', note: 'On prépare ...d5 en soutien.' },
          { san: 'd4' },
          { san: 'd5', note: 'On frappe le centre blanc.' }
        ]
      },
      {
        title: "La variante d'avance", place: '3.e5 c5 4.c3 Cc6',
        intro: "Les Blancs ferment le centre avec 3.e5 et gagnent de l'espace. Les Noirs ripostent aussitôt à la base de la chaîne avec ...c5, puis assiègent d4.",
        line: [
          { san: 'e4' }, { san: 'e6' }, { san: 'd4' }, { san: 'd5' },
          { san: 'e5', note: "Le centre se ferme ; les Blancs ont de l'espace." },
          { san: 'c5', note: 'On attaque la base de la chaîne (d4).' },
          { san: 'c3', note: 'Les Blancs soutiennent d4.' },
          { san: 'Nc6', note: 'On augmente la pression sur d4 ; suivra ...Db6.' }
        ]
      },
      {
        title: "La variante d'échange", place: '3.exd5 exd5',
        intro: "3.exd5 ouvre la position et libère justement le fameux fou de cases blanches noir. Symétrique, mais loin d'être nulle d'office : à jouer pour gagner.",
        line: [
          { san: 'e4' }, { san: 'e6' }, { san: 'd4' }, { san: 'd5' },
          { san: 'exd5', note: 'Les Blancs clarifient le centre.' },
          { san: 'exd5', note: 'La structure devient symétrique mais le jeu reste ouvert.' }
        ]
      },
      {
        title: 'La Tarrasch 3.Cd2', place: '3.Cd2 c5 4.exd5 exd5 5.Cgf3 Cc6',
        intro: "3.Cd2 évite le clouage ...Fb4 de la Winawer. Les Noirs frappent au centre avec ...c5 et obtiennent un jeu de pièces libre malgré un éventuel pion isolé.",
        line: [
          { san: 'e4' }, { san: 'e6' }, { san: 'd4' }, { san: 'd5' },
          { san: 'Nd2', note: 'La Tarrasch : flexible et sans clouage.' },
          { san: 'c5', note: 'On frappe le centre immédiatement.' },
          { san: 'exd5' }, { san: 'exd5' },
          { san: 'Ngf3' }, { san: 'Nc6', note: 'Développement naturel ; pièces actives pour les Noirs.' }
        ]
      },
      {
        title: 'La Classique Steinitz', place: '3.Cc3 Cf6 4.e5 Cfd7 5.f4 c5',
        intro: "3.Cc3 Cf6 invite 4.e5 : le cavalier f6 est repoussé en d7 et les Blancs gagnent de l'espace. Les Noirs contre-attaquent classiquement la base d4 avec ...c5 et ...Cc6.",
        line: [
          { san: 'e4' }, { san: 'e6' }, { san: 'd4' }, { san: 'd5' },
          { san: 'Nc3' }, { san: 'Nf6' },
          { san: 'e5', note: 'On repousse le cavalier et on prend l\'espace.' },
          { san: 'Nfd7', note: 'Le cavalier se replie pour soutenir ...c5.' },
          { san: 'f4', note: 'Les Blancs renforcent leur centre e5.' },
          { san: 'c5', note: 'On attaque immédiatement la base d4.' }
        ]
      },
      {
        title: 'La Winawer 3.Cc3 Fb4', place: '3.Cc3 Fb4 4.e5 c5 5.a3 Fxc3+ 6.bxc3',
        intro: "La variante la plus mordante : ...Fb4 cloue le cavalier c3. Après l'échange, les Blancs ont la paire de fous et un centre, les Noirs visent les pions doublés c3-c2. Déséquilibre total.",
        line: [
          { san: 'e4' }, { san: 'e6' }, { san: 'd4' }, { san: 'd5' },
          { san: 'Nc3' },
          { san: 'Bb4', note: 'La Winawer : on cloue le cavalier c3.' },
          { san: 'e5', note: 'Le centre se ferme.' },
          { san: 'c5', note: 'Contre-attaque à la base.' },
          { san: 'a3', note: 'On somme le fou de s\'expliquer.' },
          { san: 'Bxc3+' },
          { san: 'bxc3', note: 'Paire de fous contre pions doublés : la grande bataille Winawer.' }
        ]
      }
    ]
  },
  {
    id: 'carokann', name: 'La Caro-Kann', eco: 'B10', icon: '🛡️',
    cover: '#6e8c9c', dark: '#506a78', side: 'black',
    tagline: 'Aussi solide que la Française, sans le mauvais fou',
    steps: [
      {
        title: "L'idée de 1...c6", place: '1.e4 c6 2.d4 d5',
        intro: "Comme la Française, on prépare ...d5 — mais en gardant la diagonale du fou de cases blanches LIBRE. C'est sa grande force : une structure solide sans pièce enfermée.",
        line: [
          { san: 'e4' },
          { san: 'c6', note: 'On prépare ...d5 sans bloquer le fou c8.' },
          { san: 'd4' },
          { san: 'd5', note: 'On conteste le centre.' }
        ]
      },
      {
        title: 'La variante classique', place: '3.Cc3 dxe4 4.Cxe4 Ff5 5.Cg3 Fg6',
        intro: "Les Noirs sortent justement leur fou en f5 AVANT de jouer ...e6 : c'est tout l'intérêt de la Caro. Position saine, sans faiblesse, parfaite pour jouer solide.",
        line: [
          { san: 'e4' }, { san: 'c6' }, { san: 'd4' }, { san: 'd5' },
          { san: 'Nc3' },
          { san: 'dxe4', note: 'On échange au centre.' },
          { san: 'Nxe4' },
          { san: 'Bf5', note: 'Le bon fou sort librement : impossible en Française !' },
          { san: 'Ng3' },
          { san: 'Bg6', note: 'Le fou recule sur une case sûre ; suivra ...e6, ...Cd7, ...Cgf6.' }
        ]
      },
      {
        title: 'La variante Karpov 4...Cd7', place: '3.Cc3 dxe4 4.Cxe4 Cd7',
        intro: "Le choix d'élite de Karpov : 4...Cd7 prépare ...Cgf6 sans permettre aux Blancs d'abîmer la structure par Cxf6+. Solidité maximale, mais demande de la précision.",
        line: [
          { san: 'e4' }, { san: 'c6' }, { san: 'd4' }, { san: 'd5' },
          { san: 'Nc3' }, { san: 'dxe4' }, { san: 'Nxe4' },
          { san: 'Nd7', note: 'On prépare ...Cgf6 en évitant les pions doublés.' }
        ]
      },
      {
        title: "La variante d'avance", place: '3.e5 Ff5 4.Cf3 e6',
        intro: "3.e5 ferme le centre comme en Française... mais encore une fois le fou c8 sort d'abord en f5. Les Noirs sont parfaitement confortables.",
        line: [
          { san: 'e4' }, { san: 'c6' }, { san: 'd4' }, { san: 'd5' },
          { san: 'e5', note: 'Le centre se ferme.' },
          { san: 'Bf5', note: 'Le fou sort AVANT de jouer ...e6.' },
          { san: 'Nf3' },
          { san: 'e6', note: 'Maintenant on peut fermer : le fou est déjà dehors.' }
        ]
      },
      {
        title: "L'attaque Panov", place: '3.exd5 cxd5 4.c4 Cf6 5.Cc3',
        intro: "L'option la plus agressive des Blancs : 4.c4 crée un pion dame isolé contre lequel les Noirs jouent. Structures dynamiques proches du Gambit Dame.",
        line: [
          { san: 'e4' }, { san: 'c6' }, { san: 'd4' }, { san: 'd5' },
          { san: 'exd5' }, { san: 'cxd5' },
          { san: 'c4', note: "L'attaque Panov : on attaque d5 et on vise un jeu ouvert." },
          { san: 'Nf6' },
          { san: 'Nc3', note: 'Les Noirs joueront ...e6, ...Fe7, ...O-O en bloquant le pion isolé.' }
        ]
      }
    ]
  },
  {
    id: 'scandinave', name: 'La Scandinave', eco: 'B01', icon: '❄️',
    cover: '#8aa0c2', dark: '#6a7e9c', side: 'black',
    tagline: 'Frappe le centre dès le premier coup',
    steps: [
      {
        title: '1.e4 d5 — le défi immédiat', place: '1.e4 d5 2.exd5 Dxd5 3.Cc3 Da5',
        intro: "Dès le 1er coup, les Noirs défient e4. Après 2.exd5 Dxd5, la dame est chassée par 3.Cc3 mais se replace activement en a5. Ouverture facile à apprendre et très solide.",
        line: [
          { san: 'e4' },
          { san: 'd5', note: 'On attaque e4 sans préparation.' },
          { san: 'exd5' },
          { san: 'Qxd5', note: 'On reprend avec la dame.' },
          { san: 'Nc3', note: 'Les Blancs gagnent un tempo en attaquant la dame.' },
          { san: 'Qa5', note: 'La dame se met en sécurité tout en restant active.' }
        ]
      },
      {
        title: 'Le développement harmonieux', place: '4.d4 Cf6 5.Cf3 c6',
        intro: "Le plan noir est simple et naturel : ...Cf6, ...c6 (case de fuite pour la dame), ...Ff5 ou ...Fg4, ...e6, puis roque. Un système facile à rejouer dans toutes les parties.",
        line: [
          { san: 'e4' }, { san: 'd5' }, { san: 'exd5' }, { san: 'Qxd5' }, { san: 'Nc3' }, { san: 'Qa5' },
          { san: 'd4' },
          { san: 'Nf6', note: 'Développement et contrôle de e4.' },
          { san: 'Nf3' },
          { san: 'c6', note: 'Clé : on ménage la case c7/b6 pour la dame et on solidifie.' }
        ]
      },
      {
        title: 'La variante moderne 2...Cf6', place: '2...Cf6 3.d4 Cxd5',
        intro: "Pour éviter de sortir la dame, on peut reprendre d5 avec le cavalier. 2...Cf6 prépare 3...Cxd5 : le cavalier occupe le centre, jeu plus moderne et flexible.",
        line: [
          { san: 'e4' }, { san: 'd5' }, { san: 'exd5' },
          { san: 'Nf6', note: 'On retarde la reprise pour éviter de sortir la dame.' },
          { san: 'd4' },
          { san: 'Nxd5', note: 'Le cavalier reprend et se centralise ; suivra ...g6 ou ...Ff5.' }
        ]
      },
      {
        title: 'Le Gambit portugais', place: '2...Cf6 3.d4 Fg4!?',
        intro: "Très ambitieux : au lieu de reprendre d5 tout de suite, les Noirs sortent le fou en g4 et offrent même un pion pour une grosse avance de développement. Piégeux et amusant.",
        line: [
          { san: 'e4' }, { san: 'd5' }, { san: 'exd5' },
          { san: 'Nf6' }, { san: 'd4' },
          { san: 'Bg4', note: 'Le Gambit portugais : développement avant tout, on récupérera d5 plus tard.' }
        ]
      }
    ]
  },
  {
    id: 'estindienne', name: "L'Est-Indienne", eco: 'E60', icon: '🐯',
    cover: '#c98a3c', dark: '#a06a28', side: 'black',
    tagline: 'Laisse le centre aux Blancs… pour mieux le détruire',
    steps: [
      {
        title: 'La configuration hypermoderne', place: '1.d4 Cf6 2.c4 g6 3.Cc3 Fg7 4.e4 d6',
        intro: "Idée hypermoderne : les Noirs laissent les Blancs bâtir un gros centre, puis l'attaqueront avec ...e5 ou ...c5 et le fou g7. Une des défenses les plus combatives contre 1.d4.",
        line: [
          { san: 'd4' }, { san: 'Nf6' }, { san: 'c4' },
          { san: 'g6', note: 'On prépare le fianchetto.' },
          { san: 'Nc3' },
          { san: 'Bg7', note: 'Le fou vise le grand centre blanc.' },
          { san: 'e4', note: 'Les Blancs acceptent de prendre tout le centre.' },
          { san: 'd6', note: 'On prépare le coup de levier ...e5.' }
        ]
      },
      {
        title: 'La variante classique', place: '5.Cf3 O-O 6.Fe2 e5',
        intro: "Le plan vedette : ...e5 ! frappe le centre. Si 7.O-O, les Noirs verrouillent par ...Cc6, ...Ce7 et lancent la tempête ...f5-f4-g5 contre le roi blanc.",
        line: [
          { san: 'd4' }, { san: 'Nf6' }, { san: 'c4' }, { san: 'g6' }, { san: 'Nc3' }, { san: 'Bg7' },
          { san: 'e4' }, { san: 'd6' }, { san: 'Nf3' },
          { san: 'O-O', note: 'Roi en sécurité.' },
          { san: 'Be2' },
          { san: 'e5', note: 'Le coup clé : on défie le centre blanc.' }
        ]
      },
      {
        title: "L'attaque à l'aile roi", place: '7.O-O Cc6 8.d5 Ce7',
        intro: "Après 8.d5, le centre se ferme et chacun attaque de son côté : les Blancs à l'aile dame (c5), les Noirs à l'aile roi avec ...Cd7, ...f5, ...f4, ...g5. Course de vitesse classique.",
        line: [
          { san: 'd4' }, { san: 'Nf6' }, { san: 'c4' }, { san: 'g6' }, { san: 'Nc3' }, { san: 'Bg7' },
          { san: 'e4' }, { san: 'd6' }, { san: 'Nf3' }, { san: 'O-O' }, { san: 'Be2' }, { san: 'e5' },
          { san: 'O-O' },
          { san: 'Nc6', note: 'On presse d4.' },
          { san: 'd5', note: 'Le centre se ferme : signal de la course aux deux ailes.' },
          { san: 'Ne7', note: 'Le cavalier file vers g6/f5 pour l\'attaque ...f5.' }
        ]
      }
    ]
  },
  {
    id: 'gambitdame', name: 'Le Gambit Dame', eco: 'D06', icon: '👑',
    cover: '#e0a83c', dark: '#b9852a', side: 'white',
    tagline: 'Le grand classique positionnel du 1.d4',
    steps: [
      {
        title: "L'idée du gambit", place: '1.d4 d5 2.c4',
        intro: "Les Blancs offrent le pion c4 pour détourner le pion d5 et dominer le centre. Ce n'est pas un vrai sacrifice : le pion se récupère presque toujours.",
        line: [
          { san: 'd4' }, { san: 'd5' },
          { san: 'c4', note: 'On attaque d5 pour dégager le centre.' }
        ]
      },
      {
        title: 'Le Gambit Dame refusé', place: '2...e6 3.Cc3 Cf6 4.Fg5',
        intro: "2...e6 garde le pion d5 solidement. 4.Fg5 cloue le cavalier f6 et augmente la pression sur d5. L'une des défenses les plus sûres, jouée dans d'innombrables championnats du monde.",
        line: [
          { san: 'd4' }, { san: 'd5' }, { san: 'c4' },
          { san: 'e6', note: 'Les Noirs refusent le gambit et soutiennent d5.' },
          { san: 'Nc3' }, { san: 'Nf6' },
          { san: 'Bg5', note: 'Clouage classique : on presse d5 via le cavalier f6.' }
        ]
      },
      {
        title: 'Le Gambit Dame accepté', place: '2...dxc4 3.e3 Cf6 4.Fxc4',
        intro: '2...dxc4 prend le pion. Les Noirs ne pourront pas le garder : 3.e3 prépare Fxc4 et les Blancs obtiennent un beau centre mobile.',
        line: [
          { san: 'd4' }, { san: 'd5' }, { san: 'c4' },
          { san: 'dxc4', note: 'On accepte le pion — mais on ne le gardera pas.' },
          { san: 'e3', note: 'On prépare Fxc4.' },
          { san: 'Nf6' },
          { san: 'Bxc4', note: 'Le pion est récupéré ; centre idéal pour les Blancs.' }
        ]
      },
      {
        title: 'La défense Slave', place: '2...c6 3.Cf3 Cf6 4.Cc3 dxc4',
        intro: "2...c6 soutient d5 sans enfermer le fou c8 (au contraire de 2...e6). Très solide : les Noirs peuvent prendre en c4 plus tard et développer le fou en f5 ou g4.",
        line: [
          { san: 'd4' }, { san: 'd5' }, { san: 'c4' },
          { san: 'c6', note: 'La Slave : on soutient d5 en gardant le fou c8 libre.' },
          { san: 'Nf3' }, { san: 'Nf6' }, { san: 'Nc3' },
          { san: 'dxc4', note: 'Maintenant on prend, en préparant ...Ff5 et ...b5.' }
        ]
      },
      {
        title: 'La défense Tarrasch', place: '2...e6 3.Cc3 c5 4.cxd5 exd5 5.Cf3 Cc6',
        intro: "Les Noirs acceptent un pion dame isolé en échange d'un jeu de pièces très actif et libre. Une défense énergique recommandée par Tarrasch puis Kasparov.",
        line: [
          { san: 'd4' }, { san: 'd5' }, { san: 'c4' }, { san: 'e6' }, { san: 'Nc3' },
          { san: 'c5', note: 'La Tarrasch : on frappe le centre, quitte à avoir un pion isolé.' },
          { san: 'cxd5' }, { san: 'exd5' }, { san: 'Nf3' },
          { san: 'Nc6', note: 'Pièces actives : le pion isolé d5 est dynamique, pas faible.' }
        ]
      }
    ]
  },
  {
    id: 'anglaise', name: "L'Anglaise", eco: 'A10', icon: '🎩',
    cover: '#7c9c7c', dark: '#5c7c5c', side: 'white',
    tagline: 'Le flanc tranquille mais venimeux : 1.c4',
    steps: [
      {
        title: 'Le coup de flanc 1.c4', place: '1.c4 e5 2.Cc3 Cf6',
        intro: "1.c4 contrôle d5 depuis le flanc. Après 1...e5, on obtient une « Sicilienne inversée » avec un tempo de plus : flexible, riche en plans, difficile à attaquer.",
        line: [
          { san: 'c4', note: 'On contrôle d5 sans engager le centre.' },
          { san: 'e5', note: 'Les Noirs prennent leur part du centre.' },
          { san: 'Nc3' },
          { san: 'Nf6', note: 'Position de Sicilienne avec les couleurs inversées.' }
        ]
      },
      {
        title: 'Le grand fianchetto', place: '2...Cf6 3.g3 d5 4.cxd5 Cxd5 5.Fg2',
        intro: "Le plan signature de l'Anglaise : Fg2 sur la grande diagonale. On vise le centre et l'aile dame de loin, à la manière hypermoderne. Setup ultra-solide et polyvalent.",
        line: [
          { san: 'c4' }, { san: 'e5' }, { san: 'Nc3' }, { san: 'Nf6' },
          { san: 'g3', note: 'On prépare le fianchetto du roi.' },
          { san: 'd5' }, { san: 'cxd5' }, { san: 'Nxd5' },
          { san: 'Bg2', note: 'Le fou rayonne sur la grande diagonale a8-h1.' }
        ]
      },
      {
        title: "L'Anglaise symétrique", place: '1.c4 c5 2.Cf3 Cc6 3.Cc3',
        intro: "Si les Noirs imitent (1...c5), on obtient une structure symétrique très équilibrée mais pleine de nuances. Les Blancs jouent souvent g3, Fg2, et cherchent la poussée d4 au bon moment.",
        line: [
          { san: 'c4' },
          { san: 'c5', note: 'Les Noirs jouent symétriquement.' },
          { san: 'Nf3' }, { san: 'Nc6' },
          { san: 'Nc3', note: 'On développe ; suivra g3, Fg2, O-O, et d4 au moment opportun.' }
        ]
      }
    ]
  },
  {
    id: 'londres', name: 'Le Système Londres', eco: 'D02', icon: '🌆',
    cover: '#9a8aab', dark: '#776a87', side: 'white',
    tagline: 'Un plan facile à rejouer dans toutes tes parties',
    steps: [
      {
        title: 'La configuration Londres', place: '1.d4 d5 2.Ff4',
        intro: "Le Londres, c'est un SYSTÈME : presque toujours les mêmes coups (d4, Ff4, e3, Cf3, c3, Fd3, Cbd2). Parfait quand on ne veut pas mémoriser des tonnes de théorie.",
        line: [
          { san: 'd4' }, { san: 'd5' },
          { san: 'Bf4', note: 'Le fou sort AVANT de jouer e3 : c\'est la clé du Londres.' }
        ]
      },
      {
        title: 'Le développement type', place: '2...Cf6 3.e3 e6 4.Cf3 c5 5.c3 Cc6 6.Cbd2 Fd6 7.Fg3',
        intro: "Voici le plan complet à connaître par cœur. On bâtit une structure en triangle e3-d4-c3, on développe simplement, et on vise une attaque sur le roi avec Ce5, f4, Df3-h3.",
        line: [
          { san: 'd4' }, { san: 'd5' }, { san: 'Bf4' },
          { san: 'Nf6' }, { san: 'e3', note: 'On soutient d4 et on ouvre la route au fou f1.' },
          { san: 'e6' }, { san: 'Nf3' }, { san: 'c5' },
          { san: 'c3', note: 'Le triangle de pions est en place.' },
          { san: 'Nc6' },
          { san: 'Nbd2', note: 'Le cavalier vise e5 et f3.' },
          { san: 'Bd6' },
          { san: 'Bg3', note: 'On échange ou on garde le bon fou ; setup idéal atteint.' }
        ]
      },
      {
        title: 'Gérer le coup ...Db6', place: '...4.Cf3 c5 5.Cc3 Db6',
        intro: "Le piège typique : ...Db6 attaque le pion b2. Au lieu de le défendre passivement, 5.Cc3 ! laisse b2 et mise sur le développement (après Dxb2, Cb5 piège la dame). À retenir.",
        line: [
          { san: 'd4' }, { san: 'd5' }, { san: 'Bf4' }, { san: 'Nf6' }, { san: 'e3' },
          { san: 'e6' }, { san: 'Nf3' }, { san: 'c5' },
          { san: 'Nc3', note: 'On développe et on ignore (presque) b2.' },
          { san: 'Qb6', note: 'La dame lorgne b2 — mais Cb5 ! la mettrait en danger après Dxb2.' }
        ]
      },
      {
        title: 'Contre le fianchetto ...g6', place: '1.d4 Cf6 2.Ff4 g6 3.Cc3 d5 4.e3 Fg7',
        intro: "Si les Noirs fianchettent (style Est-Indienne), le Londres tient parfaitement : on garde le même plan, et on peut même viser Cb5 ou Dd2-Fh6 pour échanger le fou g7.",
        line: [
          { san: 'd4' }, { san: 'Nf6' }, { san: 'Bf4' },
          { san: 'g6', note: 'Les Noirs visent un fianchetto.' },
          { san: 'Nc3', note: 'On presse d5 et on garde la case b5 en vue.' },
          { san: 'd5' }, { san: 'e3' },
          { san: 'Bg7', note: 'Le Londres reste solide ; plan : Fe2/Fd3, O-O, h3, Ce5.' }
        ]
      }
    ]
  }
]
