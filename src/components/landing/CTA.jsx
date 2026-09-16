import { Link } from "react-router-dom";

function CTA(){
    return(
        
      <section className="bg-[#3b68ff] border-y border-black/10 px-6 py-32 text-center">
        <h2 className="text-5xl font-black tracking-tighter text-white sm:text-7xl">
          Ready to remove some backgrounds?
        </h2>

        <p className="mt-6 text-lg font-medium text-white/80">
          No signup. No upload queue. Just drop an image.
        </p>

        <Link
          to="/remove"
          className="mt-10 inline-block bg-white px-8 py-4 text-sm font-bold text-black shadow-xl transition-transform hover:scale-105 hover:bg-[#f3f4f6]"
        >
          Remove a background →
        </Link>
      </section>
    )
}

export default CTA;