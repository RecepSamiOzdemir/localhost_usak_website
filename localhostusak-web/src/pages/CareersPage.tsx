import React, { useState, useEffect, useMemo } from 'react';
import { PageHero } from '../components/layout/PageHero';
import { FilterBar, FilterOption } from '../components/shared/FilterBar';
import { CareerCard } from '../components/careers/CareerCard';
import { CareerResources } from '../components/careers/CareerResources';
import { CareerCTA } from '../components/careers/CareerCTA';
import { EmptyState } from '../components/shared/EmptyState';
import { CareerItem } from '../types/career';
import { useLinks } from '../context/LinksContext';

// Static fallback data
import initialCareers from '../data/careers.json';

export const CareersPage: React.FC = () => {
  const { links } = useLinks();
  const [careers, setCareers] = useState<CareerItem[]>(initialCareers as CareerItem[]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch from API with fallback
  useEffect(() => {
    fetch('/api/careers')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data)) setCareers(data);
      })
      .catch(() => {
        // Fallback to static data
      });
  }, []);

  const primaryOptions: FilterOption[] = [
    { id: 'all', label: 'Tüm İlanlar', icon: '⚡' },
    { id: 'job', label: 'İş İlanı', icon: '💼' },
    { id: 'internship', label: 'Staj', icon: '🎓' },
    { id: 'freelance', label: 'Freelance', icon: '🌍' },
    { id: 'mentorship', label: 'Mentorluk', icon: '🤝' },
  ];

  const secondaryOptions: FilterOption[] = [
    { id: 'all', label: 'Tüm Çalışma Şekilleri' },
    { id: 'remote', label: 'Remote', icon: '🌐' },
    { id: 'hybrid', label: 'Hibrit', icon: '🏢' },
    { id: 'onsite', label: 'Ofis', icon: '📍' },
  ];

  const filteredCareers = useMemo(() => {
    return careers.filter((c) => {
      const matchType = selectedType === 'all' || c.type === selectedType;
      const matchMode = selectedWorkMode === 'all' || c.workMode === selectedWorkMode;
      const matchSearch =
        searchQuery.trim() === '' ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchType && matchMode && matchSearch;
    });
  }, [careers, selectedType, selectedWorkMode, searchQuery]);

  return (
    <main>
      <PageHero
        tag="// KARİYER & FIRSAT PANOSU"
        title="Uşak'tan Globale,"
        highlightText="Doğru Fırsatı Yakala"
        description="Topluluk üyelerinin paylaştığı iş ilanları, staj fırsatları, freelance projeler ve ücretsiz mentorluk eşleşmeleri."
        whatsappUrl={links.whatsappCareers}
        whatsappLabel="WhatsApp Kariyer Grubuna Katıl"
      />

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Filter Bar */}
        <FilterBar
          primaryLabel="Tür"
          primaryOptions={primaryOptions}
          selectedPrimary={selectedType}
          onSelectPrimary={setSelectedType}
          secondaryLabel="Çalışma Şekli"
          secondaryOptions={secondaryOptions}
          selectedSecondary={selectedWorkMode}
          onSelectSecondary={setSelectedWorkMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Teknoloji, pozisyon veya şirket ara..."
        />

        {/* List Title */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            Aktif Fırsatlar <span style={{ color: 'var(--accent-primary)' }}>({filteredCareers.length})</span>
          </h2>
        </div>

        {filteredCareers.length === 0 ? (
          <EmptyState
            icon="💼"
            title="İlan Bulunamadı"
            description="Seçtiğin kriterlere uygun açık kariyer ilanı bulunmuyor. Filtreleri temizleyerek tüm ilanları listeleyebilirsin."
            actionText="Filtreleri Sıfırla"
            onAction={() => {
              setSelectedType('all');
              setSelectedWorkMode('all');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="career-list">
            {filteredCareers.map((item) => (
              <CareerCard key={item.id} career={item} />
            ))}
          </div>
        )}

        {/* Career Resources Grid */}
        <CareerResources />

        {/* Career CTA */}
        <CareerCTA />
      </div>
    </main>
  );
};
