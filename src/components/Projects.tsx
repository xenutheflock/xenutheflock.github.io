import { useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion, useSpring, useTransform, useVelocity } from 'motion/react'
import { FiArrowUpRight } from 'react-icons/fi'
import { projects, type Project } from '../data/projects'
import { sectionNumber } from '../data/sections'
import CursorLens from './CursorLens'

/* ====== PALITAN MO ITO NG INFO MO ====== */
const INTRO =
  'Edzel turns ideas into working software, from a public sticky-note wall to a crime analytics capstone and a learning management system, always with a focus on clean design and solid security.'
/* ======================================= */

/* Laki ng preview na sumusunod sa cursor (pixels). 2:1 para sakto sa mga screenshot. */
const PREVIEW_W = 440
const PREVIEW_H = 220

// Picture ng project. Kung wala pa ang file sa public/projects/ (o sira), "fallback" ang lalabas.
function ProjectImage({
  src,
  alt,
  className,
  lazy = false,
  fallback = null,
}: {
  src: string
  alt: string
  className: string
  lazy?: boolean
  fallback?: ReactNode
}) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return fallback
  return (
    <img
      src={src}
      alt={alt}
      loading={lazy ? 'lazy' : undefined}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}

// Bilog na "GET IN TOUCH" button: medyo hinihila papunta sa cursor (magnetic)
function MagneticCircle({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const spring = { stiffness: 200, damping: 15, mass: 0.4 }
  const x = useSpring(0, spring)
  const y = useSpring(0, spring)

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    x.set((e.clientX - (box.left + box.width / 2)) * 0.35)
    y.set((e.clientY - (box.top + box.height / 2)) * 0.35)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      initial={{ scale: 0, rotate: -90 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: false }}
      transition={{ type: 'spring', stiffness: 160, damping: 14 }}
      className="circle flex h-36 w-36 shrink-0 items-center justify-center border border-neutral-400 text-center text-xl font-semibold uppercase leading-tight transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white md:h-44 md:w-44 md:text-2xl dark:border-neutral-600 dark:hover:border-white dark:hover:bg-white dark:hover:text-neutral-900"
    >
      {children}
    </motion.a>
  )
}

