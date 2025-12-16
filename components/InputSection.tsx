import React, { useState, useRef } from "react";
import { MagicIcon, UploadIcon, YouTubeIcon, CloudUploadIcon, FileIcon } from "./Icons";

interface InputSectionProps {
  onAnalyze: (content: string, mimeType: string, engagement: string) => void;
  isLoading: boolean;
}

type InputMode = "text" | "video" | "youtube";

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [mode, setMode] = useState<InputMode>("text");
  const [transcript, setTranscript] = useState("");
  const [engagement, setEngagement] = useState("Views: 1000, Likes: 150, Comments: 20");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "text") {
      if (!transcript.trim()) return;
      onAnalyze(transcript, "text/plain", engagement);
    } else if (mode === "youtube") {
      if (!youtubeUrl.trim()) return;
      // We pass the URL as text, the service will need to handle it (or just treat as text context)
      onAnalyze(youtubeUrl, "text/plain", engagement); 
    } else if (mode === "video") {
      if (!videoFile) return;
      
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get raw base64
        const base64String = result.split(',')[1];
        onAnalyze(base64String, videoFile.type, engagement);
      };
      reader.readAsDataURL(videoFile);
    }
  };

  const handleTextFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTranscript(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert("For this demo, please use video files under 20MB.");
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 pb-2">
          VidGenius AI
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Transform video content into viral-ready short clips, captions, SEO metadata, and publishing schedules in seconds.
        </p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-2xl">
        <div className="flex space-x-2 mb-6 bg-gray-900/50 p-1.5 rounded-xl border border-gray-700/50">
          <button
            onClick={() => setMode("text")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
              mode === "text" ? "bg-gray-700 text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
            type="button"
          >
            <FileIcon className="w-4 h-4" />
            <span>Transcript</span>
          </button>
          <button
            onClick={() => setMode("video")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
              mode === "video" ? "bg-purple-600 text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
            type="button"
          >
            <CloudUploadIcon className="w-4 h-4" />
            <span>Upload Video</span>
          </button>
          <button
            onClick={() => setMode("youtube")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
              mode === "youtube" ? "bg-red-600 text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
            type="button"
          >
            <YouTubeIcon className="w-4 h-4" />
            <span>YouTube Link</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "text" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Raw Video Transcript
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors bg-purple-900/20 px-3 py-1.5 rounded-lg border border-purple-500/30 hover:bg-purple-900/40"
                >
                  <UploadIcon className="w-3.5 h-3.5 mr-1.5" />
                  Upload .txt file
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleTextFileChange}
                  className="hidden"
                  accept=".txt"
                />
              </div>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste your raw, unedited transcript here..."
                className="w-full h-64 bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none font-mono text-sm transition-all"
                required={mode === "text"}
              />
            </div>
          )}

          {mode === "video" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Video File (Max 20MB for demo)
              </label>
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  videoFile ? "border-purple-500 bg-purple-900/10" : "border-gray-700 bg-gray-900 hover:border-gray-600"
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith('video/')) {
                     if (file.size > 20 * 1024 * 1024) {
                        alert("File too large for demo.");
                        return;
                     }
                     setVideoFile(file);
                     setVideoPreview(URL.createObjectURL(file));
                  }
                }}
              >
                {!videoFile ? (
                  <div className="space-y-4" onClick={() => videoInputRef.current?.click()}>
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto cursor-pointer hover:bg-gray-700 transition-colors">
                      <CloudUploadIcon className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-gray-300 font-medium">Click to upload or drag and drop</p>
                      <p className="text-gray-500 text-sm mt-1">MP4, MOV (max 20MB)</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {videoPreview && (
                      <video src={videoPreview} controls className="max-h-64 mx-auto rounded-lg shadow-lg" />
                    )}
                    <div className="flex items-center justify-center space-x-2">
                       <span className="text-purple-300 font-medium text-sm">{videoFile.name}</span>
                       <button 
                         type="button" 
                         onClick={() => { setVideoFile(null); setVideoPreview(null); }}
                         className="text-gray-500 hover:text-white"
                       >
                         ✕
                       </button>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  ref={videoInputRef}
                  onChange={handleVideoFileChange}
                  className="hidden"
                  accept="video/*"
                />
              </div>
            </div>
          )}

          {mode === "youtube" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                YouTube Video URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <YouTubeIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm transition-all"
                  required={mode === "youtube"}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Note: Analyzing external YouTube links works best for popular videos with accessible captions. For personal videos, please use the Upload tab.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mock Engagement Data (Optional)
            </label>
            <input
              type="text"
              value={engagement}
              onChange={(e) => setEngagement(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || (mode === 'text' && !transcript) || (mode === 'video' && !videoFile) || (mode === 'youtube' && !youtubeUrl)}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] ${
              isLoading
                ? "bg-gray-700 cursor-not-allowed text-gray-400"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-purple-500/25"
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing with Gemini 2.5...</span>
              </>
            ) : (
              <>
                <MagicIcon className="w-6 h-6" />
                <span>Generate Content Assets</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
