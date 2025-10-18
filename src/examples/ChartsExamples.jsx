import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import DonutChart from '../components/charts/DonutChart';
import Card from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';

/**
 * Page d'exemples - Composants Charts
 * 
 * Démontre LineChart, BarChart, PieChart, DonutChart
 */
const ChartsExamples = () => {
  // Données pour LineChart - Évolution mensuelle
  const lineChartData = [
    { month: 'Jan', revenus: 45000, depenses: 32000, economie: 13000 },
    { month: 'Fév', revenus: 52000, depenses: 38000, economie: 14000 },
    { month: 'Mar', revenus: 48000, depenses: 35000, economie: 13000 },
    { month: 'Avr', revenus: 61000, depenses: 42000, economie: 19000 },
    { month: 'Mai', revenus: 55000, depenses: 39000, economie: 16000 },
    { month: 'Jun', revenus: 67000, depenses: 45000, economie: 22000 }
  ];

  const lineChartLines = [
    { dataKey: 'revenus', name: 'Revenus', color: '#10b981' },
    { dataKey: 'depenses', name: 'Dépenses', color: '#ef4444' },
    { dataKey: 'economie', name: 'Économie', color: '#0d9488' }
  ];

  // Données pour BarChart - Budgets par catégorie
  const barChartData = [
    { category: 'Alimentation', budget: 15000, depense: 12500, reste: 2500 },
    { category: 'Transport', budget: 5000, depense: 4200, reste: 800 },
    { category: 'Logement', budget: 20000, depense: 20000, reste: 0 },
    { category: 'Loisirs', budget: 8000, depense: 3600, reste: 4400 },
    { category: 'Santé', budget: 10000, depense: 8200, reste: 1800 }
  ];

  const barChartBars = [
    { dataKey: 'budget', name: 'Budget', color: '#0d9488' },
    { dataKey: 'depense', name: 'Dépensé', color: '#ef4444' }
  ];

  const barChartBarsStacked = [
    { dataKey: 'depense', name: 'Dépensé', color: '#ef4444' },
    { dataKey: 'reste', name: 'Restant', color: '#10b981' }
  ];

  // Données pour PieChart - Répartition dépenses
  const pieChartData = [
    { name: 'Alimentation', value: 12500, color: '#10b981' },
    { name: 'Transport', value: 4200, color: '#3b82f6' },
    { name: 'Logement', value: 20000, color: '#ef4444' },
    { name: 'Loisirs', value: 3600, color: '#f59e0b' },
    { name: 'Santé', value: 8200, color: '#8b5cf6' }
  ];

  // Données pour DonutChart - Sources de revenus
  const donutChartData = [
    { name: 'Salaire', value: 45000, color: '#0d9488' },
    { name: 'Freelance', value: 15000, color: '#3b82f6' },
    { name: 'Investissements', value: 8000, color: '#10b981' },
    { name: 'Autres', value: 2000, color: '#f59e0b' }
  ];

  const totalRevenus = donutChartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Charts Components 🌊
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            LineChart, BarChart, PieChart & DonutChart - Visualisation de données
          </p>
        </div>

        {/* LineChart */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            📈 LineChart
          </h2>

          <Card variant="glass">
            <Card.Header>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Évolution mensuelle des finances
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Revenus, Dépenses et Économies sur 6 mois
              </p>
            </Card.Header>
            <Card.Body>
              <LineChart
                data={lineChartData}
                lines={lineChartLines}
                xAxisKey="month"
                height={350}
              />
            </Card.Body>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card variant="glass">
              <Card.Header>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Sans grille
                </h3>
              </Card.Header>
              <Card.Body>
                <LineChart
                  data={lineChartData}
                  lines={lineChartLines}
                  xAxisKey="month"
                  height={250}
                  showGrid={false}
                />
              </Card.Body>
            </Card>

            <Card variant="glass">
              <Card.Header>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Lignes droites
                </h3>
              </Card.Header>
              <Card.Body>
                <LineChart
                  data={lineChartData}
                  lines={lineChartLines}
                  xAxisKey="month"
                  height={250}
                  curved={false}
                />
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* BarChart */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            📊 BarChart
          </h2>

          <Card variant="glass">
            <Card.Header>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Budgets par catégorie
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comparaison Budget vs Dépenses réelles
              </p>
            </Card.Header>
            <Card.Body>
              <BarChart
                data={barChartData}
                bars={barChartBars}
                xAxisKey="category"
                height={350}
              />
            </Card.Body>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card variant="glass">
              <Card.Header>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Barres empilées (Stacked)
                </h3>
              </Card.Header>
              <Card.Body>
                <BarChart
                  data={barChartData}
                  bars={barChartBarsStacked}
                  xAxisKey="category"
                  height={250}
                  stacked
                />
              </Card.Body>
            </Card>

            <Card variant="glass">
              <Card.Header>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Horizontal
                </h3>
              </Card.Header>
              <Card.Body>
                <BarChart
                  data={barChartData}
                  bars={barChartBars}
                  xAxisKey="category"
                  height={250}
                  horizontal
                />
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* PieChart */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            🥧 PieChart
          </h2>

          <Card variant="glass">
            <Card.Header>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Répartition des dépenses
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total: {pieChartData.reduce((sum, item) => sum + item.value, 0).toLocaleString()} HTG
              </p>
            </Card.Header>
            <Card.Body>
              <PieChart
                data={pieChartData}
                height={350}
              />
            </Card.Body>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card variant="glass">
              <Card.Header>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Avec labels
                </h3>
              </Card.Header>
              <Card.Body>
                <PieChart
                  data={pieChartData}
                  height={300}
                  showLabels
                />
              </Card.Body>
            </Card>

            <Card variant="glass">
              <Card.Header>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Sans légende
                </h3>
              </Card.Header>
              <Card.Body>
                <PieChart
                  data={pieChartData}
                  height={300}
                  showLegend={false}
                />
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* DonutChart */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            🍩 DonutChart
          </h2>

          <Card variant="glass">
            <Card.Header>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Sources de revenus
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Répartition des revenus mensuels
              </p>
            </Card.Header>
            <Card.Body>
              <DonutChart
                data={donutChartData}
                height={350}
                centerText={`${totalRevenus.toLocaleString()} HTG`}
                centerLabel="Total revenus"
              />
            </Card.Body>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card variant="glass">
              <Card.Header>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Avec labels
                </h3>
              </Card.Header>
              <Card.Body>
                <DonutChart
                  data={donutChartData}
                  height={300}
                  showLabels
                  centerText="70K"
                />
              </Card.Body>
            </Card>

            <Card variant="glass">
              <Card.Header>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Donut large
                </h3>
              </Card.Header>
              <Card.Body>
                <DonutChart
                  data={donutChartData}
                  height={300}
                  innerRadius={70}
                  outerRadius={100}
                  centerText="100%"
                  centerLabel="Collecté"
                />
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Comparaison dans Tabs */}
        <Card variant="glass">
          <Card.Header>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🔄 Comparaison des Charts
            </h2>
          </Card.Header>
          <Card.Body>
            <Tabs defaultValue="line">
              <Tabs.List>
                <Tabs.Tab value="line">LineChart</Tabs.Tab>
                <Tabs.Tab value="bar">BarChart</Tabs.Tab>
                <Tabs.Tab value="pie">PieChart</Tabs.Tab>
                <Tabs.Tab value="donut">DonutChart</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="line">
                <div className="pt-4">
                  <LineChart
                    data={lineChartData}
                    lines={lineChartLines}
                    xAxisKey="month"
                    height={300}
                  />
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="bar">
                <div className="pt-4">
                  <BarChart
                    data={barChartData}
                    bars={barChartBars}
                    xAxisKey="category"
                    height={300}
                  />
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="pie">
                <div className="pt-4">
                  <PieChart
                    data={pieChartData}
                    height={300}
                  />
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="donut">
                <div className="pt-4">
                  <DonutChart
                    data={donutChartData}
                    height={300}
                    centerText={`${totalRevenus.toLocaleString()} HTG`}
                    centerLabel="Total"
                  />
                </div>
              </Tabs.Panel>
            </Tabs>
          </Card.Body>
        </Card>

        {/* Features */}
        <Card variant="glass">
          <Card.Header>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              ✨ Features des Charts
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-teal-600 dark:text-teal-400">
                  📈 LineChart
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>✅ Multi-lignes</li>
                  <li>✅ Courbes ou droites</li>
                  <li>✅ Grille optionnelle</li>
                  <li>✅ Tooltip interactif</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-teal-600 dark:text-teal-400">
                  📊 BarChart
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>✅ Multi-barres</li>
                  <li>✅ Stacked (empilé)</li>
                  <li>✅ Horizontal/Vertical</li>
                  <li>✅ Comparaisons</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-teal-600 dark:text-teal-400">
                  🥧 PieChart
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>✅ Répartition %</li>
                  <li>✅ Labels optionnels</li>
                  <li>✅ Couleurs custom</li>
                  <li>✅ Légende</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-teal-600 dark:text-teal-400">
                  🍩 DonutChart
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>✅ Texte au centre</li>
                  <li>✅ Taille ajustable</li>
                  <li>✅ Labels optionnels</li>
                  <li>✅ Tooltip détaillé</li>
                </ul>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Code Example */}
        <Card variant="glass">
          <Card.Header>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              📝 Exemples de Code
            </h2>
          </Card.Header>
          <Card.Body className="space-y-4">
            <div>
              <h3 className="font-semibold text-teal-600 dark:text-teal-400 mb-2">
                LineChart
              </h3>
              <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<LineChart
  data={[
    { month: 'Jan', revenus: 45000, depenses: 32000 },
    { month: 'Fév', revenus: 52000, depenses: 38000 }
  ]}
  lines={[
    { dataKey: 'revenus', name: 'Revenus', color: '#10b981' },
    { dataKey: 'depenses', name: 'Dépenses', color: '#ef4444' }
  ]}
  xAxisKey="month"
  height={350}
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-teal-600 dark:text-teal-400 mb-2">
                DonutChart avec texte au centre
              </h3>
              <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<DonutChart
  data={[
    { name: 'Salaire', value: 45000, color: '#0d9488' },
    { name: 'Freelance', value: 15000, color: '#3b82f6' }
  ]}
  centerText="60,000 HTG"
  centerLabel="Total revenus"
  height={350}
/>`}
              </pre>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ChartsExamples;