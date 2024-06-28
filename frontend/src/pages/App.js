import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import BasicOptionChain from './basic-option-chain';
import OptionChart from './option-chart';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BasicOptionChain />} />
        <Route path="/basic-option-chain" element={<BasicOptionChain />} />
        <Route path="/option-chart" element={<OptionChart />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
