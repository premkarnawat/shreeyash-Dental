import { StoreProvider } from '../hooks/useStore'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Pricing from '../components/Pricing'
import Appointment from '../components/Appointment'
import { About, Gallery, News, Contact } from '../components/Sections'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <StoreProvider>
      <main>
        <Hero />
        <Services />
        <Pricing />
        <Appointment />
        <About />
        <Gallery />
        <News />
        <Contact />
        <Footer />
      </main>
    </StoreProvider>
  )
}
