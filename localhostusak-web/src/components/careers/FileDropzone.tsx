import React, { useState } from 'react';
import { FileText, Upload, X } from 'lucide-react';
import { formatFileSize } from '../../utils/applicationForm';

interface FileDropzoneProps {
  id: string;
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  invalid?: boolean;
  // Ek açıklama/hata öğelerinin id'leri (aria-describedby)
  describedBy?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

// Yeni paket kullanmadan: gerçek <input type="file"> (klavye + ekran okuyucu) + native sürükle-bırak.
// Girdi görsel olarak gizlidir ama odaklanabilir; odak halkası etikete çizilir.
export const FileDropzone: React.FC<FileDropzoneProps> = ({
  id,
  file,
  onChange,
  disabled = false,
  invalid = false,
  describedBy,
  inputRef,
}) => {
  const [dragging, setDragging] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files?.[0] ?? null);
    // Aynı dosya kaldırılıp yeniden seçilebilsin
    e.target.value = '';
  };

  const stop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    stop(e);
    setDragging(false);
    if (disabled) return;
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onChange(dropped);
  };

  return (
    <div
      className={`dropzone${dragging ? ' is-dragging' : ''}${invalid ? ' is-invalid' : ''}${disabled ? ' is-disabled' : ''}`}
      onDragEnter={(e) => {
        stop(e);
        if (!disabled) setDragging(true);
      }}
      onDragOver={stop}
      onDragLeave={(e) => {
        stop(e);
        // Çocuk öğelere geçişte titremesin
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
      }}
      onDrop={handleDrop}
    >
      <input
        id={id}
        ref={inputRef}
        type="file"
        className="dropzone-input"
        accept="application/pdf,.pdf"
        onChange={handleInput}
        disabled={disabled}
        aria-required="true"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
      />
      {/* Fare/dokunma hedefi; erişilebilir ad ve açıklama girdinin kendi etiketinden gelir */}
      <label htmlFor={id} className="dropzone-label" aria-hidden="true">
        <Upload size={28} aria-hidden="true" />
        <span className="dropzone-title">
          PDF dosyanızı buraya bırakın veya <span className="dropzone-link">dosya seçin</span>
        </span>
      </label>

      {file && (
        <div className="dropzone-file">
          <FileText size={18} aria-hidden="true" />
          <span className="dropzone-file-name">{file.name}</span>
          <span className="dropzone-file-size">{formatFileSize(file.size)}</span>
          <button
            type="button"
            className="dropzone-remove"
            onClick={() => onChange(null)}
            disabled={disabled}
            aria-label={`Seçilen dosyayı kaldır: ${file.name}`}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};
