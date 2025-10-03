/**
 * =========================================================
 * FinApp Haiti - Sign Up Page
 * Page d'inscription avec validation et Redux
 * =========================================================
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Redux actions et selectors
import { registerAsync, clearError } from "store/slices/authSlice";
import { 
  selectAuthLoading, 
  selectAuthError,
  selectIsAuthenticated 
} from "store/slices/authSlice";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

// Régions d'Haïti
const REGIONS_HAITI = [
  "Artibonite",
  "Centre",
  "Grand'Anse",
  "Nippes",
  "Nord",
  "Nord-Est",
  "Nord-Ouest",
  "Ouest",
  "Sud",
  "Sud-Est"
];

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    region: "Ouest",
    currency: "HTG",
    agreeTerms: false
  });

  const [formErrors, setFormErrors] = useState({});

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Nettoyer erreur au démontage
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === "agreeTerms" ? checked : value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }

    // Clear global error
    if (error) {
      dispatch(clearError());
    }
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    const errors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      errors.firstName = "Le prénom est requis";
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = "Minimum 2 caractères";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      errors.lastName = "Le nom est requis";
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = "Minimum 2 caractères";
    }

    // Email validation
    if (!formData.email) {
      errors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Format d'email invalide";
    }

    // Phone validation (optionnel mais si rempli, doit être valide)
    if (formData.phone && !/^\+?[\d\s-]{8,}$/.test(formData.phone)) {
      errors.phone = "Numéro de téléphone invalide";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      errors.password = "Minimum 6 caractères requis";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirmez le mot de passe";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    // Terms validation
    if (!formData.agreeTerms) {
      errors.agreeTerms = "Vous devez accepter les conditions";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    dispatch(clearError());

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Prepare data for API
    const registerData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      region: formData.region,
      currency: formData.currency,
      language: "fr"
    };

    // Dispatch register action
    const result = await dispatch(registerAsync(registerData));

    // Check if registration succeeded
    if (registerAsync.fulfilled.match(result)) {
      console.log('✅ Inscription réussie, redirection...');
      // Navigation gérée par useEffect avec isAuthenticated
    } else {
      console.error('❌ Inscription échouée:', result.payload);
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        {/* Header */}
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Inscription
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Rejoignez FinApp Haiti 🇭🇹
          </MDTypography>
        </MDBox>

        <MDBox pt={4} pb={3} px={3}>
          {/* Global Error Alert */}
          {error && (
            <MDBox mb={2}>
              <Alert 
                severity="error" 
                onClose={() => dispatch(clearError())}
              >
                {error}
              </Alert>
            </MDBox>
          )}

          {/* Form */}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            {/* First Name */}
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Prénom"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                error={!!formErrors.firstName}
                disabled={loading}
                autoComplete="given-name"
                autoFocus
              />
              {formErrors.firstName && (
                <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1}>
                  {formErrors.firstName}
                </MDTypography>
              )}
            </MDBox>

            {/* Last Name */}
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Nom"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                error={!!formErrors.lastName}
                disabled={loading}
                autoComplete="family-name"
              />
              {formErrors.lastName && (
                <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1}>
                  {formErrors.lastName}
                </MDTypography>
              )}
            </MDBox>

            {/* Email */}
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                error={!!formErrors.email}
                disabled={loading}
                autoComplete="email"
              />
              {formErrors.email && (
                <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1}>
                  {formErrors.email}
                </MDTypography>
              )}
            </MDBox>

            {/* Phone (optionnel) */}
            <MDBox mb={2}>
              <MDInput
                type="tel"
                label="Téléphone (optionnel)"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                error={!!formErrors.phone}
                disabled={loading}
                autoComplete="tel"
                placeholder="+509 XXXX-XXXX"
              />
              {formErrors.phone && (
                <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1}>
                  {formErrors.phone}
                </MDTypography>
              )}
            </MDBox>

            {/* Region */}
            <MDBox mb={2}>
              <MDInput
                select
                label="Région"
                name="region"
                value={formData.region}
                onChange={handleChange}
                fullWidth
                disabled={loading}
                SelectProps={{
                  native: false,
                }}
              >
                {REGIONS_HAITI.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </MDInput>
            </MDBox>

            {/* Password */}
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Mot de passe"
                name="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                error={!!formErrors.password}
                disabled={loading}
                autoComplete="new-password"
              />
              {formErrors.password && (
                <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1}>
                  {formErrors.password}
                </MDTypography>
              )}
            </MDBox>

            {/* Confirm Password */}
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Confirmer le mot de passe"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                error={!!formErrors.confirmPassword}
                disabled={loading}
                autoComplete="new-password"
              />
              {formErrors.confirmPassword && (
                <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1}>
                  {formErrors.confirmPassword}
                </MDTypography>
              )}
            </MDBox>

            {/* Terms & Conditions */}
            <MDBox display="flex" alignItems="center" ml={-1} mb={2}>
              <Checkbox
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                disabled={loading}
              />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;J'accepte les&nbsp;
                <MDTypography
                  component="a"
                  href="#"
                  variant="button"
                  fontWeight="bold"
                  color="info"
                  textGradient
                >
                  Conditions d'utilisation
                </MDTypography>
              </MDTypography>
            </MDBox>
            {formErrors.agreeTerms && (
              <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1} mb={2}>
                {formErrors.agreeTerms}
              </MDTypography>
            )}

            {/* Submit Button */}
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <MDBox display="flex" alignItems="center" justifyContent="center">
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Inscription en cours...
                  </MDBox>
                ) : (
                  "S'inscrire"
                )}
              </MDButton>
            </MDBox>

            {/* Login Link */}
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Déjà un compte ?{" "}
                <MDTypography
                  component={Link}
                  to="/login"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                  sx={{ 
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" }
                  }}
                >
                  Se connecter
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default SignUp;