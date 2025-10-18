import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useSelector } from 'react-redux';

/**
 * Composant LineChart - Graphique linéaire
 * 
 * Features:
 * - Évolution dans le temps
 * - Multi-lignes
 * - Tooltip interactif
 * - Légende
 * - Responsive
 * - Support Light/Dark
 * - Couleurs Haiti 🇭🇹
 * 
 * @example
 * <LineChart
 *   data={[
 *     { month: 'Jan', revenus: 45000, depenses: 32000 },
 *     { month: 'Fév', revenus: 52000, depenses: 38000 }
 *   ]}
 *   lines={[
 *     { dataKey: 'revenus', name: 'Revenus', color: '#10b981' },
 *     { dataKey: 'depenses', name: 'Dépenses', color: '#ef4444' }
 *   ]}
 *   xAxisKey="month"
 * />
 */
const LineChart = forwardRef(({
  data = [],
  lines = [],
  xAxisKey = 'name',
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  curved = true,
  className = ''
}, ref) => {
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';

  // Couleurs par défaut selon le thème
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const textColor = isDark ? '#9ca3af' : '#6b7280';

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 dark:text-gray-400">{entry.name}:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {typeof entry.value === 'number' 
                  ? entry.value.toLocaleString() 
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={ref} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          )}
          
          <XAxis
            dataKey={xAxisKey}
            stroke={textColor}
            style={{ fontSize: '12px' }}
          />
          
          <YAxis
            stroke={textColor}
            style={{ fontSize: '12px' }}
          />
          
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: '14px', color: textColor }}
            />
          )}
          
          {lines.map((line, index) => (
            <Line
              key={index}
              type={curved ? 'monotone' : 'linear'}
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={{ r: 4, fill: line.color }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
});

LineChart.displayName = 'LineChart';

LineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  lines: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    })
  ).isRequired,
  xAxisKey: PropTypes.string,
  height: PropTypes.number,
  showGrid: PropTypes.bool,
  showLegend: PropTypes.bool,
  showTooltip: PropTypes.bool,
  curved: PropTypes.bool,
  className: PropTypes.string
};

export default LineChart;