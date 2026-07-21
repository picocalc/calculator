import { calculate } from "picocalc";
import { createEffect, createSignal } from "solid-js";

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

  let mainDisplayRef: HTMLInputElement | undefined;

  const MAX_LENGTH_THRESHOLD = 200_000;

  function scrollDisplayToEnd() {
    requestAnimationFrame(() => {
      if (mainDisplayRef) {
        mainDisplayRef.scrollLeft = mainDisplayRef.scrollWidth;
      }
    });
  }

  function appendToken(token: string) {
    if (isResultShown() || isLargeDataStored()) {
      const newExpr =
        !Number.isNaN(Number(token)) || token === "(" || token === "pi"
          ? token
          : expression() + token;

      setIsLargeDataStored(newExpr.length >= MAX_LENGTH_THRESHOLD);
      setExpression(newExpr);
      setIsResultShown(false);
      scrollDisplayToEnd();
    } else {
      const currentText = expression() || "0";
      if (
        currentText === "0" &&
        !["+", "*", "/", "^", "!", "%", "."].includes(token)
      ) {
        setExpression(token);
      } else {
        const start = mainDisplayRef?.selectionStart ?? currentText.length;
        const end = mainDisplayRef?.selectionEnd ?? currentText.length;
        const newValue =
          currentText.slice(0, start) + token + currentText.slice(end);
        setExpression(newValue);
        const cursorPos = start + token.length;
        requestAnimationFrame(() => {
          mainDisplayRef?.setSelectionRange(cursorPos, cursorPos);
        });
      }
    }
  }

  function clearAll() {
    setExpression("0");
    setHistory("");
    setIsResultShown(false);
    setIsLargeDataStored(false);
  }

  function performCalculation() {
    const exp = expression().trim();
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
    navigator.clipboard.writeText(expression());
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
        expression={expression()}
        isLargeDataStored={isLargeDataStored()}
        preview={preview()}
        onInput={(value) => {
          if (!isLargeDataStored()) {
            setExpression(value);
          }
        }}
        onCalculate={performCalculation}
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
