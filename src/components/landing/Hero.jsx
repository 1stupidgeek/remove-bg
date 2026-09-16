import { Link } from "react-router-dom";
import KofiTipJar from "./KofiTipJar";

function Hero() {
    return (
        <section className="bg-white px-4 py-3 sm:px-6 sm:py-12 md:px-8 md:py-16">
            <div className="mx-auto max-w-4xl">

                <header className="">
                    <div className="max-w-4xl">
                        <div className="mb-5 inline-flex items-center border border-black/10 bg-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-black/40 sm:text-xs">
                            Free and Secure Background Removing Tool
                        </div>

                        <h1 className="mt-3 mb-6 text-4xl font-black leading-[0.9] tracking-tighter text-black sm:text-5xl md:text-6xl">
                            Remove backgrounds.
                            <br />
                            <span className="text-[#3b68ff]">
                                Without uploading.
                            </span>
                        </h1>

                        <p className="border-b w-fit mt-4 font-mono text-[10px] font-bold uppercase tracking-wider text-black/40 sm:text-[11px]">
                            Your images never leave your device
                        </p>
                        <p className="mt-3 max-w-2xl text-[15px] leading-[1.7] text-black/60 sm:text-base">
                            Cut out the background from your images using AI
                            that runs <span className="inline-flex items-center border border-black/10 bg-whit px-1 font-mono text-[10px] font-bold uppercase tracking-wider text-black/40 sm:text-xs">directly in your browser</span>
                        </p>

                        <div className="mt-4 w-full">
                            <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                                {/* LEFT — MAIN CTA */}
                                <div>
                                    <Link
                                        to="/remove"
                                        className="inline-flex border border-black bg-black px-6 py-3 text-sm font-bold text-white transition-colors hover:border-[#3b68ff] hover:bg-[#3b68ff]"
                                    >
                                        Remove a background →
                                    </Link>

                                    <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-wider text-black/40 sm:text-[11px]">
                                        No accounts · No uploads · No breach of privacy
                                    </p>
                                </div>

                                {/* RIGHT — SUPPORT */}
                                <KofiTipJar />
                            </div>
                        </div>
                    </div>
                </header>

            </div>
        </section>
    );
}

export default Hero;