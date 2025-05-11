
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { DocumentForm } from '@/components/documents/DocumentForm';
import { useDocuments } from '@/contexts/DocumentContext';
import { Document as DocumentType } from '@/types/models';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function DocumentsPage() {
  const { documents, addDocument, updateDocument, filterDocuments, loading } = useDocuments();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDocument, setCurrentDocument] = useState<DocumentType | undefined>(undefined);
  
  // Filtrar documentos com base na pesquisa
  const filteredDocuments = useMemo(() => {
    let filtered = activeTab === 'all' ? documents : filterDocuments(activeTab as DocumentType['type']);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) || 
        doc.content.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [documents, activeTab, searchQuery, filterDocuments]);
  
  const handleAddClick = () => {
    setCurrentDocument(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditClick = (document: DocumentType) => {
    setCurrentDocument(document);
    setIsFormOpen(true);
  };
  
  const handleFormSave = (document: Omit<DocumentType, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (currentDocument) {
      updateDocument(currentDocument.id, document);
    } else {
      addDocument(document);
    }
    
    setIsFormOpen(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Registros e Documentos</h1>
        <Button 
          onClick={handleAddClick} 
          className="bg-police-blue hover:bg-police-lightBlue"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Documento
        </Button>
      </div>
      
      {/* Barra de pesquisa */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Pesquisar por título ou conteúdo..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="bulletin">Boletins</TabsTrigger>
          <TabsTrigger value="procedure">POPs</TabsTrigger>
          <TabsTrigger value="instruction">NIs</TabsTrigger>
          <TabsTrigger value="traffic">Trânsito</TabsTrigger>
          <TabsTrigger value="other">Outros</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-pulse text-center">
                <p className="text-gray-500">Carregando...</p>
              </div>
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocuments.map(document => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onEdit={handleEditClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              {searchQuery ? (
                <p className="text-gray-500">Nenhum documento encontrado com os critérios da pesquisa</p>
              ) : (
                <>
                  <p className="text-gray-500">Nenhum documento encontrado nesta categoria</p>
                  <Button
                    onClick={handleAddClick}
                    className="mt-4 bg-police-blue hover:bg-police-lightBlue"
                  >
                    Adicionar Documento
                  </Button>
                </>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {currentDocument ? 'Editar Documento' : 'Adicionar Documento'}
            </DialogTitle>
          </DialogHeader>
          <DocumentForm
            document={currentDocument}
            onSave={handleFormSave}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DocumentsPage;
