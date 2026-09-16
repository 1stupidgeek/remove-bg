function Controls({
    session,
    currentImage,
    processing,
    removeBackground,
    hasOutput,
    downloadImage,
    hasImage,
    clearImage,
}) {
    return (
        <div className="grid grid-cols-2 gap-2 border border-black/10 bg-[#f7f7f7] p-3 sm:flex sm:flex-wrap sm:p-5">
            <button
                className="col-span-2 border border-transparent bg-[#3b68ff] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#2d58df] disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-1 sm:px-5 sm:py-2.5 sm:text-sm"
                disabled={!session || !currentImage || processing}
                onClick={removeBackground}
            >
                {processing ? "Removing…" : "Remove background"}
            </button>

            <button
                className="border border-black/10 bg-white px-3 py-3 text-xs font-bold text-black transition-colors hover:bg-[#eeeeee] disabled:cursor-not-allowed disabled:opacity-40 sm:px-5 sm:py-2.5 sm:text-sm"
                disabled={!hasOutput}
                onClick={downloadImage}
            >
                Download PNG
            </button>

            <button
                className="border border-black/10 bg-white px-3 py-3 text-xs font-bold text-black transition-colors hover:bg-[#eeeeee] disabled:cursor-not-allowed disabled:opacity-40 sm:px-5 sm:py-2.5 sm:text-sm"
                disabled={!hasImage}
                onClick={clearImage}
            >
                Clear
            </button>
        </div>
    );
}

export default Controls;