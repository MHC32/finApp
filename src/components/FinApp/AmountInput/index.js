// src/components/FinApp/AmountInput/index.js
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// @mui material components
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

// @mui icons
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CalculateIcon from "@mui/icons-material/Calculate";

// Material Dashboard 2 React components
import MDInput from "components/MDInput";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// FinApp components
import { CURRENCIES } from "components/FinApp/CurrencySelector";

// Utilitaires formatage
const formatNumber = (value, locale = "fr-HT") => {
  if (!value && value !== 0) return "";
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const parseNumber = (value, locale = "fr-HT") => {
  if (!value) return null;
  
  // Nettoyage de la chaîne
  let cleaned = value.toString()
    .replace(/\s/g, "") // Supprimer espaces
    .replace(/[^\d.,\-]/g, ""); // Garder seulement chiffres, virgule, point, moins
  
  // Gestion virgule/point selon locale
  if (locale === "fr-HT") {
    cleaned = cleaned.replace(",", ".");
  }
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
};

function AmountInput({
  value = "",
  onChange,
  currency = "HTG",
  onCurrencyChange,
  label = "Montant",
  placeholder,
  min = 0,
  max,
  required = false,
  disabled = false,
  error = false,
  helperText = "",
  showCurrencySwitch = false,
  showCalculator = false,
  variant = "outlined",
  size = "medium",
  fullWidth = true,
  ...other
}) {
  const [inputValue, setInputValue] = useState("");
  const [numericValue, setNumericValue] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  // Synchroniser avec la prop value
  useEffect(() => {
    if (value !== undefined && value !== null) {
      const parsed = parseNumber(value);
      setNumericValue(parsed);
      
      if (!isFocused) {
        // Formatter seulement si pas en focus
        setInputValue(parsed !== null ? formatNumber(parsed) : "");
      }
    }
  }, [value, isFocused]);

  const handleInputChange = (event) => {
    const rawValue = event.target.value;
    setInputValue(rawValue);
    
    const parsed = parseNumber(rawValue);
    setNumericValue(parsed);
    
    // Callback vers parent avec valeur numérique
    if (onChange) {
      onChange(parsed);
    }
  };

  const handleFocus = (event) => {
    setIsFocused(true);
    // Afficher valeur brute en focus
    if (numericValue !== null) {
      setInputValue(numericValue.toString());
    }
    if (other.onFocus) {
      other.onFocus(event);
    }
  };

  const handleBlur = (event) => {
    setIsFocused(false);
    // Formater en sortie de focus
    if (numericValue !== null) {
      setInputValue(formatNumber(numericValue));
    }
    if (other.onBlur) {
      other.onBlur(event);
    }
  };

  const handleCurrencySwitch = () => {
    const newCurrency = currency === "HTG" ? "USD" : "HTG";
    if (onCurrencyChange) {
      onCurrencyChange(newCurrency);
    }
  };

  const handleCalculatorClick = () => {
    // TODO: Ouvrir modal calculatrice
    console.log("Ouvrir calculatrice");
  };

  // Validation
  const isInvalid = error || 
    (numericValue !== null && min !== undefined && numericValue < min) ||
    (numericValue !== null && max !== undefined && numericValue > max);

  const getHelperText = () => {
    if (helperText) return helperText;
    if (numericValue !== null && min !== undefined && numericValue < min) {
      return `Montant minimum: ${formatNumber(min)} ${currency}`;
    }
    if (numericValue !== null && max !== undefined && numericValue > max) {
      return `Montant maximum: ${formatNumber(max)} ${currency}`;
    }
    return "";
  };

  // Configuration symbole monétaire
  const currencyConfig = CURRENCIES[currency];
  const currencySymbol = currencyConfig ? currencyConfig.symbol : currency;

  return (
    <MDBox>
      <MDInput
        {...other}
        label={label}
        placeholder={placeholder || `0.00 ${currency}`}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        required={required}
        disabled={disabled}
        error={isInvalid}
        InputProps={{
          // Symbole monétaire au début
          startAdornment: (
            <InputAdornment position="start">
              <MDTypography 
                variant="button" 
                fontWeight="medium"
                color={isInvalid ? "error" : "text"}
              >
                {currencySymbol}
              </MDTypography>
            </InputAdornment>
          ),
          // Actions à la fin
          endAdornment: (
            <InputAdornment position="end">
              <MDBox display="flex" alignItems="center" gap={0.5}>
                {/* Switch currency */}
                {showCurrencySwitch && onCurrencyChange && (
                  <Tooltip title={`Changer vers ${currency === "HTG" ? "USD" : "HTG"}`}>
                    <IconButton
                      size="small"
                      onClick={handleCurrencySwitch}
                      disabled={disabled}
                    >
                      <SwapHorizIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                
                {/* Calculatrice */}
                {showCalculator && (
                  <Tooltip title="Ouvrir calculatrice">
                    <IconButton
                      size="small"
                      onClick={handleCalculatorClick}
                      disabled={disabled}
                    >
                      <CalculateIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </MDBox>
            </InputAdornment>
          ),
          // Styling spécialisé
          sx: {
            "& input": {
              textAlign: "right",
              fontFamily: "monospace",
              fontSize: size === "small" ? "0.875rem" : "1rem",
              fontWeight: 500,
            }
          }
        }}
      />
      
      {/* Texte d'aide */}
      {getHelperText() && (
        <MDBox mt={0.5}>
          <MDTypography 
            variant="caption" 
            color={isInvalid ? "error" : "text"}
          >
            {getHelperText()}
          </MDTypography>
        </MDBox>
      )}
      
      {/* Conversion temps réel (si applicable) */}
      {numericValue !== null && numericValue > 0 && showCurrencySwitch && (
        <MDBox mt={0.5}>
          <MDTypography variant="caption" color="text">
            ≈ {currency === "HTG" 
              ? `$${formatNumber(numericValue * 0.0075)}` // Taux HTG->USD
              : `${formatNumber(numericValue * 133.33)} HTG` // Taux USD->HTG
            }
          </MDTypography>
        </MDBox>
      )}
    </MDBox>
  );
}

// Props par défaut
AmountInput.defaultProps = {
  currency: "HTG",
  label: "Montant",
  min: 0,
  max: undefined,
  required: false,
  disabled: false,
  error: false,
  helperText: "",
  showCurrencySwitch: false,
  showCalculator: false,
  variant: "outlined",
  size: "medium",
  fullWidth: true,
};

// Validation des props
AmountInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  currency: PropTypes.oneOf(["HTG", "USD"]),
  onCurrencyChange: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  showCurrencySwitch: PropTypes.bool,
  showCalculator: PropTypes.bool,
  variant: PropTypes.oneOf(["outlined", "filled", "standard"]),
  size: PropTypes.oneOf(["small", "medium"]),
  fullWidth: PropTypes.bool,
};

export default AmountInput;

// Utilitaires d'export
export { formatNumber, parseNumber };