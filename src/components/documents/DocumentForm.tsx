
import React, { useState, useEffect } from 'react';
import { Document } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface DocumentFormProps {
  document?: Document;
  onSave: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function DocumentForm({ document, onSave, onCancel }: DocumentFormProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Document['type']>('bulletin');
  const [content, setContent] = useState('');
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);
  
  // Se houver um documento para edição, carregue os dados
  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setType(document.type);
      setContent(document.content);
    }
  }, [document]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadProgress(true);
    
    try {
      // Save document without attachments
      onSave({
        title,
        type,
        content
      });
      
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Erro ao salvar o documento');
    } finally {
      setUploadProgress(false);
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
