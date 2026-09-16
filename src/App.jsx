import { useEffect, useRef, useState } from "react";
import "./App.css";
import { getCachedModel, cacheModel } from "./utils/modelCache";

const MODEL_SIZE = 320;

const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];

function App() {
  const SILUETA_URL = "https://models.stupidgeek.org/models/silueta.onnx"
  const U2NETP_URL = "https://models.stupidgeek.org/models/u2netp.onnx"

  const [fileName, setFileName] = useState(null);
  const [model, setModel] = useState(SILUETA_URL);
  const [session, setSession] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const [status, setStatus] = useState("Loading model…");
  const [statusMode, setStatusMode] = useState("");

  const [processing, setProcessing] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [hasOutput, setHasOutput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const inputCanvasRef = useRef(null);
  const outputCanvasRef = useRef(null);

  // async function loadModel(model) {
  //   try {
  //     ort.env.wasm.wasmPaths =
  //       "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/";

  //     const loadedSession = await ort.InferenceSession.create(
  //       model,
  //       {
  //         executionProviders: ["wasm"],
  //         graphOptimizationLevel: "all",
  //       }
  //     );
  //     return loadedSession;
  //   } catch (err) {
  //     console.error(err);
  //     setStatus(`Failed to load model: ${err.message}`);
  //   }
  // }


  async function loadModel(model) {
    try {
      setStatus("Loading model...");
      setStatusMode("loading");

      let modelData = await getCachedModel(model);

      if (modelData) {
        console.log("Loading model from IndexedDB");
      } else {
        console.log("Downloading model...");

        const response = await fetch(model);

        if (!response.ok) {
          throw new Error(
            `Failed to download model: ${response.status}`
          );
        }

        modelData = await response.arrayBuffer();

        await cacheModel(model, modelData);

        console.log("Model saved to IndexedDB");
      }

      ort.env.wasm.wasmPaths =
        "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/";

      const loadedSession = await ort.InferenceSession.create(
        modelData,
        {
          executionProviders: ["wasm"],
          graphOptimizationLevel: "all",
        }
      );

      return loadedSession;

    } catch (err) {
      console.error(err);
      setStatus(`Failed to load model: ${err.message}`);
      setStatusMode("error");

      return null;
    }
  }

  // Load ONNX model
  useEffect(() => {
    // setStatus(`Loading Model ${model}`)
    // setStatusMode("busy");
    // console.log(model)
    async function load() {
      const loadedSession = await loadModel(model);

      setSession(loadedSession);
      setStatus(`Model loaded (${model})`);
      setStatusMode("ok");
    }

    load();
  }, [model]);

  function loadFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const img = new Image();

    img.onload = () => {
      setCurrentImage(img);
      setHasImage(true);
      setHasOutput(false);

      const canvas = inputCanvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.drawImage(img, 0, 0);

      setStatus('Ready — click "Remove background"');
      setStatusMode("ok");
    };

    img.src = URL.createObjectURL(file);
    setFileName(file.name);
  }

  function handleFileChange(event) {
    loadFile(event.target.files[0]);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    loadFile(event.dataTransfer.files[0]);
  }

  function handleDragOver(event) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function preprocess(img) {
    const canvas = document.createElement("canvas");

    canvas.width = MODEL_SIZE;
    canvas.height = MODEL_SIZE;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0, MODEL_SIZE, MODEL_SIZE);

    const { data } = ctx.getImageData(0, 0, MODEL_SIZE, MODEL_SIZE);

    const chw = new Float32Array(3 * MODEL_SIZE * MODEL_SIZE);

    const plane = MODEL_SIZE * MODEL_SIZE;

    for (let p = 0; p < plane; p++) {
      const r = data[p * 4] / 255;
      const g = data[p * 4 + 1] / 255;
      const b = data[p * 4 + 2] / 255;

      chw[p] = (r - MEAN[0]) / STD[0];
      chw[plane + p] = (g - MEAN[1]) / STD[1];
      chw[2 * plane + p] = (b - MEAN[2]) / STD[2];
    }

    return new ort.Tensor("float32", chw, [1, 3, MODEL_SIZE, MODEL_SIZE]);
  }

  function maskToCanvas(output, outW, outH) {
    let min = Infinity;
    let max = -Infinity;

    for (let i = 0; i < output.length; i++) {
      if (output[i] < min) min = output[i];
      if (output[i] > max) max = output[i];
    }

    const range = max - min || 1;

    const small = document.createElement("canvas");

    small.width = MODEL_SIZE;
    small.height = MODEL_SIZE;

    const smallCtx = small.getContext("2d");

    const imgData = smallCtx.createImageData(MODEL_SIZE, MODEL_SIZE);

    for (let i = 0; i < output.length; i++) {
      const value = Math.round(((output[i] - min) / range) * 255);

      imgData.data[i * 4] = 255;
      imgData.data[i * 4 + 1] = 255;
      imgData.data[i * 4 + 2] = 255;
      imgData.data[i * 4 + 3] = value;
    }

    smallCtx.putImageData(imgData, 0, 0);

    const full = document.createElement("canvas");

    full.width = outW;
    full.height = outH;

    const fullCtx = full.getContext("2d");

    fullCtx.imageSmoothingEnabled = true;
    fullCtx.imageSmoothingQuality = "high";

    fullCtx.drawImage(small, 0, 0, outW, outH);

    return full;
  }

  async function removeBackground() {
    if (!currentImage || !session) {
      return;
    }

    setProcessing(true);
    setStatus("Running inference…");
    setStatusMode("busy");

    // Give React/browser a chance to render the status
    await new Promise((resolve) => setTimeout(resolve, 20));

    const start = performance.now();

    try {
      const tensor = preprocess(currentImage);

      const outputs = await session.run({
        "input.1": tensor,
      });

      const outputName = session.outputNames[0];
      const maskData = outputs[outputName].data;

      const width = currentImage.naturalWidth;
      const height = currentImage.naturalHeight;

      const maskCanvas = maskToCanvas(maskData, width, height);

      const outputCanvas = outputCanvasRef.current;

      outputCanvas.width = width;
      outputCanvas.height = height;

      const ctx = outputCanvas.getContext("2d");

      ctx.clearRect(0, 0, width, height);

      // Draw original image
      ctx.drawImage(currentImage, 0, 0, width, height);

      // Use mask as alpha channel
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(maskCanvas, 0, 0);
      ctx.globalCompositeOperation = "source-over";

      setHasOutput(true);

      const seconds = ((performance.now() - start) / 1000).toFixed(2);

      setStatus(`Done in ${seconds}s`);
      setStatusMode("ok");
    } catch (err) {
      console.error(err);
      setStatus(`Inference failed: ${err.message}`);
      setStatusMode("");
    } finally {
      setProcessing(false);
    }
  }

  function downloadImage() {
    const canvas = outputCanvasRef.current;

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "removed-" + fileName;

      link.click();

      URL.revokeObjectURL(url);
    }, "image/png");
  }

  const dotColor =
    statusMode === "ok"
      ? "bg-key"
      : statusMode === "busy"
        ? "bg-amber-500 animate-pulse"
        : "bg-line";

  return (
    <div className="max-w-[960px] mx-auto px-6 pt-12 pb-20">
      <header className="flex items-baseline justify-between gap-4 mb-9 flex-wrap">
        <h1 className="text-[22px] font-[650] tracking-tight m-0">
          Cut<span className="text-key-ink">out</span>
        </h1>

        <span className="font-mono text-xs text-mute border border-line rounded-md px-2 py-[3px] bg-panel">
          {model} · runs entirely on-device
        </span>
      </header>

      <div className="flex items-center gap-2.5 text-[13px] text-mute mb-5 min-h-[20px]">
        <span className={`w-[7px] h-[7px] rounded-full flex-shrink-0 ${dotColor}`} />
        <span>{status}</span>
      </div>
      <div className="flex items-center gap-2.5 text-[13px] text-mute mb-5 min-h-[20px]">
        <h1>Model:</h1>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value={U2NETP_URL}>U²-NetP (4MB)</option>
          <option value={SILUETA_URL}>Silueta (43MB)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* INPUT */}
        <div className="relative overflow-hidden flex items-center justify-center bg-panel border border-line rounded-[10px] aspect-[4/3]">
          <span className="absolute top-2.5 left-3 z-[2] font-mono text-[11px] text-mute">
            input
          </span>

          {!hasImage && (
            <label
              className={`w-full h-full flex flex-col items-center justify-center gap-2.5 cursor-pointer text-center p-6 ${isDragging ? "bg-[#eafaf1]" : ""
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="opacity-[0.35]"
              >
                <path d="M12 16V4M12 4l-4 4M12 4l4 4" />
                <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
              </svg>

              <p className="m-0 text-[13.5px] text-mute">
                Drop an image, or click to choose one
              </p>

              <small className="font-mono text-[11px] text-mute">
                runs locally — nothing is uploaded
              </small>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}

          <canvas
            ref={inputCanvasRef}
            className="max-w-full max-h-full block"
            style={{ display: hasImage ? "block" : "none" }}
          />
        </div>

        {/* OUTPUT */}
        <div className="relative overflow-hidden flex items-center justify-center bg-panel border border-line rounded-[10px] aspect-[4/3] bg-checker">
          <span className="absolute top-2.5 left-3 z-[2] font-mono text-[11px] text-mute">
            output
          </span>

          <canvas
            ref={outputCanvasRef}
            className="max-w-full max-h-full block"
            style={{ display: hasOutput ? "block" : "none" }}
          />
        </div>
      </div>

      <div className="flex gap-2.5 mt-5 flex-wrap">
        <button
          className="font-sans text-[13.5px] font-semibold rounded-[7px] border border-transparent px-[18px] py-[11px] cursor-pointer transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed bg-key text-[#06281a] enabled:hover:bg-[#1ea366]"
          disabled={!session || !currentImage || processing}
          onClick={removeBackground}
        >
          {processing ? "Removing background…" : "Remove background"}
        </button>

        <button
          className="font-sans text-[13.5px] font-semibold rounded-[7px] border border-line px-[18px] py-[11px] cursor-pointer transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed bg-panel text-ink enabled:hover:bg-[#ebeee9]"
          disabled={!hasOutput}
          onClick={downloadImage}
        >
          Download PNG
        </button>
      </div>

      <div className="mt-10 pt-5 border-t border-line text-[12.5px] text-mute leading-relaxed">
        Model: <code className="font-mono bg-panel border border-line px-[5px] py-[1px] rounded">{model}</code> (fetched once and cached by the browser). Inference runs via{" "}
        <code className="font-mono bg-panel border border-line px-[5px] py-[1px] rounded">onnxruntime-web</code> on
        WebAssembly — your image never leaves this device.
      </div>
    </div>
  );
}

export default App;
