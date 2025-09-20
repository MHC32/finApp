// src/components/FinApp/CategorySelector/index.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';

// @mui icons
import Icon from '@mui/material/Icon';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';

// Configuration des catégories pour le contexte haïtien
const CATEGORIES_CONFIG = {
  // Catégories de dépenses
  expense: [
    {
      id: 'alimentation',
      label: 'Alimentation',
      icon: 'restaurant',
      color: 'success',
      subcategories: ['Supermarché', 'Marché local', 'Restaurant', 'Fast-food', 'Épicerie', 'Boulangerie']
    },
    {
      id: 'transport',
      label: 'Transport',
      icon: 'directions_car',
      color: 'info',
      subcategories: ['Tap-tap', 'Taxi', 'Moto-taxi', 'Bus', 'Essence', 'Réparation véhicule', 'Parking']
    },
    {
      id: 'logement',
      label: 'Logement',
      icon: 'home',
      color: 'primary',
      subcategories: ['Loyer', 'Électricité (EDH)', 'Eau (DINEPA)', 'Internet', 'Téléphone', 'Réparations', 'Mobilier']
    },
    {
      id: 'sante',
      label: 'Santé',
      icon: 'medical_services',
      color: 'error',
      subcategories: ['Médecin', 'Pharmacie', 'Hôpital', 'Dentiste', 'Laboratoire', 'Assurance santé', 'Vitamines']
    },
    {
      id: 'education',
      label: 'Éducation',
      icon: 'school',
      color: 'warning',
      subcategories: ['École', 'Université', 'Cours particuliers', 'Livres', 'Matériel scolaire', 'Formation']
    },
    {
      id: 'loisirs',
      label: 'Loisirs',
      icon: 'sports_esports',
      color: 'secondary',
      subcategories: ['Cinéma', 'Concert', 'Sport', 'Sorties', 'Voyage', 'Hobbies', 'Festivals']
    },
    {
      id: 'vetements',
      label: 'Vêtements',
      icon: 'checkroom',
      color: 'primary',
      subcategories: ['Vêtements', 'Chaussures', 'Accessoires', 'Coiffeur', 'Cosmétiques']
    },
    {
      id: 'services',
      label: 'Services',
      icon: 'build',
      color: 'info',
      subcategories: ['Banque', 'Notaire', 'Avocat', 'Comptable', 'Réparations', 'Nettoyage']
    },
    {
      id: 'famille',
      label: 'Famille',
      icon: 'family_restroom',
      color: 'success',
      subcategories: ['Enfants', 'Aide famille', 'Cadeaux', 'Fêtes', 'Mariage', 'Baptême']
    },
    {
      id: 'divers',
      label: 'Divers',
      icon: 'category',
      color: 'dark',
      subcategories: ['Imprévus', 'Frais bancaires', 'Taxes', 'Amendes', 'Dons', 'Autre']
    }
  ],
  
  // Catégories de revenus
  income: [
    {
      id: 'salaire',
      label: 'Salaire',
      icon: 'work',
      color: 'success',
      subcategories: ['Salaire principal', 'Bonus', 'Heures supplémentaires', 'Prime']
    },
    {
      id: 'business',
      label: 'Business',
      icon: 'business_center',
      color: 'primary',
      subcategories: ['Vente produits', 'Services', 'Commerce', 'Artisanat', 'Agriculture']
    },
    {
      id: 'investissement',
      label: 'Investissement',
      icon: 'trending_up',
      color: 'warning',
      subcategories: ['Actions', 'Élevage', 'Immobilier', 'Sols reçus', 'Intérêts']
    },
    {
      id: 'freelance',
      label: 'Freelance',
      icon: 'laptop_mac',
      color: 'info',
      subcategories: ['Consultation', 'Projets', 'Traduction', 'Design', 'Programmation']
    },
    {
      id: 'aide',
      label: 'Aide reçue',
      icon: 'volunteer_activism',
      color: 'secondary',
      subcategories: ['Famille', 'Diaspora', 'Amis', 'Organisations', 'Bourses']
    },
    {
      id: 'autre_revenu',
      label: 'Autre revenu',
      icon: 'attach_money',
      color: 'success',
      subcategories: ['Remboursement', 'Vente objets', 'Location', 'Trouvé', 'Cadeau argent']
    }
  ]
};

