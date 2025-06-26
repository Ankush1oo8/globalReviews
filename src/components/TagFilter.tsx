
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const tagColors = [
  'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200',
  'bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200',
  'bg-green-100 text-green-800 hover:bg-green-200 border-green-200',
  'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200',
  'bg-pink-100 text-pink-800 hover:bg-pink-200 border-pink-200',
  'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200',
  'bg-red-100 text-red-800 hover:bg-red-200 border-red-200',
  'bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200',
];

const selectedTagColors = [
  'bg-blue-500 text-white hover:bg-blue-600 border-blue-500',
  'bg-purple-500 text-white hover:bg-purple-600 border-purple-500',
  'bg-green-500 text-white hover:bg-green-600 border-green-500',
  'bg-yellow-500 text-white hover:bg-yellow-600 border-yellow-500',
  'bg-pink-500 text-white hover:bg-pink-600 border-pink-500',
  'bg-indigo-500 text-white hover:bg-indigo-600 border-indigo-500',
  'bg-red-500 text-white hover:bg-red-600 border-red-500',
  'bg-orange-500 text-white hover:bg-orange-600 border-orange-500',
];

const getTagColor = (tag: string, isSelected: boolean) => {
  const colors = isSelected ? selectedTagColors : tagColors;
  const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

const TagFilter = ({ tags, selectedTags, onTagToggle }: TagFilterProps) => {
  if (tags.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-800">Filter by Tags</h3>
        </div>
        
        {selectedTags.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => selectedTags.forEach(tag => onTagToggle(tag))}
            className="text-slate-600 hover:text-slate-800"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-slate-600 mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                className={`${getTagColor(tag, true)} cursor-pointer transition-all duration-200 px-4 py-2 text-sm font-medium border hover:shadow-md`}
                onClick={() => onTagToggle(tag)}
              >
                #{tag}
                <X className="w-3 h-3 ml-2" />
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {tags
          .filter(tag => !selectedTags.includes(tag))
          .sort()
          .map((tag) => (
            <Badge
              key={tag}
              className={`${getTagColor(tag, false)} cursor-pointer transition-all duration-200 px-4 py-2 text-sm font-medium border hover:shadow-md hover:scale-105`}
              onClick={() => onTagToggle(tag)}
            >
              #{tag}
            </Badge>
          ))}
      </div>
    </div>
  );
};

export default TagFilter;
