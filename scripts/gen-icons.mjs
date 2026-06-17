// Genere des icones PNG simples (damier + carre accent) sans dependance externe.
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1))
  }
  return ~c >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
  const t = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])))
  return Buffer.concat([len, t, data, crc])
}
function png(size) {
  const bg = [13, 17, 23]       // fond
  const accent = [31, 111, 235] // bleu
  const light = [120, 150, 200]
  const raw = Buffer.alloc(size * (size * 4 + 1))
  let p = 0
  const margin = Math.floor(size * 0.12)
  const inner = size - margin * 2
  const cell = inner / 4
  for (let y = 0; y < size; y++) {
    raw[p++] = 0
    for (let x = 0; x < size; x++) {
      let col = bg
      if (x >= margin && x < size - margin && y >= margin && y < size - margin) {
        const cx = Math.floor((x - margin) / cell)
        const cy = Math.floor((y - margin) / cell)
        col = (cx + cy) % 2 === 0 ? accent : light
      }
      raw[p++] = col[0]; raw[p++] = col[1]; raw[p++] = col[2]; raw[p++] = 255
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8; ihdr[9] = 6 // 8 bits, RGBA
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}

mkdirSync(new URL('../public/icons/', import.meta.url), { recursive: true })
for (const s of [192, 512]) {
  writeFileSync(new URL(`../public/icons/icon-${s}.png`, import.meta.url), png(s))
  console.log('icon-' + s + '.png genere')
}
