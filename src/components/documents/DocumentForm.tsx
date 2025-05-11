
import React, { useState, useEffect } from 'react';
import { Document } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';

interface DocumentFormProps {
  document?: Document;
  onSave: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function DocumentForm({ document, onSave, onCancel }: DocumentFormProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Document['type']>('bulletin');
  const [content, setContent] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>(undefined);
  const [attachmentName, setAttachmentName] = useState('');
  
  // Se houver um documento para edição, carregue os dados
  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setType(document.type);
      setContent(document.content);
      setAttachmentUrl(document.attachmentUrl);
      if (document.attachmentUrl) {
        const fileName = document.attachmentUrl.split('/').pop() || 'arquivo';
        setAttachmentName(fileName);
      }
    }
  }, [document]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      title,
      type,
      content,
      attachmentUrl,
    });
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Neste exemplo, simulamos um upload de arquivo
    // Em uma aplicação real, isso enviaria o arquivo para um servidor
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachmentName(file.name);
      
      // Simulamos a URL do arquivo
      setAttachmentUrl(`https://exemplo.com/files/${file.name}`);
    }
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
        <Label>Anexo</Label>
        <div className="flex items-center p-4 border-2 border-dashed rounded-lg">
          {attachmentUrl ? (
            <div className="flex flex-1 justify-between items-center">
              <span className="text-sm truncate max-w-[200px]">{attachmentName}</span>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setAttachmentUrl(undefined);
                  setAttachmentName('');
                }}
              >
                Remover anexo
              </Button>
            </div>
          ) : (
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
          )}
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-police-blue hover:bg-police-lightBlue">
          {document ? 'Atualizar' : 'Adicionar'} Documento
        </Button>
      </div>
    </form>
  );
}
