import { Link } from "react-router-dom";

function KanyeWest() {
    return (
        <div className="bg-[#3b68ff] p-4 sm:p-6 md:p-10 lg:p-12">
            <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">

                {/* Text */}
                <div className="flex flex-col justify-center lg:col-span-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                        SIMPLE BY DESIGN
                    </p>

                    <h2 className="mt-3 text-3xl font-black tracking-tighter text-white sm:text-4xl md:text-5xl">
                        Drop an image.
                        <br />
                        Get a cutout.
                    </h2>

                    <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">
                        Upload an image, choose an AI model, and let your browser do
                        the rest. Download the result as a transparent PNG.
                    </p>

                    <Link
                        to="/remove"
                        className="mt-7 w-fit text-sm font-bold text-white underline decoration-2 underline-offset-4 transition-opacity hover:opacity-70"
                    >
                        Try it yourself →
                    </Link>
                </div>

                {/* Image comparison */}
                <div className="w-full min-w-0 lg:col-span-8">
                    <div className="w-full bg-white p-1.5 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.12)] sm:p-2">

                        <div className="relative grid aspect-[4/3] w-full grid-cols-2 overflow-hidden border border-black/10 sm:aspect-[16/9]">

                            {/* Original */}
                            <div className="relative min-w-0 overflow-hidden border-r border-black/10 bg-[#f3f4f6]">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <img
                                        src="/KanyeWest.jpg"
                                        className="h-full w-full object-cover"
                                        alt="Original"
                                    />
                                </div>

                                <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 sm:bottom-5">
                                    <p className="whitespace-nowrap border border-black/10 bg-white px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] sm:px-3 sm:py-1.5 sm:text-xs">
                                        Original
                                    </p>
                                </div>
                            </div>

                            {/* Removed */}
                            <div
                                className="relative min-w-0 overflow-hidden bg-white"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                                        linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                                        linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                                        linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                                    `,
                                    backgroundSize: "20px 20px",
                                    backgroundPosition:
                                        "0 0, 0 10px, 10px -10px, -10px 0",
                                }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <img
                                        src="/removed-KanyeWest.png"
                                        className="h-full w-full object-cover drop-shadow-2xl"
                                        alt="Removed"
                                    />
                                </div>

                                <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 sm:bottom-5">
                                    <p className="whitespace-nowrap border border-black/10 bg-white px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] sm:px-3 sm:py-1.5 sm:text-xs">
                                        Background removed
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default KanyeWest;
