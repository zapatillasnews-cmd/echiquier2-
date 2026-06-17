// Problemes curates (coup-cle unique) avec explications en francais.
// solution = liste de coups UCI (souvent un seul coup-cle).
export const PUZZLES = [
  {
    id: 'p1', theme: 'Mat du couloir', rating: 900, mate: true,
    fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
    solution: ['a1a8'],
    explanation: "La tour plonge sur la 8e rangee : Ta8#. Le roi noir est etouffe par ses propres pions f7-g7-h7 et ne peut fuir. C'est le mat du couloir, a surveiller des qu'un roi reste enferme derriere ses pions."
  },
  {
    id: 'p2', theme: 'Mat de la dame', rating: 1000, mate: true,
    fen: '6k1/8/6K1/8/8/8/8/3Q4 w - - 0 1',
    solution: ['d1d8'],
    explanation: "Dd8# : la dame donne echec sur la 8e rangee et le roi blanc en g6 controle f7, g7 et h7. Le roi noir n'a aucune case de fuite. Schema fondamental dame + roi."
  },
  {
    id: 'p3', theme: 'Mat etouffe', rating: 1300, mate: true,
    fen: '6rk/6pp/8/6N1/8/8/8/7K w - - 0 1',
    solution: ['g5f7'],
    explanation: "Cf7# : le mat etouffe. Le roi en h8 est emmure par sa tour g8 et ses pions g7-h7 ; seul le cavalier peut l'achever. Motif classique a connaitre par coeur."
  },
  {
    id: 'p4', theme: 'Fourchette', rating: 1100, mate: false,
    fen: '4k3/8/8/1N1q4/8/8/8/4K3 w - - 0 1',
    solution: ['b5c7'],
    explanation: "Cc7+ : une fourchette de cavalier. Le cavalier attaque a la fois le roi en e8 et la dame en d5. Apres le coup du roi, Cxd5 gagne la dame. Le cavalier est le roi des fourchettes."
  },
  {
    id: 'p5', theme: 'Double attaque', rating: 1200, mate: false,
    fen: 'r5k1/6pp/8/8/8/8/6PP/3Q2K1 w - - 0 1',
    solution: ['d1d5'],
    explanation: "Dd5+ : double attaque diagonale. La dame fait echec au roi en g8 (diagonale d5-g8) tout en visant la tour en a8 (diagonale d5-a8). Le roi doit parer l'echec, puis Dxa8 ramasse la tour."
  },
  {
    id: 'p6', theme: 'Mat de l\'escalier', rating: 800, mate: true,
    fen: '7k/1R6/8/8/8/8/8/R6K w - - 0 1',
    solution: ['a1a8'],
    explanation: "Ta8# : les deux tours forment l'escalier. La tour b7 interdit la 7e rangee, l'autre tour donne mat sur la 8e. Technique de base pour mater avec deux tours."
  }
]

// Positions pour le jeu \"Trouve le meilleur coup\" (Stockfish juge la reponse).
export const FIND_BEST_POSITIONS = [
  '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
  '4k3/8/8/1N1q4/8/8/8/4K3 w - - 0 1',
  'r5k1/6pp/8/8/8/8/6PP/3Q2K1 w - - 0 1',
  'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1',
  'r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 1',
  'r2q1rk1/ppp2ppp/2np1n2/2b1p1B1/2B1P1b1/2NP1N2/PPP2PPP/R2Q1RK1 w - - 0 1',
  'rnbqkb1r/pp2pppp/3p1n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 1'
]
