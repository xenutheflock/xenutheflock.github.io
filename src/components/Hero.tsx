import { useRef, useState } from 'react'
import { motion, useSpring } from 'motion/react'
import { FiArrowUpRight, FiMail } from 'react-icons/fi'
import { FaGithub, FaLinkedinIn, FaFacebookF } from 'react-icons/fa'

/* ====== PALITAN MO ITO NG INFO MO ====== */
const NAME = 'EDZEL'
const ROLE = 'Web Developer'
const DESCRIPTION = 'Final-year BSIT student building clean, secure, and useful web apps.'
const HEAD_IMAGE = '/head.png' // drawing para sa light mode (public/head.png)
const HEAD_IMAGE_DARK = '/head-inverted.png' // drawing para sa dark mode (public/head-inverted.png)

const socials = [
  { label: 'GitHub', href: 'https://github.com/', icon: <FaGithub /> },
  { label: 'LinkedIn', href: 'https://linkedin.com/', icon: <FaLinkedinIn /> },
  { label: 'Facebook', href: 'https://facebook.com/', icon: <FaFacebookF /> },
  { label: 'Email', href: 'mailto:you@example.com', icon: <FiMail /> },
]
/* ======================================= */

/* Gaano kalakas ang galaw ng ulo */
const MAX_TILT = 18 // degrees na pag-ikot
const MAX_SHIFT = 24 // pixels na pag-usog

/* Laki ng invert lens (pixels) */
const LENS_SIZE = 200

// Helper para sa fade-up na intro animation
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
})

function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const [showLens, setShowLens] = useState(false)

  // "Spring" para smooth at medyo bouncy ang pagsunod ng ulo
  const headSpring = { stiffness: 120, damping: 14, mass: 0.6 }
  const rotateY = useSpring(0, headSpring)
  const rotateX = useSpring(0, headSpring)
  const moveX = useSpring(0, headSpring)
  const moveY = useSpring(0, headSpring)

  // Posisyon ng lens (mas mabilis na spring para dikit sa cursor)
  const lensSpring = { stiffness: 400, damping: 35 }
  const lensX = useSpring(0, lensSpring)
  const lensY = useSpring(0, lensSpring)

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const section = sectionRef.current
    const head = headRef.current
    if (!section || !head) return

    // --- LENS: ilagay ang gitna ng bilog sa cursor ---
    const area = section.getBoundingClientRect()
    lensX.set(e.clientX - area.left - LENS_SIZE / 2)
    lensY.set(e.clientY - area.top - LENS_SIZE / 2)

    // --- ULO: lumingon papunta sa cursor ---
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

  // Pagpasok ng cursor: ilagay agad ang lens sa cursor (walang "lipad" mula sa sulok)
  function handleMouseEnter(e: React.MouseEvent<HTMLElement>) {
    const section = sectionRef.current
    if (!section) return
    const area = section.getBoundingClientRect()
    lensX.jump(e.clientX - area.left - LENS_SIZE / 2)
    lensY.jump(e.clientY - area.top - LENS_SIZE / 2)
    setShowLens(true)
  }

  // Pag umalis ang cursor: itago ang lens, ibalik sa gitna ang ulo
  function handleMouseLeave() {
    setShowLens(false)
    rotateY.set(0)
    rotateX.set(0)
    moveX.set(0)
    moveY.set(0)
  }

  return (
    <section
      ref={sectionRef}
      id="home"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto flex h-[calc(100svh-84px)] min-h-[560px] max-w-7xl flex-col overflow-hidden px-4 md:px-8"
    >
      {/* Malaking pangalan */}
      <motion.h1
        {...fadeUp(0.2)}
        className="hero-name mt-4 text-center text-[clamp(3rem,18vw,8rem)] md:mt-6 md:text-[clamp(4rem,14vw,13rem)]"
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
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold transition hover:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-100"
            >
              {s.icon} {s.label}
            </a>
          </li>
        ))}
      </motion.ul>

      {/* ULO: umaakyat mula sa baba (intro), tapos sumusunod sa cursor */}
      <motion.div
        initial={{ opacity: 0, y: 160 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute bottom-[6%] left-1/2 z-10 h-[36%] -translate-x-1/2 md:bottom-[8%] md:h-[56%]"
        style={{ perspective: 900 }}
      >
        <motion.div
          ref={headRef}
          className="h-full"
          style={{ rotateX, rotateY, x: moveX, y: moveY, transformOrigin: '50% 80%' }}
        >
          {/* Light mode na ulo */}
          <img
            src={HEAD_IMAGE}
            alt={`Drawing of ${NAME}`}
            className="h-full w-auto select-none object-contain object-bottom dark:hidden"
            draggable={false}
          />
          {/* Dark mode na ulo (inverted) */}
          <img
            src={HEAD_IMAGE_DARK}
            alt={`Drawing of ${NAME}`}
            className="hidden h-full w-auto select-none object-contain object-bottom dark:block"
            draggable={false}
          />
        </motion.div>
      </motion.div>

      {/* INVERT LENS: bilog na sumusunod sa cursor, binabaliktad ang kulay ng nasa ilalim */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-40 hidden rounded-full border border-white/40 shadow-[0_0_40px_rgba(0,0,0,0.15)] md:block"
        style={{
          width: LENS_SIZE,
          height: LENS_SIZE,
          x: lensX,
          y: lensY,
          backdropFilter: 'invert(1)',
          WebkitBackdropFilter: 'invert(1)',
        }}
        initial={false}
        animate={{ scale: showLens ? 1 : 0, opacity: showLens ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
    </section>
  )
}

export default Hero