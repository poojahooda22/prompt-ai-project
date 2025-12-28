"use client";
import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveProvider, LivePreview, LiveError } from 'react-live';

export default function AppBuilder() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("<div>components goes here</div>");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    console.log("RAW CODE FROM AI:", data.code);
    setGeneratedCode(data.code);
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-black text-white p-10 gap-10">
      {/* LEFT: Input Area */}
      <div className="w-1/3 space-y-4">
        <h1 className="text-2xl font-bold">Vibe Designer</h1>
        <textarea 
          className="w-full h-40 p-4 bg-zinc-900 border border-zinc-800 rounded-lg"
          placeholder="e.g., Build a modern pricing section with 3 cards..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold"
        >
          {loading ? "Generating..." : "Generate Component"}
        </button>
      </div>

      {/* RIGHT: Preview Area */}
      <div className="w-2/3 bg-white text-black rounded-xl overflow-hidden shadow-2xl">
        <LiveProvider code={generatedCode} noInline={true}
          scope={{ ...Lucide, motion, AnimatePresence, React }}
        >
          <div className="p-4 border-b bg-gray-50 text-xs text-gray-500 font-mono">
            Preview Window
          </div>
          <div className="p-20 min-h-150 bg-zinc-50 flex items-center justify-center">
            <div className="w-full max-w-4xl">
                <LivePreview />
            </div>
          </div>
          <LiveError className="bg-red-100 text-red-600 p-4 text-xs" />
        </LiveProvider>
      </div>
    </div>
  );
}