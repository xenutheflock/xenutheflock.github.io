import { useRef } from 'react'
import { motion, useReducedMotion, useSpring } from 'motion/react'
import { FiArrowUpRight } from 'react-icons/fi'
import CursorLens from './CursorLens'
import { NAME, ROLE, linkProps, socials } from '../data/profile'
import { sectionNumber } from '../data/sections'

/* ====== PALITAN MO ITO NG INFO MO ======
   (Pangalan, role, at social links: nasa src/data/profile.ts) */
const DESCRIPTION = 'Fourth-year BSIT student building clean, secure, and useful web apps.'
// Drawing ng ulo (public/head.webp). Sa dark mode, kusang binabaliktad ang kulay (CSS invert),
// kaya isang file na lang ang kailangan.
const HEAD_IMAGE = '/head.webp'
const HEAD_SIZE = { width: 865, height: 770 } // totoong sukat ng image (iwas "talon" habang naglo-load)
/* ======================================= */

/* Gaano kalakas ang galaw ng ulo */
const MAX_TILT = 18 // degrees na pag-ikot
const MAX_SHIFT = 24 // pixels na pag-usog

// Helper para sa fade-up na animation (umuulit tuwing babalik ka sa hero)
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.3 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
})

function Hero() {
  const headRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion() // naka-"reduce motion" ba ang device?

  // "Spring" para smooth at medyo bouncy ang pagsunod ng ulo
  const headSpring = { stiffness: 120, damping: 14, mass: 0.6 }
  const rotateY = useSpring(0, headSpring)
  const rotateX = useSpring(0, headSpring)
  const moveX = useSpring(0, headSpring)
  const moveY = useSpring(0, headSpring)

  // ULO: lumingon papunta sa cursor (wala kung naka-reduce motion)
  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const head = headRef.current
    if (!head || reduceMotion) return
    const box = head.getBoundingClientRect()
    const centerX = box.left + box.width / 2
    const centerY = box.top + box.height / 2
    const x = Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth / 2)))
    const y = Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight / 2)))
    rotateY.set(x * MAX_TILT)
    rotateX.set(-y * MAX_TILT * 0.7)
    moveX.set(x * MAX_SHIFT)
    moveY.set(y * MAX_SHIFT * 0.5)
  }

  // Pag umalis ang cursor: ibalik sa gitna ang ulo
  function handleMouseLeave() {
    rotateY.set(0)
    rotateX.set(0)
    moveX.set(0)
    moveY.set(0)
  }

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto flex h-[calc(100svh-84px)] min-h-[560px] max-w-7xl flex-col overflow-hidden px-4 md:px-8"
    >
      {/* Section number (kanan-taas, gaya ng ibang section) */}
      <motion.div
        {...fadeUp(0.1)}
        className="flex justify-end text-sm font-semibold text-neutral-500 md:text-lg"
      >
        {sectionNumber('home')}
      </motion.div>

      {/* Malaking pangalan */}
      <motion.h1
        {...fadeUp(0.2)}
        className="hero-name mt-1 text-center uppercase text-[clamp(3rem,18vw,8rem)] md:mt-2 md:text-[clamp(4rem,14vw,13rem)]"
      >
        {NAME}
      </motion.h1>

      {/* Role + description + button (kaliwa) */}
      <motion.div
        {...fadeUp(0.6)}
        className="relative z-20 mt-6 text-center md:absolute md:bottom-16 md:left-8 md:mt-0 md:max-w-xs md:text-left"
      >
        <h2 className="text-2xl font-bold md:text-3xl">{ROLE}</h2>
        <p className="mt-2 text-sm text-neutral-500 md:text-base dark:text-neutral-400">{DESCRIPTION}</p>
        <a
          href="#contact"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Let's collaborate <FiArrowUpRight />
        </a>
      </motion.div>

      {/* Social links (kanan, desktop lang) */}
      <motion.ul
        {...fadeUp(0.75)}
        className="absolute bottom-16 right-8 z-20 hidden flex-col items-end gap-3 md:flex"
      >
        {socials.map((s) => (
          <li key={s.label}>
            <a
              href={s.href}
              {...linkProps(s.href)}
              className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold transition hover:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-100"
            >
              <s.icon aria-hidden /> {s.label}
            </a>
          </li>
        ))}
      </motion.ul>

      {/* ULO: umaakyat mula sa baba (umuulit), lumulutang, at sumusunod sa cursor */}
      <motion.div
        initial={{ opacity: 0, y: 160 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute bottom-[6%] left-1/2 z-10 h-[36%] -translate-x-1/2 md:bottom-[8%] md:h-[56%]"
        style={{ perspective: 900 }}
      >
        {/* Dahan-dahang lumulutang pataas-pababa (walang tigil) */}
        <motion.div
          className="h-full"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            ref={headRef}
            className="h-full"
            style={{ rotateX, rotateY, x: moveX, y: moveY, transformOrigin: '50% 80%' }}
          >
            {/* Iisang drawing: binabaliktad ang kulay sa dark mode (dark:invert) */}
            <img
              src={HEAD_IMAGE}
              {...HEAD_SIZE}
              alt={`Drawing of ${NAME}`}
              fetchPriority="high"
              className="h-full w-auto select-none object-contain object-bottom dark:invert"
              draggable={false}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* INVERT LENS: bilog na sumusunod sa cursor (tingnan ang CursorLens.tsx) */}
      <CursorLens />
    </section>
  )
}

export default Hero