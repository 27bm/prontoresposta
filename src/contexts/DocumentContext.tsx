
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Document } from '../types/models';
import { toast } from 'sonner';

// Mock data para exemplificar documentos
const initialDocuments: Document[] = [
  {
    id: '1',
    title: 'Modelo de Boletim de Ocorrência - Furto',
    type: 'bulletin',
    content: 'Modelo padrão para registro de ocorrências de furto.',
    createdAt: new Date(2023, 3, 5),
    updatedAt: new Date(2023, 3, 5),
  },
  {
    id: '2',
    title: 'POP - Abordagem Veicular',
    type: 'procedure',
    content: 'Procedimento operacional padrão para abordagem de veículos suspeitos.',
    createdAt: new Date(2023, 2, 12),
    updatedAt: new Date(2023, 2, 12),
  },
  {
    id: '3',
    title: 'Artigos CTB - Infrações Graves',
    type: 'traffic',
    content: 'Lista dos principais artigos do Código de Trânsito Brasileiro referentes a infrações graves.',
    createdAt: new Date(2023, 4, 20),
    updatedAt: new Date(2023, 4, 20),
  },
  {
    id: '4',
    title: 'NI 01/2023 - Uso de Equipamentos',
    type: 'instruction',
    content: 'Norma de instrução sobre utilização e manutenção de equipamentos de proteção.',
    createdAt: new Date(2023, 1, 8),
    updatedAt: new Date(2023, 1, 8),
  },
];

interface DocumentContextType {
  documents: Document[];
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDocument: (id: string, document: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  filterDocuments: (type?: Document['type']) => Document[];
  loading: boolean;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [loading, setLoading] = useState(false);

  const addDocument = (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const newDocument: Document = {
        ...document,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setDocuments([...documents, newDocument]);
      toast.success('Documento adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar documento');
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = (id: string, updatedFields: Partial<Document>) => {
    setLoading(true);
    try {
      const updatedDocuments = documents.map(doc => {
        if (doc.id === id) {
          return { 
            ...doc, 
            ...updatedFields,
            updatedAt: new Date() 
          };
        }
        return doc;
      });
      setDocuments(updatedDocuments);
      toast.success('Documento atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar documento');
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = (id: string) => {
    setLoading(true);
    try {
      setDocuments(documents.filter(doc => doc.id !== id));
      toast.success('Documento removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover documento');
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
      deleteDocument,
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
