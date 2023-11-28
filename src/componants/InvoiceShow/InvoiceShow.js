import React, { useEffect, useState } from "react";
import './InvoiceShow.css';
import {
    MDBCard,
    MDBCardBody,
    MDBContainer,
    MDBCol,
    MDBRow,
} from "mdb-react-ui-kit";
import Header from "../Header/Header.js";

export default function InvoiceShow() {


    const [invoiceDetails, setInvoiceDetails] = useState([]);
    const [invoiceItemData, setItemData] = useState([]);


    const handlePrint = () => {
        window.print();
    };

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch the last invoice number from the server
                const response = await fetch('https://localhost:7173/api/salesInvoices/lastInvoiceNumber');
                if (!response.ok) {
                    throw new Error('Failed to fetch last invoice number');
                }
                const lastInvoiceNumber = await response.json();

                const responseInvoice = await fetch(`https://localhost:7173/api/salesInvoices/${lastInvoiceNumber}`);

                if (!responseInvoice.ok) {
                    throw new Error('Failed to store sales invoice data in the database');
                }
                const responseDataInvoice = await responseInvoice.json();


                console.log('Sales invoice data header stored successfully:', responseDataInvoice);
                console.log('customerCode:', responseDataInvoice.customerCode);
                setInvoiceDetails(responseDataInvoice);

                const responseDetails = await fetch(`https://localhost:7173/api/salesInvoiceDetails/${lastInvoiceNumber}`);
                if (!responseDetails.ok) {
                    throw new Error('Failed to store sales invoice details data in the database');
                }

                const responseDataDetails = await responseDetails.json();
                console.log('Sales invoice data stored successfully:', responseDataDetails);
                setItemData(responseDataDetails);
                console.log("invoiceNo", responseDataDetails[0].invoiceNo);

            } catch (error) {
                console.error('Error sending and storing data:', error.message);
            }
        }

        fetchData();
    }, []);


    return (


        <div>
            <header>
                <Header />
            </header>
            <MDBContainer className="py-5">
                <MDBCard>
                    <MDBCardBody className="mx-4">
                        <MDBContainer>
                            <div className="modal-content">
                                <div id="invoiceCapture">
                                    <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
                                        <div className="w-100">
                                            <h4 className="fw-bold my-2">Sales Invoice</h4>
                                            <h6 className="fw-bold text-secondary mb-1">Invoice #: {invoiceDetails.invoiceNo}</h6>
                                        </div>
                                        <div className="text-end ms-4">
                                            <h6 className="fw-bold mt-1 mb-2">Amount Due:</h6>
                                            <h5 className="fw-bold text-secondary">{invoiceDetails.totalSalesInvoiceAmountWithVatamount} $</h5>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="mb-4 row">
                                            <div className="col-md-4">
                                                <div className="fw-bold">Billed to:</div>
                                                <div>{invoiceDetails.customerCode}</div>
                                                <div>{invoiceDetails.englishName}</div>
                                                <div className='fw-bold'>Remarks:</div>
                                                <div>{invoiceDetails.remarks}</div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="fw-bold">Total Amount:</div>
                                                <div>{invoiceDetails.totalSalesInvoiceAmount} $</div>
                                                <div className="fw-bold">Tax:</div>
                                                <div>{invoiceDetails.totalVatamount} $ </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="fw-bold mt-2">Date Of Issue:</div>
                                                <div>{invoiceDetails.invoiceDate}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <MDBRow>
                                <table className="mb-0 table">
                                    <thead>
                                        <tr>
                                            <th>Item Code</th>
                                            <th>Items Name</th>
                                            <th className="text-end">QTY</th>
                                            <th className="text-end">VAT%</th>
                                            <th className="text-end">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoiceItemData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.itemCode}</td>
                                                <td>{item.itemEnglishName}</td>
                                                <td className="text-end">{item.qty}</td>
                                                <td className="text-end">{item.vat}</td>
                                                <td className="text-end">{item.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <hr style={{ border: "2px solid black" }} />
                                <MDBCol xl="10">
                                    <p className='font'>Total Amount:</p>
                                </MDBCol>
                                <MDBCol xl="2">
                                    <p className="float-end font">{invoiceDetails.totalSalesInvoiceAmount}
                                    </p>
                                </MDBCol>
                                <hr />
                            </MDBRow>

                            <MDBRow>
                                <MDBCol xl="10">
                                    <p className='font'>VAT:</p>
                                </MDBCol>
                                <MDBCol xl="2">
                                    <p className="float-end font"> {invoiceDetails.totalVatamount} $
                                    </p>
                                </MDBCol>
                                <hr />
                            </MDBRow>

                            <MDBRow className="text-black">
                                <MDBCol xl="12">
                                    <p className="float-end fw-bold font">Total: {invoiceDetails.totalSalesInvoiceAmountWithVatamount} $
                                    </p>

                                </MDBCol>
                                <hr style={{ border: "2px solid black" }} />
                            </MDBRow>

                            <button type="button" className="btn btn-secondary me-2" onClick={handlePrint}>
                                Print
                            </button>

                        </MDBContainer>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
        </div>

    );
}