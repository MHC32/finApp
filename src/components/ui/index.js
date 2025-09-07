// src/components/ui/index.js - VERSION CORRIGÉE SANS ERREURS
export { default as Button } from './Button';
export { default as Card, AlertCard, StatsCard } from './Card';
export { default as Input, Textarea, Select } from './Input';
export { default as Modal, ConfirmModal, AlertModal } from './Modal';
export { default as Badge, StatusBadge, PriorityBadge, NotificationBadge, CurrencyBadge, CategoryBadge, InlineBadge } from './Badge';
export { 
  default as LoadingSpinner, 
  PageLoader, 
  SectionLoader, 
  ButtonLoader, 
  InlineLoader, 
  SkeletonCard, 
  SkeletonList 
} from './LoadingSpinner';

// CurrencyDisplay avec ses variants
export { 
  default as CurrencyDisplay, 
  CompactCurrency, 
  DetailedCurrency, 
  LargeCurrency, 
  BalanceDisplay, 
  AmountChange 
} from './CurrencyDisplay';

// ExchangeWidget simple (sans variants pour l'instant)
export { default as ExchangeWidget } from './ExchangeWidget';