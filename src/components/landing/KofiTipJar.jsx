function KofiTipJar() {
    return (
        <div className="mb-6 w-fit border-l-4 border-[#3b68ff] bg-[#f7f7f7] px-5 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col gap-3">
                <div>
                    <p className="text-[14px] font-bold text-black">
                        Like the tool?
                    </p>

                    <p className="mt-1 text-[13px] leading-5 text-black/55">
                        Support the project with a small tip.
                    </p>
                </div>

                <a
                    href="https://ko-fi.com/stupidgeek"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-2 border border-black/10 bg-white px-4 py-2 text-[13px] font-bold text-black transition-colors hover:bg-black hover:text-white"
                >
                    ☕ Buy me a coffee →
                </a>
            </div>
        </div>
    );
}

export default KofiTipJar;