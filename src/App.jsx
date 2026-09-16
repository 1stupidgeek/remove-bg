import { Link } from "react-router-dom";
import KofiTipJar from "./components/KofiTipJar";

function App() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-500">
            Free and Secure Background Removing Tool
          </div>

          <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
            Remove backgrounds.
            <br />
            <span className="text-zinc-400">Without uploading.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-zinc-500 sm:text-lg">
            Cut out the background from your images using AI that runs
            directly in your browser. Your images stay on your device.
          </p>

          <div className="mt-9 flex justify-center">
            <Link
              to="/remove"
              className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
            >
              Remove a background →
            </Link>
          </div>

          <p className="mt-4 text-xs text-zinc-400">
            No account · No uploads · No nonsense
          </p>
          <KofiTipJar />
        </div>
      </section>

      {/* Demo */}
      <section className="border-y border-zinc-100 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-zinc-400">
                SIMPLE BY DESIGN
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Drop an image.
                <br />
                Get a cutout.
              </h2>

              <p className="mt-5 max-w-md leading-7 text-zinc-500">
                Upload an image, choose an AI model, and let your browser do
                the rest. Download the result as a transparent PNG.
              </p>

              <Link
                to="/remove"
                className="mt-7 inline-block text-sm font-medium text-zinc-900 underline underline-offset-4"
              >
                Try it yourself →
              </Link>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
              <div className="grid aspect-[4/3] grid-cols-2 overflow-hidden rounded-xl">
                <div className="relative flex items-center justify-center bg-zinc-100">
                  <div className="text-center">
                    {/* <div className="text-4xl">🧑‍💻</div> */}
                    <div className="text-4xl">
                      <img
                        src="/KanyeWest.jpg"
                      />
                    </div>
                    <p className="mt-3 text-xs text-zinc-400">
                      Original
                    </p>
                  </div>
                </div>

                <div
                  className="relative flex items-center justify-center"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #eee 25%, transparent 25%),
                      linear-gradient(-45deg, #eee 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #eee 75%),
                      linear-gradient(-45deg, transparent 75%, #eee 75%)
                    `,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0",
                  }}
                >
                  <div className="text-center">
                    <div className="text-4xl">
                      <img
                        src="/removed-KanyeWest.png"
                      />
                    </div>
                    <p className="mt-3 text-xs text-zinc-400">
                      Background removed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-zinc-400">
            WHY USE 'REMOVE THAT BG'?
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Your browser does everything.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
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

      <section className="mx-auto px-6 py-24 text-center bg-zinc-950">
        <h2 className="text-4xl font-semibold tracking-tight text-white">
          Ready to cut some backgrounds?
        </h2>

        <p className="mt-4 text-zinc-500">
          No signup. No upload queue. Just drop an image.
        </p>

        <Link
          to="/remove"
          className="mt-8 inline-block rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          Remove a background →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 text-xs text-zinc-400">
          <span>Remove That BG</span>
          <span></span>
        </div>
      </footer>
    </main>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-6">
      <div className="text-xl">{icon}</div>

      <h3 className="mt-5 font-medium">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-zinc-500">
        {text}
      </p>
    </div>
  );
}

export default App;