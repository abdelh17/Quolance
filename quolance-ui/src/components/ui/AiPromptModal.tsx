import React, { useState } from "react";
import LargeModal from "./LargeModal";
import { useGenerateAbout } from "@/api/textGeneration-api";
import Typewriter from "typewriter-effect";

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
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const { mutate: generateAbout, isLoading } = useGenerateAbout();

  // Generate AI text
  const handleGenerate = () => {
    setAiResponse(null);

    generateAbout(prompt, {
      onSuccess: (response) => {
        setAiResponse(response);
      },
    });
  };

  // Retry: revert to prompt input
  const handleRetry = () => {
    setAiResponse(null);
  };

  // Apply the AI text to the parent and reset
  const handleApply = () => {
    if (aiResponse) {
      onApply(aiResponse);
    }
    setIsOpen(false);
    setAiResponse(null);
    setPrompt("");
  };

  // Decide which button to show in the footer (Generate, Retry, or loading)
  let footerButton;
  if (isLoading) {
    footerButton = (
      <button
        disabled
        className="hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full bg-blue-600 px-6 py-2 font-medium text-white opacity-50 cursor-not-allowed"
      >
        <span className="relative z-10">Generating...</span>
      </button>
    );
  } else if (aiResponse) {
    footerButton = (
      <button
        onClick={handleRetry}
        className="hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full bg-blue-600 px-6 py-2 font-medium text-white duration-700
          after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-blue-400 after:duration-700 hover:after:w-[calc(100%+2px)]"
      >
        <span className="relative z-10">Retry</span>
      </button>
    );
  } else {
    footerButton = (
      <button
        onClick={handleGenerate}
        className="hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full bg-blue-600 px-6 py-2 font-medium text-white duration-700
          after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-blue-400 after:duration-700 hover:after:w-[calc(100%+2px)]"
      >
        <span className="relative z-10">Generate</span>
      </button>
    );
  }

  return (
    <LargeModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Generate About Me with AI"
      onConfirm={handleApply}
      confirmText="Apply"
      footerExtra={footerButton}
    >
      <div className="p-4 flex flex-col gap-4">
        {/* Loading Spinner */}
        {isLoading && !aiResponse && (
          <div className="flex justify-center items-center py-4">
            <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mr-2"></div>
            <p className="text-blue-600">Generating AI response...</p>
          </div>
        )}

        {/* Typewriter Effect: if we have a response */}
        {aiResponse && (
          <div className="border border-gray-300 rounded bg-gray-50 p-4">
            <p className="font-semibold mb-2">AI Response:</p>
            <Typewriter
              onInit={(typewriter) => {
                // Replace newlines with <br/> so line breaks are preserved
                const typedString = aiResponse.replace(/\n/g, "<br/>");
                typewriter
                  .typeString(typedString)
                  .start();
              }}
              options={{
                cursor: "|",
                delay: 10, // typing speed (ms per character)
                loop: false,
                // If line breaks still don't appear, try enabling HTML parsing:
                // html: true,
              }}
            />
          </div>
        )}

        {/* Prompt Input (only if not loading and no AI response) */}
        {!aiResponse && !isLoading && (
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
        )}
      </div>
    </LargeModal>
  );
}
