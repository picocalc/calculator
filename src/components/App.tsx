import { calculate } from "picocalc";
import { createEffect, createSignal, onMount } from "solid-js";

import CalculatorButtons from "./CalculatorButtons.tsx";
import Display from "./Display.tsx";
import Header from "./Header.tsx";

function Calculator() {
  const [history, setHistory] = createSignal("");
  const [isResultShown, setIsResultShown] = createSignal(false);
  const [isLargeDataStored, setIsLargeDataStored] = createSignal(false);
  const [preciseMode, setPreciseMode] = createSignal(false);
  const [expression, setExpression] = createSignal("");
  const [preview, setPreview] = createSignal<
    { ok: true; value: string } | { ok: false; error: string } | null
  >(null);

  createEffect(() => {
    const exp = expression().trim();
    if (!exp || exp === "0") {
      setPreview(null);
      return;
    }
    try {
      const options = preciseMode() ? { format: "precise" as const } : {};
      const result = calculate(exp, options);
      setPreview({ ok: true, value: result });
    } catch (err) {
      const error = err instanceof Error ? err.message : "Unknown error";
      setPreview({ ok: false, error });
    }
  });

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
        setIsLargeDataStored(true);
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
  }

  function performCalculation() {
    const exp = isLargeDataStored()
      ? expression()
      : mainDisplayRef?.innerText.trim() || "";
    if (!exp || exp === "0") return;

    setTimeout(() => {
      try {
        if (!calculate) return;
        const options = preciseMode() ? { format: "precise" as const } : {};
        const result = calculate(exp, options);

        setHistory(
          exp.length > MAX_LENGTH_THRESHOLD
            ? `[Large Expression: ${exp.length} chars] =`
            : `${exp} =`,
        );

        if (mainDisplayRef) mainDisplayRef.innerText = result;
        setExpression(result.toString());
        setIsResultShown(true);
        setIsLargeDataStored(false);
        scrollDisplayToEnd();
      } catch (err) {
        setPreview({
          ok: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }, 10);
  }

  function copyResult() {
    const text = isLargeDataStored()
      ? expression()
      : mainDisplayRef?.innerText || "";
    navigator.clipboard.writeText(text);
  }

  return (
    <div class="glass w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4 overflow-hidden">
      <Header
        preciseMode={preciseMode()}
        onPreciseToggle={setPreciseMode}
        onCopy={copyResult}
      />
      <Display
        history={history()}
        preview={preview()}
        setDisplayRef={(el) => (mainDisplayRef = el)}
      />
      <CalculatorButtons
        onAppendToken={appendToken}
        onClearAll={clearAll}
        onCalculate={performCalculation}
      />
    </div>
  );
}

export default Calculator;
