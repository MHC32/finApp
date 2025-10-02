import { Link } from "react-router-dom";
import Container from "@mui/material/Container";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

function DefaultNavbar() {
  return (
    <Container>
      <MDBox py={2} px={3} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography component={Link} to="/" variant="h6" fontWeight="bold">
          FinApp Haiti
        </MDTypography>
        <MDBox display="flex" gap={2}>
          <MDButton component={Link} to="/authentication/sign-in" variant="text" color="dark">
            Se connecter
          </MDButton>
          <MDButton component={Link} to="/authentication/sign-up" variant="gradient" color="info">
            S'inscrire
          </MDButton>
        </MDBox>
      </MDBox>
    </Container>
  );
}

export default DefaultNavbar;
