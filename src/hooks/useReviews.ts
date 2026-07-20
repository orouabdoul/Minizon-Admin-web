import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Review, ReviewStatus, ReviewDirection } from '../models/review.model';
import { reviewService } from '../services/review_service';

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK: Review[] = [
  { id: 'r1',  tripId: '#TRJ-8472', direction: 'passager_vers_conducteur', authorName: 'Aminata Diallo',    authorAvatar: 'https://placehold.co/32x32', targetName: 'Adjovi Sèna',           targetAvatar: 'https://placehold.co/32x32', rating: 5, comment: 'Conducteur ponctuel, véhicule propre et climatisé. Très professionnel !', createdAt: '2026-07-01T14:30:00', status: 'visible', reportCount: 0 },
  { id: 'r2',  tripId: '#TRJ-8472', direction: 'conducteur_vers_passager', authorName: 'Adjovi Sèna',       authorAvatar: 'https://placehold.co/32x32', targetName: 'Aminata Diallo',         targetAvatar: 'https://placehold.co/32x32', rating: 5, comment: 'Passagère très agréable, à l\'heure et respectueuse.', createdAt: '2026-07-01T15:00:00', status: 'visible', reportCount: 0 },
  { id: 'r3',  tripId: '#TRJ-8471', direction: 'passager_vers_conducteur', authorName: 'Pierre Moreau',     authorAvatar: 'https://placehold.co/32x32', targetName: 'Kofi Mensah',            targetAvatar: 'https://placehold.co/32x32', rating: 2, comment: 'Conducteur en retard de 20 minutes, n\'a pas prévenu. Trajet correct après mais première impression désastreuse.', createdAt: '2026-06-30T11:00:00', status: 'signalé', reportCount: 2 },
  { id: 'r4',  tripId: '#TRJ-8470', direction: 'passager_vers_conducteur', authorName: 'Fatou Sow',         authorAvatar: 'https://placehold.co/32x32', targetName: 'Jean-Baptiste Hounkpè', targetAvatar: 'https://placehold.co/32x32', rating: 1, comment: 'Comportement irrespectueux. Ce conducteur ne devrait pas être sur la plateforme. Musique trop forte refus de baisser.', createdAt: '2026-06-30T09:15:00', status: 'signalé', reportCount: 4 },
  { id: 'r5',  tripId: '#TRJ-8469', direction: 'passager_vers_conducteur', authorName: 'Moussa Traoré',     authorAvatar: 'https://placehold.co/32x32', targetName: 'Yao Kobenan',            targetAvatar: 'https://placehold.co/32x32', rating: 4, comment: 'Bon trajet dans l\'ensemble. Le conducteur connaît bien les routes. Manque un peu de communication.', createdAt: '2026-06-29T16:45:00', status: 'visible', reportCount: 0 },
  { id: 'r6',  tripId: '#TRJ-8468', direction: 'conducteur_vers_passager', authorName: 'Kofi Mensah',       authorAvatar: 'https://placehold.co/32x32', targetName: 'Pierre Moreau',          targetAvatar: 'https://placehold.co/32x32', rating: 3, comment: 'Passager OK mais bavard et a demandé plusieurs détours non prévus.', createdAt: '2026-06-29T10:00:00', status: 'visible', reportCount: 0 },
  { id: 'r7',  tripId: '#TRJ-8467', direction: 'passager_vers_conducteur', authorName: 'Marie Dupont',      authorAvatar: 'https://placehold.co/32x32', targetName: 'Adjoa Koffi',            targetAvatar: 'https://placehold.co/32x32', rating: 5, comment: 'Parfait du début à la fin. Conductrice rassurante et le trajet s\'est fait en avance sur l\'heure prévue.', createdAt: '2026-06-28T13:20:00', status: 'visible', reportCount: 0 },
  { id: 'r8',  tripId: '#TRJ-8466', direction: 'passager_vers_conducteur', authorName: 'Kwame Asante',      authorAvatar: 'https://placehold.co/32x32', targetName: 'Amara Diallo',           targetAvatar: 'https://placehold.co/32x32', rating: 1, comment: 'Nul. Annulé 5 minutes avant le départ sans explication. Catastrophique.', createdAt: '2026-06-28T08:00:00', status: 'masqué', reportCount: 1 },
  { id: 'r9',  tripId: '#TRJ-8465', direction: 'conducteur_vers_passager', authorName: 'Yao Kobenan',       authorAvatar: 'https://placehold.co/32x32', targetName: 'Fatou Sow',              targetAvatar: 'https://placehold.co/32x32', rating: 2, comment: 'Passagère très difficile, a changé d\'adresse de destination 3 fois en route.', createdAt: '2026-06-27T17:30:00', status: 'signalé', reportCount: 3 },
  { id: 'r10', tripId: '#TRJ-8464', direction: 'passager_vers_conducteur', authorName: 'Aïcha Traoré',      authorAvatar: 'https://placehold.co/32x32', targetName: 'Moussa Traoré',          targetAvatar: 'https://placehold.co/32x32', rating: 4, comment: 'Très bien. Conducteur sympa et honnête, a rendu un objet oublié dans le véhicule.', createdAt: '2026-06-27T12:00:00', status: 'visible', reportCount: 0 },
];

export interface ReviewFilters {
  status:    ReviewStatus | 'all';
  direction: ReviewDirection | 'all';
  rating:    'all' | '1' | '2' | '3' | '4' | '5';
  search:    string;
}

const DEFAULT_FILTERS: ReviewFilters = { status: 'all', direction: 'all', rating: 'all', search: '' };

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useReviews() {
  const [reviews,  setReviews]  = useState<Review[]>(MOCK);
  const [filters,  setFilters]  = useState<ReviewFilters>(DEFAULT_FILTERS);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    setLoading(true);
    reviewService.getAll()
      .then((res) => {
        const data = res.data.body;
        if (Array.isArray(data) && data.length > 0) setReviews(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => reviews.filter((r) => {
    if (filters.status    !== 'all' && r.status    !== filters.status)                                          return false;
    if (filters.direction !== 'all' && r.direction !== filters.direction)                                       return false;
    if (filters.rating    !== 'all' && r.rating    !== parseInt(filters.rating, 10))                            return false;
    if (filters.search && !r.comment.toLowerCase().includes(filters.search.toLowerCase())
      && !r.authorName.toLowerCase().includes(filters.search.toLowerCase())
      && !r.targetName.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  }), [reviews, filters]);

  const setStatus = useCallback(async (id: string, status: ReviewStatus) => {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    reviewService.setStatus(id, status).catch(() => {});
  }, []);

  const remove = useCallback(async (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    reviewService.remove(id).catch(() => {});
  }, []);

  const stats = useMemo(() => ({
    total:    reviews.length,
    signalé:  reviews.filter((r) => r.status === 'signalé').length,
    masqué:   reviews.filter((r) => r.status === 'masqué').length,
    avgRating: reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—',
  }), [reviews]);

  return {
    reviews: filtered, stats, loading, filters,
    setFilters: (f: Partial<ReviewFilters>) => setFilters((prev) => ({ ...prev, ...f })),
    setStatus, remove,
  };
}
