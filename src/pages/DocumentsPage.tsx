
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { DocumentForm } from '@/components/documents/DocumentForm';
import { useDocuments } from '@/contexts/DocumentContext';
import { Document as DocumentType } from '@/types/models';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

export function DocumentsPage() {
  const { documents, addDocument, updateDocument, filterDocuments, loading } = useDocuments();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDocument, setCurrentDocument] = useState<DocumentType | undefined>(undefined);
  const [viewingDocument, setViewingDocument] = useState<DocumentType | null>(null);
  const isMobile = useIsMobile();
  
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
  
  // Calculate document counts for each category
  const documentCounts = useMemo(() => {
    return {
      all: documents.length,
      bulletin: documents.filter(doc => doc.type === 'bulletin').length,
      procedure: documents.filter(doc => doc.type === 'procedure').length,
      instruction: documents.filter(doc => doc.type === 'instruction').length,
      traffic: documents.filter(doc => doc.type === 'traffic').length,
      other: documents.filter(doc => doc.type === 'other').length,
    };
  }, [documents]);
  
  // Função para determinar a cor do badge com base no tipo
  const getBadgeStyle = (type: DocumentType['type']) => {
    switch (type) {
      case 'bulletin':
        return 'bg-blue-500';
      case 'procedure':
        return 'bg-green-500';
      case 'instruction':
        return 'bg-amber-500';
      case 'traffic':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const handleAddClick = () => {
    setCurrentDocument(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditClick = (document: DocumentType) => {
    setCurrentDocument(document);
    setIsFormOpen(true);
  };

  const handleViewDocument = (document: DocumentType) => {
    setViewingDocument(document);
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
      <div className="flex justify-end">
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
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full overflow-hidden">
        <div className="overflow-x-auto pb-1">
          <TabsList className={`${isMobile ? 'w-max min-w-full' : 'grid grid-cols-6'} mb-4`}>
            <TabsTrigger value="all" className="text-xs whitespace-nowrap text-black font-medium">Todos ({documentCounts.all})</TabsTrigger>
            <TabsTrigger value="bulletin" className="text-xs whitespace-nowrap text-black font-medium">Boletins ({documentCounts.bulletin})</TabsTrigger>
            <TabsTrigger value="procedure" className="text-xs whitespace-nowrap text-black font-medium">POPs ({documentCounts.procedure})</TabsTrigger>
            <TabsTrigger value="instruction" className="text-xs whitespace-nowrap text-black font-medium">NIs ({documentCounts.instruction})</TabsTrigger>
            <TabsTrigger value="traffic" className="text-xs whitespace-nowrap text-black font-medium">Trânsito ({documentCounts.traffic})</TabsTrigger>
            <TabsTrigger value="other" className="text-xs whitespace-nowrap text-black font-medium">Outros ({documentCounts.other})</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-pulse text-center">
                <p className="text-gray-700">Carregando...</p>
              </div>
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocuments.map(document => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onClick={handleViewDocument}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              {searchQuery ? (
                <p className="text-gray-700">Nenhum documento encontrado com os critérios da pesquisa</p>
              ) : (
                <>
                  <p className="text-gray-700">Nenhum documento encontrado nesta categoria</p>
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
      
      {/* Dialog para adicionar/editar documento */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-800">
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

      {/* Dialog para visualizar o documento completo */}
      <Dialog open={!!viewingDocument} onOpenChange={(open) => !open && setViewingDocument(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-800">
              {viewingDocument?.title}
            </DialogTitle>
            {viewingDocument && (
              <Badge className={`w-fit ${getBadgeStyle(viewingDocument.type)}`}>
                {(() => {
                  switch (viewingDocument.type) {
                    case 'bulletin': return 'Boletim';
                    case 'procedure': return 'Procedimento';
                    case 'instruction': return 'Instrução';
                    case 'traffic': return 'Trânsito';
                    default: return 'Outro';
                  }
                })()}
              </Badge>
            )}
          </DialogHeader>
          <DialogDescription className="whitespace-pre-wrap text-black">
            {viewingDocument?.content}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DocumentsPage;
