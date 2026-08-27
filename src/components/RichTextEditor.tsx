import React, { useRef, useState, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
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
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'blockquote'],
      ['clean']
    ]
  }), []);

  return (
    <div className={cn("border border-border/50 rounded-lg overflow-hidden bg-background/50 focus-within:ring-1 focus-within:ring-primary shadow-inner transition-shadow flex flex-col w-full relative group", className)}>
      
      {/* Editor do Quill */}
      <ReactQuill 
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || "O que está acontecendo?"}
        className="w-full text-foreground ql-custom-theme"
      />

      {/* Botão de Emojis */}
      <div className="absolute top-2 right-2 z-10">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground bg-background/80 hover:bg-background shadow-sm border border-border/50" title="Adicionar Emoji">
              <Smile className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-none bg-transparent shadow-none" align="end">
            <EmojiPicker 
              onEmojiClick={onEmojiClick} 
              theme={'dark'} 
              lazyLoadEmojis={true}
              searchPlaceHolder="Pesquisar emoji..."
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <style>{`
        .ql-custom-theme .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid hsl(var(--border) / 0.5) !important;
          background-color: hsl(var(--background) / 0.8) !important;
          border-radius: 0.5rem 0.5rem 0 0;
          padding: 8px !important;
        }
        .ql-custom-theme .ql-container {
          border: none !important;
          font-family: inherit !important;
          font-size: 1rem !important;
        }
        .ql-custom-theme .ql-editor {
          min-height: 80px;
          padding: 12px 16px !important;
        }
        @media (min-width: 768px) {
          .ql-custom-theme .ql-editor {
            min-height: 150px;
          }
        }
        .ql-custom-theme .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground)) !important;
          font-style: normal !important;
        }
        .ql-custom-theme .ql-stroke {
          stroke: hsl(var(--muted-foreground)) !important;
        }
        .ql-custom-theme .ql-fill {
          fill: hsl(var(--muted-foreground)) !important;
        }
        .ql-custom-theme button:hover .ql-stroke {
          stroke: hsl(var(--foreground)) !important;
        }
        .ql-custom-theme button:hover .ql-fill {
          fill: hsl(var(--foreground)) !important;
        }
        .ql-custom-theme .ql-active .ql-stroke {
          stroke: hsl(var(--primary)) !important;
        }
        .ql-custom-theme .ql-active .ql-fill {
          fill: hsl(var(--primary)) !important;
        }
      `}</style>
    </div>
  );
}
