import { motion } from 'motion/react'
import { FiArrowUpRight } from 'react-icons/fi'
import ThemeToggle from './ThemeToggle'

const links = [
  { label: 'About', href: '#about', tag: '' },
  { label: 'Projects', href: '#projects', tag: '[3]' },
  { label: 'Skills', href: '#skills', tag: '' },
  { label: 'Contact', href: '#contact', tag: '' },
]

function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative z-30 mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 md:px-8"
    >
      {/* Availability badge */}
      <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold shadow-sm md:text-sm dark:border-neutral-800 dark:bg-neutral-900">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>
        Open to Opportunities
      </div>

      {/* Links (nakatago sa phone) */}
      <ul className="hidden items-center gap-10 text-sm font-medium md:flex">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="transition hover:opacity-60">
              {link.label}
              {link.tag && <span className="ml-1.5 text-xs text-neutral-400 dark:text-neutral-500">{link.tag}</span>}
            </a>
          </li>
        ))}
      </ul>

      {/* Dark mode toggle + Let's Talk button */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <a
          href="#contact"
          className="hidden items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-neutral-700 sm:flex dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Let's Talk <FiArrowUpRight />
        </a>
      </div>
    </motion.nav>
  )
}

export default Navbar