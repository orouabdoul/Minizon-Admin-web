import { useState, useEffect, useCallback } from 'react';
import type { Conversation, ChatMessage, BroadcastTarget } from '../models/messaging.model';
import { messagingService } from '../services/messaging_service';

// ── Mock conversations ─────────────────────────────────────────────────────────

const MOCK: Conversation[] = [
  {
    id: 'c1', driverId: 'd1',
    driverName: 'Kofi Mensah', driverAvatar: 'https://placehold.co/40x40',
    driverPhone: '+229 97 45 67 89', driverStatus: 'en_trajet',
    activeTripId: '#TRJ-8472', priority: 'retard',
    lastMessage: 'Je viens de sortir de l\'embouteillage, j\'arrive bientôt',
    lastMessageAt: '2026-07-01T14:30:00', unreadCount: 1,
    messages: [
      { id: 'm1', conversationId: 'c1', sender: 'driver', content: 'Bonjour, je suis en retard à cause d\'un embouteillage sur la N1', sentAt: '2026-07-01T14:10:00', status: 'lu' },
      { id: 'm2', conversationId: 'c1', sender: 'admin',  content: 'Merci de nous avoir informé. Pouvez-vous estimer votre retard ?', sentAt: '2026-07-01T14:12:00', status: 'lu' },
      { id: 'm3', conversationId: 'c1', sender: 'driver', content: 'Environ 20 minutes, désolé pour la gêne occasionnée', sentAt: '2026-07-01T14:15:00', status: 'lu' },
      { id: 'm4', conversationId: 'c1', sender: 'admin',  content: 'D\'accord, nous informons votre passager. Conduisez prudemment.', sentAt: '2026-07-01T14:16:00', status: 'lu' },
      { id: 'm5', conversationId: 'c1', sender: 'driver', content: 'Je viens de sortir de l\'embouteillage, j\'arrive bientôt', sentAt: '2026-07-01T14:30:00', status: 'envoyé' },
    ],
  },
  {
    id: 'c2', driverId: 'd2',
    driverName: 'Adjovi Sèna', driverAvatar: 'https://placehold.co/40x40',
    driverPhone: '+229 96 78 90 12', driverStatus: 'en_trajet',
    activeTripId: '#TRJ-8471', priority: 'panne',
    lastMessage: 'Une assistance est en route, ETA 15 min. Restez avec vos passagers.',
    lastMessageAt: '2026-07-01T13:50:00', unreadCount: 0,
    messages: [
      { id: 'm6', conversationId: 'c2', sender: 'driver', content: 'Panne de carburant sur la route de Parakou, au niveau du km 45', sentAt: '2026-07-01T13:45:00', status: 'lu' },
      { id: 'm7', conversationId: 'c2', sender: 'admin',  content: 'Restez calme. Avez-vous des passagers avec vous ?', sentAt: '2026-07-01T13:47:00', status: 'lu' },
      { id: 'm8', conversationId: 'c2', sender: 'driver', content: 'Oui, 2 passagers. Nous sommes sur le côté de la route, tout va bien.', sentAt: '2026-07-01T13:48:00', status: 'lu' },
      { id: 'm9', conversationId: 'c2', sender: 'admin',  content: 'Une assistance est en route, ETA 15 min. Restez avec vos passagers.', sentAt: '2026-07-01T13:50:00', status: 'lu' },
    ],
  },
  {
    id: 'c3', driverId: 'd3',
    driverName: 'Adjoa Koffi', driverAvatar: 'https://placehold.co/40x40',
    driverPhone: '+229 95 12 34 56', driverStatus: 'en_ligne',
    priority: 'normal',
    lastMessage: 'Merci ! Je peux commencer à accepter des trajets maintenant ?',
    lastMessageAt: '2026-07-01T12:05:00', unreadCount: 1,
    messages: [
      { id: 'm10', conversationId: 'c3', sender: 'admin',  content: 'Bonjour Adjoa, votre vérification de documents a été approuvée ! Votre compte est maintenant actif.', sentAt: '2026-07-01T12:00:00', status: 'lu' },
      { id: 'm11', conversationId: 'c3', sender: 'driver', content: 'Merci ! Je peux commencer à accepter des trajets maintenant ?', sentAt: '2026-07-01T12:05:00', status: 'envoyé' },
    ],
  },
  {
    id: 'c4', driverId: 'd4',
    driverName: 'Jean-Baptiste Hounkpè', driverAvatar: 'https://placehold.co/40x40',
    driverPhone: '+229 94 56 78 90', driverStatus: 'hors_ligne',
    priority: 'normal',
    lastMessage: 'Parfait, j\'y serai à 07h00. Bonne journée !',
    lastMessageAt: '2026-07-01T10:15:00', unreadCount: 0,
    messages: [
      { id: 'm12', conversationId: 'c4', sender: 'admin',  content: 'Bonjour Jean-Baptiste, votre trajet de demain est confirmé : Cotonou → Parakou, départ 07h00. Soyez ponctuel.', sentAt: '2026-07-01T10:00:00', status: 'lu' },
      { id: 'm13', conversationId: 'c4', sender: 'driver', content: 'Parfait, j\'y serai à 07h00. Bonne journée !', sentAt: '2026-07-01T10:15:00', status: 'lu' },
    ],
  },
  {
    id: 'c5', driverId: 'd5',
    driverName: 'Yao Kobenan', driverAvatar: 'https://placehold.co/40x40',
    driverPhone: '+229 93 45 67 89', driverStatus: 'en_ligne',
    priority: 'normal',
    lastMessage: 'Bonjour, comment signaler un accident mineur sur l\'application ?',
    lastMessageAt: '2026-07-01T15:20:00', unreadCount: 1,
    messages: [
      { id: 'm14', conversationId: 'c5', sender: 'driver', content: 'Bonjour, comment signaler un accident mineur sur l\'application ?', sentAt: '2026-07-01T15:20:00', status: 'envoyé' },
    ],
  },
];

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK);
  const [selectedId,    setSelectedId]    = useState<string | null>('c1');
  const [loading,       setLoading]       = useState(false);
  const [sending,       setSending]       = useState(false);

  const selectedConversation = conversations.find((c) => c.id === selectedId) ?? null;
  const totalUnread          = conversations.reduce((s, c) => s + c.unreadCount, 0);

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    messagingService.getConversations()
      .then((res) => {
        const data = res.data.body;
        if (Array.isArray(data) && data.length > 0) setConversations(data);
      })
      .catch(() => { /* keep mock */ })
      .finally(() => setLoading(false));
  }, []);

  // ── 5-second polling ──────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      messagingService.getConversations()
        .then((res) => {
          const data = res.data.body;
          if (Array.isArray(data) && data.length > 0) setConversations(data);
        })
        .catch(() => {});
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // ── Select + mark as read ─────────────────────────────────────────────────
  const selectConversation = useCallback((id: string) => {
    setSelectedId(id);
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, unreadCount: 0 } : c));
    messagingService.markAsRead(id).catch(() => {});
  }, []);

  // ── Send message (optimistic) ─────────────────────────────────────────────
  const sendMessage = useCallback(async (content: string) => {
    if (!selectedId || !content.trim()) return;
    const msg: ChatMessage = {
      id:             `msg-${Date.now()}`,
      conversationId: selectedId,
      sender:         'admin',
      content:        content.trim(),
      sentAt:         new Date().toISOString(),
      status:         'envoyé',
    };
    setConversations((prev) => prev.map((c) =>
      c.id !== selectedId ? c : {
        ...c,
        messages:      [...c.messages, msg],
        lastMessage:   msg.content,
        lastMessageAt: msg.sentAt,
      }
    ));
    setSending(true);
    try {
      await messagingService.sendMessage(selectedId, content.trim());
    } catch { /* optimistic update already visible */ }
    finally { setSending(false); }
  }, [selectedId]);

  // ── Broadcast ─────────────────────────────────────────────────────────────
  const broadcastMessage = useCallback(async (content: string, target: BroadcastTarget) => {
    try {
      await messagingService.broadcast(content, target);
    } catch { /* silent — optimistic */ }
  }, []);

  return {
    conversations, selectedId, selectedConversation,
    totalUnread, loading, sending,
    selectConversation, sendMessage, broadcastMessage,
  };
}
