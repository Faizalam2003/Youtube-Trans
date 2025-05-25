# YouTube Video Summarizer

A full-stack application that generates AI-powered summaries of YouTube videos by analyzing their transcripts. The application extracts video metadata, fetches the transcript, and uses OpenRouter (with OpenAI's models) to generate comprehensive summaries, key points, and timestamps.

## ✨ Features

- **Video Analysis**: Extract metadata and transcript from any YouTube video
- **AI-Powered Summaries**: Generate concise and detailed summaries using advanced AI
- **Structured Output**: Get organized results including:
  - Brief and detailed summaries
  - Key points
  - Timestamped sections
  - Main takeaways
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface built with modern web technologies

## 🛠 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite.js for fast development and building
- Tailwind CSS for styling
- Shadcn UI Components for beautiful, accessible UI
- Framer Motion for smooth animations
- Axios for API requests

### Backend
- Node.js with Express.js
- YouTube Data API v3 for video metadata
- youtube-transcript for fetching video transcripts
- OpenRouter (with OpenAI models) for AI summarization
- CORS for secure cross-origin requests
- Environment-based configuration

## 📁 Project Structure

```
vedio-trans/
├── public/                  # Static files
├── server/                  # Backend server
│   ├── node_modules/        # Server dependencies
│   ├── .env                 # Environment variables
│   ├── package.json         # Server dependencies
│   └── server.js            # Express server and API endpoints
├── src/                     # Frontend source code
│   ├── components/          # Reusable React components
│   │   ├── ui/              # Shadcn UI components
│   │   ├── VideoSummaryForm.tsx  # URL input and options form
│   │   ├── SummaryDisplay.tsx    # Summary results display
│   │   └── home.tsx               # Main page component
│   ├── lib/                 # Utility functions
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Application entry point
├── .gitignore              # Git ignore file
├── package.json            # Frontend dependencies
├── README.md               # Project documentation
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.ts          # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher) or yarn
- OpenRouter API key (get it from [OpenRouter](https://openrouter.ai/keys))
- YouTube Data API v3 key (get it from [Google Cloud Console](https://console.cloud.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vedio-trans
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   ```

3. **Set up the frontend**
   ```bash
   cd ../
   npm install
   ```

4. **Configure environment variables**
   Create a `.env` file in the `server` directory with:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key
   YOUTUBE_API_KEY=your_youtube_api_key
   PORT=5000
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd ..
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## 📝 Usage

1. Enter a YouTube video URL in the input field
2. (Optional) Customize summary options:
   - Choose between brief or detailed summary
   - Select which elements to include (key points, timestamps, takeaways)
3. Click "Generate Summary"
4. View the generated summary and video information

## 🔧 Troubleshooting

- **No transcript available**: Ensure the YouTube video has captions enabled
- **API errors**: Verify your API keys are correctly set in the `.env` file
- **CORS issues**: Make sure the frontend is making requests to the correct backend URL

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) for providing access to various AI models
- [YouTube Data API](https://developers.google.com/youtube/v3) for video metadata
- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library

---

Built with ❤️ by [Your Name]
- npm or yarn
- YouTube Data API key
- OpenAI API key

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   YOUTUBE_API_KEY=your_youtube_api_key_here
   PORT=5000
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. In the root directory, install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. To run both frontend and backend concurrently:
   ```
   npm start
   ```

## Usage

1. Open the application in your browser
2. Paste a YouTube URL in the input field
3. Select summary options (brief/detailed, focus areas)
4. Click "Summarize Video"
5. View the generated summary with key points, timestamps, and takeaways

## License

MIT

