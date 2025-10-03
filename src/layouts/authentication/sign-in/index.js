/**
 * =========================================================
 * FinApp Haiti - Sign In Page
 * Page de connexion avec validation et Redux
 * =========================================================
 */

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Redux actions et selectors
import { loginAsync, clearError } from "store/slices/authSlice";
import { 
  selectAuthLoading, 
  selectAuthError,
  selectIsAuthenticated 
} from "store/slices/authSlice";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux state
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const [formErrors, setFormErrors] = useState({});

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      // Rediriger vers la page demandée ou dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

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
      [name]: name === "rememberMe" ? checked : value
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
   * Toggle password visibility
   */
  const handleTogglePassword = () => {
    // Fonctionnalité désactivée pour simplifier
    // Peut être réactivée plus tard si besoin
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData.email) {
      errors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Format d'email invalide";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      errors.password = "Minimum 6 caractères requis";
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

    // Dispatch login action
    const result = await dispatch(loginAsync({
      email: formData.email.trim(),
      password: formData.password,
      rememberMe: formData.rememberMe
    }));

    // Check if login succeeded
    if (loginAsync.fulfilled.match(result)) {
      console.log('✅ Login réussi, redirection...');
      // Navigation gérée par useEffect avec isAuthenticated
    } else {
      console.error('❌ Login échoué:', result.payload);
      // L'erreur est déjà dans le state Redux
    }
  };

  /**
   * Handle Remember Me toggle
   */
  const handleRememberMeToggle = () => {
    if (!loading) {
      setFormData(prev => ({
        ...prev,
        rememberMe: !prev.rememberMe
      }));
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        {/* Header */}
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Connexion
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Bienvenue sur FinApp Haiti 🇭🇹
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
            {/* Email Field */}
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
                autoFocus
              />
              {formErrors.email && (
                <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1}>
                  {formErrors.email}
                </MDTypography>
              )}
            </MDBox>

            {/* Password Field */}
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
                autoComplete="current-password"
              />
              {formErrors.password && (
                <MDTypography variant="caption" color="error" fontSize="0.75rem" ml={1}>
                  {formErrors.password}
                </MDTypography>
              )}
            </MDBox>

            {/* Remember Me Switch */}
            <MDBox display="flex" alignItems="center" ml={-1} mb={2}>
              <Switch
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={loading}
              />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleRememberMeToggle}
                sx={{ 
                  cursor: loading ? "default" : "pointer", 
                  userSelect: "none", 
                  ml: -1 
                }}
              >
                &nbsp;&nbsp;Se souvenir de moi
              </MDTypography>
            </MDBox>

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
                    Connexion en cours...
                  </MDBox>
                ) : (
                  "Se connecter"
                )}
              </MDButton>
            </MDBox>

            {/* Forgot Password Link */}
            <MDBox mt={2} mb={1} textAlign="center">
              <MDTypography 
                variant="button" 
                color="text"
                component={Link}
                to="/forgot-password"
                sx={{ 
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" }
                }}
              >
                Mot de passe oublié ?
              </MDTypography>
            </MDBox>

            {/* Divider */}
            <MDBox my={3}>
              <MDTypography variant="caption" color="text" textAlign="center" display="block">
                ──────  ou  ──────
              </MDTypography>
            </MDBox>

            {/* Register Link */}
            <MDBox textAlign="center">
              <MDTypography variant="button" color="text">
                Pas encore de compte ?{" "}
                <MDTypography
                  component={Link}
                  to="/register"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                  sx={{ 
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" }
                  }}
                >
                  S'inscrire
                </MDTypography>
              </MDTypography>
            </MDBox>

            {/* Demo Credentials (Development only) */}
            {process.env.NODE_ENV === 'development' && (
              <MDBox mt={3} p={2} bgcolor="grey.100" borderRadius="lg">
                <MDTypography variant="caption" color="text" fontWeight="bold">
                  🔧 Credentials de test :
                </MDTypography>
                <MDTypography variant="caption" color="text" display="block" mt={0.5}>
                  Email: test@finapp.ht
                </MDTypography>
                <MDTypography variant="caption" color="text" display="block">
                  Password: password123
                </MDTypography>
              </MDBox>
            )}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default SignIn;