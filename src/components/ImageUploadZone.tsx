import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ImageUploadZoneProps {
  onImageUpload: (file: File) => void;
  uploadedImage: File | null;
  isAnalyzing: boolean;
}

export const ImageUploadZone = ({ onImageUpload, uploadedImage, isAnalyzing }: ImageUploadZoneProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            onImageUpload(file);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-primary/5'
          }
        `}
      >
        <input {...getInputProps()} />
        
        {!uploadedImage ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground mb-2">
                Drop your candlestick chart here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse files (JPG, PNG, WebP)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              {isAnalyzing ? (
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              ) : (
                <CheckCircle className="h-12 w-12 text-success" />
              )}
            </div>
            <div>
              <p className="text-lg font-medium text-foreground mb-2">
                {uploadedImage.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {isAnalyzing ? 'Analyzing chart patterns...' : 'Analysis complete'}
              </p>
            </div>
          </div>
        )}
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Uploading...</span>
            <span className="text-foreground">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {uploadedImage && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-success">
            <ImageIcon className="h-4 w-4" />
            <span>Image ready for analysis</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setUploadProgress(0)}
            className="w-full"
          >
            Upload Different Chart
          </Button>
        </div>
      )}
    </div>
  );
};