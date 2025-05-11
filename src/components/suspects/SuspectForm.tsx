
import React, { useState, useEffect } from 'react';
import { Suspect } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, Upload } from 'lucide-react';

interface SuspectFormProps {
  suspect?: Suspect;
  onSave: (suspect: Omit<Suspect, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function SuspectForm({ suspect, onSave, onCancel }: SuspectFormProps) {
  const [name, setName] = useState('');
  const [rg, setRg] = useState('');
  const [cpf, setCpf] = useState('');
  const [nickname, setNickname] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [observations, setObservations] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  
  // Se houver um suspeito para edição, carregue os dados
  useEffect(() => {
    if (suspect) {
      setName(suspect.name);
      setRg(suspect.rg || '');
      setCpf(suspect.cpf || '');
      setNickname(suspect.nickname || '');
      setNeighborhood(suspect.neighborhood || '');
      setObservations(suspect.observations || '');
      setPhotoUrl(suspect.photoUrl);
    }
  }, [suspect]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      name,
      rg: rg || undefined,
      cpf: cpf || undefined,
      nickname: nickname || undefined,
      neighborhood: neighborhood || undefined,
      observations: observations || undefined,
      photoUrl,
    });
  };
  
  const handlePhotoCapture = () => {
    // Neste exemplo, apenas simulamos uma captura de foto
    // Em uma aplicação real, isso seria integrado com a câmera do dispositivo
    alert('Funcionalidade de captura de foto seria implementada aqui');
    setPhotoUrl('https://images.unsplash.com/photo-1649972904349-6e44c42644a7?q=80&w=250');
  };
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Neste exemplo, simulamos um upload de arquivo
    // Em uma aplicação real, isso enviaria a imagem para um servidor
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setPhotoUrl(event.target.result);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome*</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Nome completo" 
          required 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rg">RG</Label>
          <Input 
            id="rg" 
            value={rg} 
            onChange={(e) => setRg(e.target.value)} 
            placeholder="00.000.000-0" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input 
            id="cpf" 
            value={cpf} 
            onChange={(e) => setCpf(e.target.value)} 
            placeholder="000.000.000-00" 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nickname">Apelido</Label>
          <Input 
            id="nickname" 
            value={nickname} 
            onChange={(e) => setNickname(e.target.value)} 
            placeholder="Apelido conhecido" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input 
            id="neighborhood" 
            value={neighborhood} 
            onChange={(e) => setNeighborhood(e.target.value)} 
            placeholder="Bairro de atuação" 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="observations">Observações</Label>
        <Textarea 
          id="observations" 
          value={observations} 
          onChange={(e) => setObservations(e.target.value)} 
          placeholder="Informações adicionais..." 
          rows={3} 
        />
      </div>
      
      <div className="space-y-2">
        <Label>Foto</Label>
        <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-lg">
          {photoUrl ? (
            <div className="flex flex-col items-center">
              <img 
                src={photoUrl} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded-lg mb-4" 
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setPhotoUrl(undefined)}
              >
                Remover foto
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-gray-500">
                Capture uma foto ou faça upload de uma imagem
              </p>
              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center gap-2" 
                  onClick={handlePhotoCapture}
                >
                  <Camera className="h-4 w-4" />
                  Câmera
                </Button>
                <div className="relative">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex items-center gap-2" 
                  >
                    <Upload className="h-4 w-4" />
                    Upload
                  </Button>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>
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
          {suspect ? 'Atualizar' : 'Adicionar'} Suspeito
        </Button>
      </div>
    </form>
  );
}
