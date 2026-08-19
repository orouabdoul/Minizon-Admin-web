import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  Conversation, ChatMessage, BroadcastTarget, BroadcastResult,
  ConvStatusFilter, RoleFilter, UserSearchResult, SendToSelectedResult,
  AttachmentType,
} from '../models/messaging.model';
import { messagingService } from '../services/messaging_service';
import { env } from '../config/env';

// Resolve a relative storage path to a full URL
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function resolveUrl(path: any): string {
  if (!path) return '';
  const s = String(path);
  if (/^https?:\/\//.test(s)) return s;
  if (s.startsWith('/')) return `${env.baseUrl}${s}`;
  return `${env.baseUrl}/${s}`;
}

// Normalize a raw API message into ChatMessage — handles multiple backend field conventions:
//   1. Nested attachment object:         { attachment: { url, type } }
//   2. Flat audio_url:                   { audio_url: '...' }
//   3. Flat file_url + file_type:        { file_url: '...', file_type: 'audio' }
//   4. Laravel $fillable flat fields:    { attachment_path, attachment_type|message_type|is_voice_message }
//   5. Raw URL in content:               { content: 'https://.../file.webm' }
// Also normalises content: null → '' and handles body/message aliases from different endpoints.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeMessage(m: any): ChatMessage {
  // Backend aliases: content / body / message depending on which endpoint responded
  const textContent: string = m.content ?? m.body ?? m.message ?? '';
  const base = { ...m, content: textContent };

  // 1. Nested attachment object — resolve URL in case it's relative, respect is_voice_message for type
  if (m.attachment?.url) {
    const type: AttachmentType =
      (m.is_voice_message || m.message_type === 'audio') ? 'audio' :
      (m.attachment.type as AttachmentType) ?? 'document';
    return { ...base, attachment: { url: resolveUrl(m.attachment.url), type } };
  }

  // 2. Flat audio_url
  if (m.audio_url)
    return { ...base, attachment: { url: resolveUrl(m.audio_url), type: 'audio' as AttachmentType } };

  // 3. Flat file_url + file_type
  if (m.file_url && m.file_type)
    return { ...base, attachment: { url: resolveUrl(m.file_url), type: m.file_type as AttachmentType } };

  // 4. Laravel $fillable: attachment_path with type from is_voice_message / attachment_type / message_type
  if (m.attachment_path) {
    const type: AttachmentType =
      m.is_voice_message            ? 'audio'    :
      m.attachment_type             ? (m.attachment_type as AttachmentType) :
      m.message_type === 'audio'    ? 'audio'    :
      m.message_type === 'image'    ? 'image'    :
      m.message_type === 'document' ? 'document' :
      'document'; // safe fallback — not 'image' to avoid silent render failure on audio
    return { ...base, content: textContent, attachment: { url: resolveUrl(m.attachment_path), type } };
  }

  // 5. Fallback: content is a bare URL pointing to a media file
  if (textContent && /\.(mp3|ogg|wav|webm|m4a|aac|mpeg|mp4)(\?.*)?$/i.test(textContent))
    return { ...base, content: '', attachment: { url: textContent, type: 'audio' as AttachmentType } };
  if (textContent && /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(textContent))
    return { ...base, content: '', attachment: { url: textContent, type: 'image' as AttachmentType } };

  // 6. Backend signalled audio (is_voice_message/message_type) but sent no URL at all.
  //    This means formatAdminMessage() is not including attachment_path in its output.
  //    Show a visible placeholder so the bubble doesn't silently disappear.
  if (m.is_voice_message || m.message_type === 'audio') {
    // eslint-disable-next-line no-console
    console.warn('[normalizeMessage] audio message has no URL — backend is missing attachment_path in response. Full message:', JSON.stringify(m));
    return { ...base, content: '🎤 Message vocal' };
  }

  return base as ChatMessage;
}

const POLL_MS = 10_000;

// ── Helpers ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractConversations(raw: any): { conversations: Conversation[]; totalUnread: number } | null {
  const body = raw?.body ?? raw;
  if (!body) return null;
  if (Array.isArray(body.conversations))
    return { conversations: body.conversations, totalUnread: body.totalUnread ?? 0 };
  if (Array.isArray(body))
    return { conversations: body, totalUnread: 0 };
  if (Array.isArray(body.data))
    return { conversations: body.data, totalUnread: body.totalUnread ?? 0 };
  return null;
}

