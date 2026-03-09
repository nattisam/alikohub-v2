
-- Create portfolio_media table for storing portfolio/gallery media items
CREATE TABLE public.portfolio_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portal TEXT NOT NULL CHECK (portal IN ('professional', 'social')),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.portfolio_media ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Portfolio media viewable by everyone"
ON public.portfolio_media
FOR SELECT
USING (true);

-- Admin can manage
CREATE POLICY "Admins can manage portfolio media"
ON public.portfolio_media
FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'organizer'::app_role));

-- Create index
CREATE INDEX idx_portfolio_media_portal_category ON public.portfolio_media (portal, category);
