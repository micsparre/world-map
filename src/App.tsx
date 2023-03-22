import React from 'react';
import logo from './logo.svg';
import './App.css';
import MapChart from "./MapChart";

const App: React.FC = () => {
  return (
    <div>
      <h1>My Travel Map</h1>
      <MapChart />
    </div>
  );
};

export default App;
