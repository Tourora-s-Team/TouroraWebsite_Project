import React, { useState, useEffect } from 'react';
import styles from './DateInput.module.css';

const DateInput = ({ 
  value, 
  onChange, 
  placeholder = "dd/mm/yyyy", 
  className = "",
  required = false,
  isAutoFilled = false,
  ...props 
}) => {
  const [displayValue, setDisplayValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  // Convert ISO date to dd/mm/yyyy format
  const formatDateForDisplay = (isoDate) => {
    if (!isoDate) return '';
    try {
      // Parse YYYY-MM-DD format manually to avoid timezone issues
      const parts = isoDate.split('-');
      if (parts.length !== 3) return '';
      
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      
      if (isNaN(year) || isNaN(month) || isNaN(day)) return '';
      
      // Basic validation
      if (day < 1 || day > 31) return '';
      if (month < 1 || month > 12) return '';
      if (year < 1900 || year > 2100) return '';
      
      const formattedDay = String(day).padStart(2, '0');
      const formattedMonth = String(month).padStart(2, '0');
      const formattedYear = String(year);
      
      return `${formattedDay}/${formattedMonth}/${formattedYear}`;
    } catch {
      return '';
    }
  };
  // Convert dd/mm/yyyy to ISO date format
  const formatDateForValue = (displayDate) => {
    if (!displayDate) return '';
    
    const parts = displayDate.split('/');
    if (parts.length !== 3) return '';
    
    const [day, month, year] = parts;
    if (day.length !== 2 || month.length !== 2 || year.length !== 4) return '';
    
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    // Basic validation
    if (dayNum < 1 || dayNum > 31) return '';
    if (monthNum < 1 || monthNum > 12) return '';
    if (yearNum < 1900 || yearNum > 2100) return '';
    
    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (isNaN(date.getTime())) return '';
    
    // Check if the date is valid (handles leap years, etc.)
    if (date.getDate() !== dayNum || date.getMonth() !== monthNum - 1 || date.getFullYear() !== yearNum) {
      return '';
    }
    
    // Format as YYYY-MM-DD manually to avoid timezone issues
    const formattedYear = String(yearNum).padStart(4, '0');
    const formattedMonth = String(monthNum).padStart(2, '0');
    const formattedDay = String(dayNum).padStart(2, '0');
    
    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
  };

  // Validate date format
  const validateDate = (dateString) => {
    if (!dateString) return true; // Empty is valid if not required
    if (dateString.length !== 10) return false;
    return formatDateForValue(dateString) !== '';
  };
  // Initialize display value when prop value changes
  useEffect(() => {
    const formatted = formatDateForDisplay(value);
    setDisplayValue(formatted);
    setInputValue(formatted);
    setIsValid(validateDate(formatted));
  }, [value]);
  const handleInputChange = (e) => {
    let inputVal = e.target.value;
    
    // Remove non-digit characters
    inputVal = inputVal.replace(/\D/g, '');
    
    // Limit to 8 digits (ddmmyyyy)
    if (inputVal.length > 8) {
      inputVal = inputVal.slice(0, 8);
    }
    
    // Auto-format as user types
    if (inputVal.length >= 3 && inputVal.length <= 4) {
      inputVal = inputVal.slice(0, 2) + '/' + inputVal.slice(2);
    } else if (inputVal.length >= 5) {
      inputVal = inputVal.slice(0, 2) + '/' + inputVal.slice(2, 4) + '/' + inputVal.slice(4, 8);
    }
    
    setInputValue(inputVal);
    
    // Real-time validation
    const isValidDate = validateDate(inputVal);
    setIsValid(inputVal.length === 0 || isValidDate);
    
    // Trigger onChange immediately for empty values
    if (inputVal.length === 0) {
      setDisplayValue('');
      onChange({ target: { value: '' } });
      return;
    }
    
    // Only trigger onChange if we have a complete and valid date
    if (inputVal.length === 10 && isValidDate) {
      const isoDate = formatDateForValue(inputVal);
      if (isoDate) {
        setDisplayValue(inputVal);
        onChange({ target: { value: isoDate } });
      }
    }
  };
  const handleBlur = () => {
    // If empty, that's okay
    if (inputValue.length === 0) {
      setDisplayValue('');
      setIsValid(true);
      onChange({ target: { value: '' } });
      return;
    }

    // If complete and valid, finalize
    if (inputValue.length === 10) {
      const isValidDate = validateDate(inputValue);
      if (isValidDate) {
        const isoDate = formatDateForValue(inputValue);
        if (isoDate) {
          setDisplayValue(inputValue);
          setIsValid(true);
          onChange({ target: { value: isoDate } });
          return;
        }
      }
      
      // Invalid complete date
      setIsValid(false);
      return;
    }
    
    // Incomplete date - mark as invalid but keep the value for user to continue
    setIsValid(false);
  };

  const handleFocus = (e) => {
    e.target.select();
  };
  // Determine CSS classes
  const getCssClasses = () => {
    let classes = styles.dateInput;
    if (className) classes += ` ${className}`;
    
    // Auto-filled styling
    if (isAutoFilled && inputValue) classes += ` ${styles.autoFilled}`;
    
    // Validation styling
    if (!isValid && inputValue.length > 0) {
      classes += ` ${styles.error}`;
    } else if (isValid && inputValue.length === 10) {
      classes += ` ${styles.success}`;
    }
    
    return classes;
  };

  return (
    <input
      type="text"
      className={getCssClasses()}
      value={inputValue}
      onChange={handleInputChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholder={placeholder}
      maxLength={10}
      required={required}
      {...props}
    />
  );
};

export default DateInput;
