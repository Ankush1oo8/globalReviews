
import { useState, useEffect } from 'react';
import { Star, Camera, X, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreateReviewData } from '@/hooks/useReviews';

interface ReviewFormProps {
  onSubmit: (review: CreateReviewData) => void;
  initialData?: CreateReviewData;
  isEditing?: boolean;
}

const ReviewForm = ({ onSubmit, initialData, isEditing = false }: ReviewFormProps) => {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState<string | undefined>();
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // Load initial data for editing
  useEffect(() => {
    if (initialData) {
      setText(initialData.text);
      setRating(initialData.rating);
      setTags(initialData.tags);
      setImage(initialData.image);
      setLocation(initialData.location || '');
      setName(initialData.name || '');
    }
  }, [initialData]);

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && rating > 0) {
      onSubmit({
        text: text.trim(),
        rating,
        tags,
        image,
        location: location.trim() || undefined,
        name: name.trim() || undefined
      });
      
      // Reset form only if not editing
      if (!isEditing) {
        setText('');
        setRating(0);
        setTags([]);
        setTagInput('');
        setImage(undefined);
        setLocation('');
        setName('');
      }
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setRating(i + 1)}
        onMouseEnter={() => setHoverRating(i + 1)}
        onMouseLeave={() => setHoverRating(0)}
        className="focus:outline-none transition-colors duration-150"
      >
        <Star
          className={`w-8 h-8 ${
            i < (hoverRating || rating)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-slate-300 hover:text-yellow-200'
          }`}
        />
      </button>
    ));
  };

  const tagColors = [
    'bg-blue-100 text-blue-800',
    'bg-purple-100 text-purple-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
  ];

  const getTagColor = (tag: string) => {
    const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % tagColors.length;
    return tagColors[index];
  };

  return (
    <div className="space-y-6">
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">
          {isEditing ? 'Edit Your Review' : 'Share Your Review'}
        </h2>
        <p className="text-slate-600 mt-1">
          {isEditing ? 'Update your experience' : 'Help others by sharing your experience'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Rating *</Label>
          <div className="flex space-x-1">
            {renderStars()}
          </div>
          {rating > 0 && (
            <p className="text-sm text-slate-600">
              You rated this {rating}/5 stars
            </p>
          )}
        </div>

        {/* Review Text */}
        <div className="space-y-2">
          <Label htmlFor="text" className="text-base font-semibold">
            Your Review *
          </Label>
          <Textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your experience... What did you like or dislike?"
            className="min-h-[120px] resize-none"
            required
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-base font-semibold">
            Location
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where was this experience?"
              className="pl-10"
            />
          </div>
        </div>

        {/* Name (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base font-semibold">
            Your Name (Optional)
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Share your identity (optional)"
              className="pl-10"
            />
          </div>
          <p className="text-xs text-slate-500">
            Your name will be displayed publicly with this review. Leave blank to remain anonymous.
          </p>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Photo (Optional)</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200"
              >
                <Camera className="w-4 h-4" />
                <span>Add Photo</span>
              </Label>
            </div>

            {image && (
              <div className="relative inline-block">
                <img
                  src={image}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setImage(undefined)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags" className="text-base font-semibold">
            Tags
          </Label>
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagAdd}
            placeholder="Add tags and press Enter (e.g., coffee, restaurant, cozy)"
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={`${getTagColor(tag)} px-3 py-1 text-sm flex items-center space-x-1`}
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="ml-1 hover:text-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t">
          <Button
            type="submit"
            disabled={!text.trim() || rating === 0}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isEditing ? 'Update Review' : 'Share Review'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
