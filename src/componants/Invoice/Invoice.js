import React, { useEffect, useState } from "react";
import './Invoice.css';
import {
    MDBCard,
    MDBCardBody,
    MDBContainer,
    MDBCol,
    MDBRow,
} from "mdb-react-ui-kit";
import { getStoredCustomerInfo } from '../Customer/Customer';
import { getStoredItemInfo } from '../Items/Items';
import { useNavigate } from 'react-router-dom';

export default function Invoice() {
    const navigate = useNavigate();
    const { customerInfo, error } = getStoredCustomerInfo();
    const { itemInfo, error2 } = getStoredItemInfo();
    console.log('itemInfo', itemInfo)

    const [invoiceDetails, setInvoiceDetails] = useState({
        invoiceNo: 2,
        invoiceDate: new Date(),
        customerCode: '',
        englishName: '',
        remarks: '',
        totalSalesInvoiceAmount: 0,
        totalVATAmount: 0,
        totalSalesInvoiceAmountWithVatamount: 0,
    });
    const [lastInvoiceNumber, setlastInvoiceNumber] = useState(0);
    console.log('lastInvoiceNumber();', lastInvoiceNumber);

    useEffect(() => {
        setInvoiceDetails((prevInvoiceDetails) => ({
            ...prevInvoiceDetails,
            invoiceDate: new Date(),
            customerCode: customerInfo && customerInfo.length > 0 ? customerInfo[0].customerCode : 'N/A',
            englishName: customerInfo && customerInfo.length > 0 ? customerInfo[0].englishName : 'N/A',
        }));
    }, []);

    useEffect(() => {
        const totalSalesInvoiceAmount = itemInfo.reduce((total, item) => total + (item.price || 0) * (item.qty || 1), 0);
        const totalVATAmount = itemInfo.reduce((total, item) => total + (item.price || 0) * (item.vat || 0) * (item.qty || 1), 0);

        setInvoiceDetails((prevInvoiceDetails) => ({
            ...prevInvoiceDetails,
            totalSalesInvoiceAmount: totalSalesInvoiceAmount.toFixed(2),
            totalVATAmount: totalVATAmount.toFixed(2),
            totalSalesInvoiceAmountWithVatamount: (totalSalesInvoiceAmount + totalVATAmount).toFixed(2),
        }));
    }, []);
    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch the last invoice number from the server
                const response = await fetch('https://localhost:7173/api/salesInvoices/lastInvoiceNumber');
                if (!response.ok) {
                    throw new Error('Failed to fetch last invoice number');
                }
                const lastInvoiceNumber = await response.json();
                setlastInvoiceNumber(lastInvoiceNumber);
            } catch (error) {
                console.error('Error sending and storing data:', error.message);

            }
        }
        fetchData();
    }, []);


    const handleSendAndStoreInvoice = async () => {
        try {
            // Fetch the last invoice number from the server
            const response = await fetch('https://localhost:7173/api/salesInvoices/lastInvoiceNumber');
            if (!response.ok) {
                throw new Error('Failed to fetch last invoice number');
            }
            const lastInvoiceNumber = await response.json();
            console.log('lastInvoiceNumber', lastInvoiceNumber);

            // sales invoice data
            const salesInvoiceData = {
                invoiceDate: invoiceDetails.invoiceDate,
                customerCode: invoiceDetails.customerCode,
                englishName: invoiceDetails.englishName,
                remarks: invoiceDetails.remarks,
                totalSalesInvoiceAmount: invoiceDetails.totalSalesInvoiceAmount,
                totalVATAmount: invoiceDetails.totalVATAmount,
                totalSalesInvoiceAmountWithVatamount: invoiceDetails.totalSalesInvoiceAmountWithVatamount,
            };

            // sales invoice details data
            const salesInvoiceDetailsData = itemInfo.map(item => ({
                invoiceNo: lastInvoiceNumber + 1,
                itemCode: item.itemCode,
                itemEnglishName: item.itemEnglishName,
                price: item.price,
                qty: item.qty,
                totalAmount: (item.price || 0) * (item.qty || 1),
                vat: item.vat,
                totalAmountWithVat: (item.price || 0) * (item.vat || 0) * (item.qty || 1),
            }));

            // Calculate total values
            const totalAmountDetails = salesInvoiceDetailsData.reduce((total, item) => total + item.totalAmount, 0);
            const totalVATAmountDetails = salesInvoiceDetailsData.reduce((total, item) => total + item.totalAmountWithVat, 0);

            // Add total values
            salesInvoiceDetailsData[salesInvoiceDetailsData.length - 1].totalAmount = totalAmountDetails;
            salesInvoiceDetailsData[salesInvoiceDetailsData.length - 1].totalVATAmount = totalVATAmountDetails;
            salesInvoiceDetailsData[salesInvoiceDetailsData.length - 1].totalAmountWithVat = totalAmountDetails + totalVATAmountDetails;

            console.log('salesInvoiceDetailsData', salesInvoiceDetailsData);

            salesInvoiceDetailsData.forEach(item => {
                console.log('itemEnglishName', item.itemEnglishName);
            });
            // console.log('salesInvoiceDetailsData', salesInvoiceDetailsData[0]);

            // Send sales invoice data to store in the database
            const responseInvoice = await fetch('https://localhost:7173/api/salesInvoices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(salesInvoiceData),
            });

            if (!responseInvoice.ok) {
                throw new Error('Failed to store sales invoice data in the database');
            }

            const responseDataInvoice = await responseInvoice.json();
            console.log('Sales invoice data stored successfully:', responseDataInvoice);

            // Send sales invoice details data to store in the database
            const responseDetails = await fetch('https://localhost:7173/api/salesInvoiceDetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(salesInvoiceDetailsData),
            });

            if (!responseDetails.ok) {
                throw new Error('Failed to store sales invoice details data in the database');
            }

            const responseDataDetails = await responseDetails.json();
            console.log('Sales invoice details data stored successfully:', responseDataDetails);

            // window.location.reload();
            navigate('/invoiceShow');
        } catch (error) {
            console.error('Error sending and storing data:', error.message);
        }
    };

    <div className="text-center" style={{ marginTop: "20px" }}>
        <button type="button" className="btn btn-primary" onClick={handleSendAndStoreInvoice}>
            Send Invoice and Store Data
        </button>
    </div>

    return (
        <div>
            <MDBContainer className="py-5">
                <MDBCard>
                    <MDBCardBody className="mx-4">
                        <MDBContainer>
                            <div className="modal-content">
                                <div id="invoiceCapture">
                                    <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
                                        <div className="w-100">
                                            <h4 className="fw-bold my-2">Sales Invoice</h4>
                                            <h6 className="fw-bold text-secondary mb-1">Invoice #: {lastInvoiceNumber}</h6>
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
                                                <textarea
                                                    placeholder="Thanks for your business!"
                                                    name="remarks"
                                                    rows="1"
                                                    className="my-2 form-control"
                                                    onChange={(e) => setInvoiceDetails((prevInvoiceDetails) => ({ ...prevInvoiceDetails, remarks: e.target.value }))}
                                                ></textarea>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="fw-bold">Total Amount:</div>
                                                <div>{invoiceDetails.totalSalesInvoiceAmount} $</div>
                                                <div className="fw-bold">Total VAT Amount:</div>
                                                <div>{invoiceDetails.totalVATAmount} $</div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="fw-bold mt-2">Date Of Issue:</div>
                                                <div>{invoiceDetails.invoiceDate.toDateString()}</div>
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
                                        {itemInfo.map((item, index) => (
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
                                    <p className="float-end font">{(itemInfo.reduce((total, item) => total + (item.price || 0) * (item.qty || 1), 0)).toFixed(2)} $
                                    </p>
                                </MDBCol>
                                <hr />
                            </MDBRow>

                            <MDBRow>
                                <MDBCol xl="10">
                                    <p className='font'>VAT:</p>
                                </MDBCol>
                                <MDBCol xl="2">
                                    <p className="float-end font"> {itemInfo.reduce((total, item) => total + (item.price || 0) * (item.vat || 0) * (item.qty || 1), 0).toFixed(2)} $
                                    </p>
                                </MDBCol>
                                <hr />
                            </MDBRow>

                            <MDBRow className="text-black">
                                <MDBCol xl="12">
                                    <p className="float-end fw-bold font">Total: {itemInfo.reduce((total, item) => total + (item.price || 0) * (item.qty || 1), 0) +
                                        itemInfo.reduce((total, item) => total + (item.price || 0) * (item.vat || 0) * (item.qty || 1), 0)} $
                                    </p>
                                </MDBCol>
                                <hr style={{ border: "2px solid black" }} />
                            </MDBRow>
                            <div className="text-center" style={{ marginTop: "20px" }}>
                                <button type="button" className="btn btn-primary a" onClick={handleSendAndStoreInvoice}>
                                    Review Invoice
                                </button>
                            </div>
                        </MDBContainer>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>
        </div>
    );
}