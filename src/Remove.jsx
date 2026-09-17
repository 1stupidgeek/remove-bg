import { useEffect, useRef, useState } from "react";
import "./App.css";
import { getCachedModel, cacheModel } from "./utils/modelCache";
import Controls from "./components/landing/tool/Controls";
import Workspace from "./components/landing/tool/Images";
import ModelSelector from "./components/landing/tool/Models";
import Header from "./components/landing/tool/Header";
import { MODELS } from "./utils/model";


function Remove() {
    const [fileName, setFileName] = useState(null);
    const [model, setModel] = useState(MODELS[0]);
    const [session, setSession] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);

    const [downloadProgress, setDownloadProgress] = useState(null);
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
        const config = MODELS.find((m) => m.url === modelUrl);

        try {
            setStatus("Loading model...");
            setStatusMode("loading");
            setDownloadProgress(null);

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

                const contentLength = response.headers.get("content-length");

                if (!response.body || !contentLength) {
                    // Fallback if the server doesn't provide Content-Length
                    modelData = await response.arrayBuffer();
                } else {
                    const total = parseInt(contentLength, 10);
                    const reader = response.body.getReader();

                    const chunks = [];
                    let received = 0;

                    while (true) {
                        const { done, value } = await reader.read();

                        if (done) {
                            break;
                        }

                        chunks.push(value);
                        received += value.length;

                        const progress = Math.round(
                            (received / total) * 100
                        );

                        setDownloadProgress(progress);
                        setStatus(`Downloading model… ${progress}%`);
                    }

                    const buffer = new Uint8Array(received);

                    let offset = 0;

                    for (const chunk of chunks) {
                        buffer.set(chunk, offset);
                        offset += chunk.length;
                    }

                    modelData = buffer.buffer;
                }

                setDownloadProgress(null);

                await cacheModel(modelUrl, modelData);

                console.log("Model saved to IndexedDB");
            }

            ort.env.wasm.wasmPaths =
                "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/";

            const loadedSession = await ort.InferenceSession.create(
                modelData,
                {
                    executionProviders: config.executionProviders,
                    graphOptimizationLevel: "all",
                }
            );

            return loadedSession;
        } catch (err) {
            console.error(err);

            setDownloadProgress(null);

            setStatus(`Failed to load model: ${err.message}`);
            setStatusMode("error");

            return null;
        }
    }

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setSession(null);
            setHasOutput(false);

            const loadedSession = await loadModel(model.url);

            if (cancelled || !loadedSession) {
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
        } else if (config.outputType === "u2net") {
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

        await new Promise((resolve) =>
            setTimeout(resolve, 20)
        );

        const start = performance.now();

        try {
            const tensor = preprocess(
                currentImage,
                config.inputSize
            );

            const outputs = await session.run({
                [config.inputName]: tensor,
            });

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

            const width =
                currentImage.naturalWidth;

            const height =
                currentImage.naturalHeight;

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

            ctx.drawImage(
                currentImage,
                0,
                0,
                width,
                height
            );

            ctx.globalCompositeOperation =
                "destination-in";

            ctx.drawImage(
                maskCanvas,
                0,
                0,
                width,
                height
            );

            ctx.globalCompositeOperation =
                "source-over";

            setHasOutput(true);

            const seconds = (
                (performance.now() - start) /
                1000
            ).toFixed(2);

            setStatus(`Done in ${seconds}s`);
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

            const newName = "removed-" + fileName.replace(/\.[^.]+$/, "") + ".png";

            link.href = url;
            link.download = newName

            console.log(newName)

            link.click();


            console.log(link)

            URL.revokeObjectURL(url);
        }, "image/png");
    }

    const dotColor =
        statusMode === "ok"
            ? "bg-[#00FF00]"
            : statusMode === "busy"
                ? "bg-amber-500 animate-pulse"
                : "bg-black/25";

    return (
        <main className="bg-white px-4 sm:px-6 md:px-8">

            <div className="mx-auto w-full max-w-[1100px]">

                {/* HEADER */}
                <Header
                    model={model}
                    downloadProgress={downloadProgress}
                    status={status}
                    dotColor={dotColor}
                />

                {/* STATUS */}
                {/* <div className="mb-1 flex min-h-[20px] items-center gap-2.5 text-xs text-black/50 sm:text-[13px]">
                    <span
                        className={`h-2 w-2 flex-shrink-0 rounded-full ${dotColor}`}
                    />

                    <span>{status}</span>
                </div> */}

                {/* CONTROLS */}
                {/* Model selector + desktop controls */}
                <section className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
                    <ModelSelector
                        model={model}
                        setModel={setModel}
                        processing={processing}
                        MODELS={MODELS}
                    />

                    <div className="hidden md:block">
                        <Controls
                            session={session}
                            currentImage={currentImage}
                            processing={processing}
                            removeBackground={removeBackground}
                            hasOutput={hasOutput}
                            downloadImage={downloadImage}
                            hasImage={hasImage}
                            clearImage={clearImage}
                        />
                    </div>
                </section>

                {/* Full-width workspace */}
                <Workspace
                    isDragging={isDragging}
                    handleDragOver={handleDragOver}
                    handleDragLeave={handleDragLeave}
                    handleDrop={handleDrop}
                    hasImage={hasImage}
                    fileInputRef={fileInputRef}
                    handleFileChange={handleFileChange}
                    inputCanvasRef={inputCanvasRef}
                    hasOutput={hasOutput}
                    outputCanvasRef={outputCanvasRef}
                />

                {/* Mobile controls */}
                <div className="mt-3 md:hidden">
                    <Controls
                        session={session}
                        currentImage={currentImage}
                        processing={processing}
                        removeBackground={removeBackground}
                        hasOutput={hasOutput}
                        downloadImage={downloadImage}
                        hasImage={hasImage}
                        clearImage={clearImage}
                    />
                </div>

                <footer className="my-8 py-5 border-t border-black/10 pt-5 text-xs leading-relaxed text-black/40">

                    <p>
                        <span className="font-semibold text-black/55">
                            {model.name}
                        </span>{" "}
                        is fetched once and cached by your browser.
                        Inference runs locally through{" "}
                        <code className="border border-black/10 bg-[#f7f7f7] px-1.5 py-0.5 font-mono text-black/55">
                            onnxruntime-web
                        </code>
                        . Your image never leaves this device.
                    </p>

                </footer>

            </div>
        </main>
    );
}

export default Remove;