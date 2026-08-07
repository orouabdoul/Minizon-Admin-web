export type DriverStatus     = 'en_ligne' | 'hors_ligne' | 'en_trajet';
export type UserRole         = 'driver' | 'passenger';
export type MessageSender    = 'admin' | 'user';
export type MessageStatus    = 'envoyé' | 'lu';
export type ConvPriority     = '' | 'normal' | 'retard' | 'panne' | 'urgence';
export type BroadcastTarget  = 'tous' | 'tous_conducteurs' | 'tous_passagers' | 'en_ligne' | 'en_trajet';
export type ConvStatusFilter = 'tous' | 'en_ligne' | 'en_trajet' | 'hors_ligne';
export type RoleFilter       = 'all' | 'driver' | 'passenger';

export interface ChatMessage {
  id:              string;
  conversationId?: string;
  sender:          MessageSender;
  content:         string;
  sentAt:          string;
  status:          MessageStatus;
}

export interface Conversation {
  driverName: string | undefined;
  driverAvatar: string | undefined;
  id:            string;
  userId?:       string;
  name:          string;
  avatar:        string;
  phone:         string;
  role:          UserRole;
  roleLabel:     string;
  driverStatus?: DriverStatus;
  activeTripId?: string;
  priority?:     ConvPriority;
  lastMessage:   string;
  lastMessageAt: string;
  unreadCount:   number;
  messages?:     ChatMessage[];
}

export interface UserSearchResult {
  uuid:             string;
  name:             string;
  phone:            string;
  avatar:           string;
  role:             UserRole;
  roleLabel:        string;
  conversationUuid: string | null;
}

export interface StartConvResult {
  conversation: Conversation;
  messages:     ChatMessage[];
  created:      boolean;
}

export interface BroadcastResult {
  sent_to: number;
  target:  string;
}

export interface ConversationsBody {
  conversations: Conversation[];
  totalUnread:   number;
}
