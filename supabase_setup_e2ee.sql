-- 1. Adicionar Chave Pública na tabela de perfis (para criptografar as mensagens E2EE)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS public_key TEXT;

-- 2. Criar a tabela de Seguidores (Followers)
CREATE TABLE IF NOT EXISTS public.followers (
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (follower_id, following_id)
);

-- Habilitar RLS e criar políticas para Seguidores
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Todos podem ver os seguidores" ON public.followers FOR SELECT USING (true);
CREATE POLICY "Usuários logados podem seguir" ON public.followers FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Usuários logados podem deixar de seguir" ON public.followers FOR DELETE USING (auth.uid() = follower_id);

-- 3. Criar a tabela de Mensagens Criptografadas (E2EE)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    -- O conteúdo trafega criptografado e ilegível para o servidor!
    encrypted_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS e criar políticas para Mensagens
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Somente remetente e destinatário visualizam a linha" 
ON public.messages FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Usuários logados podem enviar mensagens" 
ON public.messages FOR INSERT 
WITH CHECK (auth.uid() = sender_id);
