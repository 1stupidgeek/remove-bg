const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];

export const MODELS = [
    {
        name: "U²-NetP (4MB) /basic",
        url: "https://models.stupidgeek.org/models/u2netp.onnx",
        inputSize: 320,
        inputName: "input.1",
        mean: MEAN,
        std: STD,
        outputType: "u2net",
        executionProviders: ["wasm"], // MaxPool ceil_mode is unsupported in WebGPU
    },
    {
        name: "RMBG-1.4 (88MB) /general /best-quality",
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
        name: "Silueta (43MB) /general",
        url: "https://models.stupidgeek.org/models/silueta.onnx",
        inputSize: 320,
        inputName: "input.1",
        mean: MEAN,
        std: STD,
        outputType: "u2net",
        executionProviders: ["wasm"], // U2-Net variant (requires WASM)
    },
    {
        name: "U²-Net (176MB) /general",
        url: "https://models.stupidgeek.org/models/u2net.onnx",
        inputSize: 320,
        inputName: "input.1",
        mean: MEAN,
        std: STD,
        outputType: "u2net",
        executionProviders: ["wasm"], // Fails on WebGPU MaxPool kernel
    },
    {
        name: "MODNet (25MB) /portraits",
        url: "https://models.stupidgeek.org/models/modnet_photographic_portrait_matting.onnx",
        inputSize: 512,
        inputName: "input",
        outputName: "output",
        mean: [0.5, 0.5, 0.5],
        std: [0.5, 0.5, 0.5],
        outputType: "u2net",
        executionProviders: ["webgpu", "wasm"],
    },
];