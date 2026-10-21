// "Form açık kalma süresi" sayacı (bot koruması). Süre, formun İLK AÇILDIĞI andan itibaren sayılır;
// form kapalıyken (ya da hiç açılmamışken) geçen süre sayılmaz. Bağımlılığı yoktur: saat dışarıdan verilir
// (tarayıcıda performance.now(); cihaz saatinden bağımsız), böylece birim test edilebilir.
export interface OpenTimer {
  /** Formun açıldığını bildirir. Yalnızca İLK çağrı sayar; yeniden açmak süreyi sıfırlamaz. */
  markOpened(): void;
  /** Süreyi şimdiye taşır (başarılı gönderim sonrası form temizlenince). Açılmamışsa etkisizdir. */
  restart(): void;
  /** Açılıştan bu yana geçen ms; hiç açılmadıysa 0. */
  elapsedMs(): number;
}

export const createOpenTimer = (now: () => number): OpenTimer => {
  let openedAt: number | null = null;
  return {
    markOpened() {
      if (openedAt === null) openedAt = now();
    },
    restart() {
      if (openedAt !== null) openedAt = now();
    },
    elapsedMs() {
      return openedAt === null ? 0 : Math.max(0, Math.round(now() - openedAt));
    },
  };
};
