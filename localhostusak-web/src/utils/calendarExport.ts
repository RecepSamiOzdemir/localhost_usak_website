/* ==========================================================================
   Calendar Export (.ICS & Google Calendar) Helper Utilities
   ========================================================================== */

interface CalendarEventParams {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  durationHours?: number;
}

export function downloadICS({
  title,
  description,
  location,
  startDate,
  durationHours = 3,
}: CalendarEventParams) {
  const startStr = startDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
  const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);
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
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '-')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function openGoogleCalendar({
  title,
  description,
  location,
  startDate,
  durationHours = 3,
}: CalendarEventParams) {
  const startStr = startDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
  const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);
  const endStr = endDate.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${startStr}/${endStr}&details=${encodeURIComponent(
    description
  )}&location=${encodeURIComponent(location)}`;

  window.open(url, '_blank');
}
