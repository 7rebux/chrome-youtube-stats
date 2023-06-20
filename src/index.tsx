import React from 'react';
import ReactDOM from 'react-dom/client';
import Container from './Container';

const init = () => {
  const sidebar = document.getElementById('related');
  const wrapper = document.createElement('div');
  const root = ReactDOM.createRoot(wrapper);
  
  sidebar.prepend(wrapper);
  root.render(<Container />);
};

window.addEventListener('load', init);
