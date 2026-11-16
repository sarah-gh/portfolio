/**
 * Builds a repeating, random-looking grid of item indices for an infinite tiled gallery,
 * where the same item never appears next to itself.
 *
 * - Every row is a shuffled permutation of all items (no repeats within a row).
 * - A tile differs from the three tiles it can touch in the row above (rows are offset
 *   sideways, so diagonal neighbours count) and from the tile two rows above.
 * - Rules also hold across the wrap-around in both directions, so the pattern tiles seamlessly.
 *
 * Returns `rows` arrays of length `count`; read it as pattern[row % rows][column % count].
 */
export function createTilePattern(count: number, rows = 4, seed = 7): number[][] {
  if (count <= 0) return []
  const random = mulberry32(seed)
  const base = Array.from({ length: count }, (_, i) => i)

  // With few items not every rule can hold, so relax step by step:
  // all rules → only tiles that physically touch → plain shuffled rows.
  for (const rules of ['all', 'touching'] as const) {
    for (let attempt = 0; attempt < 200; attempt++) {
      const pattern: number[][] = []
      let failed = false
      for (let row = 0; row < rows && !failed; row++) {
        const placed = placeRow(row, pattern, rows, count, base, random, rules)
        if (placed) pattern.push(placed)
        else failed = true
      }
      if (!failed) return pattern
    }
  }

  return Array.from({ length: rows }, () => shuffle([...base], random))
}

type Rules = 'all' | 'touching'

/** Fills one row with backtracking so every tile respects its neighbours. */
function placeRow(row: number, pattern: number[][], rows: number, count: number, base: number[], random: () => number, rules: Rules) {
  const result: number[] = []
  const used = new Set<number>()

  // Indices that must not appear at `column` in this row.
  const blocked = (column: number) => {
    const avoid = new Set<number>()
    const at = (r: number, c: number) => pattern[((r % rows) + rows) % rows]?.[((c % count) + count) % count]
    const neighbours = [
      at(row - 1, column - 1), at(row - 1, column), at(row - 1, column + 1),
    ]
    // The last row also touches the first row of the next repetition.
    if (row === rows - 1) neighbours.push(at(0, column - 1), at(0, column), at(0, column + 1))
    // Stricter: no repeat two rows apart in the same column either.
    if (rules === 'all') {
      neighbours.push(at(row - 2, column))
      if (row >= rows - 2) neighbours.push(at(row + 2, column))
    }
    for (const value of neighbours) if (value !== undefined) avoid.add(value)
    return avoid
  }

  const fill = (column: number): boolean => {
    if (column === count) return true
    const avoid = blocked(column)
    for (const candidate of shuffle([...base], random)) {
      if (used.has(candidate) || avoid.has(candidate)) continue
      used.add(candidate)
      result.push(candidate)
      if (fill(column + 1)) return true
      used.delete(candidate)
      result.pop()
    }
    return false
  }

  return fill(0) ? result : null
}

function shuffle<T>(items: T[], random: () => number) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[items[i], items[j]] = [items[j]!, items[i]!]
  }
  return items
}

/** Small seeded PRNG: the same layout on every visit and every resize. */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6D2B79F5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
