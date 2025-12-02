-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tokens table (the digital tickets)
CREATE TABLE public.tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'DISPONIVEL' CHECK (status IN ('DISPONIVEL', 'CONSUMIDO')),
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;

-- Products are public readable (no auth needed)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Tokens: anyone can read, insert and update (for MVP without auth)
CREATE POLICY "Anyone can view tokens" 
ON public.tokens 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create tokens" 
ON public.tokens 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update tokens" 
ON public.tokens 
FOR UPDATE 
USING (true);

-- Insert default products
INSERT INTO public.products (name, price, image) VALUES
  ('Cerveja Pilsen', 12.00, '/cerveja.png'),
  ('Água Mineral', 5.00, '/agua.png'),
  ('Refrigerante', 8.00, '/refrigerante.png'),
  ('Suco Natural', 10.00, '/suco.png');

-- Enable realtime for tokens
ALTER PUBLICATION supabase_realtime ADD TABLE public.tokens;