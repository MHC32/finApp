// src/components/FinApp/CurrencyDisplay/index.js
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// @mui material components
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Grow from "@mui/material/Grow";

// @mui icons
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// FinApp components
import { CURRENCIES } from "components/FinApp/CurrencySelector";

// Hook pour animations
const useAmountAnimation = (amount) => {
  const [prevAmount, setPrevAmount] = useState(amount);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (amount !== prevAmount && prevAmount !== null) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPrevAmount(amount);
      }, 500);
      return () => clearTimeout(timer);
    }
    setPrevAmount(amount);
  }, [amount, prevAmount]);

  return { isAnimating, prevAmount };
};

// Utilitaire formatage
const formatAmount = (amount, currency, options = {}) => {
  const {
    showSymbol = true,
    showCurrency = false,
    locale = "fr-HT",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  if (amount === null || amount === undefined) return "—";

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(Math.abs(amount));

  const currencyConfig = CURRENCIES[currency];
  const symbol = currencyConfig ? currencyConfig.symbol : currency;
  
  let result = "";
  
  if (showSymbol && currency === "USD") {
    result = `${symbol}${formatted}`;
  } else if (showSymbol) {
    result = `${formatted} ${symbol}`;
  } else {
    result = formatted;
  }
  
  if (showCurrency && !showSymbol) {
    result = `${result} ${currency}`;
  }
  
  return result;
};

function CurrencyDisplay({
  amount,
  currency = "HTG",
  variant = "h6",
  color = "auto",
  fontWeight = "medium",
  showTrend = false,
  previousAmount,
  showSymbol = true,
  showCurrency = false,
  isPrivate = false,
  showPrivacyToggle = false,
  showConversion = false,
  onConversionToggle,
  animate = true,
  size = "medium",
  align = "left",
  ...other
}) {
  const [isHidden, setIsHidden] = useState(isPrivate);
  const [showConvertedAmount, setShowConvertedAmount] = useState(false);
  const { isAnimating } = useAmountAnimation(amount);

  // Détermination de la couleur automatique
  const getColor = () => {
    if (color !== "auto") return color;
    if (amount === null || amount === undefined || amount === 0) return "text";
    return amount > 0 ? "success" : "error";
  };

  // Calcul de la tendance
  const getTrendData = () => {
    if (!showTrend || !previousAmount || amount === null) return null;
    
    const diff = amount - previousAmount;
    const isPositive = diff > 0;
    const percentage = previousAmount !== 0 ? (diff / Math.abs(previousAmount)) * 100 : 0;
    
    return {
      isPositive,
      difference: diff,
      percentage: Math.abs(percentage),
      icon: isPositive ? TrendingUpIcon : TrendingDownIcon,
      color: isPositive ? "success" : "error"
    };
  };

  // Conversion de devise
  const getConvertedAmount = () => {
    if (!amount || !showConversion) return null;
    
    // Taux de change simulés - remplacer par vraie API
    const rate = currency === "HTG" ? 0.0075 : 133.33;
    const convertedValue = amount * rate;
    const targetCurrency = currency === "HTG" ? "USD" : "HTG";
    
    return {
      amount: convertedValue,
      currency: targetCurrency
    };
  };

  const handlePrivacyToggle = () => {
    setIsHidden(!isHidden);
  };

  const handleConversionToggle = () => {
    setShowConvertedAmount(!showConvertedAmount);
    if (onConversionToggle) {
      onConversionToggle(!showConvertedAmount);
    }
  };

  const trendData = getTrendData();
  const convertedData = getConvertedAmount();
  const displayColor = getColor();

  // Configuration de taille
  const sizeConfig = {
    small: { variant: "button", iconSize: "small" },
    medium: { variant: "h6", iconSize: "medium" }, 
    large: { variant: "h4", iconSize: "large" },
  };
  const actualVariant = variant !== "h6" ? variant : sizeConfig[size].variant;

  return (
    <MDBox 
      display="flex" 
      alignItems="center" 
      justifyContent={align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start"}
      gap={1}
      {...other}
    >
      {/* Montant principal */}
      <Grow in={true} timeout={animate ? 500 : 0}>
        <MDBox display="flex" alignItems="center" gap={0.5}>
          <MDTypography
            variant={actualVariant}
            color={displayColor}
            fontWeight={fontWeight}
            sx={{
              transition: animate ? "all 0.3s ease" : "none",
              transform: isAnimating ? "scale(1.05)" : "scale(1)",
              textAlign: align,
              fontFamily: "monospace",
            }}
          >
            {isHidden ? "••••••" : formatAmount(amount, currency, { showSymbol, showCurrency })}
          </MDTypography>

          {/* Icône tendance */}
          {trendData && !isHidden && (
            <Tooltip title={`${trendData.isPositive ? "+" : ""}${formatAmount(trendData.difference, currency)} (${trendData.percentage.toFixed(1)}%)`}>
              <Box sx={{ display: "flex", alignItems: "center", ml: 0.5 }}>
                <trendData.icon 
                  fontSize={sizeConfig[size].iconSize}
                  color={trendData.color}
                />
              </Box>
            </Tooltip>
          )}
        </MDBox>
      </Grow>

      {/* Actions */}
      <MDBox display="flex" alignItems="center" gap={0.5}>
        {/* Toggle visibilité */}
        {showPrivacyToggle && (
          <Tooltip title={isHidden ? "Afficher" : "Masquer"}>
            <IconButton size="small" onClick={handlePrivacyToggle}>
              {isHidden ? (
                <VisibilityIcon fontSize="small" />
              ) : (
                <VisibilityOffIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        )}

        {/* Toggle conversion */}
        {showConversion && convertedData && (
          <Tooltip title={`Voir en ${convertedData.currency}`}>
            <IconButton size="small" onClick={handleConversionToggle}>
              <SwapHorizIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </MDBox>

      {/* Montant converti */}
      {showConversion && convertedData && showConvertedAmount && !isHidden && (
        <Chip
          label={`≈ ${formatAmount(convertedData.amount, convertedData.currency, { showSymbol })}`}
          size="small"
          variant="outlined"
          sx={{
            fontSize: "0.75rem",
            height: 24,
            color: "text.secondary",
            borderColor: "text.secondary"
          }}
        />
      )}

      {/* Chip tendance (version alternative) */}
      {trendData && showTrend && !isHidden && size === "small" && (
        <Chip
          icon={<trendData.icon fontSize="small" />}
          label={`${trendData.isPositive ? "+" : ""}${trendData.percentage.toFixed(1)}%`}
          size="small"
          color={trendData.color}
          variant="outlined"
          sx={{ fontSize: "0.75rem", height: 20 }}
        />
      )}
    </MDBox>
  );
}

// Props par défaut
CurrencyDisplay.defaultProps = {
  currency: "HTG",
  variant: "h6",
  color: "auto", 
  fontWeight: "medium",
  showTrend: false,
  showSymbol: true,
  showCurrency: false,
  isPrivate: false,
  showPrivacyToggle: false,
  showConversion: false,
  animate: true,
  size: "medium",
  align: "left",
};

// Validation des props
CurrencyDisplay.propTypes = {
  amount: PropTypes.number,
  currency: PropTypes.oneOf(["HTG", "USD"]),
  variant: PropTypes.string,
  color: PropTypes.oneOfType([
    PropTypes.oneOf(["auto", "primary", "secondary", "info", "success", "warning", "error", "text"]),
    PropTypes.string
  ]),
  fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showTrend: PropTypes.bool,
  previousAmount: PropTypes.number,
  showSymbol: PropTypes.bool,
  showCurrency: PropTypes.bool,
  isPrivate: PropTypes.bool,
  showPrivacyToggle: PropTypes.bool,
  showConversion: PropTypes.bool,
  onConversionToggle: PropTypes.func,
  animate: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  align: PropTypes.oneOf(["left", "center", "right"]),
};

export default CurrencyDisplay;

// Utilitaires d'export
export { formatAmount };