import { useEffect, useRef, useState } from "react";
import "./App.css";
import { getCachedModel, cacheModel } from "./utils/modelCache";

const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];

const MODELS = [
    {
        name: "U²-NetP (4MB)",
        url: "https://models.stupidgeek.org/models/u2netp.onnx",
        inputSize: 320,
        inputName: "input.1",
        mean: MEAN,
        std: STD,
        outputType: "u2net",
        executionProviders: ["wasm"], // MaxPool ceil_mode is unsupported in WebGPU
    },
    {
        name: "BRIA RMBG (INT8 Quantized - 44MB)",
        url: "https://models.stupidgeek.org/models/rmbg_quantized.onnx",
        inputSize: 1024,
        inputName: "input",
        outputName: "output",
        mean: [0.5, 0.5, 0.5],
        std: [1.0, 1.0, 1.0],
        outputType: "u2net",
        executionProviders: ["webgpu"], // INT8 ops run best on CPU/WASM
    },
    {
        name: "BRIA RMBG (FP16 - 88MB)",
        url: "https://models.stupidgeek.org/models/rmbg_fp16.onnx",
        inputSize: 1024,
        inputName: "input",
        outputName: "output",
        mean: [0.5, 0.5, 0.5],
        std: [1.0, 1.0, 1.0],
        outputType: "u2net",
        executionProviders: ["webgpu", "wasm"], // Best on GPU, falls back to WASM
    },
    {
        name: "BRIA RMBG (FP32 - 176MB)",
        url: "https://models.stupidgeek.org/models/rmbg.onnx",
        inputSize: 1024,
        inputName: "input",
        outputName: "output",
        mean: [0.5, 0.5, 0.5],
        std: [1.0, 1.0, 1.0],
        outputType: "u2net",
        executionProviders: ["webgpu", "wasm"],
    },
    {
        name: "Silueta (43MB)",
        url: "https://models.stupidgeek.org/models/silueta.onnx",
        inputSize: 320,
        inputName: "input.1",
        mean: MEAN,
        std: STD,
        outputType: "u2net",
        executionProviders: ["wasm"], // U2-Net variant (requires WASM)
    },
    {
        name: "U²-Net (176MB)",
        url: "https://models.stupidgeek.org/models/u2net.onnx",
        inputSize: 320,
        inputName: "input.1",
        mean: MEAN,
        std: STD,
        outputType: "u2net",
        executionProviders: ["wasm"], // Fails on WebGPU MaxPool kernel
    },
    // {
    //     name: "BiRefNet General Lite (224MB)",
    //     url: "https://models.stupidgeek.org/models/BiRefNet-general-bb_swin_v1_tiny-epoch_232.onnx",

    //     inputSize: 1024,
    //     inputName: "input_image",
    //     outputName: "output_image",

    //     mean: MEAN,
    //     std: STD,

    //     outputType: "birefnet",
    // },
];

