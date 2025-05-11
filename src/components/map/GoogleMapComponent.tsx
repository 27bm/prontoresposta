
import React, { useEffect, useRef, useState } from 'react';
import { useMapMarkers } from '@/contexts/MapContext';
import { MapMarker } from '@/types/models';
import { toast } from 'sonner';

// Define the window with google maps
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMapComponent = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);
  const { markers, updateMarker } = useMapMarkers();

  // Função para inicializar o mapa
  const initializeMap = () => {
    if (!mapRef.current) return;

    // Coordenadas iniciais (Brasil)
    const center = { lat: -15.77972, lng: -47.92972 };
    
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 5,
      center,
      mapTypeId: 'roadmap',
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: false,
      zoomControl: true,
    });

    setMapInstance(map);

    // Adicionar evento de clique para adicionar marcadores
    map.addListener('click', (event: google.maps.MapMouseEvent) => {
      const position = event.latLng;
      if (position) {
        toast.info('Clique no mapa detectado. Use o botão "Adicionar Ponto" para criar um novo marcador.');
      }
    });
  };

  // Atualizar marcadores no mapa
  const updateMapMarkers = () => {
    // Limpar todos os marcadores existentes
    mapMarkers.forEach(marker => marker.setMap(null));
    const newMapMarkers: google.maps.Marker[] = [];

    if (mapInstance) {
      // Adicionar novos marcadores
      markers.forEach(marker => {
        // Determinar ícone com base no tipo
        let icon = '';
        switch (marker.type) {
          case 'drug_dealing':
            icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
            break;
          case 'patrol':
            icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
            break;
          case 'incident':
            icon = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
            break;
          case 'custom':
            icon = 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png';
            break;
          default:
            icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
        }

        const mapMarker = new window.google.maps.Marker({
          position: { lat: marker.latitude, lng: marker.longitude },
          map: mapInstance,
          title: marker.title,
          icon,
          draggable: true,
        });

        // Adicionar tooltip ao marcador
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div>
              <h3 style="font-weight: bold;">${marker.title}</h3>
              <p>${marker.description || ''}</p>
            </div>
          `,
        });

        mapMarker.addListener('click', () => {
          infoWindow.open(mapInstance, mapMarker);
        });

        // Evento para atualizar a posição do marcador quando arrastado
        mapMarker.addListener('dragend', () => {
          const position = mapMarker.getPosition();
          if (position) {
            updateMarker(marker.id, {
              latitude: position.lat(),
              longitude: position.lng(),
            });
          }
        });

        newMapMarkers.push(mapMarker);
      });

      setMapMarkers(newMapMarkers);
    }
  };

  // Carregar script do Google Maps
  useEffect(() => {
    // Verificar se o script já foi carregado
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    window.initMap = initializeMap;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyChHNHmX1iDhla5qKkdB7w3YAgur72qJk8&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      window.initMap = () => {};
      document.head.removeChild(script);
    };
  }, []);

  // Atualizar marcadores quando os dados mudarem ou o mapa for inicializado
  useEffect(() => {
    if (mapInstance) {
      updateMapMarkers();
    }
  }, [markers, mapInstance]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
};

export default GoogleMapComponent;
