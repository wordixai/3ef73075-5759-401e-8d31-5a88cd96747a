import { Download, RefreshCw, Sparkles } from 'lucide-react';

interface ResultDisplayProps {
  isProcessing: boolean;
  resultImage: string | null;
  onReset: () => void;
}

export function ResultDisplay({ isProcessing, resultImage, onReset }: ResultDisplayProps) {
  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = 'ai-outfit-result.png';
      link.click();
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-accent" />
        换装效果
      </h3>

      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass">
        {isProcessing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium">AI 正在处理中...</p>
              <p className="text-muted-foreground text-sm mt-1">请稍候，这可能需要几秒钟</p>
            </div>
          </div>
        ) : resultImage ? (
          <>
            <img
              src={resultImage}
              alt="Result"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                           bg-primary text-primary-foreground font-medium
                           hover:opacity-90 transition-opacity"
                >
                  <Download className="w-4 h-4" />
                  下载图片
                </button>
                <button
                  onClick={onReset}
                  className="p-3 rounded-xl bg-secondary text-secondary-foreground
                           hover:bg-secondary/80 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-muted-foreground">上传人物和服装图片</p>
              <p className="text-muted-foreground text-sm mt-1">点击生成按钮查看效果</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
