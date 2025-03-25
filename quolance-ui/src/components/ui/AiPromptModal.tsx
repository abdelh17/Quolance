import React, { useState } from "react";
import LargeModal from "./LargeModal";
import { useGenerateAbout } from "@/api/textGeneration-api";

interface AiPromptModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onApply: (value: string) => void; // Callback to apply AI-generated text
}

export default function AiPromptModal({
  isOpen,
  setIsOpen,
  onApply,
}: AiPromptModalProps) {
  const [prompt, setPrompt] = useState("");
  const {
    mutate: generateAbout,
    isLoading,
    data: generatedText,
  } = useGenerateAbout();

  // Generate AI text
  const handleGenerate = () => {
    generateAbout(prompt);
  };

  // Apply the AI-generated text to the parent
  const handleApply = () => {
    if (generatedText) {
      onApply(generatedText);
    }
    setIsOpen(false);
  };

  return (
    <LargeModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Generate About Me with AI"
      onConfirm={handleApply}
      confirmText="Apply"
      footerExtra={
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className={`hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full bg-blue-600 px-6 py-2 font-medium text-white duration-700
          after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]
          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span className="relative z-10">
            {isLoading ? "Generating..." : "Generate"}
          </span>
        </button>
      }
    >
      {/* Main content area */}
      <div className="p-4 flex flex-col gap-4">
        {/* Prompt Input */}
        <div>
          <label
            htmlFor="aiPrompt"
            className="block font-medium text-gray-700 mb-1"
          >
            Your Prompt
          </label>
          <textarea
            id="aiPrompt"
            placeholder="Enter your custom prompt or instructions..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={8}
            className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* AI Response */}
        {generatedText && (
          <div className="border border-gray-300 rounded bg-gray-50 p-4">
            <p className="font-semibold mb-2">AI Response:</p>
            <p className="whitespace-pre-wrap">{generatedText}</p>
          </div>
        )}
      </div>
    </LargeModal>
  );
}
