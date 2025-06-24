import React, { useState } from 'react';
import DateInput from '../components/car-rental/DateInput';

const DateInputTest = () => {
  const [dateValue, setDateValue] = useState('');

  const handleDateChange = (e) => {
    console.log('Date changed:', e.target.value);
    setDateValue(e.target.value);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Test DateInput Component</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Ngày sinh:</label>
        <DateInput
          value={dateValue}
          onChange={handleDateChange}
          placeholder="dd/mm/yyyy"
          style={{ width: '200px' }}
        />
      </div>
      
      <div>
        <strong>ISO Value:</strong> {dateValue || 'Empty'}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setDateValue('1990-05-15')}>
          Set to 15/05/1990
        </button>
        <button onClick={() => setDateValue('')} style={{ marginLeft: '10px' }}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default DateInputTest;
