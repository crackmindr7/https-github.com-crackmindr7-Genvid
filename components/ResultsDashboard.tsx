import React, { useState } from "react";
import { AnalysisResult, SeoData, SocialMetadata } from "../types";
import { CopyIcon, VideoIcon, ChartIcon, ImageIcon, FileIcon, TerminalIcon } from "./Icons";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ResultsDashboardProps {
  data: AnalysisResult;
  onReset: () => void;
}

type TabType = "clean" | "highlights" | "seo" | "captions" | "ffmpeg" | "schedule" | "analytics";

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data, onReset }) => {
  const [activeTab, setActiveTab] = useState<TabType>("highlights");
  const [copied, setCopied] = useState("");

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  // Helper to generate a specific ffmpeg cut command for a highlight
  const getClipCommand = (timestamp: string, index: number) => {
    // Expected format: "MM:SS - MM:SS"
    const times = timestamp.split('-').map(t => t.trim());
    if (times.length !== 2) return "ffmpeg -i input.mp4 -c copy clip.mp4"; // Fallback
    return `ffmpeg -i input.mp4 -ss ${times[0]} -to ${times[1]} -c copy clip_${index + 1}.mp4`;
  };

  const SidebarButton = ({ id, label, icon: Icon }: { id: TabType, label: string, icon?: React.ElementType }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center space-x-3 text-sm font-medium ${
        activeTab === id
          ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm"
          : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
      }`}
    >
      {Icon && <Icon className="w-4 h-4 opacity-70" />}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden font-inter">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800/50 backdrop-blur-xl border-r border-gray-700 flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-2 text-white font-bold text-xl cursor-pointer hover:opacity-80 transition-opacity" onClick={onReset}>
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-1.5 rounded-lg">
               <VideoIcon className="w-5 h-5 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">VidGenius</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div>
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Assets</h3>
            <div className="space-y-1">
              <SidebarButton id="highlights" label="Clip Studio" icon={VideoIcon} />
              <SidebarButton id="seo" label="SEO Metadata" icon={ChartIcon} />
            </div>
          </div>

          <div>
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Production</h3>
            <div className="space-y-1">
              <SidebarButton id="clean" label="Clean Transcript" icon={FileIcon} />
              <SidebarButton id="captions" label="Captions (.srt)" icon={FileIcon} />
              <SidebarButton id="ffmpeg" label="FFmpeg Scripts" icon={TerminalIcon} />
            </div>
          </div>

          <div>
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Strategy</h3>
            <div className="space-y-1">
              <SidebarButton id="schedule" label="Schedule" icon={ChartIcon} />
              <SidebarButton id="analytics" label="Analytics" icon={ChartIcon} />
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-700/50 bg-gray-900/20">
          <button
            onClick={onReset}
            className="w-full py-2.5 px-4 rounded-lg border border-gray-600/50 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors text-xs font-medium uppercase tracking-wide"
          >
            New Project
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-950 p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Highlights Tab (Redesigned as Clip Studio) */}
          {activeTab === "highlights" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end border-b border-gray-800 pb-6">
                <div>
                   <h2 className="text-3xl font-bold text-white mb-2">Clip Studio</h2>
                   <p className="text-gray-400">Viral-ready assets for your repurposing workflow.</p>
                </div>
              </div>

              <div className="grid gap-8">
                {data.highlights.map((highlight, idx) => (
                  <div key={idx} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl hover:border-purple-500/30 transition-all duration-300">
                    {/* Card Header */}
                    <div className="bg-gray-800/40 p-6 border-b border-gray-800 flex justify-between items-start">
                       <div>
                          <div className="flex items-center gap-3 mb-2">
                             <span className="bg-purple-500/10 text-purple-400 text-xs font-bold px-2 py-1 rounded border border-purple-500/20 uppercase">
                                Clip {idx + 1}
                             </span>
                             <span className="text-gray-500 text-sm font-mono flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                {highlight.timestamp}
                             </span>
                          </div>
                          <h3 className="text-2xl font-bold text-white leading-tight">{highlight.title}</h3>
                       </div>
                       <button
                         onClick={() => copyToClipboard(highlight.title, `title-${idx}`)}
                         className="text-gray-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700/50"
                         title="Copy Title"
                       >
                         {copied === `title-${idx}` ? <span className="text-green-400 text-xs font-bold">Copied</span> : <CopyIcon className="w-5 h-5" />}
                       </button>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                       {/* Left Column: Content */}
                       <div className="lg:col-span-2 space-y-6">
                          <div>
                             <label className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2 block">The Hook & Content</label>
                             <div className="text-gray-300 text-lg leading-relaxed italic border-l-2 border-gray-700 pl-4 py-1">
                                "{highlight.snippet}"
                             </div>
                          </div>
                          
                          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-800">
                             <div className="flex items-center gap-2 mb-2 text-yellow-500/80 font-medium text-sm">
                                <span>★ Why it works</span>
                             </div>
                             <p className="text-gray-400 text-sm">{highlight.reason}</p>
                          </div>
                       </div>

                       {/* Right Column: Assets */}
                       <div className="space-y-4">
                          {/* Visual Prompt Asset */}
                          <div className="bg-blue-950/20 border border-blue-500/20 rounded-xl p-4 relative group">
                             <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 text-xs text-blue-400 uppercase font-bold tracking-wider">
                                   <ImageIcon className="w-3 h-3" />
                                   Thumbnail Prompt
                                </label>
                                <button 
                                    onClick={() => copyToClipboard(highlight.visualPrompt, `prompt-${idx}`)}
                                    className="text-blue-400/50 hover:text-blue-300 transition-colors"
                                >
                                    {copied === `prompt-${idx}` ? <span className="text-xs">Copied</span> : <CopyIcon className="w-4 h-4" />}
                                </button>
                             </div>
                             <p className="text-gray-400 text-xs font-mono leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">
                                {highlight.visualPrompt}
                             </p>
                          </div>

                          {/* Action Asset */}
                          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                             <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 text-xs text-gray-400 uppercase font-bold tracking-wider">
                                   <TerminalIcon className="w-3 h-3" />
                                   Cut Command
                                </label>
                                <button 
                                    onClick={() => copyToClipboard(getClipCommand(highlight.timestamp, idx), `cmd-${idx}`)}
                                    className="text-gray-500 hover:text-white transition-colors"
                                >
                                    {copied === `cmd-${idx}` ? <span className="text-xs text-green-400">Copied</span> : <span className="text-xs border border-gray-600 px-2 py-0.5 rounded hover:bg-gray-700">Copy</span>}
                                </button>
                             </div>
                             <code className="text-[10px] text-green-400 font-mono block overflow-hidden text-ellipsis whitespace-nowrap bg-black/30 p-1.5 rounded">
                                {getClipCommand(highlight.timestamp, idx)}
                             </code>
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === "seo" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-3xl font-bold text-white mb-6">SEO Metadata</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {(Object.entries(data.seo) as [string, SocialMetadata][]).map(([platform, meta]) => (
                   <div key={platform} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
                      <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
                        <h3 className="text-lg font-bold text-white capitalize flex items-center gap-2">
                           <span className={`w-2 h-2 rounded-full ${platform.includes('Shorts') ? 'bg-red-500' : platform.includes('TikTok') ? 'bg-cyan-500' : 'bg-pink-500'}`}></span>
                           {platform.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <button
                          onClick={() => copyToClipboard(`${meta.title}\n\n${meta.description}\n\n${meta.tags.map(t=>`#${t.replace('#','')}`).join(' ')}`, `seo-${platform}`)}
                          className="text-xs font-medium text-purple-400 hover:text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-lg hover:bg-purple-500/10 transition-colors"
                        >
                          {copied === `seo-${platform}` ? "Copied All" : "Copy All"}
                        </button>
                      </div>
                      <div className="space-y-5">
                        <div className="group relative">
                           <div className="flex justify-between items-center mb-1">
                              <label className="text-xs text-gray-500 uppercase font-semibold">Title</label>
                              <button onClick={() => copyToClipboard(meta.title, `t-${platform}`)} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-white"><CopyIcon className="w-3 h-3"/></button>
                           </div>
                           <p className="text-white font-medium bg-gray-800/30 p-3 rounded-lg border border-gray-800">{meta.title}</p>
                        </div>
                        <div className="group relative">
                          <div className="flex justify-between items-center mb-1">
                              <label className="text-xs text-gray-500 uppercase font-semibold">Description</label>
                              <button onClick={() => copyToClipboard(meta.description, `d-${platform}`)} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-white"><CopyIcon className="w-3 h-3"/></button>
                           </div>
                          <p className="text-gray-300 text-sm leading-relaxed bg-gray-800/30 p-3 rounded-lg border border-gray-800 whitespace-pre-wrap">{meta.description}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 uppercase font-semibold block mb-2">Tags</label>
                          <div className="flex flex-wrap gap-2">
                            {meta.tags.map(tag => (
                              <span key={tag} className="bg-blue-500/10 text-blue-400 text-xs px-2.5 py-1 rounded-full border border-blue-500/20">#{tag.replace('#','')}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* Clean Transcript Tab */}
          {activeTab === "clean" && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Cleaned Transcript</h2>
                <button
                  onClick={() => copyToClipboard(data.cleanedTranscript, "clean")}
                  className="flex items-center text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-700 transition-colors"
                >
                  <CopyIcon className="w-4 h-4 mr-2" />
                  {copied === "clean" ? "Copied!" : "Copy Text"}
                </button>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-gray-300 leading-relaxed whitespace-pre-wrap font-serif text-lg shadow-inner">
                {data.cleanedTranscript}
              </div>
            </div>
          )}

          {/* Captions Tab */}
          {activeTab === "captions" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Captions (.srt)</h2>
                <button
                  onClick={() => copyToClipboard(data.captions, "captions")}
                  className="flex items-center text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-700 transition-colors"
                >
                  <CopyIcon className="w-4 h-4 mr-2" />
                  {copied === "captions" ? "Copied!" : "Copy SRT"}
                </button>
              </div>
              <pre className="bg-black border border-gray-800 rounded-2xl p-6 text-green-400 font-mono text-sm overflow-x-auto h-[600px] shadow-inner">
                {data.captions}
              </pre>
            </div>
          )}

          {/* FFmpeg Tab */}
          {activeTab === "ffmpeg" && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">FFmpeg Automation</h2>
                <button
                  onClick={() => copyToClipboard(data.ffmpegCommands, "ffmpeg")}
                  className="flex items-center text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-700 transition-colors"
                >
                  <CopyIcon className="w-4 h-4 mr-2" />
                  {copied === "ffmpeg" ? "Copied!" : "Copy Scripts"}
                </button>
              </div>
              <div className="bg-blue-900/10 border border-blue-900/30 rounded-xl p-4 mb-4 flex items-start gap-3">
                 <TerminalIcon className="w-5 h-5 text-blue-400 mt-0.5" />
                 <p className="text-blue-300 text-sm">Run these commands in your terminal to automatically process your video. Ensure <code>input.mp4</code> and the saved <code>captions.srt</code> are in the same folder.</p>
              </div>
              <pre className="bg-gray-950 border border-gray-800 rounded-2xl p-6 text-gray-300 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                {data.ffmpegCommands}
              </pre>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === "schedule" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-white mb-6">7-Day Publishing Calendar</h2>
              <div className="overflow-hidden rounded-2xl border border-gray-800 shadow-xl">
                <table className="min-w-full bg-gray-900">
                  <thead>
                    <tr className="bg-gray-950 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-800">
                      <th className="px-6 py-4">Day</th>
                      <th className="px-6 py-4">Platform</th>
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4">Content Focus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {data.schedule.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 text-white font-medium">{item.day}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border border-opacity-20
                            ${item.platform.toLowerCase().includes('youtube') ? 'bg-red-500/10 text-red-400 border-red-500' : 
                              item.platform.toLowerCase().includes('tiktok') ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500' :
                              item.platform.toLowerCase().includes('instagram') ? 'bg-pink-500/10 text-pink-400 border-pink-500' :
                              'bg-blue-500/10 text-blue-400 border-blue-500'}`}>
                            {item.platform}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 font-mono text-sm">{item.time}</td>
                        <td className="px-6 py-4 text-gray-300">{item.contentTitle}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

           {/* Analytics Tab */}
           {activeTab === "analytics" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-3xl font-bold text-white mb-6">Performance Insights</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-lg">
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Projected Top Clip</h3>
                    <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{data.analyticsReport.topClip}</p>
                 </div>
                 <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 md:col-span-2 shadow-lg">
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Strategic Improvements</h3>
                    <ul className="space-y-2">
                      {data.analyticsReport.improvements.map((imp, i) => (
                        <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                           <span className="text-green-500 mt-1">✓</span>
                           {imp}
                        </li>
                      ))}
                    </ul>
                 </div>
               </div>

               <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-lg">
                 <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-6 flex items-center">
                   <ChartIcon className="w-4 h-4 mr-2" />
                   Engagement Projection (Simulated)
                 </h3>
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Views', value: 2500 },
                        { name: 'Likes', value: 850 },
                        { name: 'Shares', value: 400 },
                        { name: 'Saves', value: 200 },
                      ]}>
                        <XAxis dataKey="name" stroke="#4b5563" tickLine={false} axisLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <YAxis stroke="#4b5563" tickLine={false} axisLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                          cursor={{fill: '#1f2937'}}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                           {[0,1,2,3].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#60a5fa', '#a78bfa', '#f472b6', '#34d399'][index]} />
                           ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};