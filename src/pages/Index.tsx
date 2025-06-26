
import { useState, useEffect } from 'react';
import { Star, Hash, Plus, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ReviewForm from '@/components/ReviewForm';
import ReviewCard from '@/components/ReviewCard';
import FilterDropdown from '@/components/FilterDropdown';
import SearchBar from '@/components/SearchBar';
import { useReviews, type Review, type CreateReviewData } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, signOut } = useAuth();
  const { reviews, isLoading, createReview, updateReview, deleteReview, isCreating, isUpdating } = useReviews();
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  useEffect(() => {
    // Filter reviews based on selected tags and search query
    let filtered = reviews;

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(review =>
        selectedTags.some(tag => review.tags.includes(tag))
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(review => 
        review.text.toLowerCase().includes(query) ||
        review.location?.toLowerCase().includes(query) ||
        review.name?.toLowerCase().includes(query) ||
        review.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredReviews(filtered);
  }, [selectedTags, searchQuery, reviews]);

  const handleAddReview = (newReview: CreateReviewData) => {
    createReview(newReview);
    setIsFormOpen(false);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setIsFormOpen(true);
  };

  const handleUpdateReview = (updatedReview: CreateReviewData) => {
    if (editingReview) {
      updateReview({ id: editingReview.id, reviewData: updatedReview });
    }
    setIsFormOpen(false);
    setEditingReview(null);
  };

  const handleDeleteReview = (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingReview(null);
  };

  const allTags = Array.from(new Set(reviews.flatMap(review => review.tags)));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600 text-lg">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ReviewGlobe
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Dialog open={isFormOpen} onOpenChange={(open) => {
                    if (!open) handleCloseForm();
                    else setIsFormOpen(true);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        disabled={isCreating || isUpdating}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {isCreating || isUpdating ? 'Saving...' : (editingReview ? 'Update Review' : 'Share Review')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <ReviewForm 
                        onSubmit={editingReview ? handleUpdateReview : handleAddReview}
                        initialData={editingReview ? {
                          text: editingReview.text,
                          rating: editingReview.rating,
                          tags: editingReview.tags,
                          image: editingReview.image_url,
                          location: editingReview.location,
                          name: editingReview.name
                        } : undefined}
                        isEditing={!!editingReview}
                      />
                    </DialogContent>
                  </Dialog>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <UserIcon className="w-4 h-4 mr-2" />
                        Account
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={signOut}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="outline">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Share Your Experiences,
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Help Others Discover
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Join our global community of reviewers. Share reviews with photos, ratings, and tags to help others make better decisions.
          </p>
          
          {/* Search Bar */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Search reviews, locations, names, or tags..."
          />
        </div>

        {/* Filter Dropdown */}
        <FilterDropdown
          tags={allTags}
          selectedTags={selectedTags}
          onTagToggle={(tag) => {
            setSelectedTags(prev =>
              prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
            );
          }}
        />

        {/* Search Results Info */}
        {(searchQuery || selectedTags.length > 0) && (
          <div className="mb-6 text-center">
            <p className="text-slate-600">
              Showing {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''} 
              {searchQuery && ` for "${searchQuery}"`}
              {selectedTags.length > 0 && ` with selected tags`}
            </p>
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredReviews.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredReviews.length === 0 && (searchQuery || selectedTags.length > 0) && (
          <div className="text-center py-12">
            <Hash className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No reviews found</h3>
            <p className="text-slate-500">
              {searchQuery ? `No reviews match "${searchQuery}". ` : ''}
              Try adjusting your search or removing some filters, or be the first to review something!
            </p>
          </div>
        )}

        {/* Empty state for no reviews at all */}
        {reviews.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No reviews yet</h3>
            <p className="text-slate-500 mb-6">
              Be the first to share a review and help others discover great experiences!
            </p>
            {user ? (
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Share First Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <ReviewForm onSubmit={handleAddReview} />
                </DialogContent>
              </Dialog>
            ) : (
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  Sign In to Share Review
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Login prompt for non-authenticated users */}
        {!user && reviews.length > 0 && (
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-lg p-6 text-center mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Want to share your own review?</h3>
            <p className="text-slate-600 mb-4">
              Sign in to create, edit, and manage your reviews. Join our community of reviewers!
            </p>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                Sign In or Create Account
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
