import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'

// Paikutin ang value sa pagitan ng min at max (para walang katapusan ang strip)
function wrap(min: number, max: number, value: number) {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

// 12-point na starburst (✸) na umiikot
function Starburst() {
  const points = Array.from({ length: 24 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 24 - Math.PI / 2
    const r = i % 2 === 0 ? 50 : 30
    return `${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`
  }).join(' ')

  return (
    <svg
      viewBox="0 0 100 100"
      className="mx-[0.35em] inline-block h-[0.6em] w-[0.6em] shrink-0 animate-[spin_6s_linear_infinite] motion-reduce:animate-none"
      aria-hidden
    >
      <polygon points={points} fill="currentColor" />
    </svg>
  )
}

type MarqueeProps = {
  items: string[]
  speed?: number // bilis kapag hindi nag-i-scroll (% kada segundo)
}

function Marquee({ items, speed = 2 }: MarqueeProps) {
  const baseX = useMotionValue(0)
  const direction = useRef(-1) // -1 = pakaliwa, 1 = pakanan
  const reduceMotion = useReducedMotion() // kung naka-on: nakatigil ang strip

  // Bilis ng scroll ng user → pampabilis ng strip
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const boost = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false })

  // Tumatakbo bawat frame: laging gumagalaw, bumibilis at bumabaliktad depende sa scroll
  useAnimationFrame((_, delta) => {
    if (reduceMotion) return
    const b = boost.get()
    if (b < 0) direction.current = 1 // scroll pataas → pakanan
    else if (b > 0) direction.current = -1 // scroll pababa → pakaliwa

    let moveBy = direction.current * speed * (delta / 1000)
    moveBy += moveBy * Math.abs(b)
    baseX.set(baseX.get() + moveBy)
  })

  // 4 na kopya ng text → paikot sa pagitan ng -25% at -50% para walang putol
  const x = useTransform(baseX, (v) => `${wrap(-50, -25, v)}%`)

  const group = [...items, ...items]

  return (
    <div className="overflow-hidden" aria-hidden>
      <motion.div style={{ x }} className="condensed flex w-max items-center whitespace-nowrap">
        {Array.from({ length: 4 }).map((_, copy) => (
          <div key={copy} className="flex items-center">
            {group.map((item, i) => (
              <span key={i} className="flex items-center">
                {item}
                <Starburst />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default Marquee