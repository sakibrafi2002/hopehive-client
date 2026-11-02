export interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  /** YYYY-MM-DD */
  eventDate: string;
  creatorEmail: string;
  creatorName: string;
  participantCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface JoinedEventItem {
  _id: string;
  eventId: string;
  userEmail: string;
  userName: string;
  joinedAt: string;
  title: string;
  thumbnail: string;
  eventType: string;
  location: string;
  eventDate: string;
}

/** The small shape EventCard needs, so one card can show created, joined and public events. */
export interface CardEvent {
  id: string;
  title: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  organizer?: string;
  participantCount?: number;
}

export const toCardEvent = (event: EventItem): CardEvent => ({
  id: event._id,
  title: event.title,
  eventType: event.eventType,
  thumbnail: event.thumbnail,
  location: event.location,
  eventDate: event.eventDate,
  organizer: event.creatorName,
  participantCount: event.participantCount,
});

export const joinedToCardEvent = (item: JoinedEventItem): CardEvent => ({
  id: item.eventId,
  title: item.title,
  eventType: item.eventType,
  thumbnail: item.thumbnail,
  location: item.location,
  eventDate: item.eventDate,
});