function Remove() {
    const [fileName, setFileName] = useState(null);
    const [model, setModel] = useState(MODELS[0]);
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

    async function loadModel(modelUrl) {
        const config = MODELS.find((m) => m.url == modelUrl);

        try {
            setStatus("Loading model...");
            setStatusMode("loading");

            let modelData = await getCachedModel(modelUrl);

            if (modelData) {
                console.log("Loading model from IndexedDB");
            } else {
                console.log("Downloading model...");

                const response = await fetch(modelUrl);

                if (!response.ok) {
                    throw new Error(
                        `Failed to download model: ${response.status}`
                    );
                }

                modelData = await response.arrayBuffer();

                await cacheModel(modelUrl, modelData);

                console.log("Model saved to IndexedDB");
            }

            ort.env.wasm.wasmPaths =
                "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/";

            // const loadedSession = await ort.InferenceSession.create(
            //     modelData,
            //     {
            //         executionProviders: ["wasm"],
            //         graphOptimizationLevel: "all",
            //     }
            // );
            const loadedSession = await ort.InferenceSession.create(
                modelData,
                {
                    // prioritize WebGPU, fallback to WebGL, then WASM
                    // executionProviders: ["webgpu","webgl", "wasm"],
                    executionProviders: config.executionProviders,
                    graphOptimizationLevel: "all",
                }
            );


            // console.log("Inputs:", loadedSession.inputNames);
            // console.log("Outputs:", loadedSession.outputNames);
            // console.log("Input metadata:", loadedSession.inputMetadata);
            // console.log("Output metadata:", loadedSession.outputMetadata);

            return loadedSession;
        } catch (err) {
            console.error(err);

            setStatus(`Failed to load model: ${err.message}`);
            setStatusMode("error");

            return null;
        }
    }

    // Load selected ONNX model
    useEffect(() => {
        let cancelled = false;

        async function load() {
            // Don't allow inference with the previous model
            setSession(null);
            setHasOutput(false);

            const loadedSession = await loadModel(model.url);

            if (cancelled) {
                return;
            }

            if (!loadedSession) {
                return;
            }

            setSession(loadedSession);

            setStatus(`Model loaded (${model.name})`);
            setStatusMode("ok");
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [model]);

    function loadFile(file) {
        if (!file || !file.type.startsWith("image/")) {
            return;
        }

        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            setCurrentImage(img);
            setHasImage(true);
            setHasOutput(false);
            setFileName(file.name);

            const canvas = inputCanvasRef.current;
            const ctx = canvas.getContext("2d");

            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            ctx.drawImage(
                img,
                0,
                0,
                img.naturalWidth,
                img.naturalHeight
            );

            // Clear previous output
            const outputCanvas = outputCanvasRef.current;

            outputCanvas.width = 1;
            outputCanvas.height = 1;

            outputCanvas
                .getContext("2d")
                .clearRect(0, 0, 1, 1);

            setStatus('Ready — click "Remove background"');
            setStatusMode("ok");
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);

            setStatus("Failed to load image");
            setStatusMode("error");
        };

        img.src = objectUrl;
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

    function clearImage() {
        setCurrentImage(null);
        setFileName(null);
        setHasImage(false);
        setHasOutput(false);

        const inputCanvas = inputCanvasRef.current;
        const outputCanvas = outputCanvasRef.current;

        if (inputCanvas) {
            const ctx = inputCanvas.getContext("2d");

            ctx.clearRect(
                0,
                0,
                inputCanvas.width,
                inputCanvas.height
            );

            inputCanvas.width = 1;
            inputCanvas.height = 1;
        }

        if (outputCanvas) {
            const ctx = outputCanvas.getContext("2d");

            ctx.clearRect(
                0,
                0,
                outputCanvas.width,
                outputCanvas.height
            );

            outputCanvas.width = 1;
            outputCanvas.height = 1;
        }

        // Allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setStatus(`Model loaded (${model.name})`);
        setStatusMode("ok");
    }

    function preprocess(img) {
        const config = model;

        const canvas = document.createElement("canvas");

        canvas.width = config.inputSize;
        canvas.height = config.inputSize;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            img,
            0,
            0,
            config.inputSize,
            config.inputSize
        );

        const { data } = ctx.getImageData(
            0,
            0,
            config.inputSize,
            config.inputSize
        );

        const plane =
            config.inputSize * config.inputSize;

        const chw = new Float32Array(
            3 * plane
        );

        for (let p = 0; p < plane; p++) {
            const r = data[p * 4] / 255;
            const g = data[p * 4 + 1] / 255;
            const b = data[p * 4 + 2] / 255;

            chw[p] =
                (r - config.mean[0]) /
                config.std[0];

            chw[plane + p] =
                (g - config.mean[1]) /
                config.std[1];

            chw[2 * plane + p] =
                (b - config.mean[2]) /
                config.std[2];
        }

        return new ort.Tensor(
            "float32",
            chw,
            [
                1,
                3,
                config.inputSize,
                config.inputSize,
            ]
        );
    }

    function maskToCanvas(output, outW, outH) {
        const config = model;

        const small = document.createElement("canvas");

        small.width = config.inputSize;
        small.height = config.inputSize;

        const smallCtx = small.getContext("2d");

        const imgData = smallCtx.createImageData(
            config.inputSize,
            config.inputSize
        );

        /*
         * BiRefNet outputs logits.
         *
         * Convert logits -> probability using sigmoid.
         */
        if (config.outputType === "birefnet") {
            for (let i = 0; i < output.length; i++) {
                const probability =
                    1 / (1 + Math.exp(-output[i]));

                const alpha = Math.round(
                    probability * 255
                );

                imgData.data[i * 4] = 255;
                imgData.data[i * 4 + 1] = 255;
                imgData.data[i * 4 + 2] = 255;
                imgData.data[i * 4 + 3] = alpha;
            }
        }

        /*
         * U²-Net / Silueta output is treated
         * as a saliency map.
         */
        else if (config.outputType === "u2net") {
            let min = Infinity;
            let max = -Infinity;

            for (let i = 0; i < output.length; i++) {
                if (output[i] < min) {
                    min = output[i];
                }

                if (output[i] > max) {
                    max = output[i];
                }
            }

            const range = max - min || 1;

            for (let i = 0; i < output.length; i++) {
                const value = Math.round(
                    ((output[i] - min) / range) * 255
                );

                imgData.data[i * 4] = 255;
                imgData.data[i * 4 + 1] = 255;
                imgData.data[i * 4 + 2] = 255;
                imgData.data[i * 4 + 3] = value;
            }
        }

        smallCtx.putImageData(
            imgData,
            0,
            0
        );

        /*
         * Resize the model's mask back to
         * the original image dimensions.
         */
        const full = document.createElement("canvas");

        full.width = outW;
        full.height = outH;

        const fullCtx = full.getContext("2d");

        fullCtx.imageSmoothingEnabled = true;
        fullCtx.imageSmoothingQuality = "high";

        fullCtx.drawImage(
            small,
            0,
            0,
            outW,
            outH
        );

        return full;
    }

    async function removeBackground() {
        const config = model;

        if (!currentImage || !session) {
            return;
        }

        setProcessing(true);
        setStatus("Running inference…");
        setStatusMode("busy");

        // Give browser a chance to render the status
        await new Promise((resolve) =>
            setTimeout(resolve, 20)
        );

        const start = performance.now();

        try {
            /*
             * Image
             * ↓
             * Model-specific preprocessing
             * ↓
             * Tensor
             */
            const tensor = preprocess(
                currentImage
            );

            /*
             * Use the input name defined
             * by the selected model.
             */
            const outputs = await session.run({
                [config.inputName]: tensor,
            });

            /*
             * Use the configured output name
             * when provided.
             *
             * Otherwise use the model's first output.
             */
            const outputName =
                config.outputName ||
                session.outputNames[0];

            const output = outputs[outputName];

            if (!output) {
                throw new Error(
                    `Output "${outputName}" was not found`
                );
            }

            const maskData = output.data;

            console.log(
                "Output:",
                outputName,
                output.dims
            );

            const width =
                currentImage.naturalWidth;

            const height =
                currentImage.naturalHeight;

            /*
             * Convert model output into
             * an alpha mask.
             */
            const maskCanvas = maskToCanvas(
                maskData,
                width,
                height
            );

            const outputCanvas =
                outputCanvasRef.current;

            outputCanvas.width = width;
            outputCanvas.height = height;

            const ctx =
                outputCanvas.getContext("2d");

            ctx.clearRect(
                0,
                0,
                width,
                height
            );

            /*
             * Draw original image.
             */
            ctx.drawImage(
                currentImage,
                0,
                0,
                width,
                height
            );

            /*
             * Apply mask as alpha.
             */
            ctx.globalCompositeOperation =
                "destination-in";

            ctx.drawImage(
                maskCanvas,
                0,
                0,
                width,
                height
            );

            /*
             * Restore normal drawing mode.
             */
            ctx.globalCompositeOperation =
                "source-over";

            setHasOutput(true);

            const seconds = (
                (performance.now() - start) /
                1000
            ).toFixed(2);

            setStatus(
                `Done in ${seconds}s`
            );

            setStatusMode("ok");
        } catch (err) {
            console.error(err);

            setStatus(
                `Inference failed: ${err.message}`
            );

            setStatusMode("error");
        } finally {
            setProcessing(false);
        }
    }

    function downloadImage() {
        const canvas =
            outputCanvasRef.current;

        if (!canvas || !hasOutput) {
            return;
        }

        canvas.toBlob((blob) => {
            if (!blob) {
                return;
            }

            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;
            link.download =
                "removed-" + fileName;

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
                    {model.name} · runs entirely on-device
                </span>
            </header>

            <div className="flex items-center gap-2.5 text-[13px] text-mute mb-5 min-h-[20px]">
                <span
                    className={`w-[7px] h-[7px] rounded-full flex-shrink-0 ${dotColor}`}
                />

                <span>
                    {status}
                </span>
            </div>
            <div className="flex items-center gap-2.5 text-[13px] text-mute mb-5 min-h-[20px]">
                <label htmlFor="model-select" className="font-semibold text-ink">
                    Model:
                </label>

                <select
                    id="model-select"
                    value={model.url}
                    disabled={processing}
                    className="bg-panel border border-line rounded px-2 py-1 text-[13px] max-w-[300px] w-full text-ink focus:outline-none focus:border-key"
                    onChange={(e) => {
                        const selectedModel = MODELS.find(
                            (item) => item.url === e.target.value
                        );

                        if (selectedModel) {
                            setModel(selectedModel);
                        }
                    }}
                >
                    <optgroup label="GPU Models (WebGPU)">
                        {MODELS.filter((item) => item.executionProviders[0] === "webgpu").map(
                            (item) => (
                                <option key={item.url} value={item.url}>
                                    {item.name}
                                </option>
                            )
                        )}
                    </optgroup>

                    <optgroup label="CPU Models (WebAssembly)">
                        {MODELS.filter((item) => item.executionProviders[0] === "wasm").map(
                            (item) => (
                                <option key={item.url} value={item.url}>
                                    {item.name}
                                </option>
                            )
                        )}
                    </optgroup>
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
                            className={`w-full h-full flex flex-col items-center justify-center gap-2.5 cursor-pointer text-center p-6 ${isDragging
                                ? "bg-[#eafaf1]"
                                : ""
                                }`}
                            onDragOver={
                                handleDragOver
                            }
                            onDragLeave={
                                handleDragLeave
                            }
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
                                ref={
                                    fileInputRef
                                }
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={
                                    handleFileChange
                                }
                            />
                        </label>
                    )}

                    <canvas
                        ref={
                            inputCanvasRef
                        }
                        className="max-w-full max-h-full block"
                        style={{
                            display: hasImage
                                ? "block"
                                : "none",
                        }}
                    />
                </div>

                {/* OUTPUT */}
                <div className="relative overflow-hidden flex items-center justify-center bg-panel border border-line rounded-[10px] aspect-[4/3] bg-checker">
                    <span className="absolute top-2.5 left-3 z-[2] font-mono text-[11px] text-mute">
                        output
                    </span>

                    <canvas
                        ref={
                            outputCanvasRef
                        }
                        className="max-w-full max-h-full block"
                        style={{
                            display: hasOutput
                                ? "block"
                                : "none",
                        }}
                    />
                </div>
            </div>

            <div className="flex gap-2.5 mt-5 flex-wrap">
                <button
                    className="font-sans text-[13.5px] font-semibold rounded-[7px] border border-transparent px-[18px] py-[11px] cursor-pointer transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed bg-key text-[#06281a] enabled:hover:bg-[#1ea366]"
                    disabled={
                        !session ||
                        !currentImage ||
                        processing
                    }
                    onClick={
                        removeBackground
                    }
                >
                    {processing
                        ? "Removing background…"
                        : "Remove background"}
                </button>

                <button
                    className="font-sans text-[13.5px] font-semibold rounded-[7px] border border-line px-[18px] py-[11px] cursor-pointer transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed bg-panel text-ink enabled:hover:bg-[#ebeee9]"
                    disabled={!hasOutput}
                    onClick={
                        downloadImage
                    }
                >
                    Download PNG
                </button>

                <button
                    className="font-sans text-[13.5px] font-semibold rounded-[7px] border border-line px-[18px] py-[11px] cursor-pointer transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed bg-panel text-ink enabled:hover:bg-[#ebeee9]"
                    disabled={!hasImage}
                    onClick={clearImage}
                >
                    Clear image
                </button>
            </div>

            <div className="mt-10 pt-5 border-t border-line text-[12.5px] text-mute leading-relaxed">
                Model:{" "}
                <code className="font-mono bg-panel border border-line px-[5px] py-[1px] rounded">
                    {model.name}
                </code>{" "}
                (fetched once and cached by the browser).
                Inference runs via{" "}
                <code className="font-mono bg-panel border border-line px-[5px] py-[1px] rounded">
                    onnxruntime-web
                </code>{" "}
                on WebAssembly — your image never leaves
                this device.
            </div>
        </div>
    );
}

export default Remove;