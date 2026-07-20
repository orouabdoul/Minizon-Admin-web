export interface TariffRule {
  id:          string;
  name:        string;
  description: string;
  value:       number;
  unit:        string;
  active:      boolean;
}

export interface PromoCode {
  id:          string;
  code:        string;
  discount:    number;
  description: string;
  expiresAt:   string;
  usageCount:  number;
  usageLimit:  number;
  active:      boolean;
}
