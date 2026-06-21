import { useState, useMemo, useCallback } from 'react';
import type { Vehicle, VehicleMetrics } from '../models/vehicle.model';

const AV  = 'https://placehold.co/40x40';

// Placehold.co images for mock documents (no auth needed, works in dev + prod)
const IMG = {
  car1:  'https://placehold.co/480x320/1e293b/94a3b8?text=Toyota+Corolla',
  car2:  'https://placehold.co/480x320/0f172a/64748b?text=Honda+Civic',
  car3:  'https://placehold.co/480x320/1e3a5f/7dd3fc?text=Kia+Sportage',
  car4:  'https://placehold.co/480x320/14532d/86efac?text=Ford+Transit',
  cg1:   'https://placehold.co/480x320/f8fafc/475569?text=Carte+Grise',
  ass1:  'https://placehold.co/480x320/fff7ed/ea580c?text=Assurance',
  vis1:  'https://placehold.co/480x320/f0fdf4/16a34a?text=Visite+Technique',
};

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'v1', vehicleId: '#VEH-001',
    driverName: 'Koffi Mensah', driverAvatar: AV, driverId: '#DRV-001', driverPhone: '+229 97 00 00 01',
    make: 'Toyota', model: 'Corolla', year: 2019, type: 'Berline', plate: 'BN-1234-A', color: 'Blanc', seats: 4,
    status: 'Actif', vehiclePhoto: IMG.car1,
    documents: { carteGrise: 'ok', carteGriseUrl: IMG.cg1, assurance: 'ok', assuranceUrl: IMG.ass1, visite: 'ok', visiteUrl: IMG.vis1 },
    trips: 247, rating: 4.8, registeredAt: '15 Jan 2024',
  },
  {
    id: 'v2', vehicleId: '#VEH-002',
    driverName: 'Adjovi Sèna', driverAvatar: AV, driverId: '#DRV-002', driverPhone: '+229 97 00 00 02',
    make: 'Honda', model: 'Civic', year: 2020, type: 'Berline', plate: 'BN-2345-B', color: 'Gris', seats: 4,
    status: 'Actif', vehiclePhoto: IMG.car2,
    documents: { carteGrise: 'ok', carteGriseUrl: IMG.cg1, assurance: 'ok', assuranceUrl: IMG.ass1, visite: 'pending' },
    trips: 183, rating: 4.9, registeredAt: '20 Jan 2024',
  },
  {
    id: 'v3', vehicleId: '#VEH-003',
    driverName: 'Moussa Traoré', driverAvatar: AV, driverId: '#DRV-003', driverPhone: '+229 97 00 00 03',
    make: 'Hyundai', model: 'Tucson', year: 2018, type: 'SUV', plate: 'BN-3456-C', color: 'Noir', seats: 5,
    status: 'En inspection',
    documents: { carteGrise: 'ok', carteGriseUrl: IMG.cg1, assurance: 'pending', visite: 'pending' },
    trips: 92, rating: 4.5, registeredAt: '05 Feb 2024',
  },
  {
    id: 'v4', vehicleId: '#VEH-004',
    driverName: 'Fatou Diallo', driverAvatar: AV, driverId: '#DRV-004', driverPhone: '+229 97 00 00 04',
    make: 'Kia', model: 'Sportage', year: 2021, type: 'SUV', plate: 'BN-4567-D', color: 'Bleu', seats: 5,
    status: 'Actif', vehiclePhoto: IMG.car3,
    documents: { carteGrise: 'ok', carteGriseUrl: IMG.cg1, assurance: 'ok', assuranceUrl: IMG.ass1, visite: 'ok', visiteUrl: IMG.vis1 },
    trips: 314, rating: 4.7, registeredAt: '10 Feb 2024',
  },
  {
    id: 'v5', vehicleId: '#VEH-005',
    driverName: 'Ibrahim Konaté', driverAvatar: AV, driverId: '#DRV-005', driverPhone: '+229 97 00 00 05',
    make: 'Yamaha', model: 'FZ 125', year: 2022, type: 'Moto', plate: 'BN-5678-E', color: 'Rouge', seats: 1,
    status: 'Actif',
    documents: { carteGrise: 'ok', carteGriseUrl: IMG.cg1, assurance: 'ok', assuranceUrl: IMG.ass1 },
    trips: 521, rating: 4.6, registeredAt: '14 Feb 2024',
  },
  {
    id: 'v6', vehicleId: '#VEH-006',
    driverName: 'Aminata Touré', driverAvatar: AV, driverId: '#DRV-006', driverPhone: '+229 97 00 00 06',
    make: 'Nissan', model: 'X-Trail', year: 2017, type: 'SUV', plate: 'BN-6789-F', color: 'Blanc', seats: 5,
    status: 'Suspendu',
    documents: { carteGrise: 'ok', assurance: 'rejected', visite: 'rejected' },
    trips: 66, rating: 3.9, registeredAt: '18 Feb 2024',
  },
  {
    id: 'v7', vehicleId: '#VEH-007',
    driverName: 'Oumar Dieng', driverAvatar: AV, driverId: '#DRV-007', driverPhone: '+229 97 00 00 07',
    make: 'Renault', model: 'Kangoo', year: 2018, type: 'Van', plate: 'BN-7890-G', color: 'Gris', seats: 7,
    status: 'Actif',
    documents: { carteGrise: 'ok', carteGriseUrl: IMG.cg1, assurance: 'ok', assuranceUrl: IMG.ass1, visite: 'ok', visiteUrl: IMG.vis1 },
    trips: 189, rating: 4.4, registeredAt: '22 Feb 2024',
  },
  {
    id: 'v8', vehicleId: '#VEH-008',
    driverName: 'Celestin Hounkpè', driverAvatar: AV, driverId: '#DRV-008', driverPhone: '+229 97 00 00 08',
    make: 'Toyota', model: 'Land Cruiser', year: 2016, type: 'SUV', plate: 'BN-8901-H', color: 'Beige', seats: 7,
    status: 'En inspection',
    documents: { carteGrise: 'pending', assurance: 'pending', visite: 'rejected' },
    trips: 45, rating: 4.2, registeredAt: '01 Mar 2024',
  },
  {
    id: 'v9', vehicleId: '#VEH-009',
    driverName: 'Grace Ahounou', driverAvatar: AV, driverId: '#DRV-009', driverPhone: '+229 97 00 00 09',
    make: 'Ford', model: 'Transit', year: 2019, type: 'Minibus', plate: 'BN-9012-I', color: 'Blanc', seats: 12,
    status: 'Actif', vehiclePhoto: IMG.car4,
    documents: { carteGrise: 'ok', carteGriseUrl: IMG.cg1, assurance: 'ok', assuranceUrl: IMG.ass1, visite: 'ok', visiteUrl: IMG.vis1 },
    trips: 378, rating: 4.8, registeredAt: '05 Mar 2024',
  },
  {
    id: 'v10', vehicleId: '#VEH-010',
    driverName: 'Romuald Agbessi', driverAvatar: AV, driverId: '#DRV-010', driverPhone: '+229 97 00 00 10',
    make: 'Peugeot', model: '208', year: 2020, type: 'Berline', plate: 'BN-0123-J', color: 'Argent', seats: 4,
    status: 'Rejeté',
    documents: { carteGrise: 'rejected', assurance: 'rejected', visite: 'rejected' },
    trips: 0, rating: 0, registeredAt: '10 Mar 2024',
  },
  {
    id: 'v11', vehicleId: '#VEH-011',
    driverName: 'Sylvie Zinsou', driverAvatar: AV, driverId: '#DRV-011', driverPhone: '+229 97 00 00 11',
    make: 'Suzuki', model: 'Swift', year: 2021, type: 'Berline', plate: 'BN-1234-K', color: 'Rose', seats: 4,
    status: 'Actif', vehiclePhoto: IMG.car2,
    documents: { carteGrise: 'ok', carteGriseUrl: IMG.cg1, assurance: 'ok', assuranceUrl: IMG.ass1, visite: 'ok', visiteUrl: IMG.vis1 },
    trips: 203, rating: 4.7, registeredAt: '15 Mar 2024',
  },
  {
    id: 'v12', vehicleId: '#VEH-012',
    driverName: 'Patrick Dossou', driverAvatar: AV, driverId: '#DRV-012', driverPhone: '+229 97 00 00 12',
    make: 'Mercedes', model: 'Sprinter', year: 2018, type: 'Minibus', plate: 'BN-2345-L', color: 'Blanc', seats: 14,
    status: 'Actif', vehiclePhoto: IMG.car4,
    documents: { carteGrise: 'ok', carteGriseUrl: IMG.cg1, assurance: 'ok', assuranceUrl: IMG.ass1, visite: 'pending' },
    trips: 412, rating: 4.9, registeredAt: '20 Mar 2024',
  },
  {
    id: 'v13', vehicleId: '#VEH-013',
    driverName: 'Cédric Akakpo', driverAvatar: AV, driverId: '#DRV-013', driverPhone: '+229 97 00 00 13',
    make: 'Honda', model: 'CR-V', year: 2019, type: 'SUV', plate: 'BN-3456-M', color: 'Noir', seats: 5,
    status: 'Actif', vehiclePhoto: IMG.car3,
    documents: { carteGrise: 'ok', carteGriseUrl: IMG.cg1, assurance: 'ok', assuranceUrl: IMG.ass1, visite: 'ok', visiteUrl: IMG.vis1 },
    trips: 155, rating: 4.5, registeredAt: '25 Mar 2024',
  },
  {
    id: 'v14', vehicleId: '#VEH-014',
    driverName: 'Viviane Agossou', driverAvatar: AV, driverId: '#DRV-014', driverPhone: '+229 97 00 00 14',
    make: 'Bajaj', model: 'Pulsar 150', year: 2023, type: 'Moto', plate: 'BN-4567-N', color: 'Bleu', seats: 1,
    status: 'En inspection',
    documents: { carteGrise: 'ok', carteGriseUrl: IMG.cg1, assurance: 'pending' },
    trips: 28, rating: 4.1, registeredAt: '30 Mar 2024',
  },
  {
    id: 'v15', vehicleId: '#VEH-015',
    driverName: 'Thierry Houngan', driverAvatar: AV, driverId: '#DRV-015', driverPhone: '+229 97 00 00 15',
    make: 'Toyota', model: 'HiAce', year: 2017, type: 'Minibus', plate: 'BN-5678-O', color: 'Jaune', seats: 15,
    status: 'Suspendu',
    documents: { carteGrise: 'ok', assurance: 'ok', visite: 'rejected' },
    trips: 89, rating: 3.7, registeredAt: '05 Apr 2024',
  },
];

