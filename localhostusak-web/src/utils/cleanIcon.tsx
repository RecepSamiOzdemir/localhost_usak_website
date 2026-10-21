import React from 'react';
import {
  Heart,
  Rocket,
  Coffee,
  Lightbulb,
  Cpu,
  Code,
  Globe,
  FileText,
  Target,
  Network,
  Users,
  Sparkles,
  Zap,
} from 'lucide-react';

export const renderCleanIcon = (icon: unknown, size = 28): React.ReactNode => {
  if (React.isValidElement(icon)) return icon;
  if (typeof icon !== 'string') {
    return <Sparkles size={size} style={{ color: 'var(--accent-primary)' }} />;
  }

  const clean = icon.trim();
  switch (clean) {
    case '🧡':
    case 'heart':
      return <Heart size={size} style={{ color: 'var(--accent-primary)' }} />;
    case '🚀':
    case 'rocket':
      return <Rocket size={size} style={{ color: 'var(--accent-primary)' }} />;
    case '☕':
    case 'coffee':
      return <Coffee size={size} style={{ color: 'var(--accent-primary)' }} />;
    case '💡':
    case 'lightbulb':
      return <Lightbulb size={size} style={{ color: 'var(--accent-primary)' }} />;
    case '⚙️':
    case '⚙':
    case 'gear':
    case 'settings':
      return <Cpu size={size} style={{ color: 'var(--accent-primary)' }} />;
    case '</>':
    case '< />':
    case 'code':
      return <Code size={size} style={{ color: 'var(--accent-primary)' }} />;
    case '🌍':
    case 'globe':
      return <Globe size={size} style={{ color: 'var(--accent-primary)' }} />;
    case '📄':
    case 'file':
      return <FileText size={size} style={{ color: 'var(--accent-primary)' }} />;
    case '🎯':
    case 'target':
      return <Target size={size} style={{ color: 'var(--accent-primary)' }} />;
    case '🌐':
    case 'network':
      return <Network size={size} style={{ color: 'var(--accent-primary)' }} />;
    case '🤝':
    case 'handshake':
      return <Users size={size} style={{ color: 'var(--accent-primary)' }} />;
    case '⚡':
    case 'zap':
      return <Zap size={size} style={{ color: 'var(--accent-primary)' }} />;
    default:
      // If it contains emoji or non-standard characters, fallback to a clean icon
      if (/[\uD800-\uDFFF]/.test(clean)) {
        return <Sparkles size={size} style={{ color: 'var(--accent-primary)' }} />;
      }
      return <Code size={size} style={{ color: 'var(--accent-primary)' }} />;
  }
};
