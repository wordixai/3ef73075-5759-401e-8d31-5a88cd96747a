import { Check } from 'lucide-react';

interface ClothingItem {
  id: string;
  name: string;
  image: string;
  category: string;
}

const clothingItems: ClothingItem[] = [
  {
    id: '1',
    name: '白色T恤',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    category: '上衣'
  },
  {
    id: '2',
    name: '黑色西装',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop',
    category: '外套'
  },
  {
    id: '3',
    name: '蓝色连衣裙',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
    category: '连衣裙'
  },
  {
    id: '4',
    name: '牛仔外套',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
    category: '外套'
  },
  {
    id: '5',
    name: '红色毛衣',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop',
    category: '上衣'
  },
  {
    id: '6',
    name: '格子衬衫',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
    category: '上衣'
  }
];

interface ClothingGalleryProps {
  selectedId: string | null;
  onSelect: (item: ClothingItem) => void;
}

export function ClothingGallery({ selectedId, onSelect }: ClothingGalleryProps) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-foreground mb-4">或从服装库选择</h3>
      <div className="grid grid-cols-3 gap-3">
        {clothingItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`relative aspect-[3/4] rounded-xl overflow-hidden transition-all duration-300
                       border-2 ${
                         selectedId === item.id
                           ? 'border-primary shadow-glow scale-[1.02]'
                           : 'border-transparent hover:border-primary/50'
                       }`}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <p className="text-foreground text-xs font-medium truncate">{item.name}</p>
              <p className="text-muted-foreground text-[10px]">{item.category}</p>
            </div>
            {selectedId === item.id && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export type { ClothingItem };
