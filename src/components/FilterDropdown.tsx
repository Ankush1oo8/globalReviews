
import { useState } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FilterDropdownProps {
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

const FilterDropdown = ({ tags, selectedTags, onTagToggle }: FilterDropdownProps) => {
  if (tags.length === 0) return null;

  return (
    <div className="flex items-center space-x-4 mb-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center space-x-2 bg-white hover:bg-slate-50 border-slate-300"
          >
            <Filter className="w-4 h-4" />
            <span>Filter by Tags</span>
            {selectedTags.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                {selectedTags.length}
              </Badge>
            )}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto bg-white border border-slate-200 shadow-lg">
          <DropdownMenuLabel className="text-slate-700 font-semibold">
            Select Tags to Filter
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {tags.sort().map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <DropdownMenuItem
                key={tag}
                onClick={() => onTagToggle(tag)}
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50"
              >
                <span className="flex items-center space-x-2">
                  <span className="text-slate-600">#{tag}</span>
                </span>
                {isSelected && (
                  <Badge className="bg-blue-500 text-white text-xs">
                    Selected
                  </Badge>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedTags.length > 0 && (
        <div className="flex items-center space-x-2">
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                className={`${getTagColor(tag, true)} cursor-pointer transition-all duration-200 px-3 py-1 text-sm font-medium border hover:shadow-md`}
                onClick={() => onTagToggle(tag)}
              >
                #{tag}
                <X className="w-3 h-3 ml-2" />
              </Badge>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => selectedTags.forEach(tag => onTagToggle(tag))}
            className="text-slate-600 hover:text-slate-800"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