// Isang row sa listahan: malaking pangalan (isa-isang umaangat ang letra) at category sa kanan
function ProjectRow({ project, onHover }: { project: Project; onHover: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const words = project.title.split(' ')

  const content = (
    <div
      ref={ref}
      className="flex flex-col gap-3 py-6 md:flex-row md:items-center md:justify-between md:gap-10 md:py-8"
    >
      {/* Pangalan ng project: isa-isang umaangat ang letra (tulad ng /ABOUT) */}
      <h3 className="min-w-0 flex-1">
        <span className="sr-only">{project.title}</span>
        <motion.span
          aria-hidden
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          variants={{ show: { transition: { staggerChildren: 0.04 } } }}
          className="block font-condensed text-[clamp(3rem,8vw,7rem)] leading-[1.15] transition-[translate] duration-500 ease-out group-hover:translate-x-4"
        >
          {words.map((word, w) => (
            <span key={w}>
              {/* Isang salita: hindi nahahati sa gitna kapag nag-wrap */}
              <span className="inline-block whitespace-nowrap">
                {word.split('').map((letter, i) => (
                  <span key={i} className="-mx-[0.02em] inline-block overflow-hidden px-[0.02em]">
                    <motion.span
                      className="inline-block"
                      variants={{
                        hidden: { y: '110%', transition: { duration: 0.3 } },
                        show: { y: '0%', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
                      }}
                    >
                      {letter}
                    </motion.span>
                  </span>
                ))}
              </span>
              {w < words.length - 1 && ' '}
            </span>
          ))}
        </motion.span>
      </h3>

      {/* Category + tech (kanan) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="shrink-0 md:max-w-[240px] md:text-right"
      >
        <p className="flex items-center gap-1.5 text-base font-medium md:justify-end md:text-lg">
          {project.category}
          {/* Arrow: may link ang project (bubukas sa bagong tab) */}
          {project.link && (
            <FiArrowUpRight
              aria-hidden
              className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          )}
        </p>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{project.tags.join(' · ')}</p>
      </motion.div>

      {/* Sa phone lang: description at picture (walang hover sa phone) */}
      <p className="text-sm text-neutral-500 md:hidden dark:text-neutral-400">{project.description}</p>
      <ProjectImage
        src={project.image}
        alt={`Screenshot of ${project.title}`}
        lazy
        className="aspect-[2/1] w-full border border-neutral-200 object-cover object-top md:hidden dark:border-neutral-800"
      />
    </div>
  )

  // Kapag hinover ang isang row, lumalabo ang iba (opacity)
  const rowClass =
    'group block border-t border-dashed border-neutral-400 transition-opacity duration-300 group-hover/list:opacity-30 hover:opacity-100 dark:border-neutral-600'

  // Kung may link, clickable ang buong row
  return project.link ? (
    <a href={project.link} target="_blank" rel="noreferrer" onMouseEnter={onHover} className={rowClass}>
      {content}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <div onMouseEnter={onHover} className={rowClass}>
      {content}
    </div>
  )
}

// Isang "slide" sa preview: picture (o placeholder) + maikling description
function PreviewPanel({ project }: { project: Project }) {
  return (
    <div className="relative h-full w-full">
      <ProjectImage
        src={project.image}
        alt=""
        className="h-full w-full object-cover object-top"
        fallback={
          <div className="flex h-full w-full items-center justify-center px-6">
            <span className="hero-name text-center text-4xl text-neutral-300 dark:text-neutral-600">
              {project.title}
            </span>
          </div>
        }
      />
      <div className="absolute inset-x-0 bottom-0 bg-neutral-950/85 px-3 py-2 text-xs text-white">
        <p className="line-clamp-2">{project.description}</p>
      </div>
    </div>
  )
}

function Projects() {
  const [current, setCurrent] = useState(0) // aling project ang naka-preview
  const [showPreview, setShowPreview] = useState(false)
  const reduceMotion = useReducedMotion() // kung naka-on: hindi tumatagilid ang preview

  // Posisyon ng preview: sumusunod sa cursor
  const previewSpring = { stiffness: 250, damping: 25, mass: 0.5 }
  const mouseX = useSpring(0, previewSpring)
  const mouseY = useSpring(0, previewSpring)

  // Tumatagilid ang preview depende sa bilis ng galaw ng mouse (pabalik-balik)
  const velocityX = useVelocity(mouseX)
  const rotate = useTransform(velocityX, [-2000, 2000], [-12, 12], { clamp: true })

  function handleMouseEnter(e: React.MouseEvent) {
    // Ilagay agad sa cursor para hindi "lumipad" mula sa sulok
    mouseX.jump(e.clientX)
    mouseY.jump(e.clientY)
  }

  function handleMouseMove(e: React.MouseEvent) {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }

  return (
    <section id="projects" className="relative overflow-hidden">
      {/* Bilog na sumusunod sa cursor; nakatago habang may project preview */}
      <CursorLens hidden={showPreview} />

      <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
        {/* Intro text + GET IN TOUCH */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-2xl font-medium leading-snug md:text-4xl md:leading-tight"
          >
            {INTRO}
          </motion.p>
          <MagneticCircle href="#contact">
            Get in
            <br />
            touch
          </MagneticCircle>
        </div>

        {/* Label */}
        <div className="mt-16 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-neutral-500 md:mt-24">
          <span>Selected Works</span>
          <span>{sectionNumber('projects')}</span>
        </div>

        {/* Listahan ng projects */}
        <div
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setShowPreview(false)}
          className="group/list mt-6 border-b border-dashed border-neutral-400 dark:border-neutral-600"
        >
          {projects.map((project, i) => (
            <ProjectRow
              key={project.title}
              project={project}
              onHover={() => {
                setCurrent(i)
                setShowPreview(true)
              }}
            />
          ))}
        </div>
      </div>

      {/* PREVIEW na sumusunod sa cursor (desktop lang) */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
        style={{ x: mouseX, y: mouseY, rotate: reduceMotion ? 0 : rotate }}
      >
        <motion.div
          initial={false}
          animate={{ scale: showPreview ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="-translate-x-1/2 -translate-y-1/2 overflow-hidden bg-neutral-100 shadow-2xl dark:bg-neutral-800"
          style={{ width: PREVIEW_W, height: PREVIEW_H }}
        >
          {/* Naka-stack ang lahat ng preview; dumudulas pataas/pababa papunta sa hinover na project */}
          <motion.div
            className="h-full"
            animate={{ y: `${-current * 100}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
          >
            {projects.map((project) => (
              <PreviewPanel key={project.title} project={project} />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Projects