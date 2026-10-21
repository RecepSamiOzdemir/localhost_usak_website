// Çalıştırma: node --experimental-strip-types --test tests/openTimer.test.ts (Node 22+, ek paket yok)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createOpenTimer } from '../src/utils/openTimer.ts';

const fakeClock = () => {
  let t = 1000; // sayfa yüklendiği an
  return { now: () => t, advance: (ms: number) => (t += ms) };
};

test('form kapalıyken geçen süre sayılmaz', () => {
  const c = fakeClock();
  const timer = createOpenTimer(c.now);
  c.advance(60_000); // sayfa açık, form kapalı
  assert.equal(timer.elapsedMs(), 0);
});

test('süre formun açıldığı andan başlar, sayfa yüklenmesinden değil', () => {
  const c = fakeClock();
  const timer = createOpenTimer(c.now);
  c.advance(60_000); // kullanıcı 1 dk sayfada gezindi
  timer.markOpened();
  c.advance(4_000); // butona basıp 4 sn'de doldurdu
  assert.equal(timer.elapsedMs(), 4_000);
});

test('hızlı doldurma (3 sn altı) açılıştan itibaren ölçülür', () => {
  const c = fakeClock();
  const timer = createOpenTimer(c.now);
  c.advance(120_000);
  timer.markOpened();
  c.advance(1_500);
  assert.ok(timer.elapsedMs() < 3_000);
});

test('kapatıp yeniden açmak süreyi sıfırlamaz (yarım dolu formu geri açan kullanıcı bot sayılmaz)', () => {
  const c = fakeClock();
  const timer = createOpenTimer(c.now);
  timer.markOpened();
  c.advance(30_000);
  timer.markOpened(); // kapat → aç
  assert.equal(timer.elapsedMs(), 30_000);
});

test('başarılı gönderimden sonra restart süreyi şimdiye taşır; açılmamışsa etkisizdir', () => {
  const c = fakeClock();
  const timer = createOpenTimer(c.now);
  timer.restart();
  c.advance(5_000);
  assert.equal(timer.elapsedMs(), 0);
  timer.markOpened();
  c.advance(10_000);
  timer.restart();
  c.advance(2_000);
  assert.equal(timer.elapsedMs(), 2_000);
});
