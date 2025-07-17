import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ClipboardEvent,
} from "react";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  className = "",
  error = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [localValues, setLocalValues] = useState<string[]>(
    Array(length)
      .fill("")
      .map((_, i) => value[i] || "")
  );

  useEffect(() => {
    const newValues = Array(length)
      .fill("")
      .map((_, i) => value[i] || "");
    setLocalValues(newValues);
  }, [value, length]);

  const handleInputChange = (index: number, inputValue: string) => {
    if (disabled) return;

    // Only allow digits
    const newValue = inputValue.replace(/[^0-9]/g, "");
    if (newValue.length > 1) return;

    const newValues = [...localValues];
    newValues[index] = newValue;
    setLocalValues(newValues);
    onChange(newValues.join(""));

    // Move to next input if value entered
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Backspace") {
      if (!localValues[index] && index > 0) {
        // Move to previous input and clear it
        const newValues = [...localValues];
        newValues[index - 1] = "";
        setLocalValues(newValues);
        onChange(newValues.join(""));
        inputRefs.current[index - 1]?.focus();
      } else if (localValues[index]) {
        // Clear current input
        const newValues = [...localValues];
        newValues[index] = "";
        setLocalValues(newValues);
        onChange(newValues.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    const pastedValues = pastedData.slice(0, length).split("");

    const newValues = Array(length)
      .fill("")
      .map((_, i) => pastedValues[i] || "");
    setLocalValues(newValues);
    onChange(newValues.join(""));

    // Focus the next empty input or the last input
    const nextEmptyIndex = newValues.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1;
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className={`flex gap-2 justify-center ${className}`}>
      {localValues.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-12 h-12 md:w-14 md:h-14 text-center text-lg md:text-xl font-semibold 
            border-2 rounded-lg transition-colors
            focus:outline-none focus:ring-2 focus:ring-[#11E5C5] focus:border-transparent
            ${
              error
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }
            ${
              disabled
                ? "opacity-50 cursor-not-allowed bg-gray-100"
                : "bg-white"
            }
          `}
        />
      ))}
    </div>
  );
};
