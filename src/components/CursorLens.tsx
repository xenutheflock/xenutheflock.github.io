import { useEffect, useRef, useState } from 'react'
import { motion, useSpring } from 'motion/react'

type CursorLensProps = {
  size?: number // laki ng bilog (pixels)
  hidden?: boolean // pansamantalang itago (hal. habang may ibang sumusunod sa cursor)
}

/* INVERT LENS: bilog na sumusunod sa cursor at binabaliktad ang kulay ng nasa ilalim.
   Paano gamitin: ilagay ang <CursorLens /> sa loob ng section na may "relative overflow-hidden".
   Ang section na iyon (ang parent) ang binabantayan, kaya doon lang lalabas ang bilog.
   Mouse lang (hindi lalabas sa touch/phone). */
function CursorLens({ size = 200, hidden = false }: CursorLensProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [inside, setInside] = useState(false)

  // Mabilis na spring para dikit sa cursor
  const spring = { stiffness: 400, damping: 35 }
  const x = useSpring(0, spring)
  const y = useSpring(0, spring)

  useEffect(() => {
    const area = ref.current?.parentElement
    if (!area) return
    let last: { x: number; y: number } | null = null // huling pwesto ng cursor sa screen

    // Ilagay ang gitna ng bilog sa cursor. jump = diretso, walang "lipad".
    function place(jump: boolean) {
      if (!last || !area) return
      const box = area.getBoundingClientRect()
      const nextX = last.x - box.left - size / 2
      const nextY = last.y - box.top - size / 2
      if (jump) {
        x.jump(nextX)
        y.jump(nextY)
      } else {
        x.set(nextX)
        y.set(nextY)
      }
    }

    function handleEnter(e: PointerEvent) {
      if (e.pointerType !== 'mouse') return
      last = { x: e.clientX, y: e.clientY }
      place(true) // pagpasok: ilagay agad sa cursor
      setInside(true)
    }
    function handleMove(e: PointerEvent) {
      if (e.pointerType !== 'mouse') return
      last = { x: e.clientX, y: e.clientY }
      place(false)
      setInside(true)
    }
    function handleLeave() {
      setInside(false)
    }
    // Nag-scroll pero hindi gumalaw ang mouse: sumabay pa rin sa cursor
    function handleScroll() {
      place(true)
    }

    area.addEventListener('pointerenter', handleEnter)
    area.addEventListener('pointermove', handleMove)
    area.addEventListener('pointerleave', handleLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      area.removeEventListener('pointerenter', handleEnter)
      area.removeEventListener('pointermove', handleMove)
      area.removeEventListener('pointerleave', handleLeave)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [size, x, y])

  const visible = inside && !hidden

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className="circle pointer-events-none absolute left-0 top-0 z-40 hidden border border-white/40 shadow-[0_0_40px_rgba(0,0,0,0.15)] md:block"
      style={{
        width: size,
        height: size,
        x,
        y,
        backdropFilter: 'invert(1)',
        WebkitBackdropFilter: 'invert(1)',
      }}
      initial={false}
      animate={{ scale: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}

export default CursorLens