function CategorySelector({
  value = null,
  onChange,
  transactionType = 'expense',
  size = 'medium',
  showSubcategory = true,
  allowCustom = true,
  required = false,
  error = false,
  helperText = '',
  disabled = false,
  variant = 'grid', // 'grid', 'dropdown', 'compact'
  maxVisible = 10,
  ...other
}) {
  const [selectedCategory, setSelectedCategory] = useState(value?.category || null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(value?.subcategory || '');
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [customCategory, setCustomCategory] = useState({ label: '', icon: 'category', color: 'primary' });

  const categories = CATEGORIES_CONFIG[transactionType] || [];

  // Filtrer les catégories selon la recherche
  const filteredCategories = categories.filter(cat =>
    cat.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.subcategories.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Limiter l'affichage si nécessaire
  const visibleCategories = showAll ? filteredCategories : filteredCategories.slice(0, maxVisible);

  // Effet pour synchroniser avec la prop value
  useEffect(() => {
    if (value) {
      setSelectedCategory(value.category);
      setSelectedSubcategory(value.subcategory || '');
    }
  }, [value]);

  const handleCategorySelect = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    setSelectedCategory(categoryId);
    setSelectedSubcategory('');
    
    if (onChange) {
      onChange({
        category: categoryId,
        categoryLabel: category?.label,
        subcategory: '',
        subcategoryLabel: ''
      });
    }
  };

  const handleSubcategorySelect = (subcategory) => {
    const category = categories.find(cat => cat.id === selectedCategory);
    setSelectedSubcategory(subcategory);
    
    if (onChange) {
      onChange({
        category: selectedCategory,
        categoryLabel: category?.label,
        subcategory: subcategory,
        subcategoryLabel: subcategory
      });
    }
  };

  const handleCustomCategoryAdd = () => {
    if (customCategory.label.trim()) {
      // Ici, on pourrait envoyer vers une API pour sauvegarder
      const newCategory = {
        id: `custom_${Date.now()}`,
        label: customCategory.label,
        icon: customCategory.icon,
        color: customCategory.color,
        subcategories: [],
        isCustom: true
      };
      
      // Pour l'instant, on sélectionne juste la catégorie custom
      handleCategorySelect(newCategory.id);
      setCustomDialogOpen(false);
      setCustomCategory({ label: '', icon: 'category', color: 'primary' });
    }
  };

  const getSelectedCategory = () => {
    return categories.find(cat => cat.id === selectedCategory);
  };

  const getSubcategories = () => {
    const category = getSelectedCategory();
    return category?.subcategories || [];
  };

  // Rendu en mode grid (par défaut)
  const renderGridMode = () => (
    <MDBox>
      {/* Barre de recherche */}
      {categories.length > 6 && (
        <MDBox mb={2}>
          <MDInput
            placeholder="Rechercher une catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            }}
          />
        </MDBox>
      )}

      {/* Grille des catégories */}
      <Grid container spacing={1.5}>
        {visibleCategories.map((category) => (
          <Grid item xs={6} sm={4} md={3} key={category.id}>
            <Tooltip title={category.label}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: 2,
                  borderColor: selectedCategory === category.id ? `${category.color}.main` : 'grey.200',
                  bgcolor: selectedCategory === category.id ? `${category.color}.50` : 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: `${category.color}.main`,
                    bgcolor: `${category.color}.50`,
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
                onClick={() => handleCategorySelect(category.id)}
              >
                <CardContent sx={{ p: 1.5, textAlign: 'center', '&:last-child': { pb: 1.5 } }}>
                  <Icon 
                    sx={{ 
                      fontSize: size === 'small' ? '1.5rem' : '2rem',
                      color: selectedCategory === category.id ? `${category.color}.main` : 'grey.500',
                      mb: 0.5
                    }}
                  >
                    {category.icon}
                  </Icon>
                  <MDTypography 
                    variant={size === 'small' ? 'caption' : 'body2'}
                    fontWeight="medium"
                    color={selectedCategory === category.id ? `${category.color}.main` : 'text'}
                    textAlign="center"
                  >
                    {category.label}
                  </MDTypography>
                </CardContent>
              </Card>
            </Tooltip>
          </Grid>
        ))}

        {/* Bouton Voir plus/moins */}
        {filteredCategories.length > maxVisible && (
          <Grid item xs={6} sm={4} md={3}>
            <Card
              sx={{
                cursor: 'pointer',
                border: 2,
                borderColor: 'grey.300',
                bgcolor: 'grey.50',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50'
                }
              }}
              onClick={() => setShowAll(!showAll)}
            >
              <CardContent sx={{ p: 1.5, textAlign: 'center', '&:last-child': { pb: 1.5 } }}>
                {showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                <MDTypography variant="body2" color="text">
                  {showAll ? 'Voir moins' : `+${filteredCategories.length - maxVisible}`}
                </MDTypography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Bouton Ajouter catégorie custom */}
        {allowCustom && (
          <Grid item xs={6} sm={4} md={3}>
            <Card
              sx={{
                cursor: 'pointer',
                border: 2,
                borderColor: 'primary.300',
                borderStyle: 'dashed',
                bgcolor: 'primary.50',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.100'
                }
              }}
              onClick={() => setCustomDialogOpen(true)}
            >
              <CardContent sx={{ p: 1.5, textAlign: 'center', '&:last-child': { pb: 1.5 } }}>
                <AddIcon sx={{ fontSize: '2rem', color: 'primary.main', mb: 0.5 }} />
                <MDTypography variant="body2" color="primary" fontWeight="medium">
                  Ajouter
                </MDTypography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Sous-catégories */}
      {showSubcategory && selectedCategory && (
        <Collapse in={Boolean(selectedCategory)} timeout={300}>
          <MDBox mt={3}>
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Sous-catégorie (optionnel)
            </MDTypography>
            <Autocomplete
              options={getSubcategories()}
              value={selectedSubcategory}
              onChange={(event, newValue) => handleSubcategorySelect(newValue || '')}
              freeSolo
              renderInput={(params) => (
                <MDInput
                  {...params}
                  placeholder="Choisir ou taper une sous-catégorie..."
                  variant="outlined"
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <MDTypography variant="body2">{option}</MDTypography>
                </Box>
              )}
            />
          </MDBox>
        </Collapse>
      )}

      {/* Message d'erreur */}
      {error && helperText && (
        <MDTypography variant="caption" color="error" mt={1} display="block">
          {helperText}
        </MDTypography>
      )}
    </MDBox>
  );

  // Rendu en mode dropdown (compact)
  const renderDropdownMode = () => (
    <MDBox>
      <Autocomplete
        options={categories}
        getOptionLabel={(option) => option.label}
        value={getSelectedCategory() || null}
        onChange={(event, newValue) => {
          if (newValue) {
            handleCategorySelect(newValue.id);
          }
        }}
        renderInput={(params) => (
          <MDInput
            {...params}
            label="Catégorie"
            placeholder="Sélectionner une catégorie..."
            error={error}
            helperText={helperText}
            required={required}
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props} display="flex" alignItems="center">
            <Icon sx={{ mr: 2, color: `${option.color}.main` }}>
              {option.icon}
            </Icon>
            <MDTypography variant="body2">{option.label}</MDTypography>
          </Box>
        )}
      />

      {/* Sous-catégorie en mode dropdown */}
      {showSubcategory && selectedCategory && (
        <MDBox mt={2}>
          <Autocomplete
            options={getSubcategories()}
            value={selectedSubcategory}
            onChange={(event, newValue) => handleSubcategorySelect(newValue || '')}
            freeSolo
            renderInput={(params) => (
              <MDInput
                {...params}
                label="Sous-catégorie"
                placeholder="Optionnel..."
              />
            )}
          />
        </MDBox>
      )}
    </MDBox>
  );

  return (
    <MDBox {...other}>
      {variant === 'grid' ? renderGridMode() : renderDropdownMode()}

      {/* Dialog pour ajouter une catégorie custom */}
      <Dialog open={customDialogOpen} onClose={() => setCustomDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <MDTypography variant="h5" fontWeight="medium">
            Ajouter une catégorie personnalisée
          </MDTypography>
        </DialogTitle>
        <DialogContent>
          <MDBox pt={1}>
            <MDInput
              label="Nom de la catégorie"
              placeholder="Ex: Pharmacie, Cours d'anglais..."
              value={customCategory.label}
              onChange={(e) => setCustomCategory(prev => ({ ...prev, label: e.target.value }))}
              fullWidth
              margin="normal"
            />
            
            <MDTypography variant="body2" color="text" mt={2} mb={1}>
              Icône (optionnel)
            </MDTypography>
            <Grid container spacing={1}>
              {['category', 'store', 'local_hospital', 'school', 'fitness_center', 'pets'].map((iconName) => (
                <Grid item key={iconName}>
                  <IconButton
                    onClick={() => setCustomCategory(prev => ({ ...prev, icon: iconName }))}
                    sx={{
                      border: 1,
                      borderColor: customCategory.icon === iconName ? 'primary.main' : 'grey.300',
                      bgcolor: customCategory.icon === iconName ? 'primary.50' : 'transparent'
                    }}
                  >
                    <Icon>{iconName}</Icon>
                  </IconButton>
                </Grid>
              ))}
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setCustomDialogOpen(false)}>
            Annuler
          </MDButton>
          <MDButton 
            variant="contained" 
            onClick={handleCustomCategoryAdd}
            disabled={!customCategory.label.trim()}
          >
            Ajouter
          </MDButton>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
}

CategorySelector.propTypes = {
  value: PropTypes.shape({
    category: PropTypes.string,
    categoryLabel: PropTypes.string,
    subcategory: PropTypes.string,
    subcategoryLabel: PropTypes.string
  }),
  onChange: PropTypes.func,
  transactionType: PropTypes.oneOf(['expense', 'income']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showSubcategory: PropTypes.bool,
  allowCustom: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['grid', 'dropdown', 'compact']),
  maxVisible: PropTypes.number,
};

export default CategorySelector;