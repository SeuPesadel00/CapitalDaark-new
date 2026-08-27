import React, { useRef, useState, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Smile, Plus, Image as ImageIcon, Video, Link2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onAttachment?: (type: 'image' | 'video' | 'link') => void;
  placeholder?: string;
  className?: string;
}

export function ChatComposer({ value, onChange, onSend, onAttachment, placeholder, className }: ChatComposerProps) {
  const quillRef = useRef<ReactQuill>(null);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const selection = editor.getSelection();
      const cursorPosition = selection ? selection.index : editor.getLength() - 1;
      editor.insertText(cursorPosition, emojiData.emoji);
      editor.setSelection(cursorPosition + 1, 0);
    }
  };

  const modules = useMemo(() => ({
    toolbar: false // Ocultamos a barra padrão no chat para ficar minimalista
  }), []);

  // Atalho para enviar com Enter (sem shift)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={cn("flex items-end gap-2 w-full p-2 bg-background/50 border-t border-border/20 backdrop-blur-sm", className)}>
      
      {/* Botão de Anexos (+) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 text-muted-foreground hover:text-white rounded-full">
            <Plus className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-background/95 border-border/50">
          <DropdownMenuItem onClick={() => onAttachment?.('image')} className="cursor-pointer gap-2">
            <ImageIcon className="h-4 w-4" /> Foto
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAttachment?.('video')} className="cursor-pointer gap-2">
            <Video className="h-4 w-4" /> Vídeo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAttachment?.('link')} className="cursor-pointer gap-2">
            <Link2 className="h-4 w-4" /> Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Caixa de Texto Rica */}
      <div className="flex-1 bg-muted/20 border border-border/30 rounded-2xl relative overflow-hidden focus-within:ring-1 focus-within:ring-primary/50 transition-all flex items-end">
        <ReactQuill 
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          placeholder={placeholder || "Mensagem..."}
          onKeyDown={handleKeyDown}
          className="w-full text-foreground ql-chat-theme"
        />
        
        {/* Botão de Emoji interno */}
        <div className="absolute bottom-1.5 right-1.5 z-10">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full">
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none bg-transparent shadow-none mb-2" align="end" side="top">
              <EmojiPicker 
                onEmojiClick={onEmojiClick} 
                theme={'dark'} 
                lazyLoadEmojis={true}
                searchPlaceHolder="Pesquisar emoji..."
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Botão de Enviar */}
      <Button 
        onClick={onSend}
        size="icon" 
        className={cn(
          "h-10 w-10 shrink-0 rounded-full transition-all duration-200", 
          value.trim() ? "bg-primary text-black hover:scale-105" : "bg-muted text-muted-foreground"
        )}
        disabled={!value.trim()}
      >
        <Send className="h-5 w-5 ml-1" />
      </Button>

      <style>{`
        .ql-chat-theme .ql-toolbar {
          display: none !important;
        }
        .ql-chat-theme .ql-container {
          border: none !important;
          font-family: inherit !important;
          font-size: 1rem !important;
          min-height: 40px;
          max-height: 120px;
          overflow-y: auto;
        }
        .ql-chat-theme .ql-editor {
          min-height: 40px;
          padding: 10px 40px 10px 16px !important; /* Espaço para o emoji */
        }
        .ql-chat-theme .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground)) !important;
          font-style: normal !important;
          left: 16px !important;
        }
      `}</style>
    </div>
  );
}
