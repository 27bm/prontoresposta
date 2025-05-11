
import React, { useState, useEffect } from 'react';
import { MapMarker } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MapMarkerFormProps {
  marker?: MapMarker;
  location?: { latitude: number; longitude: number };
  onSave: (marker: Omit<MapMarker, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function MapMarkerForm({ marker, location, onSave, onCancel }: MapMarkerFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<MapMarker['type']>('custom');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  
  // Se houver um marcador para edição ou uma localização selecionada, carregue os dados
  useEffect(() => {
    if (marker) {
      setTitle(marker.title);
      setDescription(marker.description || '');
      setType(marker.type);
      setLatitude(marker.latitude);
      setLongitude(marker.longitude);
    } else if (location) {
      setLatitude(location.latitude);
      setLongitude(location.longitude);
    }
  }, [marker, location]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      title,
      description: description || undefined,
      type,
      latitude,
      longitude,
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título*</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Título do marcador" 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Tipo de marcador*</Label>
        <Select 
          value={type}
          onValueChange={(val: MapMarker['type']) => setType(val)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="drug_dealing">Ponto de tráfico</SelectItem>
            <SelectItem value="patrol">Rota de patrulha</SelectItem>
            <SelectItem value="incident">Ocorrência</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Descrição do marcador..." 
          rows={3} 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude*</Label>
          <Input 
            id="latitude" 
            type="number" 
            step="0.000001" 
            value={latitude} 
            onChange={(e) => setLatitude(parseFloat(e.target.value))} 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude*</Label>
          <Input 
            id="longitude" 
            type="number" 
            step="0.000001" 
            value={longitude} 
            onChange={(e) => setLongitude(parseFloat(e.target.value))} 
            required 
          />
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-police-blue hover:bg-police-lightBlue">
          {marker ? 'Atualizar' : 'Adicionar'} Marcador
        </Button>
      </div>
    </form>
  );
}
