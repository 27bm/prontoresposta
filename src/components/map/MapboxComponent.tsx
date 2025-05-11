
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapMarker } from '@/types/models';

interface MapboxComponentProps {
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
}

const MapboxComponent: React.FC<MapboxComponentProps> = ({ markers = [], onMarkerClick }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const mapMarkers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1Ijoid3N3YW5kZXJzb24iLCJhIjoiY21hang2MGc5MDJhMjJqcHJ6dDh2ODZ6bCJ9.83WAa7gViuxIhISTr_cuUw';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-46.633308, -23.55052], // São Paulo
      zoom: 11
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers when they change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    mapMarkers.current.forEach(marker => marker.remove());
    mapMarkers.current = [];

    // Add new markers
    markers.forEach(marker => {
      const markerColor = getMarkerColor(marker.type);
      
      const el = document.createElement('div');
      el.className = 'mapbox-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = markerColor;
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 0 2px rgba(0, 0, 0, 0.5)';
      
      const mapMarker = new mapboxgl.Marker(el)
        .setLngLat([marker.longitude, marker.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h3>${marker.title}</h3>${marker.description ? `<p>${marker.description}</p>` : ''}`
        ));
      
      mapMarker.addTo(map.current!);
      
      // Add click handler
      el.addEventListener('click', () => {
        if (onMarkerClick) onMarkerClick(marker);
      });
      
      mapMarkers.current.push(mapMarker);
    });
  }, [markers, onMarkerClick]);

  const getMarkerColor = (type: MapMarker['type']) => {
    switch (type) {
      case 'drug_dealing': return '#dc2626'; // red
      case 'patrol': return '#2563eb'; // blue
      case 'incident': return '#eab308'; // yellow
      case 'custom': return '#9333ea'; // purple
      default: return '#6b7280'; // gray
    }
  };

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default MapboxComponent;
