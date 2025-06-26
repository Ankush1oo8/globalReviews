
-- Add name column to reviews table (optional field)
ALTER TABLE public.reviews ADD COLUMN name TEXT;

-- Add user_id column to link reviews to users
ALTER TABLE public.reviews ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS policies to require authentication for creating reviews
DROP POLICY IF EXISTS "Anyone can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can delete reviews" ON public.reviews;

-- Create policy that allows only authenticated users to create reviews
CREATE POLICY "Authenticated users can create reviews" 
  ON public.reviews 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to update only their own reviews
CREATE POLICY "Users can update their own reviews" 
  ON public.reviews 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to delete only their own reviews
CREATE POLICY "Users can delete their own reviews" 
  ON public.reviews 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Update existing reviews to have user_id as null (anonymous reviews)
-- This allows existing reviews to remain visible but uneditable
UPDATE public.reviews SET user_id = NULL WHERE user_id IS NULL;
