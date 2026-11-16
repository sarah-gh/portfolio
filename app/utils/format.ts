/** Joins tags into a readable list: "Vue, Nuxt and TypeScript". */
export function formatList(items: string[]): string {
  return new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(items)
}