const PAGE_SIZE = 10;

export function useVehicles() {
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);

  // ── Filters ───────────────────────────────────────────
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter,   setTypeFilter]   = useState('');
  const [currentPage,  setCurrentPage]  = useState(1);

  // ── Derived state ─────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allVehicles.filter((v) => {
      const matchSearch = !q ||
        v.driverName.toLowerCase().includes(q) ||
        v.plate.toLowerCase().includes(q)       ||
        v.make.toLowerCase().includes(q)        ||
        v.model.toLowerCase().includes(q);
      const matchStatus = !statusFilter || v.status === statusFilter;
      const matchType   = !typeFilter   || v.type   === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [allVehicles, search, statusFilter, typeFilter]);

  const total    = filtered.length;
  const vehicles = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const metrics = useMemo<VehicleMetrics>(() => ({
    total:      allVehicles.length,
    actif:      allVehicles.filter((v) => v.status === 'Actif').length,
    inspection: allVehicles.filter((v) => v.status === 'En inspection').length,
    suspendu:   allVehicles.filter((v) => v.status === 'Suspendu' || v.status === 'Rejeté').length,
  }), [allVehicles]);

  // ── Selection ─────────────────────────────────────────
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedVehicle = useMemo(
    () => allVehicles.find((v) => v.id === selectedId) ?? null,
    [allVehicles, selectedId],
  );

  // ── Actions ───────────────────────────────────────────
  const suspendVehicle = useCallback((id: string) => {
    setAllVehicles((prev) => prev.map((v) => v.id === id ? { ...v, status: 'Suspendu' as const } : v));
  }, []);

  const activateVehicle = useCallback((id: string) => {
    setAllVehicles((prev) => prev.map((v) => v.id === id ? { ...v, status: 'Actif' as const } : v));
  }, []);

  const rejectVehicle = useCallback((id: string) => {
    setAllVehicles((prev) => prev.map((v) => v.id === id ? { ...v, status: 'Rejeté' as const } : v));
  }, []);

  const deleteVehicle = useCallback((id: string) => {
    setAllVehicles((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const handleSearch = useCallback((v: string) => { setSearch(v);       setCurrentPage(1); }, []);
  const handleStatus = useCallback((v: string) => { setStatusFilter(v); setCurrentPage(1); }, []);
  const handleType   = useCallback((v: string) => { setTypeFilter(v);   setCurrentPage(1); }, []);

  return {
    vehicles, total, pageSize: PAGE_SIZE, currentPage, setCurrentPage,
    search,       setSearch:       handleSearch,
    statusFilter, setStatusFilter: handleStatus,
    typeFilter,   setTypeFilter:   handleType,
    metrics,
    selectedVehicle, setSelectedId,
    suspendVehicle, activateVehicle, rejectVehicle, deleteVehicle,
  };
}
