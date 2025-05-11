
export interface Suspect {
  id: string;
  name: string;
  rg?: string;
  cpf?: string;
  nickname?: string;
  neighborhood?: string;
  observations?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  type: 'drug_dealing' | 'patrol' | 'incident' | 'custom';
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  title: string;
  type: 'bulletin' | 'procedure' | 'instruction' | 'traffic' | 'other';
  content: string;
  attachmentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkSchedule {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  totalHours: number;
  type: 'regular' | 'extra' | 'compensatory';
}

export interface AppShortcut {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  downloadUrl: string;
  isSystemDefault: boolean;
}

export type ScaleType = '12x36' | '12x24_48' | 'custom';
