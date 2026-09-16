function Header({
    model,
    downloadProgress,
    status,
    dotColor,
}) {
    const downloading = downloadProgress !== null;

    return (
        <header className="mb-5 border-black/10 pt-3 sm:pt-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-black/40 sm:text-[10px]">
                        Remove image backgrounds directly from your browser.
                    </p>

                    <h1 className="m-0 text-[32px] font-black tracking-[-0.04em] text-black sm:text-[42px] md:text-[48px]">
                        Nuke My<span className="text-[#3b68ff]"> BG</span>
                    </h1>
                </div>

                <div className="w-full border border-black/10 bg-[#f7f7f7] px-3 py-2.5 font-mono text-[9px] font-bold uppercase tracking-wider text-black/45 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.06)] sm:w-fit sm:min-w-[220px] sm:text-[10px]">
                    <div className="flex items-center gap-2">
                        <span
                            className={`h-2 w-2 flex-shrink-0 rounded-full ${dotColor}`}
                        />

                        <span className="min-w-0 flex-1">
                            {downloading
                                ? `Downloading model · ${downloadProgress}%`
                                : status}
                        </span>
                    </div>

                    {/* <div className="mt-2 border-t border-black/10 pt-2 text-black/35">
                        Current Model
                        <span className="mx-1.5">:</span>
                        <span className="text-black underline">
                            {model.name}
                        </span>
                        <span className="">,</span>
                        <span className="mx-1 text-black/30">on device</span>
                    </div> */}

                    {/* <div className="mt-1 text-black/30">
                        ON-DEVICE
                    </div> */}
                </div>
            </div>
        </header>
    );
}

export default Header;