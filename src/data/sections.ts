/* ====== AYOS NG MGA SECTION ======
   Kapag nagdagdag o nag-ayos ka ng section sa App.tsx, dito rin baguhin
   para kusang tama ang "02/05" na numbering sa bawat section.
*/
const SECTIONS = ['home', 'about', 'projects', 'skills', 'contact'] as const

export type SectionId = (typeof SECTIONS)[number]

const pad = (n: number) => String(n).padStart(2, '0')

// hal. sectionNumber('about') → "02/05"
export function sectionNumber(id: SectionId) {
  return `${pad(SECTIONS.indexOf(id) + 1)}/${pad(SECTIONS.length)}`
}
