import Cities from '../Cities/Cities';
import Countries from '../Countries/Countries';
import Customer from '../Customer/Customer';
import Items from '../Items/Items';
import './Forms.css';
import Invoice from '../Invoice/Invoice';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

function Forms() {

  return (

    <div>
      <header>
        <Header />
      </header>
      <main>
        <Countries />
        <Cities />
        <Customer />
        <Items />
        <Invoice />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Forms;