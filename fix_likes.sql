-- Remove duplicatas existentes mantendo apenas a curtida mais antiga de cada usuário por post
DELETE FROM public.post_likes
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
    ROW_NUMBER() OVER( PARTITION BY user_id, post_id ORDER BY created_at ASC ) AS row_num
    FROM public.post_likes
  ) t
  WHERE t.row_num > 1
);

-- Adiciona a restrição (Constraint) para que o banco de dados PROÍBA curtidas duplicadas
ALTER TABLE public.post_likes 
ADD CONSTRAINT unique_user_post_like UNIQUE (user_id, post_id);

-- Faz o mesmo para as notícias (se aplicável) para blindar o sistema todo
DELETE FROM public.news_likes
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
    ROW_NUMBER() OVER( PARTITION BY user_id, news_link ORDER BY created_at ASC ) AS row_num
    FROM public.news_likes
  ) t
  WHERE t.row_num > 1
);

ALTER TABLE public.news_likes 
ADD CONSTRAINT unique_user_news_like UNIQUE (user_id, news_link);
