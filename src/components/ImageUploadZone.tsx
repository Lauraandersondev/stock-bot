import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, Loader2, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageUploadZoneProps {
  onImageUpload: (file: File) => void;
  onAnalyze: (file: File, question?: string) => void;
  uploadedImage: File | null;
  isAnalyzing: boolean;
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  onImageUpload,
  onAnalyze,
  uploadedImage,
  isAnalyzing
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [question, setQuestion] = useState('');

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            onImageUpload(file); // Just upload, don't analyze yet
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  };

  const handleAnalyze = () => {
    if (uploadedImage) {
      onAnalyze(uploadedImage, question.trim() || undefined);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && uploadedImage && !isAnalyzing) {
      handleAnalyze();
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: isAnalyzing
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : isAnalyzing 
              ? 'border-muted bg-muted/20 cursor-not-allowed' 
              : 'border-border hover:border-primary/50 hover:bg-primary/5'
          }
        `}
      >
        <input {...getInputProps()} />
        
        {uploadedImage && uploadProgress === 100 && !isAnalyzing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center text-green-600 dark:text-green-400">
              <CheckCircle className="h-12 w-12" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Upload successful!</p>
              <p className="text-xs text-muted-foreground mt-1">
                {uploadedImage.name}
              </p>
            </div>
            <Button
              onClick={handleAnalyze}
              className="w-full"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Chart'
              )}
            </Button>
          </div>
        ) : uploadProgress > 0 && uploadProgress < 100 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-center text-foreground">Uploading...</p>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center text-muted-foreground">
              <Upload className="h-12 w-12" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Drop your candlestick chart here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to select a file
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Question Input */}
      <div className="space-y-2">
        <Label htmlFor="question" className="text-sm font-medium text-foreground flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Ask a specific question
        </Label>
        <Input
          id="question"
          placeholder="e.g., Should I buy or sell? What's the trend?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isAnalyzing}
        />
        <p className="text-xs text-muted-foreground">
          Add a specific question to get targeted advice about this chart. Press Enter to analyze.
        </p>
        {uploadedImage && uploadProgress === 100 && !isAnalyzing && (
          <Button onClick={handleAnalyze} className="w-full mt-2">
            Analyze Chart
          </Button>
        )}
      </div>
    </div>
  );
};