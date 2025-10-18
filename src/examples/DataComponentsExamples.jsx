import { useState } from 'react';
import Table from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';

/**
 * Page d'exemples - Composants Data
 * 
 * Démontre Table, Pagination et ProgressBar
 */
const DataComponentsExamples = () => {
  // Données de test - Transactions
  const transactionsData = [
    { id: 1, date: '2025-01-15', description: 'Achat supermarché', category: 'Alimentation', amount: -2500, currency: 'HTG', type: 'expense' },
    { id: 2, date: '2025-01-14', description: 'Salaire', category: 'Revenus', amount: 50000, currency: 'HTG', type: 'income' },
    { id: 3, date: '2025-01-13', description: 'Transport', category: 'Transport', amount: -800, currency: 'HTG', type: 'expense' },
    { id: 4, date: '2025-01-12', description: 'Facture électricité', category: 'Services', amount: -3200, currency: 'HTG', type: 'expense' },
    { id: 5, date: '2025-01-11', description: 'Freelance', category: 'Revenus', amount: 15000, currency: 'HTG', type: 'income' },
    { id: 6, date: '2025-01-10', description: 'Restaurant', category: 'Loisirs', amount: -1800, currency: 'HTG', type: 'expense' },
    { id: 7, date: '2025-01-09', description: 'Épargne', category: 'Épargne', amount: -10000, currency: 'HTG', type: 'transfer' },
    { id: 8, date: '2025-01-08', description: 'Essence', category: 'Transport', amount: -2000, currency: 'HTG', type: 'expense' }
  ];

  // Données de test - Budgets
  const budgetsData = [
    { category: 'Alimentation', budget: 15000, spent: 12500, remaining: 2500, percentage: 83 },
    { category: 'Transport', budget: 5000, spent: 2800, remaining: 2200, percentage: 56 },
    { category: 'Logement', budget: 20000, spent: 20000, remaining: 0, percentage: 100 },
    { category: 'Loisirs', budget: 8000, spent: 3600, remaining: 4400, percentage: 45 },
    { category: 'Services', budget: 10000, spent: 8200, remaining: 1800, percentage: 82 }
  ];

  // États pour la table avec tri
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRows, setSelectedRows] = useState([]);

  // États pour pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Gérer le tri
  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  // Trier les données
  const getSortedData = (data) => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      // Tri numérique
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // Tri alphabétique
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  };

  // Paginer les données
  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  };

  const sortedTransactions = getSortedData(transactionsData);
  const paginatedTransactions = getPaginatedData(sortedTransactions);
  const totalPages = Math.ceil(transactionsData.length / pageSize);

  // Colonnes pour la table Transactions
  const transactionColumns = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      width: '120px'
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true
    },
    {
      key: 'category',
      label: 'Catégorie',
      sortable: true,
      render: (value) => (
        <Badge variant="subtle" color="blue">
          {value}
        </Badge>
      )
    },
    {
      key: 'amount',
      label: 'Montant',
      sortable: true,
      align: 'right',
      render: (value, row) => (
        <span className={`font-semibold ${value > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {value > 0 ? '+' : ''}{value.toLocaleString()} {row.currency}
        </span>
      )
    },
    {
      key: 'type',
      label: 'Type',
      width: '100px',
      render: (value) => {
        const colors = {
          income: 'green',
          expense: 'red',
          transfer: 'blue'
        };
        const labels = {
          income: 'Revenu',
          expense: 'Dépense',
          transfer: 'Transfert'
        };
        return (
          <Badge color={colors[value]} size="sm">
            {labels[value]}
          </Badge>
        );
      }
    }
  ];

  // Colonnes pour la table Budgets
  const budgetColumns = [
    {
      key: 'category',
      label: 'Catégorie',
      sortable: true
    },
    {
      key: 'budget',
      label: 'Budget',
      sortable: true,
      align: 'right',
      render: (value) => `${value.toLocaleString()} HTG`
    },
    {
      key: 'spent',
      label: 'Dépensé',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="text-red-600 dark:text-red-400 font-semibold">
          {value.toLocaleString()} HTG
        </span>
      )
    },
    {
      key: 'remaining',
      label: 'Restant',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className={value > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
          {value.toLocaleString()} HTG
        </span>
      )
    },
    {
      key: 'percentage',
      label: 'Progression',
      width: '200px',
      render: (value, row) => (
        <ProgressBar
          value={value}
          max={100}
          size="sm"
          color={value >= 100 ? 'red' : value >= 80 ? 'orange' : 'teal'}
          showValue
          variant="rounded"
        />
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Data Components 🌊
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Table, Pagination & ProgressBar - Composants de données
          </p>
        </div>

        {/* ========== TABLE ========== */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            📊 Table
          </h2>

          {/* Table avec tri, sélection et pagination */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              1️⃣ Table Transactions (avec tri, sélection et pagination)
            </h3>
            
            <Table
              columns={transactionColumns}
              data={paginatedTransactions}
              sortable
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
              selectable
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              striped
              hoverable
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={transactionsData.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Table Budgets */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              2️⃣ Table Budgets (avec ProgressBar intégré)
            </h3>
            
            <Table
              columns={budgetColumns}
              data={budgetsData}
              sortable
              variant="bordered"
              hoverable
            />
          </div>

          {/* Table variantes */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                3️⃣ Table Compact
              </h3>
              <Table
                columns={transactionColumns.slice(0, 3)}
                data={transactionsData.slice(0, 4)}
                compact
                striped
              />
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                4️⃣ Table Loading
              </h3>
              <Table
                columns={transactionColumns.slice(0, 3)}
                data={[]}
                loading
              />
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                5️⃣ Table Empty
              </h3>
              <Table
                columns={transactionColumns.slice(0, 3)}
                data={[]}
                emptyText="Aucune transaction trouvée"
              />
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                6️⃣ Table Card Variant
              </h3>
              <Table
                columns={transactionColumns.slice(0, 3)}
                data={transactionsData.slice(0, 3)}
                variant="card"
                striped
              />
            </div>
          </div>
        </div>

        {/* ========== PAGINATION ========== */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            📄 Pagination
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                1️⃣ Pagination Complète
              </h3>
              <Pagination
                currentPage={5}
                totalPages={20}
                totalItems={195}
                pageSize={10}
                onPageChange={() => {}}
                onPageSizeChange={() => {}}
              />
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                2️⃣ Pagination Simple
              </h3>
              <Pagination
                currentPage={2}
                totalPages={5}
                totalItems={45}
                pageSize={10}
                onPageChange={() => {}}
                showFirstLast={false}
                showPageSize={false}
              />
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                3️⃣ Pagination Small
              </h3>
              <Pagination
                currentPage={3}
                totalPages={10}
                totalItems={95}
                pageSize={10}
                onPageChange={() => {}}
                size="sm"
                showInfo={false}
              />
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                4️⃣ Pagination Large
              </h3>
              <Pagination
                currentPage={1}
                totalPages={3}
                totalItems={25}
                pageSize={10}
                onPageChange={() => {}}
                size="lg"
                variant="outlined"
              />
            </div>
          </div>
        </div>

        {/* ========== PROGRESSBAR ========== */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            📈 ProgressBar
          </h2>

          {/* Progress Linear */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              1️⃣ ProgressBar Linéaire
            </h3>
            
            <div className="space-y-4">
              <ProgressBar
                value={75}
                label="Budget Alimentation"
                showValue
                color="teal"
              />
              
              <ProgressBar
                value={95}
                label="Budget Transport"
                showValue
                color="orange"
              />
              
              <ProgressBar
                value={100}
                label="Budget Logement"
                showValue
                color="red"
              />
              
              <ProgressBar
                value={45}
                label="Objectif Épargne"
                showValue
                color="green"
              />
            </div>
          </div>

          {/* Progress Tailles */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              2️⃣ Tailles
            </h3>
            
            <div className="space-y-4">
              <ProgressBar
                value={60}
                label="Small (sm)"
                showValue
                size="sm"
                color="teal"
              />
              
              <ProgressBar
                value={60}
                label="Medium (md) - défaut"
                showValue
                size="md"
                color="blue"
              />
              
              <ProgressBar
                value={60}
                label="Large (lg)"
                showValue
                size="lg"
                color="purple"
              />
              
              <ProgressBar
                value={60}
                label="Extra Large (xl)"
                showValue
                size="xl"
                color="green"
              />
            </div>
          </div>

          {/* Progress Variantes */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              3️⃣ Variantes
            </h3>
            
            <div className="space-y-4">
              <ProgressBar
                value={70}
                label="Default (arrondi léger)"
                showValue
                variant="default"
                color="teal"
              />
              
              <ProgressBar
                value={70}
                label="Rounded (complètement arrondi)"
                showValue
                variant="rounded"
                color="blue"
              />
              
              <ProgressBar
                value={70}
                label="Square (angles droits)"
                showValue
                variant="square"
                color="purple"
              />
            </div>
          </div>

          {/* Progress Circulaire */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              4️⃣ ProgressBar Circulaire
            </h3>
            
            <div className="flex flex-wrap items-center justify-around gap-8">
              <ProgressBar
                type="circular"
                value={25}
                label="25% utilisé"
                showValue
                size="sm"
                color="green"
              />
              
              <ProgressBar
                type="circular"
                value={60}
                label="60% utilisé"
                showValue
                size="md"
                color="blue"
              />
              
              <ProgressBar
                type="circular"
                value={85}
                label="85% utilisé"
                showValue
                size="lg"
                color="orange"
              />
              
              <ProgressBar
                type="circular"
                value={100}
                label="Budget épuisé"
                showValue
                size="xl"
                color="red"
              />
            </div>
          </div>

          {/* Progress Couleurs */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              5️⃣ Palette Couleurs
            </h3>
            
            <div className="space-y-3">
              <ProgressBar value={75} showValue color="teal" label="Teal" variant="rounded" />
              <ProgressBar value={75} showValue color="blue" label="Blue" variant="rounded" />
              <ProgressBar value={75} showValue color="green" label="Green" variant="rounded" />
              <ProgressBar value={75} showValue color="yellow" label="Yellow" variant="rounded" />
              <ProgressBar value={75} showValue color="orange" label="Orange" variant="rounded" />
              <ProgressBar value={75} showValue color="red" label="Red" variant="rounded" />
              <ProgressBar value={75} showValue color="purple" label="Purple" variant="rounded" />
              <ProgressBar value={75} showValue color="gray" label="Gray" variant="rounded" />
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            📝 Exemples de Code
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-teal-600 dark:text-teal-400 mb-2">
                Table avec Tri et Sélection
              </h3>
              <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<Table
  columns={transactionColumns}
  data={transactions}
  sortable
  sortColumn={sortColumn}
  sortDirection={sortDirection}
  onSort={handleSort}
  selectable
  selectedRows={selectedRows}
  onSelectionChange={setSelectedRows}
  striped
  hoverable
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-teal-600 dark:text-teal-400 mb-2">
                Pagination
              </h3>
              <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  pageSize={pageSize}
  onPageChange={setCurrentPage}
  onPageSizeChange={setPageSize}
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-teal-600 dark:text-teal-400 mb-2">
                ProgressBar
              </h3>
              <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<ProgressBar
  value={75}
  max={100}
  label="Budget utilisé"
  showValue
  color="teal"
  variant="rounded"
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataComponentsExamples;