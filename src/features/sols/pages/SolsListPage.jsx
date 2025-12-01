// src/features/sols/pages/SolsListPage.jsx
import { forwardRef, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Users, 
  TrendingUp,
  Filter,
  Grid,
  List,
  Download
} from 'lucide-react';
import MainLayout from '../../../components/layout/MainLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import SolCard from '../components/SolCard';
import SolFilters from '../components/SolFilters';
import CreateSolModal from '../components/CreateSolModal';
import EmptyState from '../../../components/common/EmptyState';
import Loading from '../../../components/ui/Loading';
import Badge from '../../../components/ui/Badge';
import Tabs from '../../../components/ui/Tabs';
import useSol from '../hooks/useSol';

/**
 * Page SolsListPage - Page principale listant tous les sols/tontines
 * 
 * Features:
 * - Liste grille/carte des sols
 * - Filtrage et recherche avancés
 * - Création rapide de sols
 * - Statistiques globales
 * - Vue par statut (onglets)
 * - Export de données
 * - Responsive design
 * 
 * @example
 * <SolsListPage />
 */
const SolsListPage = forwardRef(({ className = '' }, ref) => {
  const navigate = useNavigate();
  const {
    // État
    sols,
    isLoading,
    solsLoaded,
    supportedData,
    
    // Fonctions
    getSols,
    createSol,
    filterSols,
    getActiveSols,
    getMonthlyContributions,
    
    // Données calculées
    getNextPaymentDue
  } = useSol();

  // État local
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filteredSols, setFilteredSols] = useState([]);

  // Chargement initial des sols
  useEffect(() => {
    if (!solsLoaded && !isLoading) {
      getSols();
    }
  }, [solsLoaded, isLoading, getSols]);

  // Filtrage des sols en fonction des critères
  useEffect(() => {
    if (!sols || sols.length === 0) {
      setFilteredSols([]);
      return;
    }

    let filtered = [...sols];

    // Filtre par onglet actif
    if (activeTab !== 'all') {
      filtered = filtered.filter(sol => sol.status === activeTab);
    }

    // Filtre par recherche texte
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(sol => 
        sol.name.toLowerCase().includes(query) ||
        sol.description?.toLowerCase().includes(query) ||
        sol.type.toLowerCase().includes(query)
      );
    }

    // Application des filtres avancés
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(sol => filters.status.includes(sol.status));
    }

    if (filters.type && filters.type.length > 0) {
      filtered = filtered.filter(sol => filters.type.includes(sol.type));
    }

    if (filters.frequency && filters.type.length > 0) {
      filtered = filtered.filter(sol => filters.frequency.includes(sol.frequency));
    }

    if (filters.amountRange) {
      const [min, max] = filters.amountRange.split('-').map(Number);
      filtered = filtered.filter(sol => {
        if (max) {
          return sol.contributionAmount >= min && sol.contributionAmount <= max;
        } else {
          return sol.contributionAmount >= min;
        }
      });
    }

    if (filters.showOnlyMySols) {
      // Ici on filtrerait par créateur - à implémenter avec l'authentification
      filtered = filtered.filter(sol => sol.isCreator);
    }

    if (filters.showOnlyActive) {
      filtered = filtered.filter(sol => sol.status === 'active');
    }

    // Tri
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'name_asc':
            return a.name.localeCompare(b.name);
          case 'name_desc':
            return b.name.localeCompare(a.name);
          case 'contribution_asc':
            return a.contributionAmount - b.contributionAmount;
          case 'contribution_desc':
            return b.contributionAmount - a.contributionAmount;
          case 'participants_asc':
            return (a.participants?.length || 0) - (b.participants?.length || 0);
          case 'participants_desc':
            return (b.participants?.length || 0) - (a.participants?.length || 0);
          case 'created_asc':
            return new Date(a.createdAt) - new Date(b.createdAt);
          case 'created_desc':
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
    }

    setFilteredSols(filtered);
  }, [sols, activeTab, searchQuery, filters]);

  // Gestion de la création d'un sol
  const handleCreateSol = async (solData) => {
    const result = await createSol(solData);
    if (result.success) {
      setShowCreateModal(false);
      // Recharger la liste
      getSols();
    }
  };

  // Navigation vers les détails d'un sol
  const handleViewDetails = (sol) => {
    navigate(`/sols/${sol._id}`);
  };

  // Rejoindre un sol
  const handleJoinSol = (sol) => {
    // À implémenter avec JoinSolModal
    console.log('Rejoindre sol:', sol);
  };

  // Effectuer un paiement
  const handlePayment = (sol) => {
    // À implémenter avec PaymentModal
    console.log('Paiement sol:', sol);
  };

  // Plus d'actions
  const handleMoreActions = (sol) => {
    console.log('Actions sol:', sol);
  };

  // Export des données
  const handleExport = () => {
    console.log('Export sols:', filteredSols);
    // À implémenter avec service d'export
  };

  // Calcul des statistiques
  const stats = useMemo(() => {
    const activeSols = getActiveSols();
    const monthlyContributions = getMonthlyContributions();
    const nextPayment = getNextPaymentDue();

    return {
      totalSols: sols.length,
      activeSols: activeSols.length,
      totalParticipants: sols.reduce((sum, sol) => sum + (sol.participants?.length || 0), 0),
      monthlyContributions,
      nextPayment
    };
  }, [sols, getActiveSols, getMonthlyContributions, getNextPaymentDue]);

  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Accueil', href: '/' },
    { label: 'Sols', href: '/sols' }
  ];

  // Configuration des onglets
  const tabConfig = {
    all: { label: 'Tous', count: sols.length },
    recruiting: { label: 'Recrutement', count: sols.filter(s => s.status === 'recruiting').length },
    active: { label: 'Actifs', count: sols.filter(s => s.status === 'active').length },
    completed: { label: 'Terminés', count: sols.filter(s => s.status === 'completed').length }
  };

  return (
    <MainLayout
      ref={ref}
      breadcrumbs={breadcrumbs}
      className={className}
    >
      {/* Header avec titre et actions */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Mes Sols & Tontines
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez vos tontines et suivez vos contributions
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Bouton export */}
          <Button
            variant="outline"
            leftIcon={Download}
            onClick={handleExport}
            disabled={filteredSols.length === 0}
          >
            Exporter
          </Button>

          {/* Bouton création */}
          <Button
            leftIcon={Plus}
            onClick={() => setShowCreateModal(true)}
          >
            Nouveau Sol
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card variant="glass" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Sols
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalSols}
              </p>
            </div>
            <div className="p-3 bg-teal-100 dark:bg-teal-900/20 rounded-lg">
              <Users className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
        </Card>

        <Card variant="glass" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Sols Actifs
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.activeSols}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card variant="glass" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Participants
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalParticipants}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card variant="glass" hoverable>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Contributions/mois
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.monthlyContributions.toLocaleString()} HTG
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres et contrôles */}
      <div className="space-y-4 mb-6">
        <SolFilters
          filters={filters}
          onFiltersChange={setFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          supportedData={supportedData}
          showResultCount
        />

        {/* Barre de contrôles secondaire */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Onglets de statut */}
          <Tabs value={activeTab} onChange={setActiveTab} size="sm">
            <Tabs.List>
              {Object.entries(tabConfig).map(([key, config]) => (
                <Tabs.Tab 
                  key={key} 
                  value={key}
                  badge={config.count > 0 ? config.count : undefined}
                >
                  {config.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>

          {/* Contrôles d'affichage */}
          <div className="flex items-center gap-2">
            {/* Toggle vue */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Compteur résultats */}
            <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {filteredSols.length} sol{filteredSols.length !== 1 ? 's' : ''} trouvé{filteredSols.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="space-y-6">
        {isLoading ? (
          // État de chargement
          <div className="space-y-4">
            <Loading.SkeletonCard />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Loading.SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : filteredSols.length === 0 ? (
          // État vide
          <EmptyState
            variant={sols.length === 0 ? "empty" : "search"}
            title={
              sols.length === 0 
                ? "Aucun sol créé" 
                : "Aucun sol trouvé"
            }
            description={
              sols.length === 0
                ? "Commencez par créer votre premier sol pour gérer vos tontines"
                : "Aucun sol ne correspond à vos critères de recherche"
            }
            action={
              sols.length === 0 && (
                <Button
                  leftIcon={Plus}
                  onClick={() => setShowCreateModal(true)}
                >
                  Créer mon premier sol
                </Button>
              )
            }
          />
        ) : (
          // Liste des sols
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredSols.map(sol => (
              <SolCard
                key={sol._id}
                sol={sol}
                onViewDetails={() => handleViewDetails(sol)}
                onJoin={() => handleJoinSol(sol)}
                onPayment={() => handlePayment(sol)}
                onMoreActions={() => handleMoreActions(sol)}
                className={viewMode === 'list' ? 'max-w-4xl' : ''}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de création */}
      <CreateSolModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateSol}
        supportedData={supportedData}
        loading={isLoading}
      />
    </MainLayout>
  );
});

SolsListPage.displayName = 'SolsListPage';

SolsListPage.propTypes = {
  /** Classes CSS additionnelles */
  className: PropTypes.string
};

export default SolsListPage;