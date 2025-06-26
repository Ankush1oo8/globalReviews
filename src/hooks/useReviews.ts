
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Review {
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

export interface CreateReviewData {
  text: string;
  rating: number;
  tags: string[];
  image?: string;
  location?: string;
  name?: string;
}

export const useReviews = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: reviews = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      console.log('Fetching reviews from Supabase...');
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }

      console.log('Fetched reviews:', data);
      return data as Review[];
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: CreateReviewData) => {
      console.log('Creating review:', reviewData);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to create a review');
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          text: reviewData.text,
          rating: reviewData.rating,
          tags: reviewData.tags,
          image_url: reviewData.image,
          location: reviewData.location,
          name: reviewData.name,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating review:', error);
        throw error;
      }

      console.log('Created review:', data);
      return data as Review;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: "Review shared!",
        description: "Your review has been published successfully.",
      });
    },
    onError: (error) => {
      console.error('Failed to create review:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to share your review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateReviewMutation = useMutation({
    mutationFn: async ({ id, reviewData }: { id: string; reviewData: CreateReviewData }) => {
      console.log('Updating review:', id, reviewData);
      
      const { data, error } = await supabase
        .from('reviews')
        .update({
          text: reviewData.text,
          rating: reviewData.rating,
          tags: reviewData.tags,
          image_url: reviewData.image,
          location: reviewData.location,
          name: reviewData.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating review:', error);
        throw error;
      }

      console.log('Updated review:', data);
      return data as Review;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: "Review updated!",
        description: "Your review has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Failed to update review:', error);
      toast({
        title: "Error",
        description: "Failed to update your review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting review:', id);
      
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting review:', error);
        throw error;
      }

      console.log('Deleted review:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: "Review deleted!",
        description: "Your review has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error('Failed to delete review:', error);
      toast({
        title: "Error",
        description: "Failed to delete your review. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    reviews,
    isLoading,
    error,
    createReview: createReviewMutation.mutate,
    updateReview: updateReviewMutation.mutate,
    deleteReview: deleteReviewMutation.mutate,
    isCreating: createReviewMutation.isPending,
    isUpdating: updateReviewMutation.isPending,
    isDeleting: deleteReviewMutation.isPending
  };
};
