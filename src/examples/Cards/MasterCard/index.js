// src/components/FinApp/HaitiBankCard/index.js
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Images - logos des banques haïtiennes
import brhLogo from "../../../assets/images/logos/brh.png"; 
import sogebankLogo from "../../../assets/images/logos/sogebank.png";
import unibankLogo from "../../../assets/images/logos/unibank.png";
import capitalBankLogo from "../../../assets/images/logos/capital.png";
import bncLogo from "../../../assets/images/logos/bnc.png"; 
import pattern from "../../../assets/images/illustrations/pattern-tree.svg";

// Configuration des banques haïtiennes
const HAITI_BANKS = {
  sogebank: {
    name: "Sogebank",
    logo: sogebankLogo,
    color: "info", // Bleu Sogebank
  },
  unibank: {
    name: "Unibank",
    logo: unibankLogo,
    color: "success", // Vert Unibank
  },
  "capital-bank": {
    name: "Capital Bank",
    logo: capitalBankLogo,
    color: "warning", // Orange Capital Bank
  },
  bnc: {
    name: "BNC",
    logo: bncLogo,
    color: "error", // Rouge BNC
  },
  custom: {
    name: "Autre Banque",
    logo: brhLogo, // Logo BRH par défaut
    color: "dark",
  }
};

function HaitiBankCard({ 
  bank = "sogebank", 
  accountNumber, 
  holder, 
  balance, 
  currency = "HTG",
  accountType = "Épargne",
  color 
}) {
  // Configuration de la banque
  const bankConfig = HAITI_BANKS[bank] || HAITI_BANKS.custom;
  const cardColor = color || bankConfig.color;
  
  // Formatage du numéro de compte (masquer les chiffres du milieu)
  const formatAccountNumber = (number) => {
    const numStr = number.toString();
    if (numStr.length >= 8) {
      const first4 = numStr.slice(0, 4);
      const last4 = numStr.slice(-4);
      return `${first4} **** **** ${last4}`;
    }
    return numStr;
  };

  // Formatage du solde
  const formatBalance = (amount, curr) => {
    const formatted = new Intl.NumberFormat('fr-HT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    
    return curr === "USD" ? `$${formatted}` : `${formatted} HTG`;
  };

  return (
    <Card
      sx={({ palette: { gradients }, functions: { linearGradient }, boxShadows: { xl } }) => ({
        background: gradients[cardColor]
          ? linearGradient(gradients[cardColor].main, gradients[cardColor].state)
          : linearGradient(gradients.dark.main, gradients.dark.state),
        boxShadow: xl,
        position: "relative",
        minHeight: "200px",
      })}
    >
      {/* Pattern de fond */}
      <MDBox
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        opacity={0.2}
        sx={{
          backgroundImage: `url(${pattern})`,
          backgroundSize: "cover",
        }}
      />
      
      {/* Contenu principal */}
      <MDBox position="relative" zIndex={2} p={2.5}>
        {/* Header avec chip NFC et type de compte */}
        <MDBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <MDBox color="white" p={1} lineHeight={0} display="inline-block">
            <Icon fontSize="default">wifi</Icon>
          </MDBox>
          <MDTypography variant="caption" color="white" fontWeight="medium" opacity={0.8}>
            {accountType}
          </MDTypography>
        </MDBox>

        {/* Numéro de compte */}
        <MDTypography 
          variant="h6" 
          color="white" 
          fontWeight="medium" 
          sx={{ mt: 1, mb: 3, letterSpacing: "2px" }}
        >
          {formatAccountNumber(accountNumber)}
        </MDTypography>

        {/* Solde */}
        <MDBox mb={3}>
          <MDTypography variant="caption" color="white" fontWeight="regular" opacity={0.8}>
            Solde disponible
          </MDTypography>
          <MDTypography variant="h4" color="white" fontWeight="bold">
            {formatBalance(balance, currency)}
          </MDTypography>
        </MDBox>

        {/* Footer avec nom titulaire et logo banque */}
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDBox display="flex" alignItems="center">
            <MDBox mr={3} lineHeight={1}>
              <MDTypography variant="caption" color="white" fontWeight="regular" opacity={0.8}>
                Titulaire
              </MDTypography>
              <MDTypography
                variant="button"
                color="white"
                fontWeight="medium"
                textTransform="uppercase"
                sx={{ fontSize: "0.875rem" }}
              >
                {holder}
              </MDTypography>
            </MDBox>
            <MDBox lineHeight={1}>
              <MDTypography variant="caption" color="white" fontWeight="regular" opacity={0.8}>
                Devise
              </MDTypography>
              <MDTypography variant="button" color="white" fontWeight="medium">
                {currency}
              </MDTypography>
            </MDBox>
          </MDBox>
          
          {/* Logo de la banque */}
          <MDBox display="flex" justifyContent="flex-end" width="25%">
            <MDBox 
              component="img" 
              src={bankConfig.logo} 
              alt={`${bankConfig.name} logo`} 
              width="80%" 
              mt={1}
              sx={{
                filter: "brightness(0) invert(1)", // Rendre le logo blanc
                opacity: 0.9
              }}
            />
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Props par défaut
HaitiBankCard.defaultProps = {
  bank: "sogebank",
  currency: "HTG",
  accountType: "Épargne",
  color: null,
};

// Validation des props
HaitiBankCard.propTypes = {
  bank: PropTypes.oneOf(["sogebank", "unibank", "capital-bank", "bnc", "custom"]),
  accountNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  holder: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired,
  currency: PropTypes.oneOf(["HTG", "USD"]),
  accountType: PropTypes.string,
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
};

export default HaitiBankCard;