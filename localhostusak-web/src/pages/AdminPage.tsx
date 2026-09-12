import React, { useState, useEffect } from 'react';
import { PageHero } from '../components/layout/PageHero';
import { EventItem, EventType } from '../types/event';
import { CareerItem } from '../types/career';
import { ProjectItem } from '../types/project';
import { useLinks } from '../context/LinksContext';
import { COMMUNITY_LINKS_META, CommunityLinks } from '../constants/links';

import defaultEventTypes from '../data/eventTypes.json';
import defaultEvents from '../data/events.json';
import defaultCareers from '../data/careers.json';
import defaultProjects from '../data/projects.json';

type AdminTab = 'eventTypes' | 'events' | 'careers' | 'projects' | 'links';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Default accessible locally
  const [activeTab, setActiveTab] = useState<AdminTab>('eventTypes');

  // Links context
  const { links, updateLinks, resetToDefaults } = useLinks();
  const [linkForms, setLinkForms] = useState<CommunityLinks>(links);
  const [isSavingLinks, setIsSavingLinks] = useState<boolean>(false);

  useEffect(() => {
    setLinkForms(links);
  }, [links]);

  // State collections
  const [eventTypes, setEventTypes] = useState<EventType[]>(defaultEventTypes as EventType[]);
  const [events, setEvents] = useState<EventItem[]>(defaultEvents as EventItem[]);
  const [careers, setCareers] = useState<CareerItem[]>(defaultCareers as CareerItem[]);
  const [projects, setProjects] = useState<ProjectItem[]>(defaultProjects as ProjectItem[]);

  // Fetch initial data from backend if server is alive
  useEffect(() => {
    fetch('/api/event-types')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => d && setEventTypes(d))
      .catch(() => {});

    fetch('/api/events')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => d && setEvents(d))
      .catch(() => {});

    fetch('/api/careers')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => d && setCareers(d))
      .catch(() => {});

    fetch('/api/projects')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => d && setProjects(d))
      .catch(() => {});
  }, []);

  // Form states for new EventType
  const [newTypeId, setNewTypeId] = useState('');
  const [newTypeLabel, setNewTypeLabel] = useState('');
  const [newTypeIcon, setNewTypeIcon] = useState('⚡');
  const [newTypeColor, setNewTypeColor] = useState('#FF6600');

  // Form states for new Event
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventTypeId, setNewEventTypeId] = useState('cowork');
  const [newEventDate, setNewEventDate] = useState('2026-11-01T14:00');
  const [newEventLocation, setNewEventLocation] = useState('Coff The Story, Uşak');
  const [newEventCapacity, setNewEventCapacity] = useState(25);

  // Form states for new Career
  const [newCareerTitle, setNewCareerTitle] = useState('');
  const [newCareerCompany, setNewCareerCompany] = useState('');
  const [newCareerType, setNewCareerType] = useState<'job' | 'internship' | 'freelance' | 'mentorship'>('job');
  const [newCareerMode, setNewCareerMode] = useState<'remote' | 'hybrid' | 'onsite'>('remote');
  const [newCareerTech, setNewCareerTech] = useState('React, TypeScript');
  const [newCareerDesc, setNewCareerDesc] = useState('');

  // Form states for new Project
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjType, setNewProjType] = useState<'showcase' | 'seeking_team' | 'opensource'>('showcase');
  const [newProjOwner, setNewProjOwner] = useState('@topluluk_uyesi');
  const [newProjTech, setNewProjTech] = useState('React, Node.js');

  // Feedback banner
  const [feedback, setFeedback] = useState<string | null>(null);
  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  // 1. Event Types Actions
  const handleAddEventType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeId.trim() || !newTypeLabel.trim()) return;

    const formattedId = newTypeId.toLowerCase().trim().replace(/\s+/g, '_');
    if (eventTypes.some((t) => t.id === formattedId)) {
      showFeedback('Hata: Bu ID ile bir etkinlik türü zaten var!');
      return;
    }

    const newType: EventType = {
      id: formattedId,
      label: newTypeLabel.trim(),
      icon: newTypeIcon,
      colorModern: newTypeColor,
      colorPixel: newTypeColor,
      isDefault: false,
      sortOrder: eventTypes.length + 1,
    };

    // Post to API if possible
    fetch('/api/admin/event-types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newType),
    }).catch(() => {});

    setEventTypes((prev) => [...prev, newType]);
    setNewTypeId('');
    setNewTypeLabel('');
    showFeedback(`✓ "${newType.label}" etkinlik türü başarıyla eklendi!`);
  };

  const handleDeleteEventType = (id: string) => {
    const target = eventTypes.find((t) => t.id === id);
    if (target?.isDefault) {
      showFeedback('Varsayılan türler (Cowork, Workshop, Talk) silinemez!');
      return;
    }

    fetch(`/api/admin/event-types/${id}`, { method: 'DELETE' }).catch(() => {});
    setEventTypes((prev) => prev.filter((t) => t.id !== id));
    showFeedback(`✓ Etkinlik türü silindi.`);
  };

  // 2. Events Actions
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEv: EventItem = {
      id: Date.now(),
      title: newEventTitle,
      description: newEventDesc || 'Topluluk buluşması.',
      typeId: newEventTypeId,
      status: 'upcoming',
      dateStart: new Date(newEventDate).toISOString(),
      location: newEventLocation,
      capacity: Number(newEventCapacity) || 20,
      attendees: 0,
      tags: ['#Topluluk'],
      createdAt: new Date().toISOString(),
    };

    fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEv),
    }).catch(() => {});

    setEvents((prev) => [newEv, ...prev]);
    setNewEventTitle('');
    setNewEventDesc('');
    showFeedback(`✓ "${newEv.title}" etkinliği oluşturuldu!`);
  };

  const handleToggleEventStatus = (id: number) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === id) {
          const nextStatus = ev.status === 'upcoming' ? 'completed' : 'upcoming';
          fetch(`/api/admin/events/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...ev, status: nextStatus }),
          }).catch(() => {});
          return { ...ev, status: nextStatus };
        }
        return ev;
      })
    );
    showFeedback('✓ Etkinlik durumu güncellendi.');
  };

  const handleDeleteEvent = (id: number) => {
    fetch(`/api/admin/events/${id}`, { method: 'DELETE' }).catch(() => {});
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showFeedback('✓ Etkinlik silindi.');
  };

  // 3. Careers Actions
  const handleAddCareer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCareerTitle.trim()) return;

    const newCar: CareerItem = {
      id: Date.now(),
      title: newCareerTitle,
      company: newCareerCompany || 'Gizli Şirket',
      type: newCareerType,
      workMode: newCareerMode,
      schedule: 'fulltime',
      description: newCareerDesc || 'Pozisyon detayı...',
      technologies: newCareerTech.split(',').map((t) => t.trim()),
      postedBy: '@admin',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    fetch('/api/admin/careers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCar),
    }).catch(() => {});

    setCareers((prev) => [newCar, ...prev]);
    setNewCareerTitle('');
    setNewCareerDesc('');
    showFeedback(`✓ "${newCar.title}" ilanı oluşturuldu!`);
  };

  const handleDeleteCareer = (id: number) => {
    fetch(`/api/admin/careers/${id}`, { method: 'DELETE' }).catch(() => {});
    setCareers((prev) => prev.filter((c) => c.id !== id));
    showFeedback('✓ Kariyer ilanı silindi.');
  };

  // 4. Projects Actions
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    const newPr: ProjectItem = {
      id: Date.now(),
      name: newProjName,
      description: newProjDesc || 'Topluluk projesi.',
      type: newProjType,
      technologies: newProjTech.split(',').map((t) => t.trim()),
      owner: newProjOwner,
      teamSize: 1,
      likes: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPr),
    }).catch(() => {});

    setProjects((prev) => [newPr, ...prev]);
    setNewProjName('');
    setNewProjDesc('');
    showFeedback(`✓ "${newPr.name}" projesi vitrine eklendi!`);
  };

  const handleDeleteProject = (id: number) => {
    fetch(`/api/admin/projects/${id}`, { method: 'DELETE' }).catch(() => {});
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showFeedback('✓ Proje silindi.');
  };

  // 5. Community & WhatsApp Links Actions
  const handleLinkChange = (key: keyof CommunityLinks, val: string) => {
    setLinkForms((prev) => ({ ...prev, [key]: val }));
  };

  const handleSaveLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingLinks(true);
    const res = await updateLinks(linkForms);
    setIsSavingLinks(false);
    showFeedback(res.message || '✓ Bağlantılar başarıyla güncellendi!');
  };

  const handleResetLinks = async () => {
    if (window.confirm('Tüm bağlantıları varsayılan fabrika ayarlarına döndürmek istediğinize emin misiniz?')) {
      await resetToDefaults();
      showFeedback('✓ Bağlantılar varsayılan değerlere sıfırlandı.');
    }
  };

  return (
    <main>
      <PageHero
        tag="// YÖNETİM & KONTROL PANELİ"
        title="localhost[uşak]"
        highlightText="Admin Merkezi"
        description="Etkinlik türleri ekleme/düzenleme, buluşma takvimi, kariyer ilanları ve proje vitrinini tek bir konsoldan yönet."
        whatsappUrl=""
        whatsappLabel=""
      />

      <div className="container admin-wrapper">
        {feedback && (
          <div
            style={{
              padding: '1rem 1.5rem',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10B981',
              borderRadius: 'var(--radius-sm)',
              color: '#10B981',
              marginBottom: '1.5rem',
              fontWeight: 600,
            }}
          >
            {feedback}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'eventTypes' ? 'active' : ''}`}
            onClick={() => setActiveTab('eventTypes')}
          >
            ☕ Etkinlik Türleri ({eventTypes.length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            📅 Buluşmalar & Etkinlikler ({events.length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'careers' ? 'active' : ''}`}
            onClick={() => setActiveTab('careers')}
          >
            💼 Kariyer İlanları ({careers.length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            🚀 Proje Vitrini ({projects.length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'links' ? 'active' : ''}`}
            onClick={() => setActiveTab('links')}
          >
            💬 WhatsApp & Linkler
          </button>
        </div>

        {/* TAB 1: EVENT TYPES MANAGEMENT */}
        {activeTab === 'eventTypes' && (
          <div>
            {/* New Event Type Form */}
            <div className="admin-form-card">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                + Yeni Etkinlik Türü Ekle
              </h3>
              <form onSubmit={handleAddEventType}>
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label>TÜR KİMLİĞİ (ID - İngilizce/Tek kelime):</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newTypeId}
                      onChange={(e) => setNewTypeId(e.target.value)}
                      placeholder="Örn: hackathon, game_jam, coffee_chat"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>ETİKET (Görünen Başlık):</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newTypeLabel}
                      onChange={(e) => setNewTypeLabel(e.target.value)}
                      placeholder="Örn: Hackathon, Game Jam"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>İKON / EMOJİ:</label>
                    <select
                      className="form-control"
                      value={newTypeIcon}
                      onChange={(e) => setNewTypeIcon(e.target.value)}
                    >
                      <option value="☕">☕ Kahve (Cowork)</option>
                      <option value="🛠️">🛠️ Çekiç (Workshop)</option>
                      <option value="🎤">🎤 Mikrofon (Talk)</option>
                      <option value="💻">💻 Laptop</option>
                      <option value="🚀">🚀 Roket</option>
                      <option value="👾">👾 Piksel Canavarı</option>
                      <option value="⚡">⚡ Şimşek</option>
                      <option value="🎮">🎮 Oyun</option>
                      <option value="🏆">🏆 Kupa</option>
                      <option value="🎨">🎨 Palet</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>VURGU RENGİ:</label>
                    <input
                      type="color"
                      className="form-control"
                      value={newTypeColor}
                      onChange={(e) => setNewTypeColor(e.target.value)}
                      style={{ height: '42px', padding: '2px', cursor: 'pointer' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <button type="submit" className="btn btn-primary">
                    <span>Etkinlik Türünü Kaydet</span>
                    <span>✓</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Event Types Table */}
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '2rem' }}>
              Mevcut Etkinlik Türleri
            </h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>İkon</th>
                  <th>ID</th>
                  <th>Etiket</th>
                  <th>Renk</th>
                  <th>Durum</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {eventTypes.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontSize: '1.5rem' }}>{t.icon}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{t.id}</td>
                    <td style={{ fontWeight: 700 }}>{t.label}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: t.colorModern,
                            borderRadius: '4px',
                            display: 'inline-block',
                          }}
                        />
                        <span>{t.colorModern}</span>
                      </div>
                    </td>
                    <td>
                      {t.isDefault ? (
                        <span className="badge badge-blue">Varsayılan</span>
                      ) : (
                        <span className="badge badge-orange">Özel Tip</span>
                      )}
                    </td>
                    <td>
                      {!t.isDefault ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleDeleteEventType(t.id)}
                          style={{ color: '#FF453A' }}
                        >
                          Sil
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Korumalı</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: EVENTS MANAGEMENT */}
        {activeTab === 'events' && (
          <div>
            {/* New Event Form */}
            <div className="admin-form-card">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                + Yeni Buluşma / Etkinlik Oluştur
              </h3>
              <form onSubmit={handleAddEvent}>
                <div className="admin-form-grid">
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>ETKİNLİK BAŞLIĞI:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      placeholder="Örn: Buluşma #4: AI Agents ile Kodlama"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>ETKİNLİK TÜRÜ:</label>
                    <select
                      className="form-control"
                      value={newEventTypeId}
                      onChange={(e) => setNewEventTypeId(e.target.value)}
                    >
                      {eventTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.icon} {t.label} ({t.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>TARİH VE SAAT:</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>MEKAN:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newEventLocation}
                      onChange={(e) => setNewEventLocation(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>KONTENJAN:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newEventCapacity}
                      onChange={(e) => setNewEventCapacity(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>AÇIKLAMA:</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={newEventDesc}
                      onChange={(e) => setNewEventDesc(e.target.value)}
                      placeholder="Buluşma formatı ve katılımcılardan beklenenler..."
                    />
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <button type="submit" className="btn btn-primary">
                    <span>Etkinliği Yayınla</span>
                    <span>✓</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Events List */}
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '2rem' }}>
              Mevcut Etkinlikler
            </h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Başlık</th>
                  <th>Tür</th>
                  <th>Tarih</th>
                  <th>Mekan</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td style={{ fontWeight: 700 }}>{ev.title}</td>
                    <td>
                      <span className="agenda-tag">{ev.typeId}</span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                      {new Date(ev.dateStart).toLocaleDateString('tr-TR')}
                    </td>
                    <td>{ev.location}</td>
                    <td>
                      <span className={`badge ${ev.status === 'upcoming' ? 'badge-live' : 'badge-orange'}`}>
                        {ev.status === 'upcoming' ? 'Yaklaşan' : 'Tamamlandı'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleToggleEventStatus(ev.id)}
                        >
                          {ev.status === 'upcoming' ? 'Tamamlandı Yap' : 'Geri Al'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleDeleteEvent(ev.id)}
                          style={{ color: '#FF453A' }}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: CAREERS MANAGEMENT */}
        {activeTab === 'careers' && (
          <div>
            <div className="admin-form-card">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                + Yeni Kariyer İlanı Ekle
              </h3>
              <form onSubmit={handleAddCareer}>
                <div className="admin-form-grid">
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>POZİSYON BAŞLIĞI:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newCareerTitle}
                      onChange={(e) => setNewCareerTitle(e.target.value)}
                      placeholder="Örn: Junior Frontend Developer"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>ŞİRKET VEYA KURUM:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newCareerCompany}
                      onChange={(e) => setNewCareerCompany(e.target.value)}
                      placeholder="Örn: XYZ Startup"
                    />
                  </div>

                  <div className="form-group">
                    <label>İLAN TÜRÜ:</label>
                    <select
                      className="form-control"
                      value={newCareerType}
                      onChange={(e) => setNewCareerType(e.target.value as any)}
                    >
                      <option value="job">💼 İş İlanı</option>
                      <option value="internship">🎓 Staj</option>
                      <option value="freelance">🌍 Freelance</option>
                      <option value="mentorship">🤝 Mentorluk</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>ÇALIŞMA ŞEKLİ:</label>
                    <select
                      className="form-control"
                      value={newCareerMode}
                      onChange={(e) => setNewCareerMode(e.target.value as any)}
                    >
                      <option value="remote">Remote (Uzaktan)</option>
                      <option value="hybrid">Hibrit</option>
                      <option value="onsite">Ofis / Uşak</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>TEKNOLOJİLER (virgülle ayır):</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newCareerTech}
                      onChange={(e) => setNewCareerTech(e.target.value)}
                      placeholder="React, Node.js, Python"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>AÇIKLAMA:</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={newCareerDesc}
                      onChange={(e) => setNewCareerDesc(e.target.value)}
                      placeholder="İş tanımı ve aranan nitelikler..."
                    />
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <button type="submit" className="btn btn-primary">
                    <span>İlanı Yayınla</span>
                    <span>✓</span>
                  </button>
                </div>
              </form>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pozisyon</th>
                  <th>Şirket</th>
                  <th>Tür</th>
                  <th>Çalışma</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {careers.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700 }}>{c.title}</td>
                    <td>{c.company}</td>
                    <td>
                      <span className="agenda-tag">{c.type}</span>
                    </td>
                    <td>{c.workMode}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleDeleteCareer(c.id)}
                        style={{ color: '#FF453A' }}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: PROJECTS MANAGEMENT */}
        {activeTab === 'projects' && (
          <div>
            <div className="admin-form-card">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                + Yeni Proje Ekle
              </h3>
              <form onSubmit={handleAddProject}>
                <div className="admin-form-grid">
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>PROJE ADI:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newProjName}
                      onChange={(e) => setNewProjName(e.target.value)}
                      placeholder="Örn: Uşak Şehir Rehberi Botu"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>PROJE TÜRÜ:</label>
                    <select
                      className="form-control"
                      value={newProjType}
                      onChange={(e) => setNewProjType(e.target.value as any)}
                    >
                      <option value="showcase">🚀 Vitrin</option>
                      <option value="seeking_team">🤝 Ekip Arıyor</option>
                      <option value="opensource">🐙 Açık Kaynak</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>SAHİBİ / GELİŞTİRİCİ:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newProjOwner}
                      onChange={(e) => setNewProjOwner(e.target.value)}
                      placeholder="@kullanici_adi"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>TEKNOLOJİLER (virgülle ayır):</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newProjTech}
                      onChange={(e) => setNewProjTech(e.target.value)}
                      placeholder="Flutter, Python, FastApi"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>AÇIKLAMA:</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={newProjDesc}
                      onChange={(e) => setNewProjDesc(e.target.value)}
                      placeholder="Proje amacı ve öne çıkan özellikleri..."
                    />
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <button type="submit" className="btn btn-primary">
                    <span>Projeyi Kaydet</span>
                    <span>✓</span>
                  </button>
                </div>
              </form>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Proje Adı</th>
                  <th>Geliştirici</th>
                  <th>Tür</th>
                  <th>Beğeni</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700 }}>{p.name}</td>
                    <td>{p.owner}</td>
                    <td>
                      <span className="agenda-tag">{p.type}</span>
                    </td>
                    <td>{p.likes} ❤️</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleDeleteProject(p.id)}
                        style={{ color: '#FF453A' }}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: WHATSAPP & COMMUNITY LINKS MANAGEMENT */}
        {activeTab === 'links' && (
          <div className="admin-links-section">
            <div className="admin-form-card" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>💬</span> WhatsApp & Topluluk Bağlantılarını Yönet
                  </h3>
                  <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Burada güncellediğiniz bağlantılar tüm web sitesinde (Ana sayfa hero, altbilgi, sağ alttaki sabit WhatsApp butonu ve alt sayfalardaki CTA'lar) anında canlı olarak güncellenir.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={handleResetLinks}
                  title="Tüm linkleri ilk fabrika ayarlarına döndür"
                  style={{ fontSize: '0.8rem', opacity: 0.8 }}
                >
                  🔄 Varsayılanlara Sıfırla
                </button>
              </div>

              <form onSubmit={handleSaveLinks}>
                {/* 1. WhatsApp Groups */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginBottom: '1rem', 
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.1))'
                  }}>
                    <span style={{ fontSize: '1.25rem' }}>🟢</span>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      WhatsApp Çalışma & Topluluk Grupları
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                    {COMMUNITY_LINKS_META.filter((m) => m.category === 'whatsapp').map((item) => {
                      const currentValue = linkForms[item.key] || '';
                      return (
                        <div
                          key={item.key}
                          style={{
                            background: 'var(--bg-secondary, rgba(255,255,255,0.03))',
                            border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
                            borderRadius: 'var(--radius-sm, 6px)',
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <label
                              htmlFor={`link-input-${item.key}`}
                              style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}
                            >
                              <span>{item.icon}</span> {item.label}
                            </label>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: 'rgba(37, 211, 102, 0.15)',
                                color: '#25D366',
                                fontWeight: 700,
                                fontFamily: 'var(--font-mono, monospace)',
                              }}
                            >
                              {item.badge}
                            </span>
                          </div>

                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            {item.description}
                          </p>

                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                              id={`link-input-${item.key}`}
                              type="url"
                              value={currentValue}
                              placeholder={item.placeholder}
                              onChange={(e) => handleLinkChange(item.key, e.target.value)}
                              required
                              style={{
                                flex: 1,
                                padding: '0.6rem 0.75rem',
                                fontFamily: 'var(--font-mono, monospace)',
                                fontSize: '0.85rem',
                                borderRadius: 'var(--radius-xs, 4px)',
                                border: '1px solid var(--border-color, rgba(255,255,255,0.15))',
                                background: 'var(--bg-card, rgba(0,0,0,0.2))',
                                color: 'var(--text-primary)',
                              }}
                            />
                            <a
                              href={currentValue}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-secondary"
                              title="Linki tarayıcıda aç ve test et"
                              style={{
                                padding: '0.6rem 0.75rem',
                                fontSize: '0.8rem',
                                whiteSpace: 'nowrap',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                              }}
                            >
                              Test ↗
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Social Media & Channels */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    marginBottom: '1rem', 
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.1))'
                  }}>
                    <span style={{ fontSize: '1.25rem' }}>🌐</span>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Sosyal Medya & Açık Kaynak Kanalları
                    </h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                    {COMMUNITY_LINKS_META.filter((m) => m.category === 'social').map((item) => {
                      const currentValue = linkForms[item.key] || '';
                      return (
                        <div
                          key={item.key}
                          style={{
                            background: 'var(--bg-secondary, rgba(255,255,255,0.03))',
                            border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
                            borderRadius: 'var(--radius-sm, 6px)',
                            padding: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <label
                              htmlFor={`link-input-${item.key}`}
                              style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}
                            >
                              <span>{item.icon}</span> {item.label}
                            </label>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: 'rgba(58, 134, 255, 0.15)',
                                color: '#3A86FF',
                                fontWeight: 700,
                                fontFamily: 'var(--font-mono, monospace)',
                              }}
                            >
                              {item.badge}
                            </span>
                          </div>

                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            {item.description}
                          </p>

                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                              id={`link-input-${item.key}`}
                              type="url"
                              value={currentValue}
                              placeholder={item.placeholder}
                              onChange={(e) => handleLinkChange(item.key, e.target.value)}
                              required
                              style={{
                                flex: 1,
                                padding: '0.6rem 0.75rem',
                                fontFamily: 'var(--font-mono, monospace)',
                                fontSize: '0.85rem',
                                borderRadius: 'var(--radius-xs, 4px)',
                                border: '1px solid var(--border-color, rgba(255,255,255,0.15))',
                                background: 'var(--bg-card, rgba(0,0,0,0.2))',
                                color: 'var(--text-primary)',
                              }}
                            />
                            <a
                              href={currentValue}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-secondary"
                              title="Linki tarayıcıda aç ve test et"
                              style={{
                                padding: '0.6rem 0.75rem',
                                fontSize: '0.8rem',
                                whiteSpace: 'nowrap',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                              }}
                            >
                              Test ↗
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Save action bar */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color, rgba(255,255,255,0.1))', flexWrap: 'wrap' }}>
                  {feedback && (
                    <div style={{ color: '#10B981', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>✓</span> {feedback}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isSavingLinks}
                    style={{ minWidth: '220px', fontWeight: 700 }}
                  >
                    {isSavingLinks ? '⏳ Kaydediliyor...' : '💾 Bağlantıları Kaydet'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
