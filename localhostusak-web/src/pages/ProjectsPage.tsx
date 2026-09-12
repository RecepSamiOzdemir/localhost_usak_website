import React, { useState, useEffect, useMemo } from 'react';
import { PageHero } from '../components/layout/PageHero';
import { FilterBar, FilterOption } from '../components/shared/FilterBar';
import { ProjectSpotlight } from '../components/projects/ProjectSpotlight';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectCTA } from '../components/projects/ProjectCTA';
import { EmptyState } from '../components/shared/EmptyState';
import { ProjectItem } from '../types/project';
import { useLinks } from '../context/LinksContext';

// Static fallback data
import initialProjects from '../data/projects.json';

export const ProjectsPage: React.FC = () => {
  const { links } = useLinks();
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects as ProjectItem[]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch from API with fallback
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data)) setProjects(data);
      })
      .catch(() => {
        // Fallback to static data
      });
  }, []);

  const handleLikeProject = (id: number) => {
    fetch(`/api/projects/${id}/like`, { method: 'PATCH' }).catch(() => {});
  };

  const primaryOptions: FilterOption[] = [
    { id: 'all', label: 'Tüm Projeler', icon: '⚡' },
    { id: 'showcase', label: 'Vitrin', icon: '🚀' },
    { id: 'seeking_team', label: 'Ekip Arıyor', icon: '🤝' },
    { id: 'opensource', label: 'Açık Kaynak', icon: '🐙' },
  ];

  const secondaryOptions: FilterOption[] = [
    { id: 'all', label: 'Tüm Teknolojiler' },
    { id: 'react', label: 'React' },
    { id: 'python', label: 'Python' },
    { id: 'flutter', label: 'Flutter' },
    { id: 'typescript', label: 'TypeScript' },
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchType = selectedType === 'all' || p.type === selectedType;
      const matchTech =
        selectedTech === 'all' ||
        p.technologies.some((t) => t.toLowerCase().includes(selectedTech.toLowerCase()));
      const matchSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchType && matchTech && matchSearch;
    });
  }, [projects, selectedType, selectedTech, searchQuery]);

  // Featured spotlight project
  const spotlightProject = useMemo(() => {
    return projects[0];
  }, [projects]);

  return (
    <main>
      <PageHero
        tag="// PROJE VİTRİNİ & AÇIK KAYNAK"
        title="Uşak'ta Üretiliyor,"
        highlightText="Dünyaya Açılıyor"
        description="Topluluk üyelerimizin geliştirdiği açık kaynak projeler, erken aşama girişimler ve birlikte üretmek için ekip arkadaşı arayanlar."
        whatsappUrl={links.whatsappProjects}
        whatsappLabel="WhatsApp Projeler Grubuna Katıl"
      />

      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Filter Bar */}
        <FilterBar
          primaryLabel="Tür"
          primaryOptions={primaryOptions}
          selectedPrimary={selectedType}
          onSelectPrimary={setSelectedType}
          secondaryLabel="Teknoloji"
          secondaryOptions={secondaryOptions}
          selectedSecondary={selectedTech}
          onSelectSecondary={setSelectedTech}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Proje adı, teknoloji veya geliştirici ara..."
        />

        {/* Spotlight Featured Project */}
        {selectedType === 'all' && selectedTech === 'all' && searchQuery === '' && spotlightProject && (
          <ProjectSpotlight project={spotlightProject} />
        )}

        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            Tüm Projeler <span style={{ color: 'var(--accent-primary)' }}>({filteredProjects.length})</span>
          </h2>
        </div>

        {filteredProjects.length === 0 ? (
          <EmptyState
            icon="🚀"
            title="Proje Bulunamadı"
            description="Arama kriterlerine uygun proje vitrini bulunmuyor. Filtreleri temizleyerek tüm projeleri listeleyebilirsin."
            actionText="Filtreleri Sıfırla"
            onAction={() => {
              setSelectedType('all');
              setSelectedTech('all');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="grid-3" style={{ gap: '1.75rem' }}>
            {filteredProjects.map((proj) => (
              <ProjectCard key={proj.id} project={proj} onLike={handleLikeProject} />
            ))}
          </div>
        )}

        {/* Project CTA */}
        <ProjectCTA />
      </div>
    </main>
  );
};
