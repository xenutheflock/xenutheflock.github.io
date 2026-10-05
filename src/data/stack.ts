/* ====== TECH STACK MO ======
   Para magdagdag: kopyahin ang isang { name, icon } at palitan.
   Mga icon: hanapin sa https://react-icons.github.io/react-icons (hal. "Si" = Simple Icons)
   tapos idagdag sa import sa taas.
*/
import type { IconType } from 'react-icons'
import {
  SiComposer,
  SiCss,
  SiDocker,
  SiExpress,
  SiGit,
  SiGithub,
  SiHtml5,
  SiLaravel,
  SiLinux,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiNpm,
  SiPhp,
  SiPostgresql,
  SiPostman,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
} from 'react-icons/si'
import { VscVscode } from 'react-icons/vsc'
import { TbBraces } from 'react-icons/tb'

export type Tech = { name: string; icon: IconType }
export type StackGroup = { category: string; items: Tech[] }

export const stack: StackGroup[] = [
  {
    category: 'Frontend',
    items: [
      { name: 'HTML5', icon: SiHtml5 },
      { name: 'CSS3', icon: SiCss },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'React', icon: SiReact },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'Tailwind', icon: SiTailwindcss },
      { name: 'Vite', icon: SiVite },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'PHP', icon: SiPhp },
      { name: 'Laravel', icon: SiLaravel },
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'Express', icon: SiExpress },
      { name: 'REST API', icon: TbBraces },
    ],
  },
  {
    category: 'Database',
    items: [
      { name: 'PostgreSQL', icon: SiPostgresql },
      { name: 'MySQL', icon: SiMysql },
    ],
  },
  {
    category: 'Dev Tools',
    items: [
      { name: 'Git', icon: SiGit },
      { name: 'GitHub', icon: SiGithub },
      { name: 'Docker', icon: SiDocker },
      { name: 'VS Code', icon: VscVscode },
      { name: 'Linux', icon: SiLinux },
      { name: 'Postman', icon: SiPostman },
      { name: 'npm', icon: SiNpm },
      { name: 'Composer', icon: SiComposer },
    ],
  },
  {
    category: 'Deployment',
    items: [
      { name: 'Vercel', icon: SiVercel },
      { name: 'Supabase', icon: SiSupabase },
    ],
  },
]