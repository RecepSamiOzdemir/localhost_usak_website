/**
 * Developer Console Easter Egg
 * Konsolu açan geliştiricilere ve meraklılara özel karşılama mesajı ve topluluk daveti.
 */

export function initConsoleEasterEgg(): void {
  if (typeof window === 'undefined') return;

  const asciiArt = `
  _                 _ _               _   [ u ş a k ]
 | |               | | |             | |  
 | | ___   ___ __ _| | |__   ___  ___| |_ 
 | |/ _ \\ / __/ _\` | | '_ \\ / _ \\/ __| __|
 | | (_) | (_| (_| | | | | | (_) \\__ \\ |_ 
 |_|\\___/ \\___\\__,_|_|_| |_|\\___/|___/\\__|
`;

  const bannerStyle = [
    'color: #00f3ff',
    'background: #0d1117',
    'font-family: monospace',
    'font-weight: bold',
    'font-size: 11px',
    'line-height: 1.2',
  ].join(';');

  const titleBadgeStyle = [
    'background: linear-gradient(135deg, #00f3ff, #ff0055)',
    'color: #ffffff',
    'font-size: 14px',
    'font-weight: 800',
    'padding: 6px 12px',
    'border-radius: 6px',
    'font-family: system-ui, -apple-system, sans-serif',
    'text-shadow: 0 1px 3px rgba(0,0,0,0.5)',
  ].join(';');

  const quoteStyle = [
    'color: #ffaa00',
    'font-size: 13px',
    'font-weight: bold',
    'background: #1a1a24',
    'padding: 8px 12px',
    'border-left: 4px solid #ffaa00',
    'border-radius: 0 6px 6px 0',
    'font-family: system-ui, -apple-system, sans-serif',
    'display: inline-block',
  ].join(';');

  const bodyStyle = [
    'color: #94a3b8',
    'font-size: 12px',
    'line-height: 1.7',
    'font-family: system-ui, -apple-system, sans-serif',
  ].join(';');

  console.log(`%c${asciiArt}`, bannerStyle);
  console.log('%c"Konsolu kurcalamak yerine topluluğa katılabilirsin ^^"', quoteStyle);


  // Konsoldan doğrudan çağrılabilen bonus fonksiyon
  try {
    (window as unknown as { topluluk?: () => string }).topluluk = () => {
      window.open('https://chat.whatsapp.com/G4lE8B7s1h696jM7q5hUfR', '_blank');
      return '🚀 WhatsApp grubuna yönlendiriliyorsun... Hoş geldin! 🎉';
    };
  } catch {
    // Tarayıcı güvenlik kısıtlaması durumunda sessizce geç
  }
}
