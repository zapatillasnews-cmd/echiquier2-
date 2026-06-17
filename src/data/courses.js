// Cours d'ouvertures : chaque cours = une ouverture, chaque etape = une ligne
// theorique (suite de coups en SAN anglais pour chess.js) avec des notes.
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
        title: 'Le Giuoco Piano', place: '3...Fc5 4.c3 Cf6 5.d3',
        intro: '« Le jeu tranquille » : les deux camps se développent calmement. Le coup c3 prépare la poussée d4 pour bâtir un gros centre.',
        line: [
          { san: 'e4' }, { san: 'e5' }, { san: 'Nf3' }, { san: 'Nc6' }, { san: 'Bc4' },
          { san: 'Bc5', note: 'Le fou noir occupe la diagonale opposée.' },
          { san: 'c3', note: 'On prépare d4 et on ménage une case de repli au fou.' },
          { san: 'Nf6', note: 'Les Noirs développent et attaquent e4.' },
          { san: 'd3', note: "On défend e4 solidement avant d'envisager d4." }
        ]
      },
      {
        title: 'Attaque des deux cavaliers', place: '3...Cf6 4.Cg5 d5 5.exd5',
        intro: 'Si les Noirs jouent 3...Cf6, le coup agressif 4.Cg5 attaque immédiatement f7. Très tranchant : à connaître des deux côtés !',
        line: [
          { san: 'e4' }, { san: 'e5' }, { san: 'Nf3' }, { san: 'Nc6' }, { san: 'Bc4' },
          { san: 'Nf6', note: 'La Défense des deux cavaliers.' },
          { san: 'Ng5', note: 'Double attaque sur f7 avec le fou c4.' },
          { san: 'd5', note: 'Le seul bon coup : les Noirs contre-attaquent au centre.' },
          { san: 'exd5', note: 'On prend, et la grande bataille théorique commence.' }
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
        title: 'La défense Morphy', place: '3...a6 4.Fa4 Cf6 5.O-O',
        intro: "3...a6 demande au fou de se décider. Il recule en a4 pour garder la pression, puis les Blancs roquent et prépareront c3 + d4.",
        line: [
          { san: 'e4' }, { san: 'e5' }, { san: 'Nf3' }, { san: 'Nc6' }, { san: 'Bb5' },
          { san: 'a6', note: 'On chasse le fou : la défense Morphy.' },
          { san: 'Ba4', note: 'Le fou garde le clouage le long de la diagonale.' },
          { san: 'Nf6', note: 'Les Noirs attaquent e4.' },
          { san: 'O-O', note: 'Les Blancs roquent ; e4 est offert temporairement.' }
        ]
      },
      {
        title: "La variante d'échange", place: '3...a6 4.Fxc6 dxc6',
        intro: '4.Fxc6 simplifie : les Blancs cèdent la paire de fous mais abîment la structure noire. Idéal si tu aimes les finales.',
        line: [
          { san: 'e4' }, { san: 'e5' }, { san: 'Nf3' }, { san: 'Nc6' }, { san: 'Bb5' }, { san: 'a6' },
          { san: 'Bxc6', note: 'On échange volontairement le fou...' },
          { san: 'dxc6', note: '...pour donner aux Noirs des pions doublés.' }
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
        intro: "Les Noirs refusent la symétrie. Le pion c5 contrôle d4 et prépare une contre-attaque sur l'aile dame, là où les Blancs sont plus exposés.",
        line: [
          { san: 'e4' },
          { san: 'c5', note: 'La Sicilienne : déséquilibre immédiat.' }
        ]
      },
      {
        title: 'La Sicilienne ouverte', place: '2.Cf3 d6 3.d4 cxd4 4.Cxd4 Cf6 5.Cc3',
        intro: 'Les Blancs ouvrent le centre. Les Noirs obtiennent une colonne c semi-ouverte et un jeu très dynamique.',
        line: [
          { san: 'e4' }, { san: 'c5' }, { san: 'Nf3' }, { san: 'd6' }, { san: 'd4' },
          { san: 'cxd4', note: 'On échange le pion c contre le pion d central.' },
          { san: 'Nxd4' },
          { san: 'Nf6', note: 'On attaque e4.' },
          { san: 'Nc3', note: 'Position de base de la Sicilienne ouverte.' }
        ]
      },
      {
        title: 'La Najdorf', place: '5...a6',
        intro: "Le coup le plus célèbre : 5...a6 contrôle b5 et prépare ...e5 ou ...e6 avec souplesse. L'arme de Fischer et Kasparov.",
        line: [
          { san: 'e4' }, { san: 'c5' }, { san: 'Nf3' }, { san: 'd6' }, { san: 'd4' },
          { san: 'cxd4' }, { san: 'Nxd4' }, { san: 'Nf6' }, { san: 'Nc3' },
          { san: 'a6', note: 'La variante Najdorf : flexible et ambitieuse.' }
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
        intro: 'Les Noirs construisent une chaîne de pions et contestent le centre avec ...d5. Seul souci : le fou de cases blanches, souvent enfermé.',
        line: [
          { san: 'e4' },
          { san: 'e6', note: 'On prépare ...d5 en soutien.' },
          { san: 'd4' },
          { san: 'd5', note: 'On frappe le centre blanc.' }
        ]
      },
      {
        title: "La variante d'avance", place: '3.e5 c5 4.c3 Cc6',
        intro: 'Les Blancs ferment le centre avec 3.e5 et gagnent de l\'espace. Les Noirs ripostent aussitôt à la base de la chaîne avec ...c5.',
        line: [
          { san: 'e4' }, { san: 'e6' }, { san: 'd4' }, { san: 'd5' },
          { san: 'e5', note: "Le centre se ferme ; les Blancs ont de l'espace." },
          { san: 'c5', note: 'On attaque la base de la chaîne (d4).' },
          { san: 'c3', note: 'Les Blancs soutiennent d4.' },
          { san: 'Nc6', note: 'On augmente la pression sur d4.' }
        ]
      },
      {
        title: "La variante d'échange", place: '3.exd5 exd5',
        intro: '3.exd5 ouvre la position et libère justement le fameux fou de cases blanches noir. Symétrique, mais loin d\'être nulle d\'office.',
        line: [
          { san: 'e4' }, { san: 'e6' }, { san: 'd4' }, { san: 'd5' },
          { san: 'exd5', note: 'Les Blancs clarifient le centre.' },
          { san: 'exd5', note: 'La structure devient symétrique mais le jeu reste ouvert.' }
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
        intro: 'Les Blancs offrent le pion c4 pour détourner le pion d5 et dominer le centre. Ce n\'est pas un vrai sacrifice : le pion se récupère presque toujours.',
        line: [
          { san: 'd4' }, { san: 'd5' },
          { san: 'c4', note: 'On attaque d5 pour dégager le centre.' }
        ]
      },
      {
        title: 'Le Gambit Dame refusé', place: '2...e6 3.Cc3 Cf6',
        intro: '2...e6 garde le pion d5 solidement. L\'une des défenses les plus sûres des Noirs, jouée dans d\'innombrables championnats du monde.',
        line: [
          { san: 'd4' }, { san: 'd5' }, { san: 'c4' },
          { san: 'e6', note: 'Les Noirs refusent le gambit et soutiennent d5.' },
          { san: 'Nc3' },
          { san: 'Nf6', note: 'Développement naturel ; la tension reste.' }
        ]
      },
      {
        title: 'Le Gambit Dame accepté', place: '2...dxc4 3.e3 ... Fxc4',
        intro: '2...dxc4 prend le pion. Les Noirs ne pourront pas le garder : les Blancs jouent e3 puis Fxc4 et obtiennent un beau centre.',
        line: [
          { san: 'd4' }, { san: 'd5' }, { san: 'c4' },
          { san: 'dxc4', note: 'On accepte le pion — mais on ne le gardera pas.' },
          { san: 'e3', note: 'On prépare Fxc4.' },
          { san: 'Nf6' },
          { san: 'Bxc4', note: 'Le pion est récupéré ; centre idéal pour les Blancs.' }
        ]
      }
    ]
  }
]
