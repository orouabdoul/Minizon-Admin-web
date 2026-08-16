import { useState } from 'react';
import { X, Radio, Search, Send, Users } from 'lucide-react';
import { DashboardLayout }   from '../../components/Layout/DashboardLayout/DashboardLayout';
import { AppIcon }           from '../../components/Common/AppIcon';
import { ConversationList }  from './components/ConversationList';
import { ChatWindow }        from './components/ChatWindow';
import { useMessaging }      from '../../hooks/useMessaging';
import type { BroadcastTarget, RoleFilter, UserSearchResult } from '../../models/messaging.model';
import '../../messaging.css';

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

const BROADCAST_TARGETS: { value: BroadcastTarget; label: string; desc: string }[] = [
  { value: 'tous',             label: 'Tout le monde',        desc: 'Conducteurs et passagers inscrits'        },
  { value: 'tous_conducteurs', label: 'Tous les conducteurs', desc: 'Ensemble du parc de conducteurs'          },
  { value: 'tous_passagers',   label: 'Tous les passagers',   desc: 'Ensemble des passagers inscrits'          },
  { value: 'en_ligne',         label: 'Conducteurs en ligne', desc: 'Conducteurs disponibles en ce moment'    },
  { value: 'en_trajet',        label: 'En trajet',            desc: 'Conducteurs actuellement sur une course' },
];

const NEW_CONV_ROLE_TABS: { value: RoleFilter; label: string }[] = [
  { value: 'all',       label: 'Tous'        },
  { value: 'driver',    label: 'Conducteurs' },
  { value: 'passenger', label: 'Passagers'   },
];

