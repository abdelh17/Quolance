'use client';

import React, { useState, ReactNode } from 'react';
import LargeModal from './LargeModal';
import Typewriter from 'typewriter-effect';
import { TailSpin } from 'react-loading-icons';
import { Sparkles, Wand2, RefreshCw, CheckCircle } from 'lucide-react';

export interface AiPromptModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onApply: (value: string) => void;
  generateMutation: {
    mutate: (prompt: string, options?: { onSuccess?: (response: string) => void }) => void;
    isLoading: boolean;
  };
  title?: string | ReactNode;
  confirmText?: string | ReactNode;
}

export default function AiPromptModal({
  isOpen,
  setIsOpen,
  onApply,
  generateMutation,
  title = 'Generate with AI',
  confirmText = 'Apply',
}: AiPromptModalProps) {
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Destructure from the passed-in mutation prop
  const { mutate, isLoading } = generateMutation;

  // Generate AI text
  const handleGenerate = () => {
    setAiResponse(null);
    mutate(prompt, {
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
    setPrompt('');
  };

  // Decide which button to show in the footer (Generate, Retry, or loading)
  let footerButton;
  if (isLoading) {
    footerButton = (
      <button
        disabled
        className="relative flex items-center justify-center rounded-full bg-indigo-400 px-6 py-2 font-medium text-white cursor-not-allowed transition"
      >
        <TailSpin stroke="#ffffff" speed={0.8} width="16" height="16" className="mr-2" />
        <span className="relative z-10">Generating...</span>
      </button>
    );
  } else if (aiResponse) {
    footerButton = (
      <button
        onClick={handleRetry}
        className="hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full bg-indigo-600 px-6 py-2 font-medium text-white duration-700
          after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]"
      >
        <RefreshCw className="h-4 w-4 mr-1" />
        <span className="relative z-10">Retry</span>
      </button>
    );
  } else {
    footerButton = (
      <button
        onClick={handleGenerate}
        className="hover:text-n900 relative flex items-center justify-center overflow-hidden rounded-full bg-indigo-600 px-6 py-2 font-medium text-white duration-700
          after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:after:w-[calc(100%+2px)]"
      >
        <Sparkles className="h-4 w-4 mr-1 text-yellow-100" />
        <span className="relative z-10">Generate</span>
      </button>
    );
  }

  // Create the title element with icon
  const titleElement = (
    <div className="flex items-center gap-2 text-xl font-semibold text-indigo-900">
      <Wand2 className="h-5 w-5 text-indigo-600" />
      {title}
    </div>
  );

  // Use the provided confirmText or create a default with icon
  const confirmElement = typeof confirmText === 'string' ? (
    <div className="flex items-center gap-1">
      <CheckCircle className="h-4 w-4" />
      {confirmText}
    </div>
  ) : confirmText;

  return (
    <LargeModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={titleElement}
      onConfirm={handleApply}
      confirmText={confirmElement}
      confirmButtonColor="bg-indigo-600"
      footerExtra={footerButton}
      disableConfirm={!aiResponse}
    >
      <div className="p-4 flex flex-col gap-6">
        {/* Loading State */}
        {isLoading && !aiResponse && (
          <div className="flex flex-col items-center justify-center py-16 min-h-[250px] gap-4 text-center bg-indigo-50 rounded-xl">
            <div className="relative">
              <TailSpin stroke="#6366f1" speed={0.8} width="60" height="60" />
              <div className="absolute inset-0 bg-indigo-50 blur-lg opacity-50 animate-pulse rounded-full"></div>
            </div>
            <p className="text-indigo-600 font-medium tracking-wide">
              Generating AI response...
            </p>
          </div>
        )}

        {/* Typewriter Effect: if we have a response */}
        {aiResponse && (
          <div className="border border-indigo-200 rounded-xl bg-gradient-to-br from-white to-indigo-50 p-6 shadow-md">
            <p className="text-indigo-800 font-semibold tracking-wide mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              AI Response:
            </p>
            <div className="prose max-w-none text-gray-700">
              <Typewriter
                onInit={(typewriter) => {
                  const typedString = aiResponse.replace(/\n/g, '<br/>');
                  typewriter.typeString(typedString).start();
                }}
                options={{
                  cursor: '|',
                  delay: 10,
                  loop: false,
                  // html: true, // uncomment if needed for line breaks
                }}
              />
            </div>
          </div>
        )}

        {/* Prompt Input (only if not loading and no AI response) */}
        {!aiResponse && !isLoading && (
          <div className="space-y-4">
            <label
              htmlFor="aiPrompt"
              className="block font-medium text-gray-700 mb-1 flex items-center gap-1"
            >
              <Wand2 className="h-4 w-4 text-indigo-500" />
              Your Prompt
            </label>
            <div className="relative">
              <textarea
                id="aiPrompt"
                placeholder="Enter your custom prompt or instructions..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={8}
                className="w-full rounded-xl border border-indigo-200 p-4 bg-white shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-300 focus:outline-none transition"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {prompt.length} characters
              </div>
            </div>
            <p className="text-xs text-gray-500 italic">
              Tip: Be specific about what you want the AI to generate for best results.
            </p>
          </div>
        )}
      </div>
    </LargeModal>
  );
}