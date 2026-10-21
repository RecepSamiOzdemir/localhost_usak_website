import React, { useEffect, useId, useRef, useState } from 'react';
import { CircleCheck, Loader2, Send, TriangleAlert } from 'lucide-react';
import { submitJobApplication } from '../../services/api';
import {
  APPLICATION_FIELDS,
  EXPERIENCE_LEVELS,
  FIELDS_OF_INTEREST,
  type ApplicationErrors,
  type ApplicationFormTexts,
  type ApplicationValues,
} from '../../types/application';
import { checkCvFile, validateApplication } from '../../utils/applicationForm';
import { createOpenTimer } from '../../utils/openTimer';
import { FileDropzone } from './FileDropzone';
import { PrivacyModal } from './PrivacyModal';

interface ApplicationFormProps {
  texts: ApplicationFormTexts;
  // Form açık mı (açılır-kapanır bölüm). Açık kalma süresi sayacı ilk açılışta başlar.
  open: boolean;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMPTY_VALUES: ApplicationValues = {
  candidateName: '',
  email: '',
  phone: '',
  linkedinUrl: '',
  githubUrl: '',
  experienceLevel: '',
  fieldsOfInterest: [],
  consent: false,
  file: null,
};

const CLIENT_SUMMARY = 'Lütfen işaretli alanları kontrol edin.';
const SERVER_FIELD_HINT = 'Lütfen bu alanı kontrol edin.';

// Formdaki alanların DOM sırası (ilk hatalı alana odaklanmak için)
const FIELD_ORDER: (keyof ApplicationValues)[] = [
  'candidateName',
  'email',
  'phone',
  'experienceLevel',
  'linkedinUrl',
  'githubUrl',
  'fieldsOfInterest',
  'file',
  'consent',
];

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ texts, open }) => {
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;

  const [values, setValues] = useState<ApplicationValues>(EMPTY_VALUES);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<ApplicationErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  // Formun İLK AÇILDIĞI an (performance.now(), cihaz saatinden bağımsız): gönderimde "açık kalma süresi"
  // hesaplanır; sunucu çok hızlı gönderimleri bot sayar. Form kapalıyken geçen süre sayılmaz (bkz. openTimer).
  const openTimer = useRef(createOpenTimer(() => performance.now()));
  const resultRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Partial<Record<keyof ApplicationValues, HTMLElement | null>>>({});
  const setRef = (key: keyof ApplicationValues) => (el: HTMLElement | null) => {
    refs.current[key] = el;
  };

  const submitting = status === 'submitting';

  // Aydınlatma pop-up'ı: onay kutusu yalnızca metin okunup onaylanınca işaretlenir. İşaretliyken
  // tıklamak doğrudan işareti kaldırır (pop-up açılmaz).
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const handleConsentChange = (checked: boolean) => {
    if (checked) setPrivacyOpen(true);
    else update('consent', false);
  };
  const closePrivacy = () => {
    setPrivacyOpen(false);
    // Pop-up kalkınca odak onay kutusuna döner
    setTimeout(() => refs.current.consent?.focus(), 0);
  };
  const confirmPrivacy = () => {
    update('consent', true);
    closePrivacy();
  };

  // Sunucu hatasında odak, alanlar yeniden etkinleştirildikten (disabled kalktıktan) sonra verilir
  const pendingFocus = useRef<keyof ApplicationValues | null>(null);

  // Açılışta sayacı başlat ve odağı ilk alana ver. İlk render'da (form kapalı) odak verilmez.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      openTimer.current.markOpened();
      if (!wasOpen.current) refs.current.candidateName?.focus();
    }
    wasOpen.current = open;
  }, [open]);
  useEffect(() => {
    if (status === 'submitting' || !pendingFocus.current) return;
    refs.current[pendingFocus.current]?.focus();
    pendingFocus.current = null;
  }, [status, errors]);

  const update = <K extends keyof ApplicationValues>(key: K, value: ApplicationValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    // Başarı mesajı yeni bir başvuru başlayınca kalkar
    if (status === 'success') {
      setStatus('idle');
      setMessage('');
    }
  };

  const toggleInterest = (value: string) => {
    const has = values.fieldsOfInterest.includes(value);
    update('fieldsOfInterest', has ? values.fieldsOfInterest.filter((v) => v !== value) : [...values.fieldsOfInterest, value]);
  };

  const selectFile = (file: File | null) => {
    update('file', file);
    // Dosya hatası (tür/boyut) seçer seçmez gösterilsin
    if (file) {
      const fileError = checkCvFile(file);
      if (fileError) setErrors((prev) => ({ ...prev, file: fileError }));
    }
  };

  const focusFirstInvalid = (invalid: ApplicationErrors) => {
    const first = FIELD_ORDER.find((key) => invalid[key]);
    if (first) refs.current[first]?.focus();
  };

  const showResult = () => {
    // Sonuç mesajı görünür olsun ve ekran okuyucuya iletilsin
    requestAnimationFrame(() => {
      resultRef.current?.focus();
      resultRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  };

  const buildFormData = (): FormData => {
    const form = new FormData();
    const set = (key: string, value: string) => {
      if (value) form.append(key, value);
    };
    set(APPLICATION_FIELDS.name, values.candidateName.trim());
    set(APPLICATION_FIELDS.email, values.email.trim());
    set(APPLICATION_FIELDS.phone, values.phone.trim());
    set(APPLICATION_FIELDS.linkedin, values.linkedinUrl.trim());
    set(APPLICATION_FIELDS.github, values.githubUrl.trim());
    set(APPLICATION_FIELDS.level, values.experienceLevel);
    values.fieldsOfInterest.forEach((v) => form.append(APPLICATION_FIELDS.interests, v));
    form.append(APPLICATION_FIELDS.consent, 'true');
    form.append(APPLICATION_FIELDS.fillMs, String(openTimer.current.elapsedMs()));
    form.append(APPLICATION_FIELDS.honeypot, honeypot);
    if (values.file) form.append(APPLICATION_FIELDS.file, values.file, values.file.name);
    return form;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const invalid = validateApplication(values);
    if (Object.keys(invalid).length > 0) {
      setErrors(invalid);
      setStatus('error');
      setMessage(CLIENT_SUMMARY);
      focusFirstInvalid(invalid);
      return;
    }

    setErrors({});
    setStatus('submitting');
    setMessage('');
    const result = await submitJobApplication(buildFormData());

    if (result.ok) {
      setValues(EMPTY_VALUES);
      setHoneypot('');
      openTimer.current.restart();
      setStatus('success');
      setMessage(texts.successMessage);
    } else {
      // Sunucunun işaretlediği alanlar (yalnızca bilinen alan adları)
      const flagged: ApplicationErrors = {};
      for (const field of result.fields) {
        if (FIELD_ORDER.includes(field as keyof ApplicationValues)) {
          flagged[field as keyof ApplicationValues] = SERVER_FIELD_HINT;
        }
      }
      setErrors(flagged);
      setStatus('error');
      setMessage(result.message);
      // İşaretli alan varsa odak ona gider (mesaj role="alert" ile zaten duyurulur)
      const firstFlagged = FIELD_ORDER.find((key) => flagged[key]);
      if (firstFlagged) {
        pendingFocus.current = firstFlagged;
        return;
      }
    }
    showResult();
  };

  // Alan hatası varsa aria-describedby ile ilişkilendirilir
  const describe = (key: keyof ApplicationValues, ...extra: string[]) =>
    [...extra, errors[key] ? fid(`${key}-err`) : ''].filter(Boolean).join(' ') || undefined;

  const fieldError = (key: keyof ApplicationValues) =>
    errors[key] ? (
      <p id={fid(`${key}-err`)} className="field-error">
        {errors[key]}
      </p>
    ) : null;

  return (
    <form className="application-form card" onSubmit={handleSubmit} noValidate aria-busy={submitting}>
      <p className="application-required-note">
        <span aria-hidden="true">*</span> ile işaretli alanlar zorunludur.
      </p>

      <div className="application-grid">
        <div className="form-group">
          <label htmlFor={fid('name')}>
            Ad soyad <span className="required-mark" aria-hidden="true">*</span>
          </label>
          <input
            id={fid('name')}
            ref={setRef('candidateName')}
            className="form-control"
            type="text"
            value={values.candidateName}
            onChange={(e) => update('candidateName', e.target.value)}
            autoComplete="name"
            maxLength={120}
            disabled={submitting}
            aria-required="true"
            aria-invalid={errors.candidateName ? true : undefined}
            aria-describedby={describe('candidateName')}
          />
          {fieldError('candidateName')}
        </div>

        <div className="form-group">
          <label htmlFor={fid('email')}>
            E-posta <span className="required-mark" aria-hidden="true">*</span>
          </label>
          <input
            id={fid('email')}
            ref={setRef('email')}
            className="form-control"
            type="email"
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
            autoComplete="email"
            maxLength={254}
            disabled={submitting}
            aria-required="true"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describe('email')}
          />
          {fieldError('email')}
        </div>

        <div className="form-group">
          <label htmlFor={fid('phone')}>Telefon (isteğe bağlı)</label>
          <input
            id={fid('phone')}
            ref={setRef('phone')}
            className="form-control"
            type="tel"
            value={values.phone}
            onChange={(e) => update('phone', e.target.value)}
            autoComplete="tel"
            maxLength={30}
            disabled={submitting}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describe('phone')}
          />
          {fieldError('phone')}
        </div>

        <div className="form-group">
          <label htmlFor={fid('level')}>
            Deneyim seviyesi <span className="required-mark" aria-hidden="true">*</span>
          </label>
          <select
            id={fid('level')}
            ref={setRef('experienceLevel')}
            className="form-control"
            value={values.experienceLevel}
            onChange={(e) => update('experienceLevel', e.target.value)}
            disabled={submitting}
            aria-required="true"
            aria-invalid={errors.experienceLevel ? true : undefined}
            aria-describedby={describe('experienceLevel')}
          >
            <option value="">Seçiniz</option>
            {EXPERIENCE_LEVELS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {fieldError('experienceLevel')}
        </div>

        <div className="form-group">
          <label htmlFor={fid('linkedin')}>LinkedIn bağlantısı (isteğe bağlı)</label>
          <input
            id={fid('linkedin')}
            ref={setRef('linkedinUrl')}
            className="form-control"
            type="url"
            inputMode="url"
            placeholder="https://www.linkedin.com/in/..."
            value={values.linkedinUrl}
            onChange={(e) => update('linkedinUrl', e.target.value)}
            maxLength={300}
            disabled={submitting}
            aria-invalid={errors.linkedinUrl ? true : undefined}
            aria-describedby={describe('linkedinUrl')}
          />
          {fieldError('linkedinUrl')}
        </div>

        <div className="form-group">
          <label htmlFor={fid('github')}>GitHub bağlantısı (isteğe bağlı)</label>
          <input
            id={fid('github')}
            ref={setRef('githubUrl')}
            className="form-control"
            type="url"
            inputMode="url"
            placeholder="https://github.com/..."
            value={values.githubUrl}
            onChange={(e) => update('githubUrl', e.target.value)}
            maxLength={300}
            disabled={submitting}
            aria-invalid={errors.githubUrl ? true : undefined}
            aria-describedby={describe('githubUrl')}
          />
          {fieldError('githubUrl')}
        </div>
      </div>

      <fieldset
        className="application-fieldset"
        disabled={submitting}
        aria-describedby={describe('fieldsOfInterest')}
      >
        <legend>
          İlgi alanları <span className="required-mark" aria-hidden="true">*</span>
        </legend>
        <div className="application-checks">
          {FIELDS_OF_INTEREST.map((o, i) => (
            <label key={o.value} className="application-check">
              <input
                type="checkbox"
                ref={i === 0 ? setRef('fieldsOfInterest') : undefined}
                checked={values.fieldsOfInterest.includes(o.value)}
                onChange={() => toggleInterest(o.value)}
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
        {fieldError('fieldsOfInterest')}
      </fieldset>

      <div className="form-group">
        <label htmlFor={fid('file')}>
          CV (PDF, en fazla 5 MB) <span className="required-mark" aria-hidden="true">*</span>
        </label>
        <FileDropzone
          id={fid('file')}
          inputRef={setRef('file')}
          file={values.file}
          onChange={selectFile}
          disabled={submitting}
          invalid={Boolean(errors.file)}
          describedBy={describe('file')}
        />
        {fieldError('file')}
      </div>

      <div className="form-group">
        <div className="application-consent">
          <input
            id={fid('consent')}
            ref={setRef('consent')}
            type="checkbox"
            checked={values.consent}
            onChange={(e) => handleConsentChange(e.target.checked)}
            disabled={submitting}
            aria-required="true"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={describe('consent')}
          />
          <label htmlFor={fid('consent')}>{texts.consentText}</label>
        </div>
        {fieldError('consent')}
      </div>

      {/* Bot tuzağı (honeypot): insanlara ve ekran okuyuculara görünmez, klavyeyle erişilmez (inert + aria-hidden +
          tabIndex -1), otomatik doldurma kapalı. Ad CMS endpoint'i ile aynı ve bilerek anlamsızdır. */}
      <div className="application-hp" aria-hidden="true" inert>
        <label>
          Bu alanı boş bırakın
          <input
            type="text"
            name={APPLICATION_FIELDS.honeypot}
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            data-1p-ignore
            data-lpignore="true"
            data-form-type="other"
          />
        </label>
      </div>

      {(status === 'success' || status === 'error') && message && (
        <div
          ref={resultRef}
          tabIndex={-1}
          role={status === 'success' ? 'status' : 'alert'}
          className={`application-result ${status === 'success' ? 'is-success' : 'is-error'}`}
        >
          {status === 'success' ? (
            <CircleCheck size={20} aria-hidden="true" />
          ) : (
            <TriangleAlert size={20} aria-hidden="true" />
          )}
          <p>{message}</p>
        </div>
      )}

      <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 size={18} className="application-spinner" aria-hidden="true" />
            Gönderiliyor…
          </>
        ) : (
          <>
            <Send size={18} aria-hidden="true" />
            Başvuruyu Gönder
          </>
        )}
      </button>
      {privacyOpen && (
        <PrivacyModal paragraphs={texts.privacyParagraphs} onConfirm={confirmPrivacy} onCancel={closePrivacy} />
      )}
    </form>
  );
};
