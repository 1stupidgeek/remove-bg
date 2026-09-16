function KofiTipJar() {
    return (
        <div className="border-t border-line pt-6 mt-12">
            <div className="flex flex-col items-center justify-between gap-6">
                <div>
                    <p className="text-[14px] font-medium text-ink">
                        Like the tool?
                    </p>

                    <p className="mt-1 text-[13px] leading-6 text-ink/55">
                        You can support the project with a small tip.
                    </p>
                </div>

                <a
                    href="https://ko-fi.com/stupidgeek"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-2 border border-line bg-panel px-4 py-2 rounded-md text-[13px] font-medium text-ink transition-colors hover:bg-ink hover:text-white"
                >
                    ☕ Buy me a coffee
                </a>
            </div>
        </div>
    );
}

export default KofiTipJar;