export function MessagingScreen() {
  const {
    conversations, selectedId, selectedConversation,
    totalUnread, loading, loadingMessages, sending, error,
    roleFilter, setRoleFilter,
    statusFilter, setStatusFilter,
    selectConversation, refreshMessages, sendMessage, sendAudioMessage,
    editMessage, deleteMessage,
    userSearchResults, userSearchLoading, startingConv,
    searchUsersForNew, clearUserSearch, startNewConversation,
    broadcastResult, broadcastError, broadcastMessage, dismissBroadcastResult,
    sendToSelected,
  } = useMessaging();

  // ── Broadcast modal ─────────────────────────────────────────────────────────
  const [broadcastOpen,    setBroadcastOpen]    = useState(false);
  const [broadcastTarget,  setBroadcastTarget]  = useState<BroadcastTarget>('tous');
  const [broadcastMsg,     setBroadcastMsg]     = useState('');
  const [broadcastSent,    setBroadcastSent]    = useState(false);
  const [broadcastSending, setBroadcastSending] = useState(false);

  const handleBroadcast = async () => {
    if (!broadcastMsg.trim() || broadcastSending) return;
    setBroadcastSending(true);
    try {
      await broadcastMessage(broadcastMsg.trim(), broadcastTarget);
      setBroadcastSent(true);
      setTimeout(() => {
        setBroadcastOpen(false);
        setBroadcastMsg('');
        setBroadcastSent(false);
        setBroadcastTarget('tous');
        dismissBroadcastResult();
      }, 2500);
    } finally {
      setBroadcastSending(false);
    }
  };

  const closeBroadcast = () => {
    setBroadcastOpen(false);
    setBroadcastMsg('');
    setBroadcastSent(false);
    setBroadcastTarget('tous');
    dismissBroadcastResult();
  };

  // ── Send-to-selected modal ──────────────────────────────────────────────────
  const [selectOpen,      setSelectOpen]      = useState(false);
  const [selectSearch,    setSelectSearch]    = useState('');
  const [selectRole,      setSelectRole]      = useState<RoleFilter>('all');
  const [selectedUuids,   setSelectedUuids]   = useState<Set<string>>(new Set());
  const [selectMsg,       setSelectMsg]       = useState('');
  const [selectSending,   setSelectSending]   = useState(false);
  const [selectResult,    setSelectResult]    = useState<{ sent_to: number; not_found: number } | null>(null);

  const openSelectModal = () => {
    setSelectOpen(true);
    setSelectSearch('');
    setSelectRole('all');
    setSelectedUuids(new Set());
    setSelectMsg('');
    setSelectResult(null);
    clearUserSearch();
  };

  const closeSelectModal = () => {
    setSelectOpen(false);
    clearUserSearch();
    setSelectResult(null);
  };

  const toggleSelectUser = (uuid: string) => {
    setSelectedUuids((prev) => {
      const next = new Set(prev);
      next.has(uuid) ? next.delete(uuid) : next.add(uuid);
      return next;
    });
  };

  const handleSendToSelected = async () => {
    if (!selectMsg.trim() || selectedUuids.size === 0 || selectSending) return;
    setSelectSending(true);
    try {
      const result = await sendToSelected([...selectedUuids], selectMsg.trim());
      if (result) {
        setSelectResult(result);
        setTimeout(() => {
          closeSelectModal();
          setSelectMsg('');
        }, 2500);
      }
    } finally {
      setSelectSending(false);
    }
  };

  // ── New conversation modal ───────────────────────────────────────────────────
  const [newConvOpen,     setNewConvOpen]     = useState(false);
  const [newConvSearch,   setNewConvSearch]   = useState('');
  const [newConvRole,     setNewConvRole]     = useState<RoleFilter>('all');
  const [selectedNewUser, setSelectedNewUser] = useState<UserSearchResult | null>(null);
  const [firstMessage,    setFirstMessage]    = useState('');

  const openNewConv = () => {
    setNewConvOpen(true);
    setNewConvSearch('');
    setNewConvRole('all');
    setSelectedNewUser(null);
    setFirstMessage('');
    clearUserSearch();
  };

  const closeNewConv = () => {
    setNewConvOpen(false);
    clearUserSearch();
  };

  const handleStartConv = async () => {
    if (!selectedNewUser) return;
    const convId = await startNewConversation(selectedNewUser.uuid, firstMessage.trim() || undefined);
    if (convId) {
      closeNewConv();
      setFirstMessage('');
      setSelectedNewUser(null);
    }
  };

  return (
    <DashboardLayout title="Centre de Communication">
      <div className={`messaging-layout${selectedId ? ' messaging-layout--chat-open' : ''}`}>
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          totalUnread={totalUnread}
          loading={loading}
          error={error}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onSelect={selectConversation}
          onBroadcast={() => setBroadcastOpen(true)}
          onNewConversation={openNewConv}
          onSendToSelected={openSelectModal}
        />
        <ChatWindow
          conversation={selectedConversation}
          sending={sending}
          loadingMessages={loadingMessages}
          onSend={sendMessage}
          onSendAudio={sendAudioMessage}
          onRefresh={refreshMessages}
          onEdit={(msgId, content) => selectedId && editMessage(selectedId, msgId, content)}
          onDelete={(msgId) => selectedId && deleteMessage(selectedId, msgId)}
        />
      </div>

      {/* ── Broadcast modal ──────────────────────────────────────────────────── */}
      {broadcastOpen && (
        <div className="msg-modal-overlay" onClick={closeBroadcast}>
          <div className="msg-modal" onClick={(e) => e.stopPropagation()}>
            <div className="msg-modal__header">
              <div>
                <p className="msg-modal__title">Message Diffusé</p>
                <p className="msg-modal__subtitle">
                  Envoyer un message simultané à plusieurs utilisateurs
                </p>
              </div>
              <button type="button" className="msg-modal__close" onClick={closeBroadcast}>
                <AppIcon icon={X} size={18} color="#6B7280" />
              </button>
            </div>

            {broadcastError && (
              <p className="msg-broadcast-err">{broadcastError}</p>
            )}

            {broadcastSent ? (
              <div className="msg-broadcast-success">
                <div className="msg-broadcast-success__icon">✅</div>
                <p className="msg-broadcast-success__title">Message diffusé !</p>
                <p className="msg-broadcast-success__desc">
                  Votre message a été envoyé à{' '}
                  <strong>{broadcastResult?.sent_to ?? '–'}</strong> destinataire(s).
                </p>
              </div>
            ) : (
              <>
                <div className="msg-broadcast-section">
                  <p className="msg-broadcast-label">Destinataires</p>
                  <div className="msg-broadcast-targets">
                    {BROADCAST_TARGETS.map(({ value, label, desc }) => {
                      const sel = broadcastTarget === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          className={`msg-broadcast-target${sel ? ' msg-broadcast-target--active' : ''}`}
                          onClick={() => setBroadcastTarget(value)}
                        >
                          <div className="msg-broadcast-target__radio" />
                          <div>
                            <div className="msg-broadcast-target__label">{label}</div>
                            <div className="msg-broadcast-target__desc">{desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="msg-broadcast-section--msg">
                  <p className="msg-broadcast-label">Message</p>
                  <textarea
                    className="msg-broadcast-textarea"
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                    placeholder="Tapez votre message ici…"
                    rows={4}
                  />
                </div>

                <div className="msg-modal__footer">
                  <button type="button" className="msg-btn msg-btn--cancel" onClick={closeBroadcast}>
                    Annuler
                  </button>
                  <button
                    type="button"
                    className="msg-btn msg-btn--send"
                    onClick={handleBroadcast}
                    disabled={!broadcastMsg.trim() || broadcastSending}
                  >
                    {broadcastSending ? 'Envoi…' : (
                      <>
                        <AppIcon icon={Radio} size={14} color="#fff" />
                        Diffuser
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── New conversation modal ───────────────────────────────────────────── */}
      {newConvOpen && (
        <div className="msg-modal-overlay" onClick={closeNewConv}>
          <div className="msg-modal msg-modal--flex" onClick={(e) => e.stopPropagation()}>
            <div className="msg-modal__header">
              <div>
                <p className="msg-modal__title">Nouvelle conversation</p>
                <p className="msg-modal__subtitle">Recherchez un conducteur ou un passager</p>
              </div>
              <button type="button" className="msg-modal__close" onClick={closeNewConv}>
                <AppIcon icon={X} size={18} color="#6B7280" />
              </button>
            </div>

            {/* Role chips */}
            <div className="msg-role-chips">
              {NEW_CONV_ROLE_TABS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={`msg-role-chip${newConvRole === value ? ' msg-role-chip--active' : ''}`}
                  onClick={() => {
                    setNewConvRole(value);
                    if (newConvSearch.trim()) searchUsersForNew(newConvSearch, value);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="msg-modal-search">
              <div className="msg-modal-search__wrap">
                <AppIcon icon={Search} size={14} color="#9CA3AF" />
                <input
                  className="msg-modal-search__input"
                  placeholder="Rechercher par nom ou téléphone…"
                  value={newConvSearch}
                  autoFocus
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewConvSearch(val);
                    searchUsersForNew(val, newConvRole);
                    if (selectedNewUser) setSelectedNewUser(null);
                  }}
                />
              </div>
            </div>

            {/* Results */}
            <div className="msg-modal-results">
              {userSearchLoading ? (
                <p className="msg-modal-empty">Recherche en cours…</p>
              ) : newConvSearch.trim() && userSearchResults.length === 0 ? (
                <p className="msg-modal-empty">Aucun résultat pour « {newConvSearch} »</p>
              ) : userSearchResults.length > 0 ? (
                <div className="msg-modal-result-list">
                  {userSearchResults.map((u) => (
                    <button
                      key={u.uuid}
                      type="button"
                      className={`msg-user-result${selectedNewUser?.uuid === u.uuid ? ' msg-user-result--selected' : ''}`}
                      onClick={() => setSelectedNewUser((prev) => prev?.uuid === u.uuid ? null : u)}
                    >
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} className="msg-user-result__avatar" />
                      ) : (
                        <div className="msg-user-result__avatar-fallback">{initials(u.name)}</div>
                      )}
                      <div className="msg-user-result__info">
                        <div className="msg-user-result__name">{u.name}</div>
                        <div className="msg-user-result__meta">{u.phone} · {u.roleLabel}</div>
                      </div>
                      <span
                        className={`msg-user-result__badge msg-user-result__badge--${u.conversationUuid ? 'existing' : 'new'}`}
                      >
                        {u.conversationUuid ? 'Existante' : 'Nouveau'}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="msg-modal-empty">Tapez un nom ou un numéro pour rechercher</p>
              )}
            </div>

            {/* First message */}
            {selectedNewUser && (
              <div className="msg-modal-first-msg">
                <p className="msg-modal-first-msg__label">Premier message (optionnel)</p>
                <div className="msg-modal-first-msg__row">
                  <input
                    className="msg-modal-first-msg__input"
                    placeholder="Bonjour…"
                    value={firstMessage}
                    autoFocus
                    onChange={(e) => setFirstMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleStartConv(); }}
                  />
                  <button
                    type="button"
                    className="msg-modal-start-btn"
                    onClick={handleStartConv}
                    disabled={startingConv}
                  >
                    {startingConv ? 'Démarrage…' : (
                      <>
                        <AppIcon icon={Send} size={13} color="#fff" />
                        Démarrer
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Send-to-selected modal ───────────────────────────────────────────── */}
      {selectOpen && (
        <div className="msg-modal-overlay" onClick={closeSelectModal}>
          <div className="msg-modal msg-modal--flex" onClick={(e) => e.stopPropagation()}>
            <div className="msg-modal__header">
              <div>
                <p className="msg-modal__title">Envoyer à une sélection</p>
                <p className="msg-modal__subtitle">
                  Cochez les destinataires puis rédigez votre message
                </p>
              </div>
              <button type="button" className="msg-modal__close" onClick={closeSelectModal}>
                <AppIcon icon={X} size={18} color="#6B7280" />
              </button>
            </div>

            {selectResult ? (
              <div className="msg-broadcast-success">
                <div className="msg-broadcast-success__icon">✅</div>
                <p className="msg-broadcast-success__title">Messages envoyés !</p>
                <p className="msg-broadcast-success__desc">
                  Envoyé à <strong>{selectResult.sent_to}</strong> destinataire(s).
                  {selectResult.not_found > 0 && (
                    <> <span style={{ color: '#EF4444' }}>{selectResult.not_found} introuvable(s).</span></>
                  )}
                </p>
              </div>
            ) : (
              <>
                {/* Role chips */}
                <div className="msg-role-chips">
                  {NEW_CONV_ROLE_TABS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      className={`msg-role-chip${selectRole === value ? ' msg-role-chip--active' : ''}`}
                      onClick={() => {
                        setSelectRole(value);
                        if (selectSearch.trim()) searchUsersForNew(selectSearch, value);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="msg-modal-search">
                  <div className="msg-modal-search__wrap">
                    <AppIcon icon={Search} size={14} color="#9CA3AF" />
                    <input
                      className="msg-modal-search__input"
                      placeholder="Rechercher par nom ou téléphone…"
                      value={selectSearch}
                      autoFocus
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectSearch(val);
                        searchUsersForNew(val, selectRole);
                      }}
                    />
                  </div>
                </div>

                {/* Selected count */}
                {selectedUuids.size > 0 && (
                  <p style={{ fontSize: 12, color: '#2563EB', padding: '0 16px', margin: '4px 0 0', fontWeight: 600 }}>
                    {selectedUuids.size} sélectionné(s)
                  </p>
                )}

                {/* Results with checkboxes */}
                <div className="msg-modal-results">
                  {userSearchLoading ? (
                    <p className="msg-modal-empty">Recherche en cours…</p>
                  ) : selectSearch.trim() && userSearchResults.length === 0 ? (
                    <p className="msg-modal-empty">Aucun résultat pour « {selectSearch} »</p>
                  ) : userSearchResults.length > 0 ? (
                    <div className="msg-modal-result-list">
                      {userSearchResults.map((u) => {
                        const checked = selectedUuids.has(u.uuid);
                        return (
                          <button
                            key={u.uuid}
                            type="button"
                            className={`msg-user-result${checked ? ' msg-user-result--selected' : ''}`}
                            onClick={() => toggleSelectUser(u.uuid)}
                          >
                            <input
                              type="checkbox"
                              readOnly
                              checked={checked}
                              style={{ accentColor: '#2563EB', width: 14, height: 14, flexShrink: 0 }}
                            />
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="msg-user-result__avatar" />
                            ) : (
                              <div className="msg-user-result__avatar-fallback">{initials(u.name)}</div>
                            )}
                            <div className="msg-user-result__info">
                              <div className="msg-user-result__name">{u.name}</div>
                              <div className="msg-user-result__meta">{u.phone} · {u.roleLabel}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="msg-modal-empty">Tapez un nom ou un numéro pour rechercher</p>
                  )}
                </div>

                {/* Message */}
                <div className="msg-modal-first-msg">
                  <p className="msg-modal-first-msg__label">Message</p>
                  <textarea
                    className="msg-broadcast-textarea"
                    value={selectMsg}
                    onChange={(e) => setSelectMsg(e.target.value)}
                    placeholder="Tapez votre message…"
                    rows={3}
                  />
                </div>

                <div className="msg-modal__footer">
                  <button type="button" className="msg-btn msg-btn--cancel" onClick={closeSelectModal}>
                    Annuler
                  </button>
                  <button
                    type="button"
                    className="msg-btn msg-btn--send"
                    onClick={handleSendToSelected}
                    disabled={!selectMsg.trim() || selectedUuids.size === 0 || selectSending}
                  >
                    {selectSending ? 'Envoi…' : (
                      <>
                        <AppIcon icon={Users} size={14} color="#fff" />
                        Envoyer ({selectedUuids.size})
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
