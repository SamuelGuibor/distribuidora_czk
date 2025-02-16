import Header from './components/header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';

export default function Home() {

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ContactSection />
      </main>
    </>
  );
}
