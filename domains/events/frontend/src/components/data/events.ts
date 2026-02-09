export type EventStatus = 'UPCOMING' | 'ONGOING' | 'PAST';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  manager: string;
  image: string;
  status: EventStatus;
}

export const events: Event[] = [
  {
    id: 1,
    title: 'Quarterly Product Strategy Sync',
    description: 'Deep dive into the Q4 roadmap and alignment on key product initiatives.',
    date: 'Oct 12, 2023 • 10:00 AM',
    manager: 'Sarah Jenkins',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
    status: 'UPCOMING',
  },
  {
    id: 2,
    title: 'Marketing Alignment Workshop',
    description: 'Interactive session to synchronize brand messaging across all digital channels.',
    date: 'Oct 14, 2023 • 02:00 PM',
    manager: 'David Chen',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
    status: 'ONGOING',
  },
];
