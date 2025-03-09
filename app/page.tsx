import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Gallery from './components/Gallery';
import ReservationForm from './components/ReservationForm';
import Contact from './components/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Menu />
      <Gallery />
      <ReservationForm />
      <Contact />
    </main>
  );
} 