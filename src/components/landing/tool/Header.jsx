function Header({ model, downloadProgress }) {
    const downloading = downloadProgress !== null;

    return (
        <header className="mb-5 border-black/10 pt-3 sm:pt-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="mb-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-black/40 sm:text-[10px]">
                        Remove image backgrounds directly from your browser.
                    </p>
                    <h1 className="m-0 text-[32px] font-black tracking-[-0.04em] text-black sm:text-[42px] md:text-[48px]">
                        Nuke My<span className="text-[#3b68ff]"> BG</span>
                    </h1>
                </div>

                <div className="w-fit border border-black/10 bg-[#f7f7f7] px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-wider text-black/45 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.06)] sm:text-[10px]">
                    {downloading ? (
                        <>
                            DOWNLOADING
                            <span className="mx-1.5">·</span>
                            {downloadProgress}%
                        </>
                    ) : (
                        <>
                            Current Model: {model.name}
                            <span className="mx-1.5">·</span>
                            ON-DEVICE
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;