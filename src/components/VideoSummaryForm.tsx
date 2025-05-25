import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VideoSummaryFormProps {
  onSubmit: (url: string, options: SummaryOptions) => void;
  isLoading?: boolean;
}

export interface SummaryOptions {
  length: "brief" | "detailed";
  focusAreas: {
    keyPoints: boolean;
    timestamps: boolean;
    takeaways: boolean;
  };
}

const VideoSummaryForm = ({
  onSubmit,
  isLoading = false,
}: VideoSummaryFormProps) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<SummaryOptions>({
    length: "brief",
    focusAreas: {
      keyPoints: true,
      timestamps: true,
      takeaways: true,
    },
  });

  const validateYouTubeUrl = (url: string): boolean => {
    // Basic YouTube URL validation
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    if (!validateYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setError(null);
    onSubmit(url, options);
  };

  const handleLengthChange = (value: string) => {
    setOptions((prev) => ({
      ...prev,
      length: value as "brief" | "detailed",
    }));
  };

  const handleFocusAreaChange = (
    area: keyof SummaryOptions["focusAreas"],
    checked: boolean,
  ) => {
    setOptions((prev) => ({
      ...prev,
      focusAreas: {
        ...prev.focusAreas,
        [area]: checked,
      },
    }));
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="youtube-url" className="text-base font-medium">
              YouTube Video URL
            </Label>
            <Input
              id="youtube-url"
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
            {error && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-base font-medium mb-2">Summary Length</h3>
              <RadioGroup
                value={options.length}
                onValueChange={handleLengthChange}
                className="flex space-x-4"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="brief" id="brief" />
                  <Label htmlFor="brief">Brief</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="detailed" id="detailed" />
                  <Label htmlFor="detailed">Detailed</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <h3 className="text-base font-medium mb-2">Focus Areas</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="key-points"
                    checked={options.focusAreas.keyPoints}
                    onCheckedChange={(checked) =>
                      handleFocusAreaChange("keyPoints", checked === true)
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="key-points">Key Points</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="timestamps"
                    checked={options.focusAreas.timestamps}
                    onCheckedChange={(checked) =>
                      handleFocusAreaChange("timestamps", checked === true)
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="timestamps">Timestamps</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="takeaways"
                    checked={options.focusAreas.takeaways}
                    onCheckedChange={(checked) =>
                      handleFocusAreaChange("takeaways", checked === true)
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor="takeaways">Main Takeaways</Label>
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Summarizing..." : "Summarize Video"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VideoSummaryForm;
