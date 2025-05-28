"use client";

import { useState, useCallback } from "react";
import AvatarSetup from "@/components/AvatarSetup";
import AvatarControls from "@/components/AvatarControls";
import VoiceInteraction from "@/components/VoiceInteraction";
import Link from "next/link";

export default function AvatarPage() {
  const [apiKey, setApiKey] = useState("");
  const [avatarId, setAvatarId] = useState("");
  const [showAvatar, setShowAvatar] = useState(false);
  const [voiceInput, setVoiceInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAvatar(true);
  };

  const handleExpressionChange = useCallback((expression: string) => {
    // In a real implementation, this would update the avatar's expression
    console.log("Changing expression to:", expression);
  }, []);

  const handleActionTrigger = useCallback((action: string) => {
    // In a real implementation, this would trigger an avatar action
    console.log("Triggering action:", action);
  }, []);

  const handleSpeechInput = useCallback(
    (text: string) => {
      setVoiceInput(text);
      console.log("Speech input received:", text);

      // Simple keyword detection for expressions and actions
      const lowerText = text.toLowerCase();

      // Check for expressions
      if (lowerText.includes("happy") || lowerText.includes("smile")) {
        handleExpressionChange("happy");
      } else if (lowerText.includes("sad")) {
        handleExpressionChange("sad");
      } else if (lowerText.includes("angry")) {
        handleExpressionChange("angry");
      } else if (
        lowerText.includes("surprised") ||
        lowerText.includes("shock")
      ) {
        handleExpressionChange("surprised");
      }

      // Check for actions
      if (lowerText.includes("wave")) {
        handleActionTrigger("wave");
      } else if (lowerText.includes("nod")) {
        handleActionTrigger("nod");
      } else if (lowerText.includes("shake")) {
        handleActionTrigger("shake");
      } else if (lowerText.includes("dance")) {
        handleActionTrigger("dance");
      }
    },
    [handleExpressionChange, handleActionTrigger]
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8">
        AI Avatar Setup with Antispace
      </h1>

      {!showAvatar ? (
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                htmlFor="apiKey"
              >
                Antispace API Key
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="apiKey"
                type="text"
                placeholder="Enter your Antispace API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
              />
              <p className="text-xs italic mt-2">
                You can get your API key from the Antispace dashboard.
              </p>
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                htmlFor="avatarId"
              >
                Avatar ID (Optional)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="avatarId"
                type="text"
                placeholder="Enter your avatar ID (optional)"
                value={avatarId}
                onChange={(e) => setAvatarId(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Load Avatar
              </button>
              <Link
                href="/"
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              >
                Back to Home
              </Link>
            </div>
          </form>

          <p className="text-center text-gray-500 text-xs">
            &copy;2025 AI Avatar Demo. All rights reserved.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <AvatarSetup
            apiKey={apiKey}
            avatarId={avatarId || undefined}
            height={500}
            width={500}
          />

          <AvatarControls
            onExpressionChange={handleExpressionChange}
            onActionTrigger={handleActionTrigger}
          />

          <VoiceInteraction onSpeechInput={handleSpeechInput} />

          {voiceInput && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-medium mb-2 text-blue-800 dark:text-blue-200">
                Voice Command
              </h3>
              <p className="text-blue-700 dark:text-blue-300">{voiceInput}</p>
            </div>
          )}

          <div className="mt-8 flex space-x-4">
            <button
              onClick={() => setShowAvatar(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Change Settings
            </button>

            <Link
              href="/"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Back to Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
