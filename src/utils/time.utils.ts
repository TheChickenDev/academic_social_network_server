export const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (!isFinite(diffInSeconds)) {
    return 'just now';
  }

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];

  const interval = intervals.find((i) => i.seconds <= diffInSeconds);
  if (!interval) {
    return 'just now';
  }

  const count = Math.floor(diffInSeconds / interval.seconds);
  if (!isFinite(count)) {
    return 'just now';
  }

  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    -count,
    interval.label as Intl.RelativeTimeFormatUnit
  );
};
