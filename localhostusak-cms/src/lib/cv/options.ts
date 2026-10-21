// Başvuru formu seçenekleri — tek kaynak (koleksiyon alanları ve başvuru endpoint'i doğrulaması)

export const EXPERIENCE_LEVELS = [
  { label: 'Stajyer / Öğrenci', value: 'intern' },
  { label: 'Junior', value: 'junior' },
  { label: 'Mid', value: 'mid' },
  { label: 'Senior', value: 'senior' },
] as const

export const FIELDS_OF_INTEREST = [
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'DevOps', value: 'devops' },
  { label: 'UI/UX', value: 'uiux' },
  { label: 'Diğer', value: 'other' },
] as const

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]['value']
export type FieldOfInterest = (typeof FIELDS_OF_INTEREST)[number]['value']
