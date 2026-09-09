/* ==========================================================================
   Event Countdown Timer & Calendar Export (.ICS & Google Calendar)
   ========================================================================== */

(function () {
  // Set next meetup: dynamically 5 days ahead at 14:00, or a specified date
  const now = new Date();
  const nextMeetupDate = new Date();
  nextMeetupDate.setDate(now.getDate() + 4);
  nextMeetupDate.setHours(14, 0, 0, 0);

  function updateCountdown() {
    const current = new Date().getTime();
    const target = nextMeetupDate.getTime();
    const diff = target - current;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-minutes').textContent = '00';
      document.getElementById('cd-seconds').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    const elDays = document.getElementById('cd-days');
    const elHours = document.getElementById('cd-hours');
    const elMins = document.getElementById('cd-minutes');
    const elSecs = document.getElementById('cd-seconds');

    if (elDays) elDays.textContent = pad(days);
    if (elHours) elHours.textContent = pad(hours);
    if (elMins) elMins.textContent = pad(minutes);
    if (elSecs) elSecs.textContent = pad(seconds);
  }

  // Calendar Export (.ics)
  function downloadICS() {
    const startStr = nextMeetupDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDate = new Date(nextMeetupDate.getTime() + 3 * 60 * 60 * 1000); // 3 hours duration
    const endStr = endDate.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//localhostusak//Community Meetup//TR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      'SUMMARY:localhostusak Buluşması #3',
      'DESCRIPTION:Uşak teknoloji ve tasarım topluluğu buluşması. Kahveni al, laptopunu getir!',
      'LOCATION:Coff The Story / Treehouse Cafe, Uşak',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'localhostusak-bulusma.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Google Calendar URL Generator
  function openGoogleCalendar() {
    const startStr = nextMeetupDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDate = new Date(nextMeetupDate.getTime() + 3 * 60 * 60 * 1000);
    const endStr = endDate.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=localhostusak+Bulu%C5%9Fmas%C4%B1+%233&dates=${startStr}/${endStr}&details=U%C5%9Fak+teknoloji+ve+tasar%C4%B1m+toplulu%C4%9Fu+bulu%C5%9Fmas%C4%B1.+Kahveni+al,+laptopunu+getir!&location=Coff+The+Story,+U%C5%9Fak`;
    window.open(url, '_blank');
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    setInterval(updateCountdown, 1000);

    const btnIcs = document.getElementById('btn-add-calendar');
    if (btnIcs) {
      btnIcs.addEventListener('click', (e) => {
        e.preventDefault();
        downloadICS();
      });
    }

    const btnGoogleCal = document.getElementById('btn-google-calendar');
    if (btnGoogleCal) {
      btnGoogleCal.addEventListener('click', (e) => {
        e.preventDefault();
        openGoogleCalendar();
      });
    }
  });
})();
