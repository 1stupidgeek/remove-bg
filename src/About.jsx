function About() {
  return (
    <div className="min-h-screen bg-white px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <header className="mb-12 border-black/10 sm:mb-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 sm:text-xs">
                ABOUT THE TOOL
              </p>

              <h1 className="m-0 text-4xl font-black tracking-tighter text-black sm:text-5xl md:text-6xl">
                About<span className="text-[#3b68ff]"> Nuke My BG</span>
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-[15px] leading-[1.7] text-black/60 sm:text-base">
            A simple tool for removing backgrounds from images,
            with the entire process running locally in your
            browser.
          </p>
        </header>


        {/* CONTENT */}
        <div className="space-y-10 sm:space-y-12">

          {/* 01 */}
          <section className="border-l-4 border-[#3b68ff] pl-5 sm:pl-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-[10px] font-bold tracking-widest text-[#3b68ff] sm:text-[11px]">
                01
              </span>

              <h2 className="text-base font-black tracking-tight text-black sm:text-lg">
                What is this?
              </h2>
            </div>

            <div className="space-y-3 text-[15px] leading-[1.7] text-black/70">
              <p>
                This is a simple, privacy-focused tool for
                removing backgrounds from images. Drop an
                image in, let the model figure out what belongs
                to the foreground, and you get a transparent
                image back.
              </p>

              <p>
                There are plenty of websites that can do this,
                but most of them require you to upload your
                images to a server. This tool takes a slightly
                different approach.
              </p>
            </div>
          </section>


          {/* 02 */}
          <section className="border-l-4 border-black/10 pl-5 sm:pl-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-[10px] font-bold tracking-widest text-black/30 sm:text-[11px]">
                02
              </span>

              <h2 className="text-base font-black tracking-tight text-black sm:text-lg">
                Everything runs in your browser
              </h2>
            </div>

            <div className="space-y-3 text-[15px] leading-[1.7] text-black/70">
              <p>
                The background removal happens entirely on
                your device using machine learning models that
                run directly in your browser. Your image
                doesn't leave your device.
              </p>

              <p>
                When you first use the tool, your browser
                downloads the model files it needs. After that,
                the actual image processing happens locally
                using your CPU or GPU.
              </p>

              <p>
                The models are cached, so you technically only
                download them once, when you first run them.
                Afterwards, you should be able to load the
                models within seconds.
              </p>
            </div>
          </section>


          {/* 03 */}
          <section className="border-l-4 border-black/10 pl-5 sm:pl-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-[10px] font-bold tracking-widest text-black/30 sm:text-[11px]">
                03
              </span>

              <h2 className="text-base font-black tracking-tight text-black sm:text-lg">
                No image-processing server
              </h2>
            </div>

            <div className="text-[15px] leading-[1.7] text-black/70">
              <p>
                The website itself is static. There's no
                backend receiving your images, no upload queue,
                and no server processing them for you. The
                server's job is essentially just to deliver the
                website and the machine learning models to your
                browser.
              </p>
            </div>
          </section>


          {/* 04 */}
          <section className="border-l-4 border-black/10 pl-5 sm:pl-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-[10px] font-bold tracking-widest text-black/30 sm:text-[11px]">
                04
              </span>

              <h2 className="text-base font-black tracking-tight text-black sm:text-lg">
                The models
              </h2>
            </div>

            <div className="space-y-4 text-[15px] leading-[1.7] text-black/70">
              <p>
                Background removal is handled by machine
                learning models that identify the subject of
                an image and separate it from the background.
              </p>

              <p>
                The default model is{" "}
                <code className="border border-black/10 bg-[#f7f7f7] px-1.5 py-0.5 font-mono text-[12px] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.06)]">
                  U²-NetP
                </code>
                . It's relatively small and fast, making it a
                good default for basic use. If you need
                cleaner edges and more detailed results, you
                can switch to larger models like{" "}
                <code className="border border-black/10 bg-[#f7f7f7] px-1.5 py-0.5 font-mono text-[12px] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.06)]">
                  BRIA RMBG
                </code>
                , which requires a larger download (90MB) for sharper results.
              </p>

              <div className="border border-black/10 bg-[#3b68ff] p-4 text-white shadow-[5px_5px_0px_0px_rgba(0,0,0,0.12)] sm:p-5">
                <p className="m-0 text-sm font-bold leading-relaxed">
                  GPU models use WebGPU and can take advantage
                  of your graphics card. CPU models use
                  WebAssembly and run without WebGPU support.
                </p>

                <p className="mt-2 m-0 text-xs leading-relaxed text-white/70">
                  If your browser and hardware support WebGPU,
                  it's generally worth trying the GPU models
                  first, simply because they perform better.
                </p>
              </div>

              <p>
                Larger models generally take more time to
                download and run, so there's a trade-off
                between speed, time and quality.
              </p>
            </div>
          </section>


          {/* 05 */}
          <section className="border-l-4 border-black/10 pl-5 sm:pl-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono text-[10px] font-bold tracking-widest text-black/30 sm:text-[11px]">
                05
              </span>

              <h2 className="text-base font-black tracking-tight text-black sm:text-lg">
                Why make this?
              </h2>
            </div>

            <div className="text-[15px] leading-[1.7] text-black/70">
              <p>
                Hold on, I'm still figuring that out.
              </p>
            </div>
          </section>
        </div>


        {/* FOOTER */}
        <footer className="mt-16 border-t border-black/10 pt-6 sm:mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          </div>
        </footer>

      </div>
    </div>
  );
}

export default About;