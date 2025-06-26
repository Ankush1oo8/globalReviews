
-- Create a table for reviews
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  tags TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create an index on created_at for better performance when ordering
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);

-- Create an index on tags for better filtering performance
CREATE INDEX idx_reviews_tags ON public.reviews USING GIN(tags);

-- Enable Row Level Security (RLS) - making reviews public for now
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to view all reviews (public app)
CREATE POLICY "Anyone can view reviews" 
  ON public.reviews 
  FOR SELECT 
  USING (true);

-- Create policy that allows anyone to create reviews (anonymous reviews)
CREATE POLICY "Anyone can create reviews" 
  ON public.reviews 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that allows anyone to update reviews
CREATE POLICY "Anyone can update reviews" 
  ON public.reviews 
  FOR UPDATE 
  USING (true);

-- Create policy that allows anyone to delete reviews
CREATE POLICY "Anyone can delete reviews" 
  ON public.reviews 
  FOR DELETE 
  USING (true);

-- Insert some sample data to start with
INSERT INTO public.reviews (text, rating, tags, image_url, location) VALUES
('Amazing coffee shop with incredible atmosphere! The baristas are so friendly and knowledgeable. Perfect spot for remote work.', 5, ARRAY['coffee', 'cafe', 'work-friendly', 'atmosphere'], 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop', 'Downtown Seattle'),
('Decent pizza but nothing extraordinary. Service was a bit slow during peak hours.', 3, ARRAY['pizza', 'restaurant', 'italian', 'service'], NULL, 'New York City'),
('Best sushi I''ve had outside of Japan! Fresh ingredients and beautiful presentation.', 5, ARRAY['sushi', 'japanese', 'restaurant', 'fresh', 'authentic'], 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop', 'Los Angeles'),
('Great bookstore with cozy reading nooks. Love spending hours here browsing.', 4, ARRAY['bookstore', 'reading', 'cozy', 'books', 'quiet'], NULL, 'Portland'),
('Overpriced gym with outdated equipment. Not worth the monthly fee.', 2, ARRAY['gym', 'fitness', 'expensive', 'equipment'], NULL, 'Miami'),
('Fantastic hiking trail with breathtaking views! Well maintained and clearly marked.', 5, ARRAY['hiking', 'nature', 'outdoor', 'views', 'trail'], 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop', 'Colorado Springs');
