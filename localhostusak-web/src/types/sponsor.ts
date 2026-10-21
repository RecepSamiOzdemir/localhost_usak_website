export type SponsorTier = 'gold' | 'silver' | 'bronze' | 'community';

export interface SponsorItem {
  id: number;
  name: string;
  tier: SponsorTier;
  logoUrl: string;
  websiteUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
