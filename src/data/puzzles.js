// Problemes curates avec explications en francais.
// solution = liste UCI alternee : coup du joueur, reponse adverse (auto), coup, ...
// Le dernier coup est toujours celui du joueur (mat pour les problemes de mat).
// Cotations realistes facon Lichess : un mat du couloir en 1 coup, c'est ~500,
// pas 900. Les combinaisons forcees montent beaucoup plus haut.
export const PUZZLES = [
  {
    id: 'p1', theme: 'Mat du couloir', rating: 500, mate: true,
    fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
    solution: ['a1a8'],
    explanation: "Ta8# : la tour plonge sur la 8e rangée. Le roi noir est étouffé par ses propres pions f7-g7-h7. C'est LE motif à surveiller dès qu'un roi reste enfermé derrière ses pions."
  },
  {
    id: 'p2', theme: 'Mat de la dame', rating: 600, mate: true,
    fen: '6k1/8/6K1/8/8/8/8/3Q4 w - - 0 1',
    solution: ['d1d8'],
    explanation: "Dd8# : la dame mate sur la 8e rangée pendant que le roi blanc en g6 contrôle f7, g7 et h7. Schéma fondamental dame + roi à connaître par cœur."
  },
  {
    id: 'p3', theme: 'Mat étouffé', rating: 1000, mate: true,
    fen: '6rk/6pp/8/6N1/8/8/8/7K w - - 0 1',
    solution: ['g5f7'],
    explanation: "Cf7# : le mat étouffé. Le roi en h8 est emmuré par sa tour g8 et ses pions ; seul le cavalier peut l'achever. Motif classique, brique de base de combinaisons plus longues."
  },
  {
    id: 'p4', theme: 'Fourchette de cavalier', rating: 1000, mate: false,
    fen: '4k3/8/8/1N1q4/8/8/8/4K3 w - - 0 1',
    solution: ['b5c7'],
    explanation: "Cc7+ : une fourchette royale. Le cavalier attaque le roi en e8 ET la dame en d5. Après le coup de roi forcé, Cxd5 ramasse la dame. Le cavalier est le roi des fourchettes."
  },
  {
    id: 'p5', theme: 'Double attaque', rating: 1100, mate: false,
    fen: 'r5k1/6pp/8/8/8/8/6PP/3Q2K1 w - - 0 1',
    solution: ['d1d5'],
    explanation: "Dd5+ : double attaque sur deux diagonales. La dame fait échec au roi en g8 tout en visant la tour en a8. Le roi doit parer, puis Dxa8 gagne la tour."
  },
  {
    id: 'p6', theme: "Mat de l'escalier", rating: 450, mate: true,
    fen: '7k/1R6/8/8/8/8/8/R6K w - - 0 1',
    solution: ['a1a8'],
    explanation: "Ta8# : les deux tours forment l'escalier. La tour b7 interdit la 7e rangée, l'autre mate sur la 8e. Technique de base pour mater avec deux tours."
  },
  {
    id: 'p7', theme: 'Mat de la dame soutenue', rating: 700, mate: true,
    fen: '7k/8/6K1/8/8/8/8/7Q w - - 0 1',
    solution: ['h1h7'],
    explanation: "Dh7# : la dame mate en h7, protégée par le roi en g6. Le roi noir en h8 n'a aucune case de fuite. Le roi qui soutient la dame, c'est la clé des mats élémentaires."
  },
  {
    id: 'p8', theme: 'Mat avec le fou', rating: 900, mate: true,
    fen: '6k1/8/8/8/3Q4/8/1B4K1/8 w - - 0 1',
    solution: ['d4g7'],
    explanation: "Dg7# : la dame se sacrifie en apparence sur g7, mais elle est protégée par le fou b2 sur la grande diagonale. Le roi en g8 est pris au piège. Dame + fou alignés = mat."
  },
  {
    id: 'p9', theme: 'Fourchette gagnant la dame', rating: 950, mate: false,
    fen: '4k3/8/8/3N3q/8/8/8/4K3 w - - 0 1',
    solution: ['d5f6'],
    explanation: "Cf6+ : le cavalier fait échec au roi e8 et attaque la dame h5 en même temps. Le roi doit parer l'échec, puis Cxh5 gagne la dame. Cherche toujours les sauts de cavalier qui touchent deux pièces."
  },
  {
    id: 'p10', theme: 'Mat de Philidor (étouffé en 2)', rating: 1800, mate: true,
    fen: '5r1k/6pp/7N/8/8/1Q6/8/6K1 w - - 0 1',
    solution: ['b3g8', 'f8g8', 'h6f7'],
    explanation: "La célèbre combinaison de Philidor : 1.Dg8+ !! sacrifie la dame. La tour DOIT prendre (Txg8) car le roi ne peut pas — la dame est protégée par le cavalier. Puis 2.Cf7# : mat étouffé. Une des plus belles combinaisons des échecs."
  },
  {
    id: 'p11', theme: 'Mat tour + roi', rating: 600, mate: true,
    fen: '5k2/8/5K2/8/8/8/8/1R6 w - - 0 1',
    solution: ['b1b8'],
    explanation: "Tb8# : la tour mate sur la 8e rangée pendant que le roi blanc en f6 verrouille toutes les cases de fuite (e7, f7, g7). Le mat élémentaire tour + roi : la tour donne l'échec, le roi enlève l'air."
  }
]

// Positions pour \"Trouve le meilleur coup\" (Stockfish juge ta reponse).
// Du calme positionnel a la tactique tranchante : a toi de trouver le coup du moteur.
export const FIND_BEST_POSITIONS = [
  // Tactiques / mats a trouver
  '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
  '4k3/8/8/1N1q4/8/8/8/4K3 w - - 0 1',
  'r5k1/6pp/8/8/8/8/6PP/3Q2K1 w - - 0 1',
  '5r1k/6pp/7N/8/8/1Q6/8/6K1 w - - 0 1',
  '4k3/8/8/3N3q/8/8/8/4K3 w - - 0 1',
  // Ouvertures / debuts de milieu de jeu riches
  'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1',
  'r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 1',
  'r2q1rk1/ppp2ppp/2np1n2/2b1p1B1/2B1P1b1/2NP1N2/PPP2PPP/R2Q1RK1 w - - 0 1',
  'rnbqkb1r/pp2pppp/3p1n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 1',
  'rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 1',
  'r1bqk2r/2ppbppp/p1n2n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQ1RK1 w kq - 0 1',
  'r1bq1rk1/ppp2ppp/2n2n2/3p4/1b1P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 1',
  // Milieux de jeu tactiques
  'r2q1rk1/pp1bbppp/2np1n2/2p1p3/2B1P3/2NP1N1P/PPP2PP1/R1BQ1RK1 w - - 0 1',
  'r4rk1/pp3ppp/2n1b3/q1pp4/8/P1PP1NP1/1PQ2PBP/R4RK1 w - - 0 1',
  'r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R w KQkq - 0 1',
  // Finales precises
  '8/5pk1/6p1/8/8/6P1/5PK1/3r4 w - - 0 1',
  '8/8/4k3/8/8/3K1Q2/8/5r2 w - - 0 1'
]
