import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './componants/Home/Home.js';
import InvoiceShow from './componants/InvoiceShow/InvoiceShow.js';
import Forms from './componants/Forms/Forms.js';
import CountriesSett from './componants/settings/CountriesSett.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/form" element={<Forms />} />
        <Route path="/" element={<Home />} />
        <Route path="/invoiceShow" element={<InvoiceShow />} />
        <Route path="/sett" element={<CountriesSett />} />
      </Routes>
    </Router>
  );
}

export default App;
