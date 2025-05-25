import React, { useState } from "react";
import { motion } from "framer-motion";
import VideoSummaryForm, { SummaryOptions } from "./VideoSummaryForm";
import SummaryDisplay from "./SummaryDisplay";
import axios from "axios";

interface VideoMetadata {
  title: string;
  channelTitle: string;
  publishedAt: string;
  thumbnail: string;
  duration: string;
  viewCount: string;
}

interface SummaryData {
  briefSummary: string;
  detailedSummary: string;
  keyPoints: string[];
  timestamps: { time: string; text: string }[];
  mainTakeaways: string[];
}

interface ApiResponse {
  metadata: VideoMetadata;
  summary: SummaryData;
}

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoData, setVideoData] = useState<VideoMetadata | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Progress bar simulation
  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + Math.random() * 10;
        return newProgress >= 100 ? 99 : newProgress;
      });
    }, 500);
    return interval;
  };

  const handleSubmit = async (url: string, options: SummaryOptions) => {
    setIsLoading(true);
    setError(null);
    setVideoData(null);
    setSummaryData(null);

    const progressInterval = simulateProgress();

    try {
      // Call the backend API
      const response = await axios.post<ApiResponse>(
        "http://localhost:5000/api/summarize",
        {
          url,
          options: {
            length: options.length,
            focusAreas: options.focusAreas,
          },
        },
      );

      setVideoData(response.data.metadata);
      setSummaryData(response.data.summary);
    } catch (err) {
      console.error("Error:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.error ||
            "Failed to generate summary. Please try again.",
        );
      } else {
        setError(
          "Failed to connect to the server. Please make sure the server is running.",
        );
      }
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => setIsLoading(false), 500); // Small delay to show 100% completion
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            YouTube Video Summarizer
          </h1>
          <p className="text-muted-foreground">
            Paste a YouTube URL to get an AI-generated summary of the video
            content
          </p>
        </header>

        <main className="space-y-8">
          <VideoSummaryForm onSubmit={handleSubmit} isLoading={isLoading} />

          {error ? (
            <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-lg">
              <h3 className="font-medium">Error</h3>
              <p>{error}</p>
            </div>
          ) : (
            <SummaryDisplay
              isLoading={isLoading}
              progress={progress}
              error={error}
              videoTitle={videoData?.title || ""}
              videoThumbnail={videoData?.thumbnail || ""}
              videoDuration={videoData?.duration || ""}
              briefSummary={summaryData?.briefSummary || ""}
              detailedSummary={summaryData?.detailedSummary || ""}
              keyPoints={summaryData?.keyPoints || []}
              mainTakeaways={summaryData?.mainTakeaways || []}
              timestamps={summaryData?.timestamps || []}
            />
          )}
        </main>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            {new Date().getFullYear()} YouTube Video Summarizer. All rights
            reserved.
          </p>
        </footer>
      </motion.div>
    </div>
  );
};

export default Home;
