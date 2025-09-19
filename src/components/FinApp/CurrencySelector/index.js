// src/components/FinApp/CurrencySelector/index.js
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// @mui material components
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Images - drapeaux
import haitiFlag from "assets/images/flags/haiti.svg";
import usaFlag from "assets/images/flags/usa.svg";

// Configuration des devises
const CURRENCIES = {
  HTG: {
    code: "HTG",
    name: "Gourde Haïtienne",
    symbol: "HTG",
    flag: haitiFlag,
    color: "#0072CE", // Bleu Haiti
  },
  USD: {
    code: "USD", 
    name: "Dollar Américain",
    symbol: "$",
    flag: usaFlag,
    color: "#2E7D32", // Vert USD
  }
};

// Hook pour taux de change (simulation - remplacer par API réelle)
const useExchangeRate = () => {
  const [rates, setRates] = useState({ HTGUSD: 0.0075, USDHTG: 133.33 });
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // TODO: Remplacer par vraie API (ex: BRH, xe.com, fixer.io)
    const fetchRates = async () => {
      setLoading(true);
      try {
        // Simulation API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Rates mockés - remplacer par vraie API
        setRates({ 
          HTGUSD: 0.0075 + (Math.random() - 0.5) * 0.0001, 
          USDHTG: 133.33 + (Math.random() - 0.5) * 2 
        });
        setLastUpdate(new Date());
      } catch (error) {
        console.error("Erreur récupération taux:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    // Refresh toutes les 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { rates, loading, lastUpdate };
};

function CurrencySelector({ 
  value = "HTG", 
  onChange, 
  showExchangeRate = true,
  size = "medium",
  variant = "outlined",
  disabled = false,
  fullWidth = false 
}) {
  const { rates, loading, lastUpdate } = useExchangeRate();
  const [selectedCurrency, setSelectedCurrency] = useState(value);

  useEffect(() => {
    setSelectedCurrency(value);
  }, [value]);

  const handleChange = (event) => {
    const newCurrency = event.target.value;
    setSelectedCurrency(newCurrency);
    if (onChange) {
      onChange(newCurrency);
    }
  };

  const getCurrentRate = () => {
    if (selectedCurrency === "HTG") {
      return `1 USD = ${rates.USDHTG.toFixed(2)} HTG`;
    } else {
      return `1 HTG = ${rates.HTGUSD.toFixed(4)} USD`;
    }
  };

  const formatLastUpdate = () => {
    const now = new Date();
    const diffMinutes = Math.floor((now - lastUpdate) / 60000);
    if (diffMinutes < 1) return "à l'instant";
    if (diffMinutes < 60) return `il y a ${diffMinutes}min`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `il y a ${diffHours}h`;
  };

  return (
    <MDBox>
      {/* Sélecteur principal */}
      <FormControl 
        variant={variant} 
        size={size}
        fullWidth={fullWidth}
        disabled={disabled}
      >
        <InputLabel>Devise</InputLabel>
        <Select
          value={selectedCurrency}
          onChange={handleChange}
          label="Devise"
          sx={{
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              gap: 1
            }
          }}
        >
          {Object.values(CURRENCIES).map((currency) => (
            <MenuItem key={currency.code} value={currency.code}>
              <MDBox display="flex" alignItems="center" gap={1}>
                <Box
                  component="img"
                  src={currency.flag}
                  alt={`${currency.name} flag`}
                  sx={{
                    width: 24,
                    height: 16,
                    borderRadius: 0.5,
                    objectFit: "cover"
                  }}
                />
                <MDBox>
                  <MDTypography variant="button" fontWeight="medium">
                    {currency.code}
                  </MDTypography>
                  <MDTypography 
                    variant="caption" 
                    color="text" 
                    sx={{ display: "block", lineHeight: 1 }}
                  >
                    {currency.name}
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Taux de change */}
      {showExchangeRate && (
        <MDBox mt={1} display="flex" alignItems="center" justifyContent="space-between">
          <Chip
            label={loading ? "Chargement..." : getCurrentRate()}
            size="small"
            color={loading ? "default" : "primary"}
            variant="outlined"
            sx={{
              fontSize: "0.75rem",
              height: 24,
              bgcolor: loading ? "grey.100" : CURRENCIES[selectedCurrency].color + "20",
              borderColor: loading ? "grey.300" : CURRENCIES[selectedCurrency].color,
              color: loading ? "text.secondary" : CURRENCIES[selectedCurrency].color,
            }}
          />
          
          <MDTypography variant="caption" color="text">
            {formatLastUpdate()}
          </MDTypography>
        </MDBox>
      )}
    </MDBox>
  );
}

// Props par défaut
CurrencySelector.defaultProps = {
  value: "HTG",
  showExchangeRate: true,
  size: "medium",
  variant: "outlined", 
  disabled: false,
  fullWidth: false,
  onChange: null,
};

// Validation des props
CurrencySelector.propTypes = {
  value: PropTypes.oneOf(["HTG", "USD"]),
  onChange: PropTypes.func,
  showExchangeRate: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium"]),
  variant: PropTypes.oneOf(["outlined", "filled", "standard"]),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

export default CurrencySelector;

// Export des utilitaires liés
export { CURRENCIES, useExchangeRate };