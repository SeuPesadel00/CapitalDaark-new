// frontend/src/components/Comments.tsx

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/comments/${postId}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar comentários.');
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado para comentar.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ postId, content: newComment }),
      });

      if (!response.ok) {
        throw new Error('Erro ao postar comentário.');
      }

      setNewComment('');
      fetchComments(); // Recarrega os comentários após o envio
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-neon-cyan mb-4">Comentários</h3>
      
      {/* Área para postar um novo comentário */}
      <div className="mb-6">
        <Textarea
          placeholder="Escreva seu comentário aqui..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="bg-background text-foreground border-border/50 focus:border-neon-cyan mb-2"
        />
        <Button onClick={handlePostComment} className="w-full bg-primary text-primary-foreground">
          Comentar
        </Button>
      </div>

      {loading && <div className="text-center text-primary">Carregando comentários...</div>}
      {error && <div className="text-center text-destructive">{error}</div>}

      {/* Lista de comentários */}
      <div className="space-y-4">
        {comments.length === 0 && !loading && !error && (
          <p className="text-center text-muted-foreground">Seja o primeiro a comentar!</p>
        )}
        {comments.map((comment) => (
          <div key={comment._id} className="bg-card p-4 rounded-xl shadow-inner border border-border/20">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-bold text-primary">{comment.author.username}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-foreground">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;