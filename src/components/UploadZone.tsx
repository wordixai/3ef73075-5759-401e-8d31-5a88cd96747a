import { useCallback, useState } from 'react';
import { Upload, X, User, Shirt } from 'lucide-react';

interface UploadZoneProps {
  type: 'person' | 'clothing';
  image: string | null;
  onImageChange: (image: string | null) => void;
}

export function UploadZone({ type, image, onImageChange }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const Icon = type === 'person' ? User : Shirt;
  const title = type === 'person' ? '上传人物照片' : '上传服装图片';
  const description = type === 'person'
    ? '请上传一张清晰的全身照'
    : '请上传想要试穿的服装';

  return (
    <div className="relative flex flex-col items-center">
      <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        {title}
      </h3>

      <div
        className={`upload-zone w-full aspect-[3/4] flex flex-col items-center justify-center cursor-pointer ${
          isDragging ? 'active' : ''
        }`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById(`upload-${type}`)?.click()}
      >
        {image ? (
          <>
            <img
              src={image}
              alt={type}
              className="w-full h-full object-cover rounded-2xl"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onImageChange(null);
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm
                         text-foreground hover:bg-destructive hover:text-destructive-foreground
                         transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 p-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium">{description}</p>
              <p className="text-muted-foreground text-sm mt-1">
                拖拽图片到此处或点击上传
              </p>
            </div>
          </div>
        )}

        <input
          id={`upload-${type}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