function mergeConversations(apiList: Conversation[], prev: Conversation[]): Conversation[] {
  return apiList.map((c) => {
    const cached = prev.find((p) => p.id === c.id);
    return {
      ...c,
      // Normalise null lastMessage (audio msgs have no text body)
      lastMessage: c.lastMessage ?? '',
      messages:    cached?.messages ?? c.messages,
    };
  });
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useMessaging() {
  const [conversations,   setConversations]   = useState<Conversation[]>([]);
  const [totalUnread,     setTotalUnread]      = useState(0);
  const [selectedId,      setSelectedId]       = useState<string | null>(null);
  const [roleFilter,      setRoleFilter]       = useState<RoleFilter>('all');
  const [statusFilter,    setStatusFilter]     = useState<ConvStatusFilter>('tous');
  const [loading,         setLoading]          = useState(true);
  const [loadingMessages, setLoadingMessages]  = useState(false);
  const [sending,         setSending]          = useState(false);
  const [error,           setError]            = useState<string | null>(null);
  const [broadcastResult, setBroadcastResult]  = useState<BroadcastResult | null>(null);
  const [broadcastError,  setBroadcastError]   = useState<string | null>(null);

  // User search for new conversation
  const [userSearchResults, setUserSearchResults] = useState<UserSearchResult[]>([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [startingConv,      setStartingConv]      = useState(false);

  const filtersRef     = useRef({ role: roleFilter, status: statusFilter });
  const selectedIdRef  = useRef<string | null>(null);
  const refreshMsgRef  = useRef<((id: string) => Promise<void>) | null>(null);

  useEffect(() => { filtersRef.current = { role: roleFilter, status: statusFilter }; }, [roleFilter, statusFilter]);
  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);

  const selectedConversation = conversations.find((c) => c.id === selectedId) ?? null;

  // ── Fetch list ─────────────────────────────────────────────────────────────

  const fetchConversations = useCallback((role: RoleFilter, status: ConvStatusFilter, silent = false) => {
    return messagingService.getConversations({
      ...(role   !== 'all'  ? { role }   : {}),
      ...(status !== 'tous' ? { status } : {}),
    })
      .then((res) => {
        const extracted = extractConversations(res.data);
        if (!extracted) { if (!silent) setError('Format de réponse inattendu.'); return; }
        setError(null);
        setConversations((prev) => {
          if (silent) {
            const selId = selectedIdRef.current;
            const prevC = selId ? prev.find((c) => c.id === selId) : null;
            const newC  = selId ? extracted.conversations.find((c) => c.id === selId) : null;
            if (prevC && newC && newC.lastMessageAt !== prevC.lastMessageAt)
              setTimeout(() => refreshMsgRef.current?.(selId!), 0);
          }
          return mergeConversations(extracted.conversations, prev);
        });
        setTotalUnread(extracted.totalUnread);
      })
      .catch(() => { if (!silent) setError('Impossible de charger les conversations.'); });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchConversations(roleFilter, statusFilter).finally(() => setLoading(false));
  }, [roleFilter, statusFilter, fetchConversations]);

  useEffect(() => {
    const id = setInterval(
      () => fetchConversations(filtersRef.current.role, filtersRef.current.status, true),
      POLL_MS,
    );
    return () => clearInterval(id);
  }, [fetchConversations]);

  // ── Select conversation ────────────────────────────────────────────────────

  const selectConversation = useCallback(async (id: string) => {
    setSelectedId(id);
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, unreadCount: 0 } : c));
    setTotalUnread((n) => {
      const conv = conversations.find((c) => c.id === id);
      return Math.max(0, n - (conv?.unreadCount ?? 0));
    });

    const alreadyLoaded = conversations.find((c) => c.id === id)?.messages !== undefined;
    if (alreadyLoaded) return;

    setLoadingMessages(true);
    try {
      const res = await messagingService.openConversation(id);
      const raw  = res.data as any;
      const body = raw?.body ?? raw;
      const conv     = body?.conversation ?? {};
      const messages: ChatMessage[] = (body?.messages ?? []).map(normalizeMessage);
      setConversations((prev) => prev.map((c) =>
        c.id === id ? { ...c, ...conv, messages, unreadCount: 0 } : c
      ));
    } catch { /* keep visible without messages */ }
    finally { setLoadingMessages(false); }
  }, [conversations]);

  const refreshMessages = useCallback(async (id: string) => {
    setLoadingMessages(true);
    try {
      const res = await messagingService.openConversation(id);
      const raw  = res.data as any;
      const body = raw?.body ?? raw;
      const conv     = body?.conversation ?? {};
      const messages: ChatMessage[] = (body?.messages ?? []).map(normalizeMessage);
      setConversations((prev) => prev.map((c) =>
        c.id === id ? { ...c, ...conv, messages, unreadCount: 0 } : c
      ));
    } catch { /* keep existing */ }
    finally { setLoadingMessages(false); }
  }, []);
  refreshMsgRef.current = refreshMessages;

  // ── Send message (optimistic) ──────────────────────────────────────────────

  const sendMessage = useCallback(async (content: string) => {
    if (!selectedId || !content.trim()) return;
    const tempId = `temp-${Date.now()}`;
    const tempMsg: ChatMessage = {
      id:             tempId,
      conversationId: selectedId,
      sender:         'admin',
      content:        content.trim(),
      sentAt:         new Date().toISOString(),
      status:         'envoyé',
    };
    setConversations((prev) => prev.map((c) =>
      c.id !== selectedId ? c : {
        ...c,
        messages:      [...(c.messages ?? []), tempMsg],
        lastMessage:   tempMsg.content,
        lastMessageAt: tempMsg.sentAt,
      }
    ));
    setSending(true);
    try {
      const res = await messagingService.sendMessage(selectedId, content.trim());
      const raw     = res.data as any;
      const realMsg = raw?.body?.message ?? raw?.message;
      if (realMsg) {
        setConversations((prev) => prev.map((c) =>
          c.id !== selectedId ? c : {
            ...c,
            messages: (c.messages ?? []).map((m) => m.id === tempId ? normalizeMessage(realMsg) : m),
          }
        ));
      }
    } catch { /* optimistic stays */ }
    finally { setSending(false); }
  }, [selectedId]);

  // ── Search users for new conversation ─────────────────────────────────────

  const searchUsersForNew = useCallback(async (q: string, role: RoleFilter = 'all') => {
    if (!q.trim()) { setUserSearchResults([]); return; }
    setUserSearchLoading(true);
    try {
      const res = await messagingService.searchUsers(q, role);
      const raw = res.data as any;
      setUserSearchResults(raw?.body ?? raw ?? []);
    } catch { setUserSearchResults([]); }
    finally { setUserSearchLoading(false); }
  }, []);

  const clearUserSearch = useCallback(() => setUserSearchResults([]), []);

  // ── Start new conversation ─────────────────────────────────────────────────

  const startNewConversation = useCallback(async (
    userUuid: string,
    firstMessage?: string,
  ): Promise<string | null> => {
    setStartingConv(true);
    try {
      const res  = await messagingService.startConversation(userUuid, firstMessage);
      const raw  = res.data as any;
      const body = raw?.body ?? raw;
      const conv: Conversation       = body.conversation;
      const msgs: ChatMessage[]      = body.messages ?? [];
      setConversations((prev) => {
        const exists = prev.find((c) => c.id === conv.id);
        if (exists) return prev.map((c) => c.id === conv.id ? { ...c, ...conv, messages: msgs } : c);
        return [{ ...conv, messages: msgs }, ...prev];
      });
      setSelectedId(conv.id);
      return conv.id;
    } catch { return null; }
    finally { setStartingConv(false); }
  }, []);

  // ── Broadcast ──────────────────────────────────────────────────────────────

  const broadcastMessage = useCallback(async (content: string, target: BroadcastTarget): Promise<BroadcastResult> => {
    setBroadcastError(null);
    try {
      const res = await messagingService.broadcast(content, target);
      const raw = res.data as any;
      const result: BroadcastResult = raw?.body ?? raw ?? { sent_to: 0, target };
      setBroadcastResult(result);
      return result;
    } catch (e: unknown) {
      const axiosMsg  = (e as any)?.response?.data?.message;
      const httpStatus = (e as any)?.response?.status;
      const msg = axiosMsg
        ?? (httpStatus ? `Erreur serveur (${httpStatus}). Veuillez réessayer.` : 'Connexion impossible. Vérifiez votre réseau.');
      setBroadcastError(msg);
      throw new Error(msg);
    }
  }, []);

  const dismissBroadcastResult = useCallback(() => {
    setBroadcastResult(null);
    setBroadcastError(null);
  }, []);

  // ── Edit message ───────────────────────────────────────────────────────────

  const editMessage = useCallback(async (convId: string, msgId: string, content: string): Promise<boolean> => {
    setConversations((prev) => prev.map((c) =>
      c.id !== convId ? c : {
        ...c,
        messages: (c.messages ?? []).map((m) =>
          m.id !== msgId ? m : { ...m, content, is_edited: true }
        ),
      }
    ));
    try {
      const res     = await messagingService.editMessage(msgId, content);
      const raw     = res.data as any;
      const updated = raw?.body ?? raw;
      if (updated?.id) {
        setConversations((prev) => prev.map((c) =>
          c.id !== convId ? c : {
            ...c,
            messages: (c.messages ?? []).map((m) =>
              m.id !== msgId ? m : { ...m, ...updated }
            ),
          }
        ));
      }
      return true;
    } catch { return false; }
  }, []);

  // ── Delete message ─────────────────────────────────────────────────────────

  const deleteMessage = useCallback(async (convId: string, msgId: string): Promise<boolean> => {
    setConversations((prev) => prev.map((c) =>
      c.id !== convId ? c : {
        ...c,
        messages: (c.messages ?? []).filter((m) => m.id !== msgId),
      }
    ));
    try {
      await messagingService.deleteMessage(msgId);
      return true;
    } catch { return false; }
  }, []);

  // ── Send audio message ─────────────────────────────────────────────────────

  const sendAudioMessage = useCallback(async (audioBlob: Blob, mimeType?: string) => {
    if (!selectedId) return;
    const tempId  = `temp-audio-${Date.now()}`;
    const tempUrl = URL.createObjectURL(audioBlob);
    const tempMsg: ChatMessage = {
      id: tempId, conversationId: selectedId,
      sender: 'admin', content: '',
      sentAt: new Date().toISOString(), status: 'envoyé',
      attachment: { url: tempUrl, type: 'audio' },
    };
    setConversations((prev) => prev.map((c) =>
      c.id !== selectedId ? c : {
        ...c,
        messages:      [...(c.messages ?? []), tempMsg],
        lastMessage:   '',
        lastMessageAt: tempMsg.sentAt,
      }
    ));
    setSending(true);
    try {
      const res     = await messagingService.sendAudioMessage(selectedId, audioBlob, mimeType);
      const raw     = res.data as any;
      // Try multiple envelope shapes the backend may use
      const realMsg = raw?.body?.message ?? raw?.body?.data ?? raw?.message ?? raw?.data?.message;
      // eslint-disable-next-line no-console
      if (env.isDev) console.log('[sendAudioMessage] raw response:', JSON.stringify(raw));
      if (realMsg) {
        setConversations((prev) => prev.map((c) =>
          c.id !== selectedId ? c : {
            ...c,
            messages: (c.messages ?? []).map((m) => m.id === tempId ? normalizeMessage(realMsg) : m),
          }
        ));
      }
    } catch { /* keep optimistic */ }
    finally { setSending(false); }
  }, [selectedId]);

  // ── Send to selected ───────────────────────────────────────────────────────

  const sendToSelected = useCallback(async (
    userUuids: string[],
    content: string,
  ): Promise<SendToSelectedResult | null> => {
    try {
      const res = await messagingService.sendToSelected(userUuids, content);
      const raw = res.data as any;
      return raw?.body ?? raw ?? null;
    } catch { return null; }
  }, []);

  return {
    // list
    conversations, selectedId, selectedConversation,
    totalUnread, loading, loadingMessages, sending, error,
    // filters
    roleFilter,   setRoleFilter,
    statusFilter, setStatusFilter,
    // conversation actions
    selectConversation, refreshMessages, sendMessage,
    editMessage, deleteMessage,
    // new conversation
    userSearchResults, userSearchLoading, startingConv,
    searchUsersForNew, clearUserSearch, startNewConversation,
    // broadcast
    broadcastResult, broadcastError, dismissBroadcastResult,
    broadcastMessage,
    // send to selected
    sendToSelected,
    // audio
    sendAudioMessage,
  };
}
