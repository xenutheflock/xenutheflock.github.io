import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { FiArrowUpRight } from 'react-icons/fi'
import ThemeToggle from './ThemeToggle'
import { projects } from '../data/projects'
import { linkProps, socials } from '../data/profile'
import { sectionNumber, type SectionId } from '../data/sections'

const links: { label: string; id: SectionId; tag: string }[] = [
  { label: 'About', id: 'about', tag: '' },
  { label: 'Projects', id: 'projects', tag: `[${projects.length}]` },
  { label: 'Skills', id: 'skills', tag: '' },
  { label: 'Contact', id: 'contact', tag: '' },
]

const EASE = [0.22, 1, 0.36, 1] as const

// Dalawang guhit: "menu" kapag sarado, nagiging "X" sa loob ng menu
function MenuIcon({ open }: { open: boolean }) {
  const bar = 'absolute left-0 h-0.5 w-full bg-current'
  return (
    <span aria-hidden className="relative block h-3 w-4">
      <span className={`${bar} ${open ? 'top-[5px] rotate-45' : 'top-[3px]'}`} />
      <span className={`${bar} ${open ? 'top-[5px] -rotate-45' : 'top-[7px]'}`} />
    </span>
  )
}

type MobileMenuProps = { onClose: () => void; onNavigate: () => void }

// Menu sa phone: buong screen, bumababa na parang kurtina, isa-isang umaangat ang mga link
function MobileMenu({ onClose, onNavigate }: MobileMenuProps) {
  const reduceMotion = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)

  // Pagbukas: i-focus ang Close button. Escape = isara.
  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Kung naka-"reduce motion" ang device: fade lang, walang kurtina
  const hidden = reduceMotion ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }
  const shown = reduceMotion ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      initial={hidden}
      animate={shown}
      exit={hidden}
      transition={{ duration: 0.6, ease: EASE }}
      className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-neutral-950 px-4 py-5 text-white md:hidden dark:bg-white dark:text-neutral-950"
    >
      {/* Taas: label + Close (kapareho ng pwesto ng menu button) */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest opacity-50">Menu</span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="circle flex h-10 w-10 items-center justify-center border"
        >
          <MenuIcon open />
        </button>
      </div>

      {/* Malalaking link */}
      <ul className="mt-auto pt-10">
        {links.map((link, i) => (
          <li key={link.id} className="overflow-hidden border-t border-dashed border-current/25">
            <motion.a
              href={`#${link.id}`}
              onClick={onNavigate}
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.06, ease: EASE }}
              className="flex items-baseline justify-between py-3 font-condensed text-[clamp(3rem,16vw,5.5rem)] uppercase leading-none"
            >
              {link.label}
              <span className="font-sans text-xs font-semibold opacity-50">{sectionNumber(link.id)}</span>
            </motion.a>
          </li>
        ))}
      </ul>

      {/* Baba: social links */}
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-dashed border-current/25 pt-6 text-xs font-semibold uppercase tracking-wide">
        {socials.map((s) => (
          <li key={s.label}>
            <a href={s.href} {...linkProps(s.href)} className="inline-flex items-center gap-1.5">
              <s.icon aria-hidden /> {s.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const restoreFocus = useRef(false) // true = ibalik ang focus sa menu button pagsara

  // Habang bukas ang menu: naka-lock ang page sa likod
  useEffect(() => {
    if (!menuOpen) return
    const root = document.getElementById('root')
    const button = menuButtonRef.current
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden' // hindi mag-scroll ang page sa likod
    root?.setAttribute('inert', '') // hindi ma-click o ma-Tab ang nasa likod ng menu

    // Kapag lumapad ang screen (hal. inikot ang tablet), isara ang menu
    const wide = window.matchMedia('(min-width: 768px)')
    const handleWide = () => wide.matches && setMenuOpen(false)
    wide.addEventListener('change', handleWide)

    return () => {
      document.body.style.overflow = prevOverflow
      root?.removeAttribute('inert')
      wide.removeEventListener('change', handleWide)
      if (restoreFocus.current) button?.focus()
      restoreFocus.current = false
    }
  }, [menuOpen])

  // Close/Escape: isara at ibalik ang focus sa menu button
  const closeMenu = useCallback(() => {
    restoreFocus.current = true
    setMenuOpen(false)
  }, [])

  // Pinindot ang link: isara lang (dadalhin na ng link sa section)
  const navigate = useCallback(() => setMenuOpen(false), [])

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
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>
        Open to Opportunities
      </div>

      {/* Links (desktop lang; sa phone, nasa menu) */}
      <ul className="hidden items-center gap-10 text-sm font-medium md:flex">
        {links.map((link) => (
          <li key={link.id}>
            <a href={`#${link.id}`} className="transition hover:opacity-60">
              {link.label}
              {link.tag && <span className="ml-1.5 text-xs text-neutral-400 dark:text-neutral-500">{link.tag}</span>}
            </a>
          </li>
        ))}
      </ul>

      {/* Dark mode toggle + Let's Talk button + Menu (phone) */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <a
          href="#contact"
          className="hidden items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-neutral-700 sm:flex dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Let's Talk <FiArrowUpRight />
        </a>
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="circle flex h-10 w-10 items-center justify-center border md:hidden"
        >
          <MenuIcon open={false} />
        </button>
      </div>

      {/* Ang menu ay nilalagay sa dulo ng <body> para laging nasa ibabaw ng lahat */}
      {createPortal(
        <AnimatePresence>
          {menuOpen && <MobileMenu key="menu" onClose={closeMenu} onNavigate={navigate} />}
        </AnimatePresence>,
        document.body,
      )}
    </motion.nav>
  )
}

export default Navbar
