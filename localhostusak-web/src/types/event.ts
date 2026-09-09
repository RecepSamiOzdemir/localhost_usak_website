export interface EventType {
  id: string;           // "cowork" | "workshop" | "talk" | dynamic ID
  label: string;        // "Cowork" | "Workshop" | "Talk"
  icon: string;         // "☕" | "🛠️" | "🎤"
  colorModern: string;  // e.g. "#FF6600"
  colorPixel: string;   // e.g. "#EE6C19"
  isDefault?: boolean;
  sortOrder?: number;
}

export interface EventItem {
  id: number;
  title: string;
  description: string;
  typeId: string;
  type?: EventType;
  status: "upcoming" | "completed" | "cancelled";
  dateStart: string;    // ISO datetime or readable string
  dateEnd?: string;
  location: string;
  mapUrl?: string;
  capacity?: number;
  attendees: number;
  imageUrl?: string;
  whatsappLink?: string;
  tags?: string[];
  createdAt: string;
}
