/**
 * Interface for DateTime information
 */
export interface DateTime {
  dateTime?: string; // ISO format date-time
  timeZone?: string; // Time zone identifier
}

/**
 * Interface for Attendee information
 */
export interface Attendee {
  email: string;
  displayName?: string;
  responseStatus?: "needsAction" | "declined" | "tentative" | "accepted";
  optional?: boolean;
}

/**
 * Interface for Reminders configuration
 */
export interface Reminders {
  useDefault?: boolean;
  overrides?: {
    method: "email" | "popup";
    minutes: number;
  }[];
}

/**
 * Interface for creating calendar events
 */
export interface CreateEvent {
  /**
   * Brief summary/title of the event
   */
  summary: string;

  /**
   * Detailed description of the event
   */
  description?: string;

  /**
   * Physical location of the event
   */
  location?: string;

  /**
   * Start time information
   */
  start: DateTime;

  /**
   * End time information
   */
  end: DateTime;

  /**
   * List of event attendees
   */
  attendees?: Attendee[];

  /**
   * Controls who receives notifications about event updates
   */
  sendUpdates?: "all" | "externalOnly" | "none";

  /**
   * Event reminder configuration
   */
  reminders?: Reminders;
}

/**
 * Interface for updating calendar events
 * Makes all properties from CreateEvent optional
 */
export interface UpdateEvent {
  /**
   * Brief summary/title of the event
   */
  summary?: string;

  /**
   * Detailed description of the event
   */
  description?: string;

  /**
   * Physical location of the event
   */
  location?: string;

  /**
   * Start time information
   */
  start?: DateTime;

  /**
   * End time information
   */
  end?: DateTime;

  /**
   * List of event attendees
   */
  attendees?: Attendee[];

  /**
   * Controls who receives notifications about event updates
   */
  sendUpdates?: "all" | "externalOnly" | "none";

  /**
   * Event reminder configuration
   */
  reminders?: Reminders;
}

/**
 * Interface representing a simplified calendar event.
 */
export interface SimplifiedEvent {
  /**
   * Unique identifier for the event.
   */
  id: string;

  /**
   * Title of the event.
   */
  title: string;

  /**
   * Summary or description of the event.
   */
  summary: string;

  /**
   * Start time information of the event.
   */
  start: {
    /**
     * ISO format date-time for the event to start.
     */
    dateTime: string;
  };

  /**
   * End time information of the event.
   */
  end: {
    /**
     * ISO format date-time for the event end.
     */
    dateTime: string;
  };

  /**
   * Color associated with the event.
   */
  color: string;
  status?: string;
  defaultResourcePrice?: number;
  clients?: string[];
  googleEventId: string;
  calendarId: string;
  resourceId: string;
}
