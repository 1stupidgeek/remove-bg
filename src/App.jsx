import KanyeWest from "./components/landing/KanyeWest.jsx";
import Hero from "./components/landing/Hero.jsx";
import Features from "./components/landing/Features.jsx";
import CTA from "./components/landing/CTA.jsx";
import Footer from "./components/landing/Footer.jsx";

function App() {
  return (
    <main className="min-h-screen bg-[#f3f4f6] text-black font-sans selection:bg-[#3b68ff] selection:text-white">
      <Hero />
      <KanyeWest />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}



export default App;