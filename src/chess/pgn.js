import { Chess } from 'chess.js'

// Parse un PGN et renvoie en-tetes + liste des positions (san + fen apres coup).
// Tolerant : si le PGN ne charge pas, leve une erreur lisible.
export function parsePgn(pgn) {
  const chess = new Chess()
  try {
    chess.loadPgn(pgn)
  } catch (e) {
    throw new Error('PGN invalide : ' + (e?.message ?? e))
  }

  const headers = chess.header()
  const verbose = chess.history({ verbose: true })

  // Rejoue depuis le debut pour recuperer la FEN apres chaque coup.
  const replay = new Chess()
  const moves = [{ san: null, fen: replay.fen(), ply: 0 }]
  verbose.forEach((m, i) => {
    replay.move(m.san)
    moves.push({ san: m.san, fen: replay.fen(), ply: i + 1 })
  })

  return { headers, moves }
}

// Construit les metadonnees a stocker en base depuis un PGN.
export function metaFromPgn(pgn) {
  const { headers } = parsePgn(pgn)
  return {
    white: headers.White ?? null,
    black: headers.Black ?? null,
    result: headers.Result ?? '*',
    event: headers.Event ?? null,
    game_date: headers.Date ?? headers.UTCDate ?? null,
    eco: headers.ECO ?? null,
    opening_name: headers.Opening ?? null,
    pgn
  }
}
