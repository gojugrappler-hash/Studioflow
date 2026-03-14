/**
 * Google Calendar Integration
 * 
 * Provides two-way appointment sync with Google Calendar.
 * Requires: Same Google OAuth credentials as Drive (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET).
 * 
 * Status: SCAFFOLD — not active until OAuth credentials are configured.
 */

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees?: { email: string; displayName?: string }[];
  location?: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
}

interface CreateEventInput {
  summary: string;
  description?: string;
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
  timeZone?: string;
  attendeeEmails?: string[];
  location?: string;
}

export function isCalendarConfigured(): boolean {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

const CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

export async function listEvents(
  accessToken: string,
  timeMin: string,
  timeMax: string,
  calendarId = 'primary'
): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({
    timeMin,
    timeMax,
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '250',
  });
  const res = await fetch(`${CALENDAR_API}/calendars/${calendarId}/events?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to list calendar events');
  const data = await res.json();
  return data.items || [];
}

export async function createEvent(
  accessToken: string,
  input: CreateEventInput,
  calendarId = 'primary'
): Promise<CalendarEvent> {
  const event = {
    summary: input.summary,
    description: input.description,
    start: { dateTime: input.startTime, timeZone: input.timeZone || 'America/Chicago' },
    end: { dateTime: input.endTime, timeZone: input.timeZone || 'America/Chicago' },
    attendees: input.attendeeEmails?.map(email => ({ email })),
    location: input.location,
  };
  const res = await fetch(`${CALENDAR_API}/calendars/${calendarId}/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
  if (!res.ok) throw new Error('Failed to create calendar event');
  return res.json();
}

export async function updateEvent(
  accessToken: string,
  eventId: string,
  updates: Partial<CreateEventInput>,
  calendarId = 'primary'
): Promise<CalendarEvent> {
  const patch: Record<string, unknown> = {};
  if (updates.summary) patch.summary = updates.summary;
  if (updates.description) patch.description = updates.description;
  if (updates.startTime) patch.start = { dateTime: updates.startTime, timeZone: updates.timeZone || 'America/Chicago' };
  if (updates.endTime) patch.end = { dateTime: updates.endTime, timeZone: updates.timeZone || 'America/Chicago' };
  if (updates.attendeeEmails) patch.attendees = updates.attendeeEmails.map(email => ({ email }));
  if (updates.location) patch.location = updates.location;

  const res = await fetch(`${CALENDAR_API}/calendars/${calendarId}/events/${eventId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('Failed to update calendar event');
  return res.json();
}

export async function deleteEvent(
  accessToken: string,
  eventId: string,
  calendarId = 'primary'
): Promise<void> {
  const res = await fetch(`${CALENDAR_API}/calendars/${calendarId}/events/${eventId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to delete calendar event');
}
