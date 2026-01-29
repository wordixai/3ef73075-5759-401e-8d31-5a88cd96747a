import { Wand2 } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  isProcessing: boolean;
}

export function GenerateButton({ onClick, disabled, isProcessing }: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isProcessing}
      className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg
                 flex items-center justify-center gap-3 transition-all duration-300
                 ${
                   disabled || isProcessing
                     ? 'bg-muted text-muted-foreground cursor-not-allowed'
                     : 'bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98]'
                 }`}
      style={{
        background: disabled || isProcessing ? undefined : 'var(--gradient-primary)'
      }}
    >
      <Wand2 className={`w-6 h-6 ${isProcessing ? 'animate-spin' : ''}`} />
      {isProcessing ? 'AI 生成中...' : '开始 AI 换装'}
    </button>
  );
}
