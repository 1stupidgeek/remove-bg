function About() {
  return (
    <div className="pt-12 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="border-t border-line pt-8 pb-10">
            
          <h1 className="text-[30px] font-[650] tracking-[-0.03em] text-ink">
            About the tool
          </h1>

          <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-ink/60">
            A simple tool for removing backgrounds from images, with the
            entire process running locally in your browser.
          </p>
        </div>

        <div className="space-y-10">
          {/* What is this */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[11px] text-ink/35">
                01
              </span>

              <h2 className="text-[16px] font-[600] text-ink">
                What is this?
              </h2>
            </div>

            <div className="pl-7 space-y-3 text-[15px] leading-[1.7] text-ink/75">
              <p>
                This is a simple, privacy-focused tool for removing
                backgrounds from images. Drop an image in, let the model
                figure out what belongs to the foreground, and you get a
                transparent image back.
              </p>

              <p>
                There are plenty of websites that can do this, but most of
                them require you to upload your images to a server. This tool
                takes a slightly different approach.
              </p>
            </div>
          </section>

          {/* Browser */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[11px] text-ink/35">
                02
              </span>

              <h2 className="text-[16px] font-[600] text-ink">
                Everything runs in your browser
              </h2>
            </div>

            <div className="pl-7 space-y-3 text-[15px] leading-[1.7] text-ink/75">
              <p>
                The background removal happens entirely on your device using
                machine learning models that run directly in your browser.
                Your image doesn't leave your device.
              </p>

              <p>
                When you first use the tool, your browser downloads the model
                files it needs. After that, the actual image processing happens
                locally using your CPU or GPU.
              </p>

              <p>
                The models are cached, so you technically only download them
                once, when you first run them. Afterwards, you should be able
                to load the models within seconds.
              </p>
            </div>
          </section>

          {/* Server */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[11px] text-ink/35">
                03
              </span>

              <h2 className="text-[16px] font-[600] text-ink">
                No image-processing server
              </h2>
            </div>

            <div className="pl-7 text-[15px] leading-[1.7] text-ink/75">
              <p>
                The website itself is static. There's no backend receiving
                your images, no upload queue, and no server processing them
                for you. The server's job is essentially just to deliver the
                website and the machine learning models to your browser.
              </p>
            </div>
          </section>

          {/* Models */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[11px] text-ink/35">
                04
              </span>

              <h2 className="text-[16px] font-[600] text-ink">
                The models
              </h2>
            </div>

            <div className="pl-7 space-y-3 text-[15px] leading-[1.7] text-ink/75">
              <p>
                Background removal is handled by machine learning models that
                identify the subject of an image and separate it from the
                background.
              </p>

              <p>
                The default model is{" "}
                <code className="font-mono text-[12px] bg-panel border border-line px-[5px] py-[2px] rounded">
                  U²-NetP
                </code>
                . It's relatively small and fast, making it a good default
                for everyday use. If you need cleaner edges and more detailed
                results, you can switch to larger models like{" "}
                <code className="font-mono text-[12px] bg-panel border border-line px-[5px] py-[2px] rounded">
                  Silueta
                </code>
                , which trades some speed for sharper results.
              </p>

              <p>
                Larger models generally take more time to download and run, so
                there's a trade-off between speed, time and quality.
              </p>
            </div>
          </section>

          {/* Why */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[11px] text-ink/35">
                05
              </span>

              <h2 className="text-[16px] font-[600] text-ink">
                Why make this?
              </h2>
            </div>

            <div className="pl-7 text-[15px] leading-[1.7] text-ink/75">
              <p>Hold on, I'm still figuring that out.</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-14 border-t border-line pt-6">
          <p className="text-[13px] text-ink/45">
            No accounts. No uploads. No mysterious image-processing server.
            Just your browser doing its thing.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;