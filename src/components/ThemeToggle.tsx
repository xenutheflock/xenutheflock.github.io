import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { FiSun, FiMoon } from 'react-icons/fi'

function ThemeToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Tingnan kung naka-dark mode na (galing sa script sa index.html)
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  )

  // Ang mismong pagpalit ng theme
  function applyTheme(next: boolean) {
    flushSync(() => setIsDark(next)) // i-update agad ang icon
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      // ok lang kung hindi ma-save
    }
  }

  function toggleTheme() {
    const next = !isDark
    const button = buttonRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Kung luma ang browser (o ayaw ng user ng animation), palit agad
    if (!document.startViewTransition || !button || reduceMotion) {
      applyTheme(next)
      return
    }

    // Gitna ng button = dito magsisimula ang bilog
    const box = button.getBoundingClientRect()
    const x = box.left + box.width / 2
    const y = box.top + box.height / 2

    // Gaano kalaki ang bilog para matakpan ang buong screen
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    // Kunan ng "picture" ang luma, palitan ang theme, tapos i-reveal ang bago gamit ang bilog
    const transition = document.startViewTransition(() => applyTheme(next))

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 700,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
  }

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-white text-lg transition-colors hover:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-100"
    >
      {/* Umiikot na palit ng icon */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ y: 20, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -20, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {isDark ? <FiMoon /> : <FiSun />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

export default ThemeToggle