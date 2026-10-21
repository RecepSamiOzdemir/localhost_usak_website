import React, { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, Loader2, FolderGit2 } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { FilterBar, FilterOption } from '../components/shared/FilterBar';
import { ProjectSpotlight } from '../components/projects/ProjectSpotlight';
import { ProjectCard } from '../components/projects/ProjectCard';
import { EmptyState } from '../components/shared/EmptyState';
import { ProjectItem } from '../types/project';

import { fetchProjects, likeProject, fetchProjectsPageSettings, getCachedProjectsPageSettings, ProjectsPageSettingsData } from '../services/api';
import seoPages from '../seo/pages.json';
import { usePageMeta } from '../hooks/usePageMeta';
import { useCmsCollection } from '../hooks/useCmsCollection';

export const ProjectsPage: React.FC = () => {
  const { items: projects, isLoading, error, retry } = useCmsCollection<ProjectItem>(fetchProjects);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [settings, setSettings] = useState<ProjectsPageSettingsData | null>(getCachedProjectsPageSettings);

  // SEO Meta
  usePageMeta({
    title: settings?.meta?.title || seoPages["/projeler"].title,
    description: settings?.meta?.description || seoPages["/projeler"].description,
  });

  useEffect(() => {
    fetchProjectsPageSettings()
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(() => {
        // Fallback to static defaults
      });
  }, []);

  const handleLikeProject = (id: number) => {
    likeProject(id);
  };

  const primaryOptions: FilterOption[] = [
    { id: 'all', label: 'Tüm Projeler' },
    { id: 'showcase', label: 'Vitrin' },
    { id: 'seeking_team', label: 'Ekip Arıyor' },
    { id: 'opensource', label: 'Açık Kaynak' },
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
        tag={settings?.hero?.tag || "// PROJE VİTRİNİ & AÇIK KAYNAK"}
        title={settings?.hero?.title || "Uşak'ta Üretiliyor,"}
        highlightText={settings?.hero?.highlightText || "Dünyaya Açılıyor"}
        description={settings?.hero?.description || "Topluluk üyelerimizin geliştirdiği açık kaynak projeler, erken aşama girişimler ve birlikte üretmek için ekip arkadaşı arayanlar."}
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

        {isLoading ? (
          <EmptyState
            icon={<Loader2 size={40} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--text-muted)' }} />}
            title="Projeler Yükleniyor"
            description="Güncel projeler getiriliyor."
          />
        ) : error ? (
          <EmptyState
            icon={<AlertTriangle size={40} style={{ color: '#FF6600' }} />}
            title="Projelere Ulaşılamadı"
            description="İçerik şu anda yüklenemiyor. Biraz sonra tekrar deneyebilirsin."
            actionText="Tekrar Dene"
            onAction={retry}
          />
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            icon={<FolderGit2 size={40} style={{ color: 'var(--text-muted)' }} />}
            title={projects.length === 0 ? 'Henüz Proje Yok' : 'Proje Bulunamadı'}
            description={projects.length === 0 ? 'Topluluk projeleri eklendiğinde burada görünecek.' : 'Arama kriterlerine uygun proje bulunmuyor. Filtreleri temizleyerek tüm projeleri listeleyebilirsin.'}
            actionText={projects.length === 0 ? undefined : 'Filtreleri Sıfırla'}
            onAction={projects.length === 0 ? undefined : () => {
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
      </div>
    </main>
  );
};
