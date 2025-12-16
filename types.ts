export interface Highlight {
  timestamp: string;
  snippet: string;
  reason: string;
  title: string;
  visualPrompt: string;
}

export interface SocialMetadata {
  title: string;
  description: string;
  tags: string[];
}

export interface SeoData {
  youtubeShorts: SocialMetadata;
  tikTok: SocialMetadata;
  instagramReels: SocialMetadata;
  facebook: SocialMetadata;
}

export interface ScheduleItem {
  day: string;
  platform: string;
  time: string;
  contentTitle: string;
}

export interface AnalyticsSummary {
  topClip: string;
  bestHashtags: string[];
  improvements: string[];
}

export interface AnalysisResult {
  cleanedTranscript: string;
  highlights: Highlight[];
  seo: SeoData;
  captions: string;
  ffmpegCommands: string;
  schedule: ScheduleItem[];
  analyticsReport: AnalyticsSummary;
}

export interface MockEngagementData {
  views: number;
  likes: number;
  comments: number;
  shares: number;
}