export type DriverStatus    = 'en_ligne' | 'hors_ligne' | 'en_trajet';
export type MessageSender   = 'admin' | 'driver';
export type MessageStatus   = 'envoyé' | 'lu';
export type ConvPriority    = 'normal' | 'retard' | 'panne' | 'urgence';
export type BroadcastTarget = 'tous' | 'en_ligne' | 'en_trajet';

export interface ChatMessage {
  id:             string;
  conversationId: string;
  sender:         MessageSender;
  content:        string;
  sentAt:         string;
  status:         MessageStatus;
}

export interface Conversation {
  id:            string;
  driverId:      string;
  driverName:    string;
  driverAvatar:  string;
  driverPhone:   string;
  driverStatus:  DriverStatus;
  activeTripId?: string;
  priority:      ConvPriority;
  lastMessage:   string;
  lastMessageAt: string;
  unreadCount:   number;
  messages:      ChatMessage[];
}
