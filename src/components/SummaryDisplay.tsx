import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clipboard, Check, Clock, ListChecks, BookOpen } from "lucide-react";

interface Timestamp {
  time: string;
  text: string;
}

interface SummaryDisplayProps {
  isLoading?: boolean;
  progress?: number;
  videoTitle?: string;
  videoThumbnail?: string;
  videoDuration?: string;
  keyPoints?: string[];
  mainTakeaways?: string[];
  timestamps?: Timestamp[];
  detailedSummary?: string;
  briefSummary?: string;
  error?: string;
}

const SummaryDisplay = ({
  isLoading = false,
  progress = 0,
  videoTitle = "",
  videoThumbnail = "",
  videoDuration = "",
  keyPoints = [],
  mainTakeaways = [],
  timestamps = [],
  detailedSummary = "",
  briefSummary = "",
  error = "",
}: SummaryDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const [summaryType, setSummaryType] = useState("brief");
  const [selectedFocusAreas, setSelectedFocusAreas] = useState({
    keyPoints: true,
    timestamps: true,
    takeaways: true,
  });

  const handleCopy = () => {
    const summaryText =
      summaryType === "brief" ? briefSummary : detailedSummary;
    let textToCopy = `Summary of "${videoTitle}":\n\n${summaryText}\n\n`;

    if (selectedFocusAreas.keyPoints) {
      textToCopy +=
        "Key Points:\n" +
        keyPoints.map((point) => `- ${point}`).join("\n") +
        "\n\n";
    }

    if (selectedFocusAreas.timestamps) {
      textToCopy +=
        "Timestamps:\n" +
        timestamps.map((ts) => `${ts.time} - ${ts.text}`).join("\n") +
        "\n\n";
    }

    if (selectedFocusAreas.takeaways) {
      textToCopy +=
        "Main Takeaways:\n" +
        mainTakeaways.map((takeaway) => `- ${takeaway}`).join("\n");
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFocusArea = (area: keyof typeof selectedFocusAreas) => {
    setSelectedFocusAreas((prev) => ({
      ...prev,
      [area]: !prev[area],
    }));
  };

  if (isLoading) {
    return (
      <Card className="w-full bg-white">
        <CardHeader>
          <CardTitle className="text-center">Generating Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Progress value={progress} className="w-full max-w-md" />
            <p className="text-sm text-muted-foreground">
              {progress < 30
                ? "Analyzing video content..."
                : progress < 60
                  ? "Extracting key points..."
                  : progress < 90
                    ? "Generating summary..."
                    : "Finalizing results..."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-white">
        <CardHeader>
          <CardTitle className="text-center text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-4 bg-gray-200 rounded-full w-24 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-full w-16 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded-full w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-full w-5/6 animate-pulse"></div>
        </div>
        <div className="pt-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-500 mt-2">
            Generating summary... {Math.round(progress)}%
          </p>
        </div>
      </div>
    );
  }

  if (!briefSummary && !detailedSummary && !keyPoints.length && !mainTakeaways.length && !timestamps.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        <p>Enter a YouTube URL and click "Generate Summary" to get started.</p>
      </div>
    );
  }

  return (
    <Card className="w-full bg-white">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1">{videoTitle}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {videoDuration}
          </Badge>
        </div>
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <img
            src={videoThumbnail}
            alt={videoTitle}
            className="h-full w-full object-cover"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-1"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Clipboard className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy Summary"}
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="keyPoints"
                checked={selectedFocusAreas.keyPoints}
                onCheckedChange={() => toggleFocusArea("keyPoints")}
              />
              <label htmlFor="keyPoints" className="text-sm cursor-pointer">
                Key Points
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="timestamps"
                checked={selectedFocusAreas.timestamps}
                onCheckedChange={() => toggleFocusArea("timestamps")}
              />
              <label htmlFor="timestamps" className="text-sm cursor-pointer">
                Timestamps
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="takeaways"
                checked={selectedFocusAreas.takeaways}
                onCheckedChange={() => toggleFocusArea("takeaways")}
              />
              <label htmlFor="takeaways" className="text-sm cursor-pointer">
                Takeaways
              </label>
            </div>
          </div>
        </div>

        <Tabs
          defaultValue="brief"
          value={summaryType}
          onValueChange={setSummaryType}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="brief" className="flex items-center gap-1">
              <ListChecks className="h-4 w-4" /> Brief Summary
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> Detailed Summary
            </TabsTrigger>
          </TabsList>

          <TabsContent value="brief" className="mt-4">
            <ScrollArea className="h-24">
              <p className="text-sm">{briefSummary}</p>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="detailed" className="mt-4">
            <ScrollArea className="h-24">
              <p className="text-sm">{detailedSummary}</p>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {selectedFocusAreas.keyPoints && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Key Points</h3>
            <ScrollArea className="h-32">
              <ul className="space-y-1">
                {keyPoints.map((point, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}

        {selectedFocusAreas.timestamps && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Timestamps</h3>
            <ScrollArea className="h-32">
              <div className="space-y-1">
                {timestamps.map((timestamp, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="min-w-14 text-center">
                      {timestamp.time}
                    </Badge>
                    <span>{timestamp.text}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {selectedFocusAreas.takeaways && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Main Takeaways</h3>
            <ScrollArea className="h-32">
              <ul className="space-y-1">
                {mainTakeaways.map((takeaway, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-center pt-2">
        <p className="text-xs text-muted-foreground">
          Summary generated by AI based on video content
        </p>
      </CardFooter>
    </Card>
  );
};

export default SummaryDisplay;
