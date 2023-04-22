import React from 'react';

import { routes } from './routes';
import { useRoutes } from 'react-router-dom';
import './App.css';
function App() {
  return <div className="App">{useRoutes(routes)}</div>;
}

export default App;
