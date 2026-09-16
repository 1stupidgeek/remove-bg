function ModelSelector({
    model,
    setModel,
    processing,
    MODELS,
}) {
    return (
        <div className="border border-black/10 bg-[#f7f7f7] p-4 sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">

                <label
                    htmlFor="model-select"
                    className="text-xs font-bold uppercase tracking-widest text-black/40"
                >
                   Choose a model:
                </label>

                <select
                    id="model-select"
                    value={model.url}
                    disabled={processing}
                    className="w-full min-w-0 border border-black/10 bg-white px-3 py-2.5 text-sm text-black outline-none transition-colors focus:border-[#3b68ff] disabled:cursor-not-allowed disabled:opacity-50 sm:max-w-[420px]"
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
                        {MODELS
                            .filter(
                                (item) =>
                                    item.executionProviders[0] === "webgpu"
                            )
                            .map((item) => (
                                <option
                                    key={item.url}
                                    value={item.url}
                                >
                                    {item.name}
                                </option>
                            ))}
                    </optgroup>

                    <optgroup label="CPU Models (WebAssembly)">
                        {MODELS
                            .filter(
                                (item) =>
                                    item.executionProviders[0] === "wasm"
                            )
                            .map((item) => (
                                <option
                                    key={item.url}
                                    value={item.url}
                                >
                                    {item.name}
                                </option>
                            ))}
                    </optgroup>
                </select>
            </div>
        </div>
    );
}

export default ModelSelector;