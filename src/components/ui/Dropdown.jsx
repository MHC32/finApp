import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({
  trigger,
  children,
  isOpen,
  onClose,
  placement = 'bottom-start',
  className = ''
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return trigger;

  return (
    <div className="relative" ref={dropdownRef}>
      {trigger}
      <div className={`
        absolute z-50 mt-1 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none
        ${placement === 'bottom-end' ? 'right-0' : 'left-0'}
        ${className}
      `}>
        <div className="py-1">
          {children}
        </div>
      </div>
    </div>
  );
};

const DropdownItem = ({ 
  children, 
  onClick, 
  leftIcon: LeftIcon, 
  className = '',
  ...props 
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
      ${className}
    `}
    {...props}
  >
    {LeftIcon && <LeftIcon className="w-4 h-4 mr-3" />}
    {children}
  </button>
);

const DropdownSeparator = () => (
  <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
);

Dropdown.Item = DropdownItem;
Dropdown.Separator = DropdownSeparator;

Dropdown.propTypes = {
  trigger: PropTypes.element.isRequired,
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  placement: PropTypes.oneOf(['bottom-start', 'bottom-end']),
  className: PropTypes.string
};

DropdownItem.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  leftIcon: PropTypes.elementType,
  className: PropTypes.string
};

export default Dropdown;