function Features() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-32">
            <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-widest text-black/40">
                    WHY USE 'REMOVE THAT BG'?
                </p>

                <h2 className="mt-4 text-5xl font-black tracking-tighter sm:text-6xl">
                    Your browser does everything.
                </h2>
            </div>

            <div className="mt-16 grid gap-0 border-t border-l border-black/10 sm:grid-cols-2 md:grid-cols-3">
                <Feature
                    title="Runs locally"
                    text="The AI model runs directly in your browser using ONNX Runtime Web."
                />
                <Feature
                    title="Privacy Focussed"
                    text="Your image doesn't need to be uploaded to a server just to remove its background. Its all on your machine."
                />
                <Feature
                    title="Different Models"
                    text="Choose between different models, based on your needs and quality."
                />
                <Feature
                    title="Caching"
                    text="The models download only once, when you first use them. Further, they are cached so you're ready to go within no time."
                />
                <Feature
                    title="Max Quality"
                    text="Since everything runs locally, you get the maximum quality of images."
                />
            </div>
        </section>
    )
}

function Feature({ icon, title, text }) {
    return (
        <div className="border-b border-r border-black/10 bg-white p-10 transition-colors hover:bg-[#f9fafb]">
            {icon && <div className="text-2xl mb-6">{icon}</div>}
            <h3 className="text-lg font-black tracking-tight text-black">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-black/60">
                {text}
            </p>
        </div>
    );
}

export default Features