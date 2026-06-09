import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  itemCounts: Record<string, number>;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory, itemCounts }: CategoryFilterProps) {
  const getCategoryColor = (categoryName: string): string => {
    const category = categories.find(c => c.name === categoryName);
    if (!category) return '#059669';
    
    const colors: Record<string, string> = {
      emerald: '#059669',
      amber: '#d97706',
      blue: '#2563eb',
      purple: '#9333ea',
      red: '#dc2626',
      teal: '#0d9488',
      pink: '#db2777',
      orange: '#ea580c',
    };
    return colors[category.color] || colors.emerald;
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          selectedCategory === null
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
            : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
        }`}
      >
        All Items
      </button>
      
      {categories.map((category) => {
        const count = itemCounts[category.name] || 0;
        if (count === 0) return null;
        
        const color = getCategoryColor(category.name);
        const isSelected = selectedCategory === category.name;
        
        return (
          <button
            key={category.name}
            onClick={() => onSelectCategory(category.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isSelected
                ? 'text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
            style={isSelected ? { backgroundColor: color } : {}}
          >
            {category.name} ({count})
          </button>
        );
      })}
    </div>
  );
}