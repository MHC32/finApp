// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './index.css';
import ButtonExamples from './examples/ButtonExamples';
import ColorPaletteGuide from './examples/ColorPaletteGuide';
import InputExamples from './examples/InputExamples';
import CardExamples from './examples/CardExamples';
import ModalExamples from './examples/ModalExamples';
import ToastExamples from './examples/ToastExamples';
import LoadingExamples from './examples/LoadingExamples';
import BadgeExamples from './examples/BadgeExamples';
import AvatarExamples from './examples/AvatarExamples';
import SelectExamples from './examples/SelectExamples';
import FormsExamples from './examples/FormsExamples';
import NavigationExamples from './examples/NavigationExamples';
import FormsComponentsExamples from './examples/FormsComponentsExamples';
import CommonComponentsExamples from './examples/CommonComponentsExamples'; 
import ChartExamples from './examples/ChartsExamples';
// ===================================================================
// IMPORTANT : Importer interceptors pour les activer
// ===================================================================
import './api/interceptors';

// ===================================================================
// RENDU APPLICATION
// ===================================================================

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
       {/* <App />  */}
       <ChartExamples />
    </Provider>
  </React.StrictMode>
);