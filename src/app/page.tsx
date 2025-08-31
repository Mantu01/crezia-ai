import CTA from '@/components/home/CTA';
import Features from '@/components/home/Features';
import Hero from '@/components/home/Hero';
import Process from '@/components/home/Process';
import Stats from '@/components/home/Stats';
import Footer from '@/components/layout/Footer';
import Effect from '@/components/ui/cursor_effect';

export default function Home() {

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <Effect/>
      <Hero />
      <Stats />
      <Features />
      <Process />
      <CTA />
      <Footer />
    </div>
  );
}