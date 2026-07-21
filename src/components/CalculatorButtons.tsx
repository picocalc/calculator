import CalculatorButton from "./CalculatorButton.tsx";

interface Props {
  onAppendToken(token: string): void;
  onClearAll(): void;
  onBackspace(): void;
  onCalculate(): void;
}

function CalculatorButtons(props: Props) {
  return (
    <div class="grid grid-cols-4 gap-2">
      <CalculatorButton
        label="AC"
        onClick={props.onClearAll}
        variant="danger"
      />
      <CalculatorButton
        label="π"
        onClick={() => props.onAppendToken("pi")}
        variant="accent"
      />
      <CalculatorButton
        label="e"
        onClick={() => props.onAppendToken("e")}
        variant="accent"
      />
      <CalculatorButton
        label="⌫"
        onClick={props.onBackspace}
        variant="danger"
      />

      <CalculatorButton
        label="x!"
        onClick={() => props.onAppendToken("!")}
        variant="fn"
      />
      <CalculatorButton
        label="%"
        onClick={() => props.onAppendToken("%")}
        variant="fn"
      />
      <CalculatorButton
        label="("
        onClick={() => props.onAppendToken("(")}
        variant="fn"
      />
      <CalculatorButton
        label=")"
        onClick={() => props.onAppendToken(")")}
        variant="fn"
      />

      <CalculatorButton
        label="7"
        onClick={() => props.onAppendToken("7")}
        variant="number"
      />
      <CalculatorButton
        label="8"
        onClick={() => props.onAppendToken("8")}
        variant="number"
      />
      <CalculatorButton
        label="9"
        onClick={() => props.onAppendToken("9")}
        variant="number"
      />
      <CalculatorButton
        label="÷"
        onClick={() => props.onAppendToken("/")}
        variant="op"
      />

      <CalculatorButton
        label="4"
        onClick={() => props.onAppendToken("4")}
        variant="number"
      />
      <CalculatorButton
        label="5"
        onClick={() => props.onAppendToken("5")}
        variant="number"
      />
      <CalculatorButton
        label="6"
        onClick={() => props.onAppendToken("6")}
        variant="number"
      />
      <CalculatorButton
        label="×"
        onClick={() => props.onAppendToken("*")}
        variant="op"
      />

      <CalculatorButton
        label="1"
        onClick={() => props.onAppendToken("1")}
        variant="number"
      />
      <CalculatorButton
        label="2"
        onClick={() => props.onAppendToken("2")}
        variant="number"
      />
      <CalculatorButton
        label="3"
        onClick={() => props.onAppendToken("3")}
        variant="number"
      />
      <CalculatorButton
        label="−"
        onClick={() => props.onAppendToken("-")}
        variant="op"
      />

      <CalculatorButton
        label="0"
        onClick={() => props.onAppendToken("0")}
        variant="number"
      />
      <CalculatorButton
        label="."
        onClick={() => props.onAppendToken(".")}
        variant="number"
      />
      <CalculatorButton
        label="^"
        onClick={() => props.onAppendToken("^")}
        variant="op"
      />
      <CalculatorButton
        label="+"
        onClick={() => props.onAppendToken("+")}
        variant="op"
      />

      <CalculatorButton
        label="="
        onClick={props.onCalculate}
        variant="success"
        span={4}
      />
    </div>
  );
}

export default CalculatorButtons;
