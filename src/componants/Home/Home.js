import { useState } from 'react';
import Cities from '../Cities/Cities';
import Countries from '../Countries/Countries';
import Customer from '../Customer/Customer';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import SalesInvoice from '../SalesInvoice/SalesInvoice';
import Items from '../Items/Items';
import './Home.css';

function Home() {

  return (

    <div>
      <header>
        <Header/>
      </header>
      
      <main>
        <Countries />
        <Cities/>
        <Customer/>
        <Items />
        <SalesInvoice />

      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Home;
