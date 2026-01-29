import { useState } from 'react';
import { Sparkles, Zap, Shield, ImageIcon } from 'lucide-react';
import { UploadZone } from '../components/UploadZone';
import { ClothingGallery, type ClothingItem } from '../components/ClothingGallery';
import { ResultDisplay } from '../components/ResultDisplay';
import { GenerateButton } from '../components/GenerateButton';
import { generateOutfitChange } from '../lib/aiService';
import { useToast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';

const Index = () => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleClothingSelect = (item: ClothingItem) => {
    setSelectedClothing(item.id);
    setClothingImage(item.image);
  };

  // Convert image URL to base64
  const urlToBase64 = async (url: string): Promise<string> => {
    // If already base64, return as is
    if (url.startsWith('data:')) {
      return url;
    }

    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleGenerate = async () => {
    if (!personImage || !clothingImage) return;

    setIsProcessing(true);
    setResultImage(null);

    try {
      // Convert images to base64 if needed
      const personBase64 = await urlToBase64(personImage);
      const clothingBase64 = await urlToBase64(clothingImage);

      const result = await generateOutfitChange({
        personImage: personBase64,
        clothingImage: clothingBase64,
      });

      if (result.success && result.resultImage) {
        setResultImage(result.resultImage);
        toast({
          title: '换装成功',
          description: 'AI已成功生成换装效果',
        });
      } else {
        toast({
          variant: 'destructive',
          title: '生成失败',
          description: result.error || '请稍后重试',
        });
      }
    } catch (error) {
      console.error('Generate error:', error);
      toast({
        variant: 'destructive',
        title: '生成失败',
        description: '网络错误，请稍后重试',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResultImage(null);
  };

  const canGenerate = personImage && clothingImage;

  return (
    <div className="min-h-screen bg-background">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center"
                   style={{ background: 'var(--gradient-primary)' }}>
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">AI 换装</h1>
                <p className="text-xs text-muted-foreground">智能虚拟试衣</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                功能特点
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                使用方法
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text">AI 智能换装</span>
              <br />
              <span className="text-foreground">一键试穿新造型</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              上传照片，选择服装，AI 帮你实现虚拟试衣。快速预览不同穿搭效果，找到最适合你的风格。
            </p>
          </div>

          {/* Main App Section */}
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Panel - Person Upload */}
              <div className="glass rounded-3xl p-6">
                <UploadZone
                  type="person"
                  image={personImage}
                  onImageChange={setPersonImage}
                />
              </div>

              {/* Middle Panel - Clothing Selection */}
              <div className="glass rounded-3xl p-6 flex flex-col gap-6">
                <UploadZone
                  type="clothing"
                  image={clothingImage}
                  onImageChange={(img) => {
                    setClothingImage(img);
                    setSelectedClothing(null);
                  }}
                />
                <div className="border-t border-border/50 pt-6">
                  <ClothingGallery
                    selectedId={selectedClothing}
                    onSelect={handleClothingSelect}
                  />
                </div>
              </div>

              {/* Right Panel - Result */}
              <div className="glass rounded-3xl p-6">
                <ResultDisplay
                  isProcessing={isProcessing}
                  resultImage={resultImage}
                  onReset={handleReset}
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="mt-8 max-w-md mx-auto">
              <GenerateButton
                onClick={handleGenerate}
                disabled={!canGenerate}
                isProcessing={isProcessing}
              />
              {!canGenerate && (
                <p className="text-center text-sm text-muted-foreground mt-3">
                  请先上传人物照片和选择服装
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 gradient-text">功能特点</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="glass glass-hover rounded-2xl p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">秒级生成</h4>
              <p className="text-sm text-muted-foreground">
                先进AI算法，几秒钟内完成换装效果生成
              </p>
            </div>
            <div className="glass glass-hover rounded-2xl p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-7 h-7 text-accent" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">高清输出</h4>
              <p className="text-sm text-muted-foreground">
                高质量图像输出，细节清晰自然逼真
              </p>
            </div>
            <div className="glass glass-hover rounded-2xl p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">隐私保护</h4>
              <p className="text-sm text-muted-foreground">
                图片处理完即删除，确保您的隐私安全
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">AI 换装 © 2024</span>
            </div>
            <p className="text-sm text-muted-foreground">
              由先进 AI 技术驱动
            </p>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Index;
