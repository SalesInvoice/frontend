import './Home.css';
import { React } from "react";
import Carousel from 'react-bootstrap/Carousel';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
function Home() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/form');
  };

  return (

    <div>
      <header>
        <Header />
      </header>
      <main>
        <div className="TOP10">
          <Carousel variant="dark">


            <Carousel.Item>
              <div className="imgback">
                <img
                  className="d-block w-100"
                  src="https://www.approvalmax.com/blog/wp-content/uploads/2023/02/am-einvoicing-fullwidth.jpg"
                  alt="Second slide"
                />
              </div>
              <Carousel.Caption>
                {/* Caption content */}
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <div className="imgback">
                <img
                  className="d-block w-100"
                  src="/assets/home1.jpeg"
                  alt="First slide"
                />
              </div>
              <Carousel.Caption>
                {/* Caption content */}
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>

          <div className="pImg">
          </div>
        </div >
        <hr />
        <div class="mb-last-child-0"><h1 class="h3 text-center">What is e-invoicing?</h1>
          <p class="fs-3 text-center">Short for electronic invoicing, revolutionizes traditional billing by digitizing the invoicing process. It involves the creation, delivery, and processing of invoices in a fully digital format, enhancing efficiency, reducing errors, and streamlining financial transactions. Discover the future of invoicing with e-invoicing!</p>
        </div>

        <img
          className="d-block2 w-100"
          src="https://png.monster/wp-content/uploads/2022/07/png.monster-669-370x259.png"
          alt="Third slide"
        />

        <div className='text-img'>

          <div class="mb-last-child-0"><h1 class="h3 text-center">Why e-invoicing?</h1>
            <p class="fs-3 text-center">Step into the future of finance with e-invoices—where efficiency meets simplicity. Say goodbye to paper clutter and hello to a streamlined, eco-friendly invoicing process. Embrace the ease of digital transactions, reducing errors and accelerating your business cycles. It's not just an invoice; it's a leap into a smarter, greener way of financial management.</p>
          </div>
          <img
            className="d-block3"
            src="https://mlbbycdw6xaf.i.optimole.com/AQ_I6FY-vAocjD6o/w:823/h:891/q:auto/https://paddington.co/wp-content/uploads/2021/08/Header-image@2x.png"
            alt="Third slide"
          />
        </div>
        <img
          className="d-block4 w-100"
          src="https://webstockreview.net/images/line-clipart-curved.png"
          alt="Third slide"
        />
        <div className='text-btn'>
          <p class="fs-3 text-center g">Experience the efficiency revolution! Try e-invoicing now and transform your billing process into a seamless, digital experience. Embrace the future of invoicing – it's just a click away. Try it now!</p>

          <button type="button" className="btn btn-primary" onClick={handleButtonClick}>
            Try it now...
          </button>
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div >
  );
}

export default Home;
