import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useSelector } from 'react-redux';

/**
 * Composant DonutChart - Graphique donut (camembert avec trou)
 * 
 * Features:
 * - Répartition en pourcentages avec centre vide
 * - Texte au centre optionnel (total, titre)
 * - Couleurs personnalisées
 * - Tooltip interactif
 * - Légende
 * - Responsive
 * - Support Light/Dark
 * - Couleurs Haiti 🇭🇹
 * 
 * @example
 * <DonutChart
 *   data={[
 *     { name: 'Alimentation', value: 12500, color: '#10b981' },
 *     { name: 'Transport', value: 4200, color: '#3b82f6' },
 *     { name: 'Logement', value: 20000, color: '#ef4444' }
 *   ]}
 *   centerText="36,700 HTG"
 *   centerLabel="Total dépensé"
 * />
 */
const DonutChart = forwardRef(({
  data = [],
  height = 300,
  showLegend = true,
  showTooltip = true,
  showLabels = false,
  innerRadius = 60,
  outerRadius = 80,
  centerText = '',
  centerLabel = '',
  className = ''
}, ref) => {
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';

  const textColor = isDark ? '#9ca3af' : '#6b7280';

  // Calculer le total
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {data.name}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.payload.color }}
            />
            <span className="text-gray-600 dark:text-gray-400">Valeur:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {data.value.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {percentage}% du total
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Label
  const renderLabel = (entry) => {
    const percentage = ((entry.value / total) * 100).toFixed(0);
    return `${percentage}%`;
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            label={showLabels ? renderLabel : false}
            labelLine={showLabels}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: '14px', color: textColor }}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>

      {/* Texte au centre du donut */}
      {(centerText || centerLabel) && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          {centerLabel && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {centerLabel}
            </p>
          )}
          {centerText && (
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {centerText}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

DonutChart.displayName = 'DonutChart';

DonutChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired
    })
  ).isRequired,
  height: PropTypes.number,
  showLegend: PropTypes.bool,
  showTooltip: PropTypes.bool,
  showLabels: PropTypes.bool,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  centerText: PropTypes.string,
  centerLabel: PropTypes.string,
  className: PropTypes.string
};

export default DonutChart;