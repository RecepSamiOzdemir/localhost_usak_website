import React, { useEffect, useId, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { isDirectCmsApi } from '../../services/api';
import type { ApplicationFormSettings } from '../../types/application';
import { resolveApplicationTexts } from '../../utils/applicationForm';
import { ApplicationForm } from './ApplicationForm';

interface ApplicationSectionProps {
  settings?: ApplicationFormSettings;
}

// CV havuzu bölümü. Bayrak kapalıysa hiçbir şey çizilmez. Bayrak açık olsa bile metinlerde
// çözülemeyen {{yer tutucu}} kalırsa ya da API doğrudan CMS'e işaret etmiyorsa form gösterilmez
// ve konsola uyarı yazılır (kullanıcıya ham {{...}} metni ya da yanlış IP sınırı gösterilmesin).
export const ApplicationSection: React.FC<ApplicationSectionProps> = ({ settings }) => {
  const enabled = settings?.enabled === true;
  const panelId = useId();
  // Form varsayılan olarak kapalıdır; sayfa içinde açılıp kapanır (modal değil)
  const [open, setOpen] = useState(false);
  const direct = isDirectCmsApi();

  const resolved = useMemo(
    () => (enabled && direct && settings ? resolveApplicationTexts(settings) : null),
    [enabled, direct, settings],
  );

  useEffect(() => {
    if (!enabled) return;
    if (!direct) {
      console.warn(
        '[kariyer] CV başvuru formu gösterilmedi: VITE_API_URL mutlak bir CMS adresi değil. ' +
          'Başvuru tarayıcıdan doğrudan CMS\'e gitmelidir (frontend proxy\'si IP sınırını bozar).',
      );
    } else if (resolved && !resolved.ok) {
      console.warn(
        `[kariyer] CV başvuru formu gösterilmedi: çözülemeyen yer tutucu veya boş zorunlu metin → ${resolved.unresolved.join(', ')}. ` +
          'CMS → Kariyer Sayfası Ayarları → CV Başvuru Formu metinlerini düzeltin.',
      );
    }
  }, [enabled, direct, resolved]);

  if (!resolved || !resolved.ok) return null;
  const { texts } = resolved;

  return (
    <section id="basvuru" className="application-section" aria-labelledby="basvuru-baslik">
      <div className="section-header">
        <span className="section-tag">CV HAVUZU</span>
        <h2 id="basvuru-baslik" className="section-title">
          {texts.title}
        </h2>
      </div>

      <button
        type="button"
        className="application-toggle card"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="application-toggle-text">
          <span className="application-toggle-title">CV Havuzuna Başvur</span>
          <span className="application-toggle-desc">CV’nizi yetenek havuzumuza ekleyin</span>
        </span>
        <ChevronDown className="application-toggle-icon" size={22} aria-hidden="true" />
      </button>

      {/* Kapalıyken inert: içindeki alanlara klavyeyle/ekran okuyucuyla ulaşılamaz; form DOM'da kalır,
          yazılan değerler kapatılıp açılınca kaybolmaz */}
      <div id={panelId} className="application-collapse" data-open={open} inert={!open}>
        {texts.intro && <p className="section-desc application-intro">{texts.intro}</p>}
        <ApplicationForm texts={texts} open={open} />
      </div>
    </section>
  );
};
