
import React, { useState, useEffect } from 'react';
import { Document } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface DocumentFormProps {
  document?: Document;
  onSave: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

interface Attachment {
  name: string;
  url: string;
  file?: File;
}

export function DocumentForm({ document, onSave, onCancel }: DocumentFormProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Document['type']>('bulletin');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);
  
  // Se houver um documento para edição, carregue os dados
  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setType(document.type);
      setContent(document.content);
      
      // Parse attachments from JSON string if they exist
      if (document.attachmentUrl) {
        try {
          const savedAttachments = JSON.parse(document.attachmentUrl);
          if (Array.isArray(savedAttachments)) {
            setAttachments(savedAttachments);
          } else {
            // For backward compatibility with older format
            setAttachments([{ name: 'Anexo', url: document.attachmentUrl }]);
          }
        } catch (e) {
          // For backward compatibility with older format
          setAttachments([{ name: 'Anexo', url: document.attachmentUrl }]);
        }
      }
    }
  }, [document]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadProgress(true);
    
    try {
      // Upload any new files first
      const updatedAttachments = [...attachments];
      
      for (let i = 0; i < updatedAttachments.length; i++) {
        const attachment = updatedAttachments[i];
        
        if (attachment.file) {
          const fileExt = attachment.name.split('.').pop();
          const filePath = `${uuidv4()}.${fileExt}`;
          
          const { data, error } = await supabase.storage
            .from('documents')
            .upload(filePath, attachment.file);
            
          if (error) {
            throw error;
          }
          
          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);
            
          updatedAttachments[i] = {
            name: attachment.name,
            url: publicUrlData.publicUrl
          };
        }
      }
      
      // Save document with attachments
      onSave({
        title,
        type,
        content,
        attachmentUrl: updatedAttachments.length > 0 ? JSON.stringify(updatedAttachments) : undefined,
      });
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erro ao fazer upload do arquivo');
    } finally {
      setUploadProgress(false);
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      setAttachments(prev => [
        ...prev,
        {
          name: file.name,
          url: URL.createObjectURL(file),
          file: file
        }
      ]);
    }
  };
  
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título*</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Título do documento" 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Tipo de documento*</Label>
        <Select 
          value={type}
          onValueChange={(val: Document['type']) => setType(val)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bulletin">Boletim</SelectItem>
            <SelectItem value="procedure">Procedimento Operacional</SelectItem>
            <SelectItem value="instruction">Norma de Instrução</SelectItem>
            <SelectItem value="traffic">Artigo de Trânsito</SelectItem>
            <SelectItem value="other">Outros</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Conteúdo*</Label>
        <Textarea 
          id="content" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          placeholder="Conteúdo do documento..." 
          rows={6} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label>Anexos</Label>
        <div className="flex flex-col space-y-2">
          {attachments.map((attachment, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center">
                <Paperclip className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm truncate max-w-[200px]">{attachment.name}</span>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          ))}
          
          <div className="flex items-center p-4 border-2 border-dashed rounded-lg">
            <div className="flex-1 text-center">
              <div className="relative inline-block">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center gap-2" 
                >
                  <Upload className="h-4 w-4" />
                  Anexar arquivo
                </Button>
                <Input 
                  type="file" 
                  onChange={handleFileUpload} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={uploadProgress}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-police-blue hover:bg-police-lightBlue"
          disabled={uploadProgress}
        >
          {uploadProgress ? 'Enviando...' : document ? 'Atualizar' : 'Adicionar'} Documento
        </Button>
      </div>
    </form>
  );
}
