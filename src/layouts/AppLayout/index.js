/**
 * =========================================================
 * FinApp Haiti - AppLayout
 * Layout racine qui gère les toasts et modals globaux
 * =========================================================
 */
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

// Material Dashboard 2 React components
import MDSnackbar from 'components/MDSnackbar';

// Redux
import { 
  selectToastQueue, 
  removeToast 
} from 'store/slices/uiSlice';

/**
 * AppLayout Component
 * Layout racine qui entoure toute l'application
 */
function AppLayout({ children }) {
  const dispatch = useDispatch();
  const toastQueue = useSelector(selectToastQueue);

  // Auto-fermer les toasts après leur durée
  useEffect(() => {
    if (toastQueue.length > 0) {
      const firstToast = toastQueue[0];
      const timer = setTimeout(() => {
        dispatch(removeToast(firstToast.id));
      }, firstToast.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [toastQueue, dispatch]);

  // Render du premier toast dans la queue
  const renderToast = () => {
    if (toastQueue.length === 0) return null;

    const toast = toastQueue[0];

    // Mapper les types vers les couleurs MDSnackbar
    const colorMap = {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info',
    };

    const iconMap = {
      success: 'check',
      error: 'warning',
      warning: 'priority_high',
      info: 'notifications',
    };

    return (
      <MDSnackbar
        color={colorMap[toast.type] || 'info'}
        icon={iconMap[toast.type] || 'notifications'}
        title="FinApp Haiti"
        content={toast.message}
        dateTime="À l'instant"
        open={true}
        onClose={() => dispatch(removeToast(toast.id))}
        close={() => dispatch(removeToast(toast.id))}
        bgWhite
      />
    );
  };

  return (
    <>
      {/* Contenu de l'app */}
      {children}

      {/* Toast Global */}
      {renderToast()}
    </>
  );
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;