export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  color: 'red' | 'blue';
  isNew?: boolean;
}

export interface CalendarDay {
  name: string;
  number: number;
  events: CalendarEvent[];
}
