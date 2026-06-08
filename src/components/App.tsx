import { calculate } from "picocalc";
import { createSignal, onMount } from "solid-js";

function Calculator() {
  const [history, setHistory] = createSignal("");
  const [status, setStatus] = createSignal("System: Ready");
  const [isResultShown, setIsResultShown] = createSignal(false);
  const [isLargeDataStored, setIsLargeDataStored] = createSignal(false);
  const [preciseMode, setPreciseMode] = createSignal(false);
  const [expression, setExpression] = createSignal("");

  // oxlint-disable-next-line no-unassigned-vars (false-positive)
  let mainDisplayRef: HTMLDivElement | undefined;

  const MAX_LENGTH_THRESHOLD = 200_000;

  onMount(async () => {
    if (!mainDisplayRef) return;

    mainDisplayRef.addEventListener("paste", (e) => {
      e.preventDefault();
      if (!e.clipboardData) return;
      const paste = e.clipboardData.getData("text");
      const cleanPaste = paste.trim().split(/\r?\n/)[0];
      document.execCommand("insertText", false, cleanPaste);
    });

    mainDisplayRef.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performCalculation();
      }
    });

    mainDisplayRef.addEventListener("input", () => {
      if (!isLargeDataStored() && mainDisplayRef) {
        setExpression(mainDisplayRef.innerText);
      }
    });
  });

  function scrollDisplayToEnd() {
    if (mainDisplayRef) {
      mainDisplayRef.scrollLeft = mainDisplayRef.scrollWidth;
    }
  }

  function appendToken(token: string) {
    if (isResultShown() || isLargeDataStored()) {
      const newExpr =
        !Number.isNaN(Number(token)) || token === "(" || token === "pi"
          ? token
          : expression() + token;

      if (newExpr.length < MAX_LENGTH_THRESHOLD) {
        if (mainDisplayRef) mainDisplayRef.innerText = newExpr;
        setIsLargeDataStored(false);
      } else if (mainDisplayRef) {
        mainDisplayRef.innerHTML = `<span class="placeholder-text">[Large Expression: ${newExpr.length} chars]</span>`;
      }
      setExpression(newExpr);
      setIsResultShown(false);
    } else {
      const currentText = mainDisplayRef?.innerText || "0";
      if (
        currentText === "0" &&
        !["+", "*", "/", "^", "!", "%", "."].includes(token)
      ) {
        if (mainDisplayRef) mainDisplayRef.innerText = token;
      } else if (mainDisplayRef) {
        mainDisplayRef.innerText += token;
      }
      setExpression(mainDisplayRef?.innerText || "");
    }
    scrollDisplayToEnd();
  }

  function clearAll() {
    if (mainDisplayRef) mainDisplayRef.innerText = "0";
    setExpression("");
    setHistory("");
    setIsResultShown(false);
    setIsLargeDataStored(false);
    setStatus("System: Ready");
  }

  function performCalculation() {
    const exp = isLargeDataStored()
      ? expression()
      : mainDisplayRef?.innerText.trim() || "";
    if (!exp || exp === "0") return;
    setStatus("Computing...");

    setTimeout(() => {
      try {
        if (!calculate) return;
        const start = performance.now();
        const options = preciseMode() ? { format: "precise" as const } : {};
        const result = calculate(exp, options);
        const end = performance.now();

        setHistory(
          exp.length > MAX_LENGTH_THRESHOLD
            ? `[Large Expression: ${exp.length} chars] =`
            : `${exp} =`,
        );

        if (mainDisplayRef) mainDisplayRef.innerText = result;
        setExpression(result.toString());
        setIsResultShown(true);
        setIsLargeDataStored(false);
        setStatus(`Done in ${(end - start).toFixed(2)}ms`);
        scrollDisplayToEnd();
      } catch (err) {
        setStatus(err instanceof Error ? err.message : "Unknown error");
      }
    }, 10);
  }

  function copyResult() {
    const text = isLargeDataStored()
      ? expression()
      : mainDisplayRef?.innerText || "";
    navigator.clipboard.writeText(text).then(() => {
      const originalStatus = status();
      setStatus("Copied to clipboard");
      setTimeout(() => setStatus(originalStatus), 2000);
    });
  }

  function btn(
    label: string,
    token: string,
    variant: "number" | "op" | "accent" | "fn" = "number",
    span?: number,
  ) {
    const variants = {
      number: "bg-slate-800/50 text-white",
      op: "bg-indigo-900/40 text-indigo-400",
      accent: "bg-amber-900/30 text-amber-400",
      fn: "bg-slate-800 text-slate-300",
    };

    return (
      <button
        onClick={() => appendToken(token)}
        class={`calc-button ${span ? `col-span-${span}` : ""} ${variants[variant]} py-4 rounded-lg`}
        type="button"
      >
        {label}
      </button>
    );
  }

  return (
    <div class="glass w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4 overflow-hidden">
      <div class="flex justify-between items-center mb-2">
        <span class="text-xs font-bold text-slate-500 tracking-widest uppercase">
          Calculator
        </span>
        <div class="flex items-center gap-4">
          <label class="flex items-center cursor-pointer gap-2">
            <span class="text-[10px] text-slate-400 uppercase tracking-tighter">
              Precise
            </span>
            <div class="relative">
              <input
                type="checkbox"
                checked={preciseMode()}
                onChange={(e) => setPreciseMode(e.currentTarget.checked)}
                class="sr-only peer"
              />
              <div class="w-7 h-4 bg-slate-700 rounded-full peer-checked:bg-emerald-600 transition-colors" />
              <div class="absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform peer-checked:translate-x-3" />
            </div>
          </label>
          <button
            onClick={copyResult}
            class="text-[10px] text-slate-400 hover:text-white border border-slate-700 px-2 py-1 rounded"
            type="button"
          >
            COPY
          </button>
        </div>
      </div>

      <div class="display-container bg-black/40 p-4 rounded-xl border border-white/5">
        <div class="text-slate-500 text-xs h-5 mb-1 overflow-hidden text-ellipsis whitespace-nowrap w-full text-left">
          {history()}
        </div>
        <div
          ref={mainDisplayRef}
          contenteditable="plaintext-only"
          spellcheck={false}
          class="main-display"
        >
          0
        </div>
      </div>

      <div class="grid grid-cols-4 gap-2">
        <button
          onClick={clearAll}
          class="calc-button col-span-2 bg-rose-900/40 text-rose-400 py-4 rounded-lg"
          type="button"
        >
          AC
        </button>
        {btn("π", "pi", "accent")}
        {btn("e", "e", "accent")}

        {btn("x!", "!", "fn")}
        {btn("%", "%", "fn")}
        {btn("(", "(", "fn")}
        {btn(")", ")", "fn")}

        {btn("7", "7")}
        {btn("8", "8")}
        {btn("9", "9")}
        {btn("÷", "/", "op")}

        {btn("4", "4")}
        {btn("5", "5")}
        {btn("6", "6")}
        {btn("×", "*", "op")}

        {btn("1", "1")}
        {btn("2", "2")}
        {btn("3", "3")}
        {btn("−", "-", "op")}

        {btn("0", "0")}
        {btn(".", ".")}
        {btn("^", "^", "op")}
        {btn("+", "+", "op")}

        <button
          onClick={performCalculation}
          class="calc-button col-span-4 bg-emerald-900/40 text-emerald-400 py-4 rounded-lg"
          type="button"
        >
          =
        </button>
      </div>

      <div class="text-[10px] text-slate-600 text-center">{status()}</div>
    </div>
  );
}

export default Calculator;
