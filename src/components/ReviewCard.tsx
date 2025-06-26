
import { Star, MapPin, Calendar, User, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface Review {
  id: string;
  text: string;
  rating: number;
  tags: string[];
  image_url?: string;
  location?: string;
  name?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

interface ReviewCardProps {
  review: Review;
  onEdit?: (review: Review) => void;
  onDelete?: (id: string) => void;
}

const tagColors = [
  'bg-blue-100 text-blue-800 hover:bg-blue-200',
  'bg-purple-100 text-purple-800 hover:bg-purple-200',
  'bg-green-100 text-green-800 hover:bg-green-200',
  'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  'bg-pink-100 text-pink-800 hover:bg-pink-200',
  'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
  'bg-red-100 text-red-800 hover:bg-red-200',
  'bg-orange-100 text-orange-800 hover:bg-orange-200',
];

const getTagColor = (tag: string) => {
  const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % tagColors.length;
  return tagColors[index];
};

const ReviewCard = ({ review, onEdit, onDelete }: ReviewCardProps) => {
  const { user } = useAuth();
  const isOwner = user && review.user_id === user.id;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-slate-300'
        }`}
      />
    ));
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-slate-200 overflow-hidden">
      {review.image_url && (
        <div className="relative overflow-hidden">
          <img
            src={review.image_url}
            alt="Review"
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      
      <CardContent className="p-6">
        {/* Header with Rating, Name, and Actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(review.rating)}
            <span className="text-sm font-medium text-slate-600 ml-2">
              {review.rating}/5
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {review.name && (
              <div className="flex items-center space-x-1 text-sm text-slate-600">
                <User className="w-3 h-3" />
                <span className="font-medium">{review.name}</span>
              </div>
            )}
            
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(review)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete?.(review.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Review Text */}
        <p className="text-slate-700 mb-4 line-clamp-3 leading-relaxed">
          {review.text}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {review.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className={`${getTagColor(tag)} text-xs font-medium px-3 py-1 rounded-full transition-colors duration-200 cursor-pointer`}
            >
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-4">
            {review.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{review.location}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
