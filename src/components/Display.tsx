import type { JSX } from "solid-js";

interface Props {
  history: string;
  expression: string;
  isLargeDataStored: boolean;
  preview: { ok: true; value: string } | { ok: false; error: string } | null;
  onInput: (value: string) => void;
  onCalculate: () => void;
  setDisplayRef: (el: HTMLInputElement) => void;
}

function Display(props: Props) {
  let capturedPaste = "";

  const preview = (): JSX.Element => {
    const p = props.preview;
    if (!p) return null;
    if (p.ok) return <span class="text-slate-400">= {p.value}</span>;
    return <span class="text-rose-400">{p.error}</span>;
  };

  const displayValue = () =>
    props.isLargeDataStored
      ? `[Large Expression: ${props.expression.length} chars]`
      : props.expression;

  return (
    <div class="max-w-full w-full overflow-hidden flex flex-col contain-content bg-black/40 p-4 rounded-xl border border-white/5">
      <div class="text-slate-500 text-xs h-5 mb-1 overflow-hidden text-ellipsis whitespace-nowrap w-full text-left">
        {props.history}
      </div>
      <label for="calculator-display" class="sr-only">
        Calculator expression
      </label>
      <input
        id="calculator-display"
        ref={props.setDisplayRef}
        type="text"
        value={displayValue()}
        readonly={props.isLargeDataStored}
        spellcheck={false}
        autocomplete="off"
        onInput={(e) => props.onInput(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            props.onCalculate();
          }
        }}
        onPaste={(e) => {
          capturedPaste = e.clipboardData?.getData("text") || "";
        }}
        onBeforeInput={(e) => {
          if (e.inputType !== "insertFromPaste") return;
          e.preventDefault();
          if (props.isLargeDataStored) return;
          const paste = e.data ?? capturedPaste;
          capturedPaste = "";
          const cleanPaste = paste.trim().split(/\r?\n/)[0] ?? "";
          const input = e.currentTarget;
          const start = input.selectionStart ?? props.expression.length;
          const end = input.selectionEnd ?? props.expression.length;
          const newValue =
            props.expression.slice(0, start) +
            cleanPaste +
            props.expression.slice(end);
          props.onInput(newValue);
          const cursorPos = start + cleanPaste.length;
          requestAnimationFrame(() => {
            input.setSelectionRange(cursorPos, cursorPos);
          });
        }}
        class={`main-display bg-transparent border-none outline-none text-right w-full overflow-x-auto whitespace-pre ${
          props.isLargeDataStored ? "placeholder-style" : ""
        }`}
      />
      <div class="text-right text-xs h-5 overflow-hidden text-ellipsis whitespace-nowrap border-t border-white/5 mt-1 pt-1">
        {preview()}
      </div>
    </div>
  );
}

export default Display;
