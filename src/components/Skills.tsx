import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { stack, type StackGroup } from '../data/stack'
import { sectionNumber } from '../data/sections'
import CursorLens from './CursorLens'

/* ====== PALITAN MO ITO KUNG GUSTO MO ====== */
const SUBTITLE = 'Tech stack I use right now'
/* ========================================== */

const HEADING = '/SKILLS'
const EASE = [0.22, 1, 0.36, 1] as const

// Kabuuang bilang ng tools (kusang nagbibilang)
const TOTAL = stack.reduce((sum, group) => sum + group.items.length, 0)

// Isang category row: pangalan sa kaliwa, icon tiles sa kanan
function StackRow({ group }: { group: StackGroup }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.3 }}
      variants={{ show: { transition: { staggerChildren: 0.05 } } }}
      className="-mx-4 grid gap-6 border-t border-dashed border-current/25 px-4 py-8 transition-colors duration-300 hover:bg-neutral-950 hover:text-white md:-mx-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:px-6 md:py-10 dark:hover:bg-white dark:hover:text-neutral-950"
    >
      {/* Category name + bilang */}
      <div className="flex items-start gap-3">
        <span className="overflow-hidden">
          <motion.h3
            variants={{
              hidden: { y: '110%' },
              show: { y: '0%', transition: { duration: 0.8, ease: EASE } },
            }}
            className="font-condensed text-5xl uppercase leading-[1.1] md:text-7xl"
          >
            {group.category}
          </motion.h3>
        </span>
        <motion.span
          variants={{ hidden: { opacity: 0 }, show: { opacity: 0.5 } }}
          className="mt-2 text-sm font-semibold"
        >
          [{String(group.items.length).padStart(2, '0')}]
        </motion.span>
      </div>

      {/* Icon tiles */}
      <ul className="flex flex-wrap content-start gap-3 md:gap-4">
        {group.items.map((tech) => (
          <motion.li
            key={tech.name}
            variants={{
              hidden: { opacity: 0, y: 24, scale: 0.8 },
              show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 18 } },
            }}
            className="group/tile flex w-[72px] flex-col items-center gap-2 md:w-[84px]"
          >
            <div className="flex aspect-square w-full items-center justify-center border border-current/25 text-3xl transition duration-300 group-hover/tile:-translate-y-1 group-hover/tile:border-current md:text-[2rem]">
              <tech.icon className="transition-transform duration-300 group-hover/tile:-rotate-12 group-hover/tile:scale-110" />
            </div>
            <span className="text-center font-mono text-[11px] leading-tight opacity-60">{tech.name}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  // "/SKILLS" dumudulas pakaliwa habang nag-i-scroll (kabaligtaran ng /ABOUT)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const headingX = useTransform(scrollYProgress, [0, 1], ['6%', '-6%'])

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative overflow-hidden py-20 md:py-28"
    >
      {/* Bilog na sumusunod sa cursor (gaya ng sa Hero) */}
      <CursorLens />

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Subtitle + section number */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-between gap-4 text-sm font-semibold text-neutral-500 md:text-lg"
        >
          <span>
            {SUBTITLE} · {TOTAL} tools
          </span>
          <span>{sectionNumber('skills')}</span>
        </motion.div>

        {/* Malaking "/SKILLS": isa-isang umaangat ang letra */}
        <motion.h2
          style={reduceMotion ? undefined : { x: headingX }}
          aria-label="Skills"
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          className="condensed mt-2 flex justify-end text-[clamp(5rem,24vw,18rem)]"
        >
          {HEADING.split('').map((letter, i) => (
            <span key={i} className="-mx-[0.02em] inline-block overflow-hidden px-[0.02em] pt-[0.04em]">
              <motion.span
                aria-hidden
                variants={{
                  hidden: { y: '110%' },
                  show: { y: '0%', transition: { duration: 0.9, ease: EASE } },
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        {/* Mga category */}
        <div className="mt-10 border-b border-dashed border-current/25 md:mt-16">
          {stack.map((group) => (
            <StackRow key={group.category} group={group} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills