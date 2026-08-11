// ── App info ────────────────────────────────────────────
export const APP_NAME             = 'MINIZON' as const;
export const APP_SUBTITLE         = 'Admin Platform' as const;
export const APP_DESCRIPTION      = 'Centre intelligent de supervision mobilité africaine' as const;
export const APP_SUBDESCRIPTION   = 'Plateforme sécurisée de gestion opérationnelle' as const;
export const APP_VERSION          = '1.0' as const;
export const COPYRIGHT_YEAR       = '2024' as const;

// ── Login banner stats ───────────────────────────────────
export const BANNER_STATS = [
  { id: 'users',  value: '24,573', label: 'Utilisateurs actifs',     badge: 'LIVE',   badgeColor: undefined },
  { id: 'trips',  value: '1,847',  label: 'Trajets quotidiens',       badge: 'TODAY',  badgeColor: undefined },
  { id: 'secure', value: '99.9%',  label: 'Transactions sécurisées',  badge: 'SECURE', badgeColor: undefined },
  { id: 'uptime', value: '100%',   label: 'Disponibilité plateforme', badge: 'UP',     badgeColor: '#4ADE80' },
] as const;

export const SECURITY_BADGES = [
  { id: 'ssl',       label: 'SSL Sécurisé' },
  { id: 'data',      label: 'Protection données' },
  { id: 'encrypted', label: 'Connexion chiffrée' },
] as const;

export const BANNER_SECURITY_FEATURES = [
  { id: 'ssl',        label: 'SSL Sécurisé' },
  { id: 'monitoring', label: 'Monitoring 24/7' },
] as const;

// ── Dashboard admin user (header) ────────────────────────
export const ADMIN_USER = {
  name:   'Admin User',
  role:   'Administrateur',
  avatar: 'https://placehold.co/32x32',
  notificationCount: 3,
} as const;

// ── Sidebar navigation ───────────────────────────────────
export type NavItemId =
  | 'dashboard' | 'users' | 'drivers' | 'vehicles' | 'passengers' | 'trips'
  | 'reservations' | 'payments' | 'disputes' | 'support'
  | 'notifications' | 'settings' | 'tracking' | 'messaging'
  | 'audit' | 'reports' | 'payouts' | 'reviews' | 'refunds';

export interface NavItem {
  id:    NavItemId;
  label: string;
  path:  string;
}

export interface NavGroup {
  label: string;
  items: NavItemId[];
}

export const NAV_GROUPS: NavGroup[] = [
  { label: "Vue d'ensemble", items: ['dashboard'] },
  { label: 'Utilisateurs',   items: ['users', 'drivers', 'passengers', 'vehicles'] },
  { label: 'Opérations',     items: ['trips', 'reservations', 'tracking', 'messaging'] },
  { label: 'Finance',        items: ['payments', 'payouts', 'refunds'] },
  { label: 'Relation client', items: ['disputes', 'support', 'reviews'] },
  { label: 'Administration', items: ['notifications', 'reports', 'audit', 'settings'] },
];

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',     label: 'Dashboard',      path: '/dashboard' },
  { id: 'users',         label: 'Utilisateurs',   path: '/users' },
  { id: 'drivers',       label: 'Conducteurs',    path: '/drivers' },
  { id: 'vehicles',      label: 'Véhicules',      path: '/vehicles' },
  { id: 'passengers',    label: 'Passagers',      path: '/passengers' },
  { id: 'trips',         label: 'Trajets',        path: '/trips' },
  { id: 'reservations',  label: 'Réservations',   path: '/reservations' },
  { id: 'payments',      label: 'Paiements',      path: '/payments' },
  { id: 'disputes',      label: 'Litiges',        path: '/disputes' },
  { id: 'support',       label: 'Support',        path: '/support' },
  { id: 'notifications', label: 'Notifications',  path: '/notifications' },
  { id: 'settings',      label: 'Paramètres',     path: '/settings' },
  { id: 'tracking',      label: 'Suivi Temps Réel',  path: '/tracking'   },
  { id: 'messaging',     label: 'Communication',     path: '/messaging'  },
  { id: 'audit',         label: "Journal d'Audit",   path: '/audit'      },
  { id: 'reports',       label: 'Rapports',           path: '/reports'    },
  { id: 'payouts',       label: 'Virements',          path: '/payouts'    },
  { id: 'reviews',       label: 'Évaluations',        path: '/reviews'    },
  { id: 'refunds',       label: 'Remboursements',     path: '/refunds'    },
];

// ── Dashboard KPI cards ──────────────────────────────────
export interface KpiCardData {
  id:           string;
  label:        string;
  value:        string;
  badge:        string;
  badgeVariant: 'success' | 'error' | 'warning' | 'neutral';
  iconBg:       string;
  iconColor:    string;
  iconId:       string;
}

export const DASHBOARD_KPIS: KpiCardData[] = [
  { id: 'total-users',    label: "Utilisateurs Totaux",       value: '24,856',   badge: '+12.5%',   badgeVariant: 'success', iconBg: '#DBEAFE', iconColor: '#2563EB', iconId: 'users' },
  { id: 'drivers',        label: 'Conducteurs Actifs',        value: '3,247',    badge: '+8.2%',    badgeVariant: 'success', iconBg: '#DCFCE7', iconColor: '#00A86B', iconId: 'car' },
  { id: 'trips-today',    label: "Trajets Aujourd'hui",       value: '1,842',    badge: '+24.1%',   badgeVariant: 'success', iconBg: '#F3E8FF', iconColor: '#9333EA', iconId: 'route' },
  { id: 'revenue',        label: 'Revenus Plateforme',        value: '2.4M FCFA', badge: '+18.7%', badgeVariant: 'success', iconBg: '#FEF9C3', iconColor: '#F4B400', iconId: 'trending' },
  { id: 'passengers',     label: 'Passagers Actifs',          value: '21,609',   badge: '+15.3%',   badgeVariant: 'success', iconBg: '#E0E7FF', iconColor: '#4F46E5', iconId: 'users' },
  { id: 'transactions',   label: "Transactions Aujourd'hui",  value: '4,521',    badge: '+31.2%',   badgeVariant: 'success', iconBg: '#CCFBF1', iconColor: '#0D9488', iconId: 'credit' },
  { id: 'disputes',       label: 'Litiges Ouverts',           value: '8',        badge: '8 Ouverts', badgeVariant: 'error',  iconBg: '#FEE2E2', iconColor: '#E53935', iconId: 'alert' },
  { id: 'satisfaction',   label: 'Taux Satisfaction',         value: '4.8/5',    badge: 'Excellent', badgeVariant: 'success', iconBg: '#DCFCE7', iconColor: '#00A86B', iconId: 'star' },
];

// ── Users page — KPI metrics ─────────────────────────────
export interface UserPageMetric {
  id:         string;
  label:      string;
  value:      string;
  trend:      string;
  trendColor: string;
  iconBg:     string;
  iconColor:  string;
  iconId:     string;
}

export const USER_PAGE_METRICS: UserPageMetric[] = [
  { id: 'active-users', label: 'Utilisateurs Actifs',  value: '12,847',   trend: '+8.2% ce mois',     trendColor: '#00A86B', iconBg: 'rgba(0,168,107,0.10)',  iconColor: '#00A86B', iconId: 'users'    },
  { id: 'daily-trips',  label: "Trajets Aujourd'hui",  value: '1,234',    trend: '+15.3% vs hier',    trendColor: '#2563EB', iconBg: 'rgba(37,99,235,0.10)',  iconColor: '#2563EB', iconId: 'route'    },
  { id: 'revenue',      label: 'Revenus',              value: '2.4M FCFA', trend: '+12.5% ce mois',  trendColor: '#00A86B', iconBg: 'rgba(0,168,107,0.10)',  iconColor: '#00A86B', iconId: 'trending' },
  { id: 'disputes',     label: 'Litiges Ouverts',      value: '23',       trend: 'Nécessite attention', trendColor: '#FB8C00', iconBg: 'rgba(251,140,0,0.10)', iconColor: '#FB8C00', iconId: 'alert'   },
];

// ── Users page — mock platform users ─────────────────────
import type { PlatformUser } from '../models/user.model';

export const MOCK_PLATFORM_USERS: PlatformUser[] = [
  { id: '1', name: 'Koffi Mensah',  phone: '+229 97 45 67 89', avatar: 'https://placehold.co/40x40', type: 'Conducteur', status: 'Actif', verification: 'Vérifié',    lastActivity: 'Il y a 2h' },
  { id: '2', name: 'Adjoa Tetteh',  phone: '+229 96 78 90 12', avatar: 'https://placehold.co/40x40', type: 'Passager',   status: 'Actif', verification: 'En attente', lastActivity: 'Il y a 1h' },
  { id: '3', name: 'Jean-Baptiste', phone: '+229 95 12 34 56', avatar: 'https://placehold.co/40x40', type: 'Conducteur', status: 'Actif', verification: 'Vérifié',    lastActivity: 'Il y a 3h' },
  { id: '4', name: 'Aïcha Kone',    phone: '+229 94 56 78 90', avatar: 'https://placehold.co/40x40', type: 'Passager',   status: 'Actif', verification: 'Vérifié',    lastActivity: 'Il y a 4h' },
];

// ── Users page — quick actions ────────────────────────────
export const USER_QUICK_ACTIONS = [
  { id: 'approve', label: 'Approuver Conducteur',  iconColor: '#00A86B', iconId: 'usercheck' },
  { id: 'suspend', label: 'Suspendre Utilisateur', iconColor: '#E53935', iconId: 'userx'     },
  { id: 'resolve', label: 'Résoudre Litige',       iconColor: '#FB8C00', iconId: 'alert'     },
] as const;

// ── Users page — system alerts ────────────────────────────
export const USER_SYSTEM_ALERTS = [
  { id: '1', title: 'Tentative de fraude détectée', time: 'Il y a 15 min', dotColor: '#E53935' },
  { id: '2', title: "Pic d'activité inhabituel",    time: 'Il y a 1h',     dotColor: '#FB8C00' },
  { id: '3', title: 'Nouveau conducteur inscrit',   time: 'Il y a 2h',     dotColor: '#00A86B' },
] as const;

// ── Users page — performance metrics ─────────────────────
export const USER_PERFORMANCE_METRICS = [
  { id: 'satisfaction', label: 'Satisfaction Client', value: '4.8/5', percent: 96, color: '#00A86B' },
  { id: 'response',     label: 'Temps Réponse',       value: '2.3s',  percent: 75, color: '#2563EB' },
] as const;

// ── Drivers page — KPI metrics ───────────────────────────
export const DRIVER_PAGE_METRICS: UserPageMetric[] = [
  { id: 'active-drivers',  label: 'Utilisateurs Actifs', value: '12,847',    trend: '+12.5% ce mois', trendColor: '#00A86B', iconBg: 'rgba(0,168,107,0.10)', iconColor: '#00A86B', iconId: 'users'    },
  { id: 'daily-trips',     label: "Trajets Aujourd'hui", value: '1,234',     trend: '+8.2% vs hier',  trendColor: '#00A86B', iconBg: 'rgba(37,99,235,0.10)', iconColor: '#2563EB', iconId: 'route'    },
  { id: 'monthly-revenue', label: 'Revenus Mensuels',    value: '2.4M FCFA', trend: '+15.3% ce mois', trendColor: '#00A86B', iconBg: '#DCFCE7',              iconColor: '#16A34A', iconId: 'trending' },
  { id: 'open-disputes',   label: 'Litiges Ouverts',     value: '23',        trend: '-5.1% ce mois',  trendColor: '#E53935', iconBg: '#FEE2E2',              iconColor: '#E53935', iconId: 'alert'    },
];

// ── Drivers page — mock drivers ───────────────────────────
import type { Driver } from '../models/driver.model';

export const MOCK_DRIVERS: Driver[] = [
  {
    id: '1', name: 'Kofi Mensah', driverId: '#DR001234',
    phone: '+229 97 45 67 89', email: 'kofi@email.com',
    vehicle: 'Toyota Corolla', plate: 'BJ-1234-AB',
    avatar: 'https://placehold.co/40x40',
    documents: { permis: 'ok', carteGrise: 'ok', assurance: 'pending', tvmDoc: 'pending', technicalControl: 'pending' },
    score: 85, status: 'En attente',
  },
  {
    id: '2', name: 'Adjoa Koffi', driverId: '#DR001235',
    phone: '+229 96 78 90 12', email: 'adjoa@email.com',
    vehicle: 'Honda Civic', plate: 'BJ-5678-CD',
    avatar: 'https://placehold.co/40x40',
    documents: { permis: 'ok', carteGrise: 'ok', assurance: 'ok', tvmDoc: 'ok', technicalControl: 'ok' },
    score: 95, status: 'Vérifié',
  },
  {
    id: '3', name: 'Jean-Baptiste Hounkpè', driverId: '#DR001236',
    phone: '+229 95 12 34 56', email: 'jb.hounkpe@email.com',
    vehicle: 'Renault Logan', plate: 'BJ-9012-EF',
    avatar: 'https://placehold.co/40x40',
    documents: { permis: 'ok', carteGrise: 'pending', assurance: 'pending', tvmDoc: 'pending', technicalControl: 'pending' },
    score: 60, status: 'En attente',
  },
];

// ── Drivers page — status filter options ─────────────────
export const DRIVER_STATUS_OPTIONS = [
  { value: 'all',        label: 'Tous les statuts' },
  { value: 'En attente', label: 'En attente'       },
  { value: 'Vérifié',    label: 'Vérifié'          },
  { value: 'Rejeté',     label: 'Rejeté'           },
  { value: 'Suspendu',   label: 'Suspendu'         },
] as const;

// ── Passengers page — KPI data ───────────────────────────
export interface PassengerKpiData {
  id:          string;
  label:       string;
  value:       string;
  badge:       string;    // texte affiché dans le badge
  iconBg:      string;
  iconColor:   string;
  iconId:      string;
  badgeBg?:    string;   // surcharge iconBg pour le badge
  badgeColor?: string;   // surcharge iconColor pour le badge
}

export const PASSENGER_KPI_DATA: PassengerKpiData[] = [
  { id: 'total',        label: 'Total Passagers',         value: '2,487',  badge: '+12.5%',   iconBg: 'rgba(0,168,107,0.10)',   iconColor: '#00A86B', iconId: 'users'        },
  { id: 'active-today', label: "Actifs Aujourd'hui",      value: '342',    badge: 'Actifs',   iconBg: 'rgba(37,99,235,0.10)',   iconColor: '#2563EB', iconId: 'usercheck'    },
  { id: 'new',          label: 'Nouvelles Inscriptions',  value: '47',     badge: '+8.2%',    iconBg: 'rgba(168,85,247,0.10)',  iconColor: '#A855F7', iconId: 'userplus'     },
  { id: 'reservations', label: "Réservations Aujourd'hui",value: '189',    badge: 'Live',     iconBg: 'rgba(249,115,22,0.10)', iconColor: '#F97316', iconId: 'calendar'     },
  { id: 'cancellation', label: "Taux Annulation",         value: '8.3%',   badge: '-2.1%',    iconBg: 'rgba(229,57,53,0.10)',  iconColor: '#E53935', iconId: 'trendingdown' },
  { id: 'disputes',     label: 'Litiges Ouverts',         value: '12',     badge: '12',       iconBg: 'rgba(244,180,0,0.10)',  iconColor: '#F4B400', iconId: 'alert'        },
  { id: 'satisfaction', label: 'Taux Satisfaction',       value: '4.8',    badge: 'Excellent',iconBg: 'rgba(34,197,94,0.10)',  iconColor: '#22C55E', iconId: 'star'         },
  { id: 'suspended',    label: 'Utilisateurs Suspendus',  value: '13',     badge: '0.5%',     iconBg: 'rgba(107,114,128,0.10)',iconColor: '#6B7280', iconId: 'userx'        },
];

// ── Passengers page — filter options ─────────────────────
export const PASSENGER_CITY_OPTIONS = [
  { value: 'all',      label: 'Toutes les villes' },
  { value: 'Dakar',    label: 'Dakar'             },
  { value: 'Cotonou',  label: 'Cotonou'           },
  { value: 'Abidjan',  label: 'Abidjan'           },
] as const;

export const PASSENGER_RISK_OPTIONS = [
  { value: 'all',     label: 'Niveau de risque' },
  { value: 'Faible',  label: 'Faible'           },
  { value: 'Moyen',   label: 'Moyen'            },
  { value: 'Élevé',   label: 'Élevé'            },
] as const;

export const PASSENGER_STATUS_OPTIONS = [
  { value: 'all',       label: 'Statut compte' },
  { value: 'Actif',     label: 'Actif'         },
  { value: 'Inactif',   label: 'Inactif'       },
  { value: 'Suspendu',  label: 'Suspendu'      },
] as const;

export const PASSENGER_VERIF_OPTIONS = [
  { value: 'all',      label: 'Vérification'   },
  { value: 'verified', label: 'Vérifié'        },
  { value: 'pending',  label: 'En attente'     },
] as const;

// ── Passengers page — mock passengers ────────────────────
import type { Passenger } from '../models/passenger.model';

export const MOCK_PASSENGERS: Passenger[] = [
  {
    id: '1', passengerId: 'PSG-2847', name: 'Aminata Diallo',
    phone: '+221 77 123 4567', email: 'aminata.d@email.com',
    city: 'Dakar', reservations: 127, spending: '45,890 FCFA',
    rating: 4.9, trustScore: 95,
    createdAt: '12 Jan 2024', createdAgo: 'Il y a 4 mois',
    lastActivity: 'Il y a 2h', activityStatus: 'En ligne',
    status: 'Actif', riskLevel: 'Faible',
  },
  {
    id: '2', passengerId: 'PSG-2848', name: 'Moussa Traoré',
    phone: '+229 97 456 789', email: 'moussa.t@email.com',
    city: 'Cotonou', reservations: 43, spending: '18,200 FCFA',
    rating: 4.2, trustScore: 72,
    createdAt: '05 Mar 2024', createdAgo: 'Il y a 2 mois',
    lastActivity: 'Il y a 1j', activityStatus: 'Hors ligne',
    status: 'Actif', riskLevel: 'Moyen',
  },
  {
    id: '3', passengerId: 'PSG-2849', name: 'Fatou Sow',
    phone: '+225 07 891 234', email: 'fatou.s@email.com',
    city: 'Abidjan', reservations: 8, spending: '3,500 FCFA',
    rating: 3.8, trustScore: 40,
    createdAt: '18 Avr 2024', createdAgo: 'Il y a 1 mois',
    lastActivity: 'Il y a 3j', activityStatus: 'Hors ligne',
    status: 'Suspendu', riskLevel: 'Élevé',
  },
];

// ── Real-time activity data ──────────────────────────────
export const ACTIVITY_INSCRIPTIONS = [
  { id: '1', name: 'Koffi Mensah',  time: 'Il y a 2 min', avatar: 'https://placehold.co/32x32' },
  { id: '2', name: 'Fatou Diallo',  time: 'Il y a 5 min', avatar: 'https://placehold.co/32x32' },
] as const;

export const ACTIVITY_TRIPS = [
  { id: '1', route: 'Cotonou → Porto-Novo', driver: 'Par Jean-Baptiste' },
  { id: '2', route: 'Parakou → Cotonou',    driver: 'Par Aïcha Kone' },
] as const;

export const ACTIVITY_PAYMENTS = [
  { id: '1', amount: '₣2,500', trip: 'Trajet #4567' },
  { id: '2', amount: '₣3,200', trip: 'Trajet #4568' },
] as const;

export const ACTIVITY_DISPUTES = [
  { id: '1', title: 'Retard conducteur',  trip: 'Trajet #4565', variant: 'error'   as const },
  { id: '2', title: 'Problème paiement',  trip: 'Trajet #4563', variant: 'warning' as const },
] as const;

// ── Trips page — KPI data ────────────────────────────────
export const TRIP_KPI_DATA: PassengerKpiData[] = [
  { id: 'active',    label: 'Trajets Actifs',   value: '342',          badge: '+12%',  iconBg: 'rgba(0,168,107,0.10)',   iconColor: '#00A86B', iconId: 'navigation' },
  { id: 'completed', label: 'Trajets Terminés', value: '1,847',        badge: '+8%',   iconBg: 'rgba(37,99,235,0.10)',   iconColor: '#2563EB', iconId: 'checkCircle' },
  { id: 'flagged',   label: 'Trajets Signalés', value: '23',           badge: '+3',    iconBg: 'rgba(244,180,0,0.10)',  iconColor: '#F4B400', iconId: 'alertTriangle',
    badgeBg: 'rgba(229,57,53,0.10)', badgeColor: '#E53935' },
  { id: 'revenue',   label: 'Revenus Générés',  value: '428,500 FCFA', badge: '+24%',  iconBg: 'rgba(0,168,107,0.10)',   iconColor: '#00A86B', iconId: 'trendingUp' },
];

// ── Trips page — filter options ──────────────────────────
export const TRIP_DEPARTURE_OPTIONS = [
  { value: 'all',         label: 'Toutes les villes' },
  { value: 'Cotonou',     label: 'Cotonou'           },
  { value: 'Porto-Novo',  label: 'Porto-Novo'        },
  { value: 'Parakou',     label: 'Parakou'           },
] as const;

export const TRIP_DESTINATION_OPTIONS = [
  { value: 'all',         label: 'Toutes les villes' },
  { value: 'Cotonou',     label: 'Cotonou'           },
  { value: 'Porto-Novo',  label: 'Porto-Novo'        },
  { value: 'Parakou',     label: 'Parakou'           },
] as const;

export const TRIP_STATUS_OPTIONS = [
  { value: 'all',      label: 'Tous les statuts' },
  { value: 'Actif',    label: 'Actif'            },
  { value: 'Terminé',  label: 'Terminé'          },
  { value: 'Annulé',   label: 'Annulé'           },
  { value: 'Signalé',  label: 'Signalé'          },
] as const;

// ── Reservations page — KPI data ─────────────────────────
export const RESERVATION_KPI_DATA: PassengerKpiData[] = [
  { id: 'today',    label: "Réservations Aujourd'hui", value: '2,847',        badge: '+12.5%', iconBg: 'rgba(0,168,107,0.10)',  iconColor: '#00A86B', iconId: 'calendar'    },
  { id: 'active',   label: 'Réservations Actives',     value: '1,234',        badge: '+8.2%',  iconBg: 'rgba(37,99,235,0.10)',  iconColor: '#2563EB', iconId: 'checkCircle' },
  { id: 'revenue',  label: 'Revenus Générés',          value: '47,829 FCFA',  badge: '+15.8%', iconBg: 'rgba(0,168,107,0.10)',  iconColor: '#00A86B', iconId: 'trendingUp'  },
  { id: 'confirm',  label: 'Taux Confirmation',        value: '94.2%',        badge: '+2.1%',  iconBg: 'rgba(0,168,107,0.10)',  iconColor: '#00A86B', iconId: 'star'        },
];

// ── Reservations page — filter options ───────────────────
export const RESERVATION_CITY_OPTIONS = [
  { value: 'all',        label: 'Toutes les villes' },
  { value: 'Cotonou',    label: 'Cotonou'           },
  { value: 'Porto-Novo', label: 'Porto-Novo'        },
  { value: 'Parakou',    label: 'Parakou'           },
] as const;

export const RESERVATION_STATUS_OPTIONS = [
  { value: 'all',         label: 'Tous les statuts' },
  { value: 'Confirmée',   label: 'Confirmée'        },
  { value: 'En attente',  label: 'En attente'       },
  { value: 'Annulée',     label: 'Annulée'          },
  { value: 'Terminée',    label: 'Terminée'         },
] as const;

export const RESERVATION_PAYMENT_OPTIONS = [
  { value: 'all',         label: 'Tous les paiements' },
  { value: 'Payé',        label: 'Payé'               },
  { value: 'En attente',  label: 'En attente'         },
  { value: 'Échoué',      label: 'Échoué'             },
  { value: 'Remboursé',   label: 'Remboursé'          },
] as const;

// ── Reservations page — mock reservations ────────────────
import type { Reservation } from '../models/reservation.model';

export const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: '1', reservationId: 'RES-2024-001',
    createdAt: '15 Jan 2024, 12:30', createdAgo: 'Il y a 2h',
    passengerName: 'Marie Dupont', passengerAvatar: 'https://placehold.co/40x40', passengerVerified: true,
    driverName: 'Jean Martin', driverAvatar: 'https://placehold.co/40x40', driverRating: 4.9,
    from: 'Cotonou', to: 'Porto-Novo', seats: 2,
    date: '15 Jan 2024', time: '14:30',
    amount: '45,000 FCFA', paymentStatus: 'Payé',
    status: 'Confirmée', riskLevel: 'Faible',
    timelineEvents: [
      { label: 'Réservation créée',  time: '15 Jan 2024, 12:30', done: true },
      { label: 'Paiement effectué',  time: '15 Jan 2024, 12:32', done: true },
      { label: 'Trajet confirmé',    time: '15 Jan 2024, 13:00', done: true },
    ],
  },
  {
    id: '2', reservationId: 'RES-2024-002',
    createdAt: '16 Jan 2024, 09:15', createdAgo: 'Il y a 4h',
    passengerName: 'Pierre Moreau', passengerAvatar: 'https://placehold.co/40x40', passengerVerified: false,
    driverName: 'Sophie Bernard', driverAvatar: 'https://placehold.co/40x40', driverRating: 4.7,
    from: 'Porto-Novo', to: 'Cotonou', seats: 1,
    date: '16 Jan 2024', time: '09:15',
    amount: '32,500 FCFA', paymentStatus: 'En attente',
    status: 'En attente', riskLevel: 'Moyen',
    timelineEvents: [
      { label: 'Réservation créée',  time: '16 Jan 2024, 09:15', done: true  },
      { label: 'Paiement en cours',  time: 'En attente',         done: false },
      { label: 'Trajet à confirmer', time: '—',                  done: false },
    ],
  },
  {
    id: '3', reservationId: 'RES-2024-003',
    createdAt: '14 Jan 2024, 07:00', createdAgo: 'Il y a 1j',
    passengerName: 'Fatou Sow', passengerAvatar: 'https://placehold.co/40x40', passengerVerified: true,
    driverName: 'Koffi Mensah', driverAvatar: 'https://placehold.co/40x40', driverRating: 4.8,
    from: 'Cotonou', to: 'Parakou', seats: 3,
    date: '14 Jan 2024', time: '07:00',
    amount: '75,000 FCFA', paymentStatus: 'Payé',
    status: 'Terminée', riskLevel: 'Faible',
    timelineEvents: [
      { label: 'Réservation créée',  time: '14 Jan 2024, 07:00', done: true },
      { label: 'Paiement effectué',  time: '14 Jan 2024, 07:02', done: true },
      { label: 'Trajet terminé',     time: '14 Jan 2024, 14:30', done: true },
    ],
  },
];

// ── Payments page — KPI data ─────────────────────────────
export const PAYMENT_KPI_DATA: PassengerKpiData[] = [
  { id: 'today',    label: "Transactions Aujourd'hui", value: '4,521',         badge: '+31.2%', iconBg: 'rgba(37,99,235,0.10)',  iconColor: '#2563EB', iconId: 'creditCard'  },
  { id: 'volume',   label: 'Volume Total',             value: '2.4M FCFA',     badge: '+18.7%', iconBg: 'rgba(0,168,107,0.10)',  iconColor: '#00A86B', iconId: 'trendingUp'  },
  { id: 'success',  label: 'Taux de Succès',           value: '97.8%',         badge: '+1.2%',  iconBg: 'rgba(34,197,94,0.10)',  iconColor: '#22C55E', iconId: 'checkCircle' },
  { id: 'refunds',  label: 'Remboursements',           value: '12',            badge: '3',      iconBg: 'rgba(229,57,53,0.10)', iconColor: '#E53935', iconId: 'alertTriangle',
    badgeBg: 'rgba(229,57,53,0.10)', badgeColor: '#E53935' },
];

// ── Payments page — filter options ───────────────────────
// Valeurs vides ('') → l'API n'envoie pas le paramètre (tous)
export const PAYMENT_STATUS_OPTIONS = [
  { value: '',            label: 'Tous les statuts' },
  { value: 'En attente',  label: 'En attente'       },
  { value: 'Sécurisé',    label: 'Sécurisé'         },
  { value: 'Libéré',      label: 'Libéré'           },
  { value: 'Échoué',      label: 'Échoué'           },
  { value: 'Remboursé',   label: 'Remboursé'        },
] as const;

export const PAYMENT_METHOD_OPTIONS = [
  { value: '',          label: 'Tous les opérateurs' },
  { value: 'MTN',       label: 'MTN Money'           },
  { value: 'Moov',      label: 'Moov Money'          },
  { value: 'Celtiis',   label: 'Celtiis'             },
] as const;


// ── Disputes page — KPI data ─────────────────────────────
export interface DisputeKpiData {
  id:         string;
  label:      string;
  value:      string;
  trend:      string;
  trendColor: string;
  iconBg:     string;
  iconColor:  string;
  iconId:     string;
  suffix:     string;
}

export const DISPUTE_KPI_DATA: DisputeKpiData[] = [
  { id: 'active', label: 'Litiges Actifs',         value: '42',          trend: '+12%',  trendColor: '#E53935', iconBg: 'rgba(244,180,0,0.10)',  iconColor: '#F4B400', iconId: 'alertTriangle', suffix: 'vs semaine dernière' },
  { id: 'amount', label: 'Montant Bloqué',          value: '1,245K FCFA', trend: '-5%',   trendColor: '#00A86B', iconBg: '#F3F4F6',               iconColor: '#4B5563', iconId: 'lock',          suffix: 'vs semaine dernière' },
  { id: 'time',   label: 'Temps Résolution Moyen',  value: '4.2h',        trend: '-1.1h', trendColor: '#00A86B', iconBg: 'rgba(37,99,235,0.10)',  iconColor: '#2563EB', iconId: 'clock',         suffix: 'vs semaine dernière' },
];

// ── Disputes page — filter options ───────────────────────
export const DISPUTE_TYPE_OPTIONS = [
  { value: 'all',           label: 'Tous les types'  },
  { value: 'Paiement',      label: 'Paiement'        },
  { value: 'Annulation',    label: 'Annulation'      },
  { value: 'Comportement',  label: 'Comportement'    },
  { value: 'Retard',        label: 'Retard'          },
  { value: 'Autre',         label: 'Autre'           },
] as const;

export const DISPUTE_STATUS_OPTIONS = [
  { value: 'all',        label: 'Tous les statuts' },
  { value: 'Ouvert',     label: 'Ouvert'           },
  { value: 'En cours',   label: 'En cours'         },
  { value: 'Résolu',     label: 'Résolu'           },
  { value: 'Clôturé',    label: 'Clôturé'          },
] as const;

export const DISPUTE_PRIORITY_OPTIONS = [
  { value: 'all',      label: 'Toutes priorités' },
  { value: 'Critique', label: 'Critique'         },
  { value: 'Élevée',   label: 'Élevée'           },
  { value: 'Moyenne',  label: 'Moyenne'          },
  { value: 'Faible',   label: 'Faible'           },
] as const;

// ── Disputes page — mock disputes ────────────────────────
export const MOCK_DISPUTES = [
  {
    id: '1', disputeId: 'LIT-001', reservationId: 'RES-2024-002',
    passengerName: 'Pierre Moreau',  passengerAvatar: 'https://placehold.co/40x40',
    driverName:    'Sophie Bernard', driverAvatar:    'https://placehold.co/40x40',
    type: 'Paiement',
    motif: 'Paiement non reçu',
    description: 'Paiement non reçu après annulation du trajet. Le passager réclame un remboursement intégral.',
    trajet: 'Porto-Novo → Cotonou',
    amount: '32,500 FCFA', date: '16 Jan 2024', createdAgo: 'Il y a 4h',
    priority: 'Critique', status: 'Ouvert',
    conductor: { name: 'Sophie Bernard', shortName: 'SB', avatar: 'https://placehold.co/40x40', role: 'Conducteur', rating: 4.7, tripCount: 203 },
    passenger: { name: 'Pierre Moreau',  shortName: 'PM', avatar: 'https://placehold.co/40x40', role: 'Passager',   rating: 4.2, tripCount: 43  },
    investigationEvents: [
      { label: 'Litige ouvert',            time: '16 Jan 2024, 09:15', done: true,  quote: '"Le conducteur a annulé sans me prévenir et je n\'ai pas été remboursé."' },
      { label: 'Analyse du paiement',      time: '16 Jan 2024, 10:00', done: true,  note: 'Transaction TX-8471 en état PENDING depuis 22h. Escalade déclenchée.' },
      { label: 'Vérification transaction', time: '16 Jan 2024, 11:30', done: false, hasAttachments: true, attachmentCount: 2 },
      { label: 'Décision finale',          time: 'En attente',         done: false },
    ],
  },
  {
    id: '2', disputeId: 'LIT-002', reservationId: 'RES-2024-005',
    passengerName: 'Moussa Traoré', passengerAvatar: 'https://placehold.co/40x40',
    driverName:    'Koffi Mensah',  driverAvatar:    'https://placehold.co/40x40',
    type: 'Retard',
    motif: 'Retard excessif',
    description: 'Conducteur en retard de plus de 45 minutes sans communication préalable.',
    trajet: 'Cotonou → Parakou',
    amount: '15,000 FCFA', date: '15 Jan 2024', createdAgo: 'Il y a 1j',
    priority: 'Élevée', status: 'En cours',
    conductor: { name: 'Koffi Mensah',  shortName: 'KM', avatar: 'https://placehold.co/40x40', role: 'Conducteur', rating: 4.8, tripCount: 127 },
    passenger: { name: 'Moussa Traoré', shortName: 'MT', avatar: 'https://placehold.co/40x40', role: 'Passager',   rating: 4.5, tripCount: 19  },
    investigationEvents: [
      { label: 'Litige ouvert',       time: '15 Jan 2024, 14:00', done: true,  quote: '"J\'ai attendu 50 minutes, le conducteur ne répondait pas."' },
      { label: 'Contact conducteur',  time: '15 Jan 2024, 14:45', done: true,  note: 'Conducteur contacté — invoque embouteillages majeurs sur la N1.' },
      { label: 'Analyse GPS',         time: '15 Jan 2024, 16:00', done: false, hasAttachments: true, attachmentCount: 1 },
      { label: 'Arbitrage en cours',  time: 'En attente',         done: false },
    ],
  },
  {
    id: '3', disputeId: 'LIT-003', reservationId: 'RES-2024-001',
    passengerName: 'Marie Dupont', passengerAvatar: 'https://placehold.co/40x40',
    driverName:    'Jean Martin',  driverAvatar:    'https://placehold.co/40x40',
    type: 'Comportement',
    motif: 'Comportement inapproprié',
    description: 'Comportement inapproprié du conducteur signalé par le passager lors du trajet.',
    trajet: 'Cotonou → Porto-Novo',
    amount: '45,000 FCFA', date: '14 Jan 2024', createdAgo: 'Il y a 2j',
    priority: 'Critique', status: 'Résolu',
    conductor: { name: 'Jean Martin',  shortName: 'JM', avatar: 'https://placehold.co/40x40', role: 'Conducteur', rating: 4.9, tripCount: 312 },
    passenger: { name: 'Marie Dupont', shortName: 'MD', avatar: 'https://placehold.co/40x40', role: 'Passager',   rating: 4.8, tripCount: 67  },
    investigationEvents: [
      { label: 'Litige ouvert',        time: '14 Jan 2024, 08:00', done: true, quote: '"Le conducteur a tenu des propos irrespectueux durant tout le trajet."' },
      { label: 'Recueil des preuves',  time: '14 Jan 2024, 09:30', done: true, hasAttachments: true, attachmentCount: 3 },
      { label: 'Avertissement émis',   time: '14 Jan 2024, 11:00', done: true, note: 'Avertissement formel adressé au conducteur. Remboursement partiel (50%) accordé.' },
      { label: 'Litige résolu',        time: '14 Jan 2024, 14:00', done: true },
    ],
  },
  {
    id: '4', disputeId: 'LIT-004', reservationId: 'RES-2024-006',
    passengerName: 'Fatou Sow',   passengerAvatar: 'https://placehold.co/40x40',
    driverName:    'Adjovi Sèna', driverAvatar:    'https://placehold.co/40x40',
    type: 'Annulation',
    motif: 'Annulation tardive',
    description: 'Annulation tardive par le conducteur sans remboursement proposé au passager.',
    trajet: 'Abidjan → Grand-Bassam',
    amount: '22,000 FCFA', date: '13 Jan 2024', createdAgo: 'Il y a 3j',
    priority: 'Moyenne', status: 'Clôturé',
    conductor: { name: 'Adjovi Sèna', shortName: 'AS', avatar: 'https://placehold.co/40x40', role: 'Conducteur', rating: 4.3, tripCount: 88  },
    passenger: { name: 'Fatou Sow',   shortName: 'FS', avatar: 'https://placehold.co/40x40', role: 'Passager',   rating: 3.8, tripCount: 8   },
    investigationEvents: [
      { label: 'Litige ouvert',          time: '13 Jan 2024, 17:00', done: true, quote: '"Le conducteur a annulé 10 min avant le départ, je n\'ai pas eu de remboursement."' },
      { label: 'Vérification politique', time: '13 Jan 2024, 17:30', done: true, note: 'Politique annulation tardive confirmée — remboursement intégral dû.' },
      { label: 'Remboursement émis',     time: '13 Jan 2024, 18:00', done: true },
      { label: 'Dossier clôturé',        time: '13 Jan 2024, 18:05', done: true },
    ],
  },
  {
    id: '5', disputeId: 'LIT-005', reservationId: 'RES-2024-009',
    passengerName: 'Aminata Diallo', passengerAvatar: 'https://placehold.co/40x40',
    driverName:    'Yao Kobenan',    driverAvatar:    'https://placehold.co/40x40',
    type: 'Paiement',
    motif: 'Double facturation',
    description: 'Passager facturé deux fois pour le même trajet. Remboursement d\'un doublon requis.',
    trajet: 'Dakar → Thiès',
    amount: '18,500 FCFA', date: '17 Jan 2024', createdAgo: 'Il y a 2h',
    priority: 'Élevée', status: 'Ouvert',
    conductor: { name: 'Yao Kobenan',    shortName: 'YK', avatar: 'https://placehold.co/40x40', role: 'Conducteur', rating: 4.6, tripCount: 155 },
    passenger: { name: 'Aminata Diallo', shortName: 'AD', avatar: 'https://placehold.co/40x40', role: 'Passager',   rating: 4.9, tripCount: 127 },
    investigationEvents: [
      { label: 'Litige ouvert',        time: '17 Jan 2024, 07:45', done: true,  quote: '"J\'ai été débité deux fois le même montant pour mon trajet de ce matin."' },
      { label: 'Analyse transactions', time: '17 Jan 2024, 08:30', done: false, hasAttachments: true, attachmentCount: 2 },
      { label: 'Contact banque',       time: 'En attente',         done: false },
      { label: 'Remboursement',        time: 'En attente',         done: false },
    ],
  },
];

// ── Support page — KPI data ──────────────────────────────
export const SUPPORT_KPI_DATA: UserPageMetric[] = [
  { id: 'new-tickets',    label: 'Tickets Nouveaux',    value: '24', trend: '+12% vs hier',    trendColor: '#EF4444', iconBg: '#FEF9C3', iconColor: '#CA8A04', iconId: 'alertTriangle' },
  { id: 'in-progress',   label: 'En Cours',            value: '18', trend: 'Temps moyen: 2h', trendColor: '#3B82F6', iconBg: '#DBEAFE', iconColor: '#2563EB', iconId: 'messageCircle' },
  { id: 'resolved-today',label: "Résolus Aujourd'hui", value: '42', trend: '95% satisfaction', trendColor: '#22C55E', iconBg: '#DCFCE7', iconColor: '#16A34A', iconId: 'checkCircle'  },
  { id: 'escalated',     label: 'Escaladés',           value: '3',  trend: 'Priorité haute',  trendColor: '#EF4444', iconBg: '#FEE2E2', iconColor: '#DC2626', iconId: 'alertTriangle' },
];

// ── Support page — filter options ────────────────────────
export const SUPPORT_STATUS_OPTIONS = [
  { value: 'all',      label: 'Tous les statuts' },
  { value: 'Nouveau',  label: 'Nouveau'          },
  { value: 'En cours', label: 'En cours'         },
  { value: 'Résolu',   label: 'Résolu'           },
  { value: 'Clôturé',  label: 'Clôturé'          },
] as const;

export const SUPPORT_PRIORITY_OPTIONS = [
  { value: 'all',     label: 'Toutes priorités' },
  { value: 'Haute',   label: 'Haute'            },
  { value: 'Moyenne', label: 'Moyenne'          },
  { value: 'Basse',   label: 'Basse'            },
] as const;

export const SUPPORT_AGENT_OPTIONS = [
  { value: 'all',         label: 'Tous les agents' },
  { value: 'Sarah K.',    label: 'Sarah K.'        },
  { value: 'David M.',    label: 'David M.'        },
  { value: 'Non assigné', label: 'Non assigné'     },
] as const;

// ── Support page — mock tickets ──────────────────────────
export const MOCK_TICKETS = [
  {
    id: '1', ticketId: '#TK-001234',
    userName: 'Aïcha Traoré', userEmail: 'aicha.traore@email.com', userAvatar: 'https://placehold.co/32x32',
    subject: 'Problème de paiement', description: 'Transaction échouée lors du trajet',
    priority: 'Haute', channel: 'App Mobile',
    date: '13 Mai 2026', time: '09:23', createdAgo: 'Il y a 2h',
    status: 'Nouveau', agentName: null, agentAvatar: null, timeElapsed: '2h 15m',
  },
  {
    id: '2', ticketId: '#TK-001233',
    userName: 'Kwame Asante', userEmail: 'kwame.asante@email.com', userAvatar: 'https://placehold.co/32x32',
    subject: 'Conducteur non trouvé', description: 'Impossible de localiser le conducteur',
    priority: 'Moyenne', channel: 'Téléphone',
    date: '13 Mai 2026', time: '08:45', createdAgo: 'Il y a 3h',
    status: 'En cours', agentName: 'Sarah K.', agentAvatar: 'https://placehold.co/24x24', timeElapsed: '45m',
  },
  {
    id: '3', ticketId: '#TK-001232',
    userName: 'Fatima Ouédraogo', userEmail: 'fatima.ouedraogo@email.com', userAvatar: 'https://placehold.co/32x32',
    subject: 'Remboursement demandé', description: 'Trajet annulé par le conducteur',
    priority: 'Basse', channel: 'Email',
    date: '12 Mai 2026', time: '16:30', createdAgo: 'Il y a 1j',
    status: 'Résolu', agentName: 'David M.', agentAvatar: 'https://placehold.co/24x24', timeElapsed: '1h 20m',
  },
  {
    id: '4', ticketId: '#TK-001231',
    userName: 'Moussa Koné', userEmail: 'moussa.kone@email.com', userAvatar: 'https://placehold.co/32x32',
    subject: 'Application crash', description: 'L\'appli se ferme lors de la réservation',
    priority: 'Haute', channel: 'App Mobile',
    date: '12 Mai 2026', time: '14:10', createdAgo: 'Il y a 1j',
    status: 'En cours', agentName: 'Sarah K.', agentAvatar: 'https://placehold.co/24x24', timeElapsed: '3h 40m',
  },
  {
    id: '5', ticketId: '#TK-001230',
    userName: 'Aminata Sow', userEmail: 'aminata.sow@email.com', userAvatar: 'https://placehold.co/32x32',
    subject: 'Note injuste reçue', description: 'Note de 1 étoile sans raison valable',
    priority: 'Moyenne', channel: 'Chat',
    date: '11 Mai 2026', time: '10:00', createdAgo: 'Il y a 2j',
    status: 'Clôturé', agentName: 'David M.', agentAvatar: 'https://placehold.co/24x24', timeElapsed: '1h 05m',
  },
];

// ── Notifications page — KPI data ───────────────────────
export const NOTIF_SUMMARY_DATA: SettingsSummaryItem[] = [
  { id: 'total',   label: 'Total Notifications',   value: '128', iconBg: '#DBEAFE', iconColor: '#2563EB', iconId: 'bell'          },
  { id: 'unread',  label: 'Non Lues',              value: '24',  valueColor: '#DC2626', iconBg: '#FEE2E2', iconColor: '#DC2626', iconId: 'mail' },
  { id: 'urgent',  label: 'Urgentes',              value: '7',   valueColor: '#CA8A04', iconBg: '#FEF9C3', iconColor: '#CA8A04', iconId: 'alertTriangle' },
  { id: 'handled', label: "Traitées Aujourd'hui",  value: '43',  iconBg: '#DCFCE7', iconColor: '#16A34A', iconId: 'checkCircle'   },
];

// ── Notifications page — filter options ──────────────────
export const NOTIF_TYPE_OPTIONS = [
  { value: 'all',     label: 'Tous les types' },
  { value: 'system',  label: 'Système'        },
  { value: 'user',    label: 'Utilisateur'    },
  { value: 'payment', label: 'Paiement'       },
  { value: 'dispute', label: 'Litige'         },
  { value: 'driver',  label: 'Conducteur'     },
] as const;

// ── Notifications page — mock notifications ───────────────
export const MOCK_NOTIFICATIONS = [
  {
    id: '1', notifId: 'NOTIF-0001',
    type: 'system', priority: 'Urgente', status: 'Non lue',
    title: "Timeout API — Mobile Money MTN",
    description: "L'API MTN Mobile Money répond avec un délai supérieur à 5s. Des transactions peuvent être affectées. Vérification de l'infrastructure requise.",
    date: '18 Jun 2026', time: '14:23', createdAgo: 'Il y a 12 min',
    dateGroup: "Aujourd'hui",
    refEntity: 'PARAM-API', refLabel: 'Voir la configuration',
  },
  {
    id: '2', notifId: 'NOTIF-0002',
    type: 'payment', priority: 'Urgente', status: 'Non lue',
    title: 'Double débit détecté — TXN-2024-0042',
    description: 'Aminata Sow a été débitée deux fois de 18,500 FCFA pour le même trajet. Un remboursement doit être émis immédiatement.',
    date: '18 Jun 2026', time: '13:47', createdAgo: 'Il y a 48 min',
    dateGroup: "Aujourd'hui",
    userName: 'Aminata Sow', userAvatar: 'https://placehold.co/32x32',
    refEntity: 'TXN-2024-0042', refLabel: 'Voir la transaction',
  },
  {
    id: '3', notifId: 'NOTIF-0003',
    type: 'dispute', priority: 'Haute', status: 'Non lue',
    title: 'Nouveau litige ouvert — LIT-006',
    description: 'Pierre Moreau a ouvert un litige pour non-remboursement après annulation de son trajet Porto-Novo → Cotonou (32,500 FCFA).',
    date: '18 Jun 2026', time: '12:31', createdAgo: 'Il y a 2h',
    dateGroup: "Aujourd'hui",
    userName: 'Pierre Moreau', userAvatar: 'https://placehold.co/32x32',
    refEntity: 'LIT-006', refLabel: 'Voir le litige',
  },
  {
    id: '4', notifId: 'NOTIF-0004',
    type: 'user', priority: 'Normale', status: 'Non lue',
    title: 'Nouvel utilisateur inscrit',
    description: 'Koffi Amégashie vient de créer un compte passager. La vérification d\'identité est en attente de validation.',
    date: '18 Jun 2026', time: '10:05', createdAgo: 'Il y a 4h',
    dateGroup: "Aujourd'hui",
    userName: 'Koffi Amégashie', userAvatar: 'https://placehold.co/32x32',
    refEntity: 'USR-1892', refLabel: "Voir l'utilisateur",
  },
  {
    id: '5', notifId: 'NOTIF-0005',
    type: 'driver', priority: 'Haute', status: 'Lue',
    title: 'Conducteur suspendu — comportement signalé',
    description: 'Jean Martin a été temporairement suspendu suite à 3 signalements de comportement inapproprié en moins de 48h.',
    date: '17 Jun 2026', time: '18:14', createdAgo: 'Il y a 1j',
    dateGroup: 'Hier',
    userName: 'Jean Martin', userAvatar: 'https://placehold.co/32x32',
    refEntity: 'DRV-0312', refLabel: 'Voir le conducteur',
  },
  {
    id: '6', notifId: 'NOTIF-0006',
    type: 'payment', priority: 'Normale', status: 'Traitée',
    title: 'Remboursement émis avec succès',
    description: 'Le remboursement de 32,500 FCFA pour la réservation RES-2024-002 a bien été envoyé sur le compte Mobile Money de Pierre Moreau.',
    date: '17 Jun 2026', time: '15:30', createdAgo: 'Il y a 1j',
    dateGroup: 'Hier',
    userName: 'Pierre Moreau', userAvatar: 'https://placehold.co/32x32',
    refEntity: 'RES-2024-002', refLabel: 'Voir la réservation',
  },
  {
    id: '7', notifId: 'NOTIF-0007',
    type: 'system', priority: 'Basse', status: 'Lue',
    title: 'Maintenance planifiée — 20 Jun 2026',
    description: 'Une maintenance système est prévue de 02h00 à 04h00. La plateforme sera en accès limité durant cette fenêtre de maintenance.',
    date: '17 Jun 2026', time: '09:00', createdAgo: 'Il y a 1j',
    dateGroup: 'Hier',
  },
  {
    id: '8', notifId: 'NOTIF-0008',
    type: 'driver', priority: 'Normale', status: 'Traitée',
    title: 'Nouveau conducteur validé',
    description: 'Adjovi Sèna a finalisé la vérification de son identité et de ses documents. Son profil conducteur est maintenant actif sur la plateforme.',
    date: '15 Jun 2026', time: '11:45', createdAgo: 'Il y a 3j',
    dateGroup: 'Cette semaine',
    userName: 'Adjovi Sèna', userAvatar: 'https://placehold.co/32x32',
    refEntity: 'DRV-0088', refLabel: 'Voir le conducteur',
  },
];

