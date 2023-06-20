import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import CustomContext from './Context/CustomContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CustomContext>
      <App />
    </CustomContext>
  </React.StrictMode>
);

