const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { YoutubeTranscript } = require("youtube-transcript");
const { OpenAI } = require("openai");
const axios = require("axios");

dotenv.config();

const app = express();
// Configure CORS with specific origin and headers
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// Initialize OpenAI with OpenRouter configuration
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // Optional, for your app's URL
    "X-Title": "Video-Trans", // Optional, shown on openrouter.ai
  },
});

// Extract YouTube video ID from URL
function extractVideoId(url) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}

// Get video metadata from YouTube API
async function getVideoMetadata(videoId) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`
    );

    if (response.data.items.length === 0) {
      throw new Error("Video not found");
    }

    const videoData = response.data.items[0];
    const snippet = videoData.snippet;
    const contentDetails = videoData.contentDetails;

    // Format duration from ISO 8601 to readable format
    const duration = contentDetails.duration
      .replace("PT", "")
      .replace("H", "h ")
      .replace("M", "m ")
      .replace("S", "s");

    return {
      title: snippet.title,
      channelTitle: snippet.channelTitle,
      publishedAt: snippet.publishedAt,
      thumbnail: snippet.thumbnails.high.url,
      duration: duration,
      viewCount: videoData.statistics.viewCount,
    };
  } catch (error) {
    console.error("Error fetching video metadata:", error);
    throw error;
  }
}

// Helper function to estimate token count
function estimateTokens(text) {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

// Generate summary using OpenAI
async function generateSummary(transcript, options) {
  try {
    const { length = "brief", focusAreas = {} } = options || {};
    const maxTokens = 12000; // Leave room for prompt and response

    // Truncate transcript if needed
    let processedTranscript = transcript;
    if (estimateTokens(transcript) > maxTokens) {
      const charsToKeep = maxTokens * 4; // Convert back to character count
      processedTranscript =
        transcript.substring(0, charsToKeep) +
        "\n[Transcript was truncated due to length]";
    }

    // Build prompt based on options
    const instructions = [
      `Summarize the following YouTube video transcript ${
        length === "brief" ? "briefly" : "in detail"
      }.`,
      focusAreas.keyPoints && "Include key points.",
      focusAreas.timestamps &&
        "Include important timestamps with descriptions.",
      focusAreas.takeaways && "Include main takeaways.",
    ]
      .filter(Boolean)
      .join(" ");

    const messages = [
      {
        role: "system",
        content:
          "You are a helpful assistant that summarizes YouTube video content. " +
          "Format your response as JSON with the following structure: { " +
          "briefSummary: string, detailedSummary: string, keyPoints: string[], " +
          "timestamps: { time: string, text: string }[], mainTakeaways: string[] }",
      },
      {
        role: "user",
        content: `${instructions}\n\nTranscript: ${processedTranscript}`,
      },
    ];

    // Use a model with larger context window if available
    const model = "gpt-3.5-turbo";

    const response = await openai.chat.completions.create({
      model,
      messages,
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for more focused responses
      max_tokens: 2000, // Limit response length
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating summary:", error);
    // Provide a more user-friendly error message
    if (error.message.includes("context_length_exceeded")) {
      throw new Error(
        "The video is too long to process. Please try a shorter video or contact support for assistance."
      );
    }
    throw error;
  }
}

// API endpoint to summarize a YouTube video
app.post("/api/summarize", async (req, res) => {
  try {
    const { url, options } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL is required",
      });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({
        success: false,
        error: "Invalid YouTube URL. Please provide a valid YouTube video URL.",
      });
    }

    try {
      // Get video metadata
      const metadata = await getVideoMetadata(videoId);

      // Get video transcript
      console.log(`Fetching transcript for video: ${videoId}`);
      const transcriptArray = await YoutubeTranscript.fetchTranscript(videoId);
      const transcript = transcriptArray.map((item) => item.text).join(" ");
      console.log(`Transcript length: ${transcript.length} characters`);

      if (!transcript || transcript.trim().length === 0) {
        throw new Error(
          "No transcript available for this video. The video might not have captions enabled."
        );
      }

      // Generate summary
      console.log("Generating summary...");
      const summary = await generateSummary(transcript, options || {});

      // Return combined data
      return res.json({
        success: true,
        metadata,
        summary,
      });
    } catch (error) {
      console.error("Error processing video:", error);

      // Handle specific error cases
      if (error.message.includes("No transcript available")) {
        return res.status(400).json({
          success: false,
          error:
            "This video does not have captions available. Please try a different video with captions enabled.",
        });
      }

      if (error.message.includes("too long")) {
        return res.status(400).json({
          success: false,
          error:
            "This video is too long to process. Please try a shorter video (under 30 minutes).",
        });
      }

      throw error; // Re-throw for the general error handler
    }
  } catch (error) {
    console.error("Error in /api/summarize:", error);

    const statusCode = error.status || 500;
    const message =
      error.message ||
      "An unexpected error occurred while processing your request";

    res.status(statusCode).json({
      success: false,
      error: message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
