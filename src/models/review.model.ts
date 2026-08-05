export type ReviewDirection = 'passager_vers_conducteur' | 'conducteur_vers_passager';
export type ReviewStatus    = 'visible' | 'masqué' | 'signalé';

export interface Review {
  id:           string;
  tripId:       string;
  direction:    ReviewDirection;
  authorName:   string;
  authorAvatar: string;
  targetName:   string;
  targetAvatar: string;
  rating:       number;
  comment:      string;
  createdAt:    string;
  status:       ReviewStatus;
  reportCount?: number;
}

export interface ReviewStats {
  total:     number;
  avgRating: string;
  signalé:   number;
  masqué:    number;
}
