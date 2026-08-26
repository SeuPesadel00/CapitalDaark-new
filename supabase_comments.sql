-- 1. Criação da Tabela de Comentários de POSTS
CREATE TABLE IF NOT EXISTS public.post_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.social_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Criação da Tabela de Comentários de NOTÍCIAS (News)
CREATE TABLE IF NOT EXISTS public.news_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    news_link TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilita RLS (Row Level Security) para segurança
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_comments ENABLE ROW LEVEL SECURITY;

-- 4. Cria Políticas (Policies) para permitir leitura pública
CREATE POLICY "Public profiles are viewable by everyone." ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone." ON public.news_comments FOR SELECT USING (true);

-- 5. Cria Políticas para permitir que usuários autenticados criem e deletem/editem seus próprios comentários
CREATE POLICY "Users can insert their own post comments." ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own post comments." ON public.post_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own post comments." ON public.post_comments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own news comments." ON public.news_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own news comments." ON public.news_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own news comments." ON public.news_comments FOR DELETE USING (auth.uid() = user_id);
