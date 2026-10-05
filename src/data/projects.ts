/* ====== LISTAHAN NG PROJECTS MO ======
   Para magdagdag: kopyahin ang isang { ... } block at palitan ang laman.
   Para sa picture: ilagay sa public/projects/ gamit ang pangalan na nasa "image"
   (hal. public/projects/geocrime.png). Kung wala pa ang file, kusang lalabas
   ang pangalan ng project bilang placeholder. Pinakamaganda ang 2:1 na sukat
   (hal. 1900 x 950), gaya ng mga screenshot ngayon.
*/

export type Project = {
  title: string
  description: string
  category: string // lumalabas sa kanan ng bawat project (hal. 'School · Capstone')
  tags: string[] // tech na ginamit (hal. 'React', 'Laravel')
  image: string
  link?: string // GitHub o live demo (optional)
}

export const projects: Project[] = [
  {
    title: 'Takenote',
    description:
      'A free public digital wall for anonymous sticky notes and sketches. Create your wall, share the link, and let people leave notes you can pin, mark as read, and style with your own theme and wallpaper.',
    category: 'Personal · Web App',
    tags: ['React', 'TypeScript', 'Tailwind', 'Supabase'],
    image: '/projects/takenote.png',
    link: 'https://www.takenote.fun',
  },
  {
    title: 'GeoCrime',
    description:
      'A web-based geospatial crime hotspot identification and analytics system built as our capstone thesis with a partner police station.',
    category: 'School · Capstone',
    tags: ['React', 'TypeScript', 'Tailwind', 'Laravel', 'PostgreSQL', 'Docker'],
    image: '/projects/geocrime.png',
    link: '',
  },
  {
    title: 'Web LMS',
    description:
      'LearnHub, a web-based learning management system for students, faculty, and administrators. Students track their classes, submit activities, check grades by semester, and see deadlines on a calendar, while faculty manage classes and review submissions.',
    category: 'School · Web App',
    tags: ['React', 'TypeScript', 'Tailwind', 'Laravel', 'PostgreSQL', 'Docker'],
    image: '/projects/weblms.png',
    link: '',
  },
]