// ── Settings page — summary cards ───────────────────────
export interface SettingsSummaryItem {
  id:          string;
  label:       string;
  value:       string;
  valueColor?: string;
  iconBg:      string;
  iconColor:   string;
  iconId:      string;
}

export const SETTINGS_SUMMARY_DATA: SettingsSummaryItem[] = [
  { id: 'active',   label: 'Paramètres Actifs',  value: '247',    iconBg: '#DBEAFE', iconColor: '#2563EB', iconId: 'settings'    },
  { id: 'apis',     label: 'APIs Connectées',     value: '12',     iconBg: '#DCFCE7', iconColor: '#16A34A', iconId: 'link2'       },
  { id: 'security', label: 'Niveau Sécurité',     value: 'Élevé',  valueColor: '#16A34A', iconBg: '#DCFCE7', iconColor: '#16A34A', iconId: 'shieldCheck' },
  { id: 'revenue',  label: 'Revenus Plateforme',  value: '€45.2K', iconBg: '#FEF9C3', iconColor: '#CA8A04', iconId: 'banknote'   },
];

// ── Settings page — commissions ──────────────────────────
export const SETTINGS_COMMISSIONS = [
  { id: '1', type: 'Trajet Standard', rate: '15%', revenue: '€12.4K', status: 'Actif' },
  { id: '2', type: 'Trajet Premium',  rate: '20%', revenue: '€8.7K',  status: 'Actif' },
] as const;

// ── Settings page — payment providers ───────────────────
export const SETTINGS_PAYMENT_PROVIDERS = [
  { id: 'mtn',   name: 'MTN Mobile Money', status: 'Connecté', responseTime: '1.2s', transactions: '1,247', failRate: '2.1%' },
  { id: 'moov',  name: 'Moov Money',       status: 'Connecté', responseTime: '0.9s', transactions: '892',   failRate: '1.8%' },
  { id: 'carte', name: 'Carte Bancaire',   status: 'En test',  responseTime: '2.1s', transactions: '156',   failRate: '5.2%' },
] as const;

// ── Settings page — security audit log ──────────────────
export const SETTINGS_SECURITY_LOGS = [
  { id: '1', time: '14:23', user: 'user@example.com', ip: '192.168.1.1', action: 'Connexion',       riskLevel: 'Faible' },
  { id: '2', time: '13:47', user: 'admin@minizon.com', ip: '10.0.0.5',   action: 'Modif. paramètre', riskLevel: 'Moyen' },
] as const;

// ── Settings page — admins ───────────────────────────────
export const SETTINGS_ADMINS = [
  { id: '1', name: 'John Doe',    avatar: 'https://placehold.co/32x32', email: 'john@minizon.com',  role: 'Super Admin',   lastLogin: 'Il y a 2h',  status: 'Actif' },
  { id: '2', name: 'Sarah Klein', avatar: 'https://placehold.co/32x32', email: 'sarah@minizon.com', role: 'Administrateur', lastLogin: 'Il y a 1j', status: 'Actif' },
] as const;

// ── Settings page — analytics BI ────────────────────────
export const SETTINGS_ANALYTICS = [
  { id: 'growth',     label: 'Croissance Utilisateurs', value: '+24.5%', valueColor: '#16A34A', period: 'Ce mois'       },
  { id: 'retention',  label: 'Taux Rétention',          value: '87.3%',  valueColor: '#2563EB', period: '30 jours'     },
  { id: 'conversion', label: 'Conversion',              value: '12.8%',  valueColor: '#9333EA', period: 'Réservations' },
] as const;

// ── Trips page — mock trips ──────────────────────────────
import type { Trip } from '../models/trip.model';

export const MOCK_TRIPS: Trip[] = [
  {
    id: '1', tripId: '#TRJ-8472',
    driverName: 'Koffi Mensah', driverRating: 4.8, driverReviews: 127,
    driverAvatar: 'https://placehold.co/40x40',
    from: 'Cotonou', to: 'Parakou',
    date: '24 Jan 2024', time: '14:30',
    seats: 4, pricePerSeat: '5,000 FCFA',
    passengers: [
      { id: 'p1', avatar: 'https://placehold.co/28x28' },
      { id: 'p2', avatar: 'https://placehold.co/28x28' },
      { id: 'p3', avatar: 'https://placehold.co/28x28' },
    ],
    seatsBooked: 3,
    revenue: '15,000 FCFA',
    bookingsCount: 3, pricePerSeatRaw: 5000, revenueRaw: 15000,
    status: 'Actif',
  },
  {
    id: '2', tripId: '#TRJ-8471',
    driverName: 'Adjovi Sèna', driverRating: 4.9, driverReviews: 203,
    driverAvatar: 'https://placehold.co/40x40',
    from: 'Porto-Novo', to: 'Cotonou',
    date: '24 Jan 2024', time: '08:00',
    seats: 4, pricePerSeat: '6,000 FCFA',
    passengers: [
      { id: 'p4', avatar: 'https://placehold.co/28x28' },
      { id: 'p5', avatar: 'https://placehold.co/28x28' },
    ],
    seatsBooked: 2,
    revenue: '12,000 FCFA',
    bookingsCount: 2, pricePerSeatRaw: 6000, revenueRaw: 12000,
    status: 'Actif',
  },
];
