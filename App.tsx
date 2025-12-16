import React, { useState } from "react";
import { InputSection } from "./components/InputSection";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { analyzeTranscript } from "./services/geminiService";
import { AnalysisResult } from "./types";

const App = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (content: string, mimeType: string, engagement: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeTranscript(content, mimeType, engagement);
      setResult(data);
    } catch (err: any) {
      setError("Failed to process content. Please check your API key and try again. If using a large video, it may have exceeded the limit.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white selection:bg-purple-500 selection:text-white">
      {result ? (
        <ResultsDashboard data={result} onReset={handleReset} />
      ) : (
        <div className="flex flex-col min-h-screen">
          <header className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
            <div className="text-xl font-bold tracking-tight flex items-center gap-2">
               <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                 <span className="text-white font-mono text-sm">V</span>
               </div>
               <span>VidGenius</span>
            </div>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Documentation</a>
          </header>
          
          <main className="flex-1 flex flex-col justify-center">
            <InputSection onAnalyze={handleAnalyze} isLoading={loading} />
            
            {error && (
              <div className="max-w-md mx-auto mt-6 bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-xl text-center animate-in fade-in">
                {error}
              </div>
            )}
          </main>

          <footer className="p-6 text-center text-gray-600 text-sm">
            Powered by Gemini 2.5 Flash • Built for Creators
          </footer>
        </div>
      )}
    </div>
  );
};

export default App;
