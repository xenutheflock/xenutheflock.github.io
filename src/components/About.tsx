import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import Marquee from './Marquee'
import CursorLens from './CursorLens'
import { sectionNumber } from '../data/sections'

/* ====== PALITAN MO ITO NG INFO MO ====== */
const BIO =
  '"Edzel is a fourth-year BSIT student from the Philippines who builds clean, secure, and useful web apps. From working on GeoCrime, a crime hotspot analytics system for our capstone, to studying how systems get broken in cybersecurity, he cares about software that is simple to use and hard to break."'
const CURRENTLY = 'Currently studying Laravel Framework as one of my foundations'

// Mga text sa sliding strip sa baba (may ✸ sa pagitan)
const MARQUEE_ITEMS = ['Code by Edzel', 'Clean and secure web apps']
/* ======================================= */

const HEADING = '/ABOUT'

// Isang salita sa bio: lumiliwanag habang nag-i-scroll
function Word({
  children,
  progress,
  range,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.15, 1])
  return (
    <motion.span style={{ opacity }} className="mr-[0.3em] inline-block">
      {children}
    </motion.span>
  )
}

function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const bioRef = useRef<HTMLParagraphElement>(null)
  const reduceMotion = useReducedMotion() // kung naka-on: walang dulas/ikot sa scroll

  // Progress ng buong section (0 = papasok pa lang sa baba, 1 = lumabas na sa taas)
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // "/ABOUT" dumudulas pakanan habang nag-i-scroll
  const headingX = useTransform(sectionProgress, [0, 1], ['-6%', '6%'])

  // Arrow: umiikot at umaakyat papunta sa pwesto nito
  const arrowRotate = useTransform(sectionProgress, [0.1, 0.5], [-135, 0])
  const arrowY = useTransform(sectionProgress, [0.1, 0.5], [120, 0])

  // Progress ng bio (para sa word-by-word na liwanag)
  const { scrollYProgress: bioProgress } = useScroll({
    target: bioRef,
    offset: ['start 0.85', 'end 0.45'],
  })

  const words = BIO.split(' ')

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden pt-20 md:pt-28"
    >
      {/* Bilog na sumusunod sa cursor (gaya ng sa Hero) */}
      <CursorLens />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        {/* Section number (kanan-taas) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-end text-sm font-semibold text-neutral-500 md:text-lg"
        >
          {sectionNumber('about')}
        </motion.div>

        {/* Malaking "/ABOUT": isa-isang umaangat ang letra */}
        <motion.h2
          style={reduceMotion ? undefined : { x: headingX }}
          aria-label="About"
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          className="condensed mt-2 flex text-[clamp(6rem,30vw,22rem)]"
        >
          {HEADING.split('').map((letter, i) => (
            <span key={i} className="-mx-[0.02em] inline-block overflow-hidden px-[0.02em] pt-[0.04em]">
              <motion.span
                aria-hidden
                variants={{
                  hidden: { y: '110%' },
                  show: { y: '0%', transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        {/* Arrow + bio */}
        <div className="mt-10 grid items-start gap-10 md:mt-14 md:grid-cols-[1fr_2fr] md:gap-16">
          {/* Malaking arrow */}
          <motion.div
            style={reduceMotion ? undefined : { rotate: arrowRotate, y: arrowY }}
            className="w-24 text-neutral-400 md:ml-[10%] md:w-full md:max-w-[220px] dark:text-neutral-600"
          >
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="square">
              <path d="M18 82 L80 20" />
              <path d="M30 20 H80 V70" />
            </svg>
          </motion.div>

          {/* Bio */}
          <div>
            {/* Buong bio para sa screen reader (hiwa-hiwalay kasi ang mga salita sa ibaba) */}
            <p className="sr-only">{BIO}</p>
            <p
              ref={bioRef}
              aria-hidden
              className="flex flex-wrap text-lg font-medium leading-relaxed md:text-2xl md:leading-relaxed"
            >
              {words.map((word, i) => (
                <Word
                  key={i}
                  progress={bioProgress}
                  range={[i / words.length, (i + 1) / words.length]}
                >
                  {word}
                </Word>
              ))}
            </p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 1 }}
              transition={{ duration: 0.6 }}
              className="mt-8 text-xs font-bold uppercase tracking-widest text-neutral-500 md:text-sm"
            >
              {CURRENTLY}
            </motion.p>
          </div>
        </div>
      </div>

      {/* SLIDING TEXT STRIP: laging gumagalaw, bumibilis/bumabaliktad sa scroll */}
      <div className="mt-20 py-6 text-[clamp(3rem,9vw,8rem)] md:mt-28 md:py-10">
        <Marquee items={MARQUEE_ITEMS} />
      </div>
    </section>
  )
}

export default About