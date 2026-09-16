function Workspace({
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    hasImage,
    fileInputRef,
    handleFileChange,
    inputCanvasRef,
    hasOutput,
    outputCanvasRef,
}) {
    return (
        <section className="bg-[#3b68ff] p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] sm:p-3 md:p-4">
            <div className="bg-white p-1.5 sm:p-2">
                <div className="grid grid-cols-1 border border-black/10 sm:grid-cols-2">

                    {/* INPUT */}
                    <div
                        className={`relative flex aspect-[4/3] min-w-0 items-center justify-center overflow-hidden bg-[#f3f4f6] sm:border-r sm:border-black/10 ${
                            isDragging ? "bg-[#eafaf1]" : ""
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <span className="absolute left-3 top-3 z-10 border border-black/10 bg-white px-2.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-black/50 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.08)] sm:text-[10px]">
                            Input
                        </span>

                        {!hasImage && (
                            <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 p-6 text-center">
                                <div className="flex h-12 w-12 items-center justify-center border border-black/10 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.08)]">
                                    <svg
                                        width="26"
                                        height="26"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        className="text-black/40"
                                    >
                                        <path d="M12 16V4M12 4l-4 4M12 4l4 4" />
                                        <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
                                    </svg>
                                </div>

                                <div>
                                    <p className="m-0 text-sm font-bold text-black/65">
                                        Drop an image here
                                    </p>

                                    <p className="mt-1 text-xs text-black/35">
                                        or click to choose a file
                                    </p>
                                </div>

                                <span className="border border-black/10 bg-white px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-black/30">
                                    Nothing is uploaded
                                </span>

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
                            className="block max-h-full max-w-full"
                            style={{
                                display: hasImage ? "block" : "none",
                            }}
                        />
                    </div>

                    {/* OUTPUT */}
                    <div
                        className="relative flex aspect-[4/3] min-w-0 items-center justify-center overflow-hidden bg-white"
                        style={{
                            backgroundImage: `
                                linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                                linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                                linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                                linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                            `,
                            backgroundSize: "20px 20px",
                            backgroundPosition:
                                "0 0, 0 10px, 10px -10px, -10px 0",
                        }}
                    >
                        <span className="absolute left-3 top-3 z-10 border border-black/10 bg-white px-2.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-black/50 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.08)] sm:text-[10px]">
                            Output
                        </span>

                        {!hasOutput && (
                            <div className="flex flex-col items-center justify-center gap-2 px-6 text-center">
                                <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-black/25 sm:text-[10px]">
                                    Output will appear here
                                </span>
                            </div>
                        )}

                        <canvas
                            ref={outputCanvasRef}
                            className="absolute inset-0 m-auto block max-h-full max-w-full"
                            style={{
                                display: hasOutput ? "block" : "none",
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Workspace;