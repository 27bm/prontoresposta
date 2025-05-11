
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Document } from '../types/models';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DocumentContextType {
  documents: Document[];
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDocument: (id: string, document: Partial<Document>) => void;
  filterDocuments: (type?: Document['type']) => Document[];
  loading: boolean;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

// Helper function to convert Supabase data to our app's Document type
const mapSupabaseToDocument = (item: any): Document => ({
  id: item.id,
  title: item.title,
  type: item.type,
  content: item.content,
  attachmentUrl: item.attachment_url || undefined,
  createdAt: new Date(item.created_at),
  updatedAt: new Date(item.updated_at)
});

// Helper function to convert our app's Document type to Supabase format
const mapDocumentToSupabase = (document: any) => ({
  title: document.title,
  type: document.type,
  content: document.content,
  attachment_url: document.attachmentUrl || null
});

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  // Load documents on component mount
  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setDocuments(data.map(mapSupabaseToDocument));
        }
      } catch (error) {
        console.error('Error loading documents:', error);
        toast.error('Erro ao carregar documentos');
      } finally {
        setLoading(false);
      }
    };
    
    loadDocuments();
  }, []);

  const addDocument = async (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const documentData = mapDocumentToSupabase(document);
      
      const { data, error } = await supabase
        .from('documents')
        .insert([documentData])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        const newDocument = mapSupabaseToDocument(data);
        setDocuments(prev => [newDocument, ...prev]);
        toast.success('Documento adicionado com sucesso!');
      }
    } catch (error) {
      console.error('Error adding document:', error);
      toast.error('Erro ao adicionar documento');
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async (id: string, updatedFields: Partial<Document>) => {
    setLoading(true);
    try {
      // Convert to Supabase format
      const updateData: any = {};
      if ('title' in updatedFields) updateData.title = updatedFields.title;
      if ('type' in updatedFields) updateData.type = updatedFields.type;
      if ('content' in updatedFields) updateData.content = updatedFields.content;
      if ('attachmentUrl' in updatedFields) updateData.attachment_url = updatedFields.attachmentUrl || null;
      
      const { data, error } = await supabase
        .from('documents')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        const updatedDocument = mapSupabaseToDocument(data);
        setDocuments(prev => prev.map(d => d.id === id ? updatedDocument : d));
        toast.success('Documento atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Erro ao atualizar documento');
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = (type?: Document['type']) => {
    if (!type) return documents;
    return documents.filter(document => document.type === type);
  };

  return (
    <DocumentContext.Provider value={{ 
      documents, 
      addDocument, 
      updateDocument,
      filterDocuments,
      loading 
    }}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}
