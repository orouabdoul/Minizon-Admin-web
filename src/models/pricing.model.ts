export interface TariffRule {
  id:          string;
  key?:        string;
  name:        string;
  description: string;
  value:       number;
  unit:        string;
  active:      boolean;
}

export interface TariffListBody {
  tariffs: TariffRule[];
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

export interface PromoListBody {
  promos: PromoCode[];
}

// Payload shape expected by the API (snake_case)
export interface CreatePromoPayload {
  code:        string;
  discount:    number;
  description: string;
  expires_at:  string;
  usage_limit: number;
  active:      boolean;
}
