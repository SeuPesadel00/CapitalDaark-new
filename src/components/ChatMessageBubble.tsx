import React from 'react';
import DOMPurify from 'dompurify';
import { format } from 'date-fns';
import { Check, CheckCheck, MoreVertical, Reply, Pencil, Trash2, ShieldX } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface MessageAttachment {
  url: string;
  type: 'image' | 'video';
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_edited?: boolean;
  is_deleted_for_everyone?: boolean;
  deleted_for?: string[];
  reply_to_id?: string | null;
  reply_to_message?: ChatMessage | null;
  attachments?: MessageAttachment[];
}

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  onReply: (msg: ChatMessage) => void;
  onEdit: (msg: ChatMessage) => void;
  onDeleteForMe: (msg: ChatMessage) => void;
  onDeleteForEveryone: (msg: ChatMessage) => void;
}

export function ChatMessageBubble({ message, isOwn, onReply, onEdit, onDeleteForMe, onDeleteForEveryone }: ChatMessageBubbleProps) {
  
  if (message.is_deleted_for_everyone) {
    return (
      <div className={cn("flex w-full mb-4", isOwn ? "justify-end" : "justify-start")}>
        <div className="px-4 py-2 rounded-2xl bg-muted/50 border border-border/20 text-muted-foreground flex items-center gap-2 text-sm italic">
          <ShieldX className="w-4 h-4" /> Mensagem apagada
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full mb-4 group relative", isOwn ? "justify-end" : "justify-start")}>
      
      {/* Container Principal do Balão */}
      <div className={cn(
        "max-w-[85%] md:max-w-[70%] flex flex-col gap-1 relative",
        isOwn ? "items-end" : "items-start"
      )}>
        
        {/* Reply Context (se houver) */}
        {message.reply_to_message && (
          <div className={cn(
            "text-xs p-2 rounded-lg mb-[-10px] pb-4 bg-black/20 border-l-2 opacity-80 cursor-pointer w-full max-w-sm truncate",
            isOwn ? "border-primary text-right" : "border-gray-500 text-left"
          )}>
            <span className="font-bold block mb-1 opacity-70">Em resposta a...</span>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.reply_to_message.content).replace(/<[^>]+>/g, '') }} />
          </div>
        )}

        {/* Balão em si */}
        <div className={cn(
          "px-4 py-2.5 rounded-2xl shadow-sm relative",
          isOwn ? "bg-primary text-black rounded-tr-sm" : "bg-card text-foreground rounded-tl-sm border border-border/30"
        )}>
          
          {/* Anexos */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-col gap-2 mb-2">
              {message.attachments.map((att, idx) => (
                att.type === 'image' ? (
                  <img key={idx} src={att.url} alt="anexo" className="rounded-lg max-w-full max-h-60 object-cover cursor-pointer hover:opacity-90" />
                ) : (
                  <video key={idx} src={att.url} controls className="rounded-lg max-w-full max-h-60" />
                )
              ))}
            </div>
          )}

          {/* Conteúdo HTML do Editor Quill */}
          <div 
            className={cn("prose prose-sm max-w-none break-words", isOwn ? "prose-p:text-black prose-a:text-black font-medium" : "prose-invert")}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.content) }}
          />
          
          {/* Metadados (Data e Editado) */}
          <div className={cn(
            "flex items-center gap-1 text-[10px] mt-1 opacity-70 justify-end",
            isOwn ? "text-black" : "text-muted-foreground"
          )}>
            {message.is_edited && <span className="italic mr-1">(editado)</span>}
            <span>{format(new Date(message.created_at), 'HH:mm')}</span>
            {isOwn && <CheckCheck className="w-3 h-3 ml-1" />}
          </div>
        </div>
      </div>

      {/* Menu de Ações (Aparece no Hover) */}
      <div className={cn(
        "absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1",
        isOwn ? "right-[calc(100%+8px)] flex-row-reverse" : "left-[calc(100%+8px)] flex-row"
      )}>
        <button onClick={() => onReply(message)} className="p-1.5 bg-background/80 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground shadow-sm">
          <Reply className="w-4 h-4" />
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 bg-background/80 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground shadow-sm">
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isOwn ? "end" : "start"}>
            <DropdownMenuItem onClick={() => onReply(message)} className="gap-2">
              <Reply className="w-4 h-4"/> Responder
            </DropdownMenuItem>
            {isOwn && (
              <DropdownMenuItem onClick={() => onEdit(message)} className="gap-2">
                <Pencil className="w-4 h-4"/> Editar
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDeleteForMe(message)} className="gap-2 text-orange-500">
              <Trash2 className="w-4 h-4"/> Apagar para mim
            </DropdownMenuItem>
            {isOwn && (
              <DropdownMenuItem onClick={() => onDeleteForEveryone(message)} className="gap-2 text-red-500">
                <ShieldX className="w-4 h-4"/> Apagar para todos
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </div>
  );
}
