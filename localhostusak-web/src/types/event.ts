export interface EventType {
  id: string;           // "cowork" | "workshop" | "talk" | dynamic ID
  label: string;        // "Cowork" | "Workshop" | "Talk"
  icon: string;         // "coffee" | "wrench" | "mic"
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
  status: "upcoming" | "open" | "closed" | "completed" | "cancelled";
  dateStart: string;    // ISO datetime or readable string
  dateEnd?: string;
  location: string;
  mapUrl?: string;
  imageUrl?: string;
  whatsappLink?: string;
  recapUrl?: string;
  tags?: string[];
  createdAt: string;
}
