import React, { useState, useEffect } from 'react';

interface FloatingCTAProps {
  whatsappUrl?: string;
  label?: string;
}

export const FloatingCTA: React.FC<FloatingCTAProps> = ({
  whatsappUrl = 'https://chat.whatsapp.com/',
  label = "WhatsApp'a Katıl",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if user has scrolled past initial hero area (e.g. > 380px)
      const scrolledPastHero = scrollY > 380;

      // Check if BigCTA is currently in view
      const ctaSection = document.getElementById('cta');
      let isCtaVisible = false;
      if (ctaSection) {
        const rect = ctaSection.getBoundingClientRect();
        // If the top of the CTA section is within or above the viewport bottom
        if (rect.top < windowHeight - 80 && rect.bottom > 0) {
          isCtaVisible = true;
        }
      }

      // Check if near very bottom of page (footer)
      const isNearBottom = scrollY + windowHeight >= documentHeight - 120;

      if (scrolledPastHero && !isCtaVisible && !isNearBottom) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`floating-cta ${isVisible ? 'visible' : ''}`}
      id="floating-whatsapp-btn"
      aria-label="WhatsApp'tan Topluluğa Katıl"
    >
      <span className="floating-cta-icon">💬</span>
      <span>{label}</span>
    </a>
  );
};

