import { MotionConfig } from 'motion/react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'

function App() {
  return (
    // reducedMotion="user": kung naka-on ang "reduce motion" sa device ng bisita,
    // hindi na gagalaw/dudulas ang mga animation (fade lang ang matitira)
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
      </main>
      <Contact />
    </MotionConfig>
  )
}

export default App
