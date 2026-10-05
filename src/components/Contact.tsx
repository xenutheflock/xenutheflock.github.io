import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { EMAIL, NAME, linkProps, socials } from '../data/profile'
import { sectionNumber } from '../data/sections'

/* ====== PALITAN MO ITO NG INFO MO ======
   (Email, pangalan, at social links: nasa src/data/profile.ts) */
const BIG_NAME = NAME // ang napakalaking pangalan sa baba
const COPYRIGHT = `© ${new Date().getFullYear()} Code by ${NAME}. All rights reserved.`
/* ======================================= */

const EASE = [0.22, 1, 0.36, 1] as const

// Pinapalaki ang text para eksaktong sumakto sa buong lapad ng container
function useFitText() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return
    let active = true

    function fit() {
      if (!active || !container || !text) return
      text.style.fontSize = '100px'
      const ratio = container.clientWidth / text.getBoundingClientRect().width
      text.style.fontSize = `${100 * ratio * 0.995}px`
    }

    fit()
    document.fonts.ready.then(fit) // ulitin kapag na-load na ang font
    const observer = new ResizeObserver(fit) // ulitin kapag nag-resize o nagpalit ng font
    observer.observe(container)
    observer.observe(text)

    return () => {
      active = false
      observer.disconnect()
    }
  }, [])

  return { containerRef, textRef }
}

function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const { containerRef, textRef } = useFitText()
  const reduceMotion = useReducedMotion() // kung naka-on: walang ikot/akyat sa scroll

  // 0 = papasok pa lang ang footer sa baba, 1 = dulo na ng page
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end end'] })

  // Arrow: umiikot papunta sa ↗ habang nag-i-scroll (bumabalik pag pataas)
  const arrowRotate = useTransform(scrollYProgress, [0, 0.7], [-90, 0])
  // Pangalan: bahagyang umaakyat habang papalapit sa dulo
  const nameY = useTransform(scrollYProgress, [0, 1], ['15%', '0%'])

  return (
    <footer
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden bg-neutral-200 text-neutral-950 dark:bg-neutral-900 dark:text-white"
    >
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-20 md:px-8 md:pt-28">
        {/* Section number (kanan-taas, gaya ng ibang section) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8 flex justify-end text-sm font-semibold text-neutral-500 md:mb-12 md:text-lg"
        >
          {sectionNumber('contact')}
        </motion.div>

        {/* TAAS: arrow + LET'S WORK TOGETHER + button */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-5 md:gap-10">
            {/* Arrow: umiikot sa scroll + laging bahagyang tumuturo */}
            <motion.svg
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="11"
              strokeLinecap="square"
              style={reduceMotion ? undefined : { rotate: arrowRotate }}
              animate={{ x: [0, 6, 0], y: [0, -6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="h-20 w-20 shrink-0 md:h-36 md:w-36"
              aria-hidden
            >
              <path d="M14 86 L82 18" />
              <path d="M28 18 H82 V72" />
            </motion.svg>

            {/* Dalawang linya na umaangat */}
            <motion.h2
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.5 }}
              variants={{ show: { transition: { staggerChildren: 0.12 } } }}
              className="text-4xl font-semibold uppercase leading-[1.05] tracking-tight md:text-7xl"
            >
              {['Let’s work', 'together'].map((line) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    variants={{
                      hidden: { y: '110%' },
                      show: { y: '0%', transition: { duration: 0.8, ease: EASE } },
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h2>
          </div>

          {/* SEND ME A MESSAGE: napupuno ng kulay mula sa ilalim pag hover */}
          <motion.a
            href={`mailto:${EMAIL}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="group/btn relative inline-flex shrink-0 items-center justify-center self-start overflow-hidden border-2 border-current px-6 py-4 text-base font-semibold uppercase md:text-xl"
          >
            <span className="absolute inset-0 translate-y-full bg-neutral-950 transition-transform duration-500 ease-out group-hover/btn:translate-y-0 dark:bg-white" />
            <span className="relative transition-colors duration-500 group-hover/btn:text-white dark:group-hover/btn:text-neutral-950">
              Send me a message
            </span>
          </motion.a>
        </div>

        {/* LINYA: gumuguhit mula kaliwa pakanan */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1.2, ease: EASE }}
          className="mt-14 h-px origin-left bg-current/40 md:mt-20"
        />

        {/* NAPAKALAKING PANGALAN: sakto sa buong lapad, isa-isang umaangat ang letra */}
        <div ref={containerRef} className="mt-8 md:mt-12">
          {/* Pang-design lang (nasa Hero na ang pangalan), kaya nakatago sa screen reader */}
          <motion.span
            ref={textRef}
            aria-hidden
            style={reduceMotion ? undefined : { y: nameY }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="inline-flex whitespace-nowrap font-condensed uppercase leading-[0.95]"
          >
            {BIG_NAME.split('').map((letter, i) => (
              <span key={i} className="inline-block overflow-hidden">
                <motion.span
                  variants={{
                    hidden: { y: '110%' },
                    show: { y: '0%', transition: { duration: 1, ease: EASE } },
                  }}
                  className="inline-block"
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              </span>
            ))}
          </motion.span>
        </div>

        {/* BABA: copyright + links */}
        <div className="mt-6 flex flex-col gap-4 text-xs font-semibold uppercase tracking-wide md:mt-8 md:flex-row md:items-center md:justify-between">
          <p className="opacity-70">{COPYRIGHT}</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 md:gap-x-12">
            {socials.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...linkProps(link.href)}
                  className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Contact