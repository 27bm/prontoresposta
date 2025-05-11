
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { DocumentForm } from '@/components/documents/DocumentForm';
import { useDocuments } from '@/contexts/DocumentContext';
import { Document } from '@/types/models';
import { Plus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function DocumentsPage() {
  const { documents, addDocument, updateDocument, deleteDocument, filterDocuments, loading } = useDocuments();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | undefined>(undefined);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filtrar documentos com base na aba selecionada
  const getFilteredDocuments = () => {
    if (activeTab === 'all') {
      return documents;
    }
    
    return filterDocuments(activeTab as Document['type']);
  };
  
  // Contar documentos por tipo
  const countDocumentsByType = (type: string) => {
    if (type === 'all') {
      return documents.length;
    }
    
    return documents.filter(doc => doc.type === type).length;
  };
  
  // Funções de manipulação do formulário
  const handleAddClick = () => {
    setCurrentDocument(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditClick = (document: Document) => {
    setCurrentDocument(document);
    setIsFormOpen(true);
  };
  
  const handleDeleteClick = (id: string) => {
    setDocumentToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (documentToDelete) {
      deleteDocument(documentToDelete);
      setDocumentToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleFormSave = (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (currentDocument) {
      updateDocument(currentDocument.id, document);
    } else {
      addDocument(document);
    }
    
    setIsFormOpen(false);
  };
  
  const filteredDocuments = getFilteredDocuments();
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Documentos e Registros</h2>
        <Button
          onClick={handleAddClick}
          className="bg-police-blue hover:bg-police-lightBlue"
        >
          <Plus className="h-4 w-4 mr-1" />
          Novo Documento
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full overflow-auto flex whitespace-nowrap scrollbar-none">
          <TabsTrigger value="all" className="flex-1">
            Todos ({countDocumentsByType('all')})
          </TabsTrigger>
          <TabsTrigger value="bulletin" className="flex-1">
            Boletins ({countDocumentsByType('bulletin')})
          </TabsTrigger>
          <TabsTrigger value="procedure" className="flex-1">
            POPs ({countDocumentsByType('procedure')})
          </TabsTrigger>
          <TabsTrigger value="instruction" className="flex-1">
            NIs ({countDocumentsByType('instruction')})
          </TabsTrigger>
          <TabsTrigger value="traffic" className="flex-1">
            Trânsito ({countDocumentsByType('traffic')})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-pulse-slow text-center">
                <p className="text-gray-500">Carregando...</p>
              </div>
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="space-y-3">
              {filteredDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">
                Nenhum documento encontrado
                {activeTab !== 'all' ? " para esta categoria" : ""}
              </p>
              <Button
                onClick={handleAddClick}
                className="mt-4 bg-police-blue hover:bg-police-lightBlue"
              >
                Adicionar Documento
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Modal do formulário */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {currentDocument ? 'Editar Documento' : 'Adicionar Novo Documento'}
            </DialogTitle>
          </DialogHeader>
          <DocumentForm
            document={currentDocument}
            onSave={handleFormSave}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleConfirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DocumentsPage;
