function About() {
  return (
    <div className="pt-12 pb-20">
      <div className="border-t border-line pt-8">
        <h1 className="text-[22px] font-[650] tracking-tight text-ink mb-6">
          About the tool
        </h1>

        <div className="space-y-4 text-[15px] leading-[1.7] text-ink/80">
          <p>
            This is a simple tool to remove the background from images. It
            uses machine learning models to determine which part of an image
            to keep and which part to remove.
          </p>

          <p>
            It runs locally in your browser, so your images never leave your
            device.
          </p>

          <p>
            This is a static site, which means there's no server involved in
            processing — the only job of the server is to serve the website
            and the model files.
          </p>

          <p>
            <code className="font-mono text-[13px] bg-panel border border-line px-[5px] py-[1px] rounded">
              U²-NetP
            </code>{" "}
            is the default model and the fastest, chosen to keep latency
            low. If you want better quality, you can switch to one of the
            larger models like{" "}
            <code className="font-mono text-[13px] bg-panel border border-line px-[5px] py-[1px] rounded">
              Silueta
            </code>
            , which trades some speed for sharper results.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;