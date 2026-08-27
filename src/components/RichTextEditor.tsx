import React, { useRef } from 'react';
import { Bold, Italic, List, Link, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function RichTextEditor({ value, onChange, placeholder, className, onKeyDown }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Função para injetar texto na posição do cursor
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const selectedText = text.substring(start, end);
    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    
    onChange(newText);
    
    // Restaurar foco e colocar o cursor no lugar certo
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleBold = () => insertFormatting('**', '**');
  const handleItalic = () => insertFormatting('*', '*');
  const handleQuote = () => insertFormatting('\n> ');
  const handleList = () => insertFormatting('\n- ');
  const handleLink = () => insertFormatting('[', '](https://)');

  return (
    <div className={cn("border border-border/50 rounded-lg overflow-hidden bg-background/50 focus-within:ring-1 focus-within:ring-primary shadow-inner transition-shadow flex flex-col w-full", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-background/80 border-b border-border/50">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={handleBold} title="Negrito" type="button">
          <Bold className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={handleItalic} title="Itálico" type="button">
          <Italic className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={handleList} title="Lista" type="button">
          <List className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={handleQuote} title="Citação" type="button">
          <Quote className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={handleLink} title="Link" type="button">
          <Link className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Área de texto expandida */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder || "O que está acontecendo?"}
        className="min-h-[120px] resize-y border-0 focus-visible:ring-0 rounded-none bg-transparent"
      />
    </div>
  );
}
