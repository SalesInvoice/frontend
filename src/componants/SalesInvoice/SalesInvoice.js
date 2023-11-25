import { /* components or styles from mdb-react-ui-kit */ } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from "react";
import './SalesInvoice.css'
import {
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBTypography,
} from "mdb-react-ui-kit";
import SalesInvoiceDetail from '../SalesInvoiceDetail/SalesInvoiceDetail';
import { getStoredCustomerInfo } from '../Customer/Customer';
import { getStoredItemInfo } from '../Items/Items';

export default function SalesInvoice() {
    const { customerInfo, error } = getStoredCustomerInfo();
    const { itemInfo, error2 } = getStoredItemInfo();

    console.log('itemInfoitemInfo', itemInfo);

    const [invoiceNumber, setInvoiceNumber] = useState(1);
    const [invoiceDetails, setInvoiceDetails] = useState({
        invoiceDate: new Date(),
        customerCode: '',
        remarks: '',
    });

    useEffect(() => {
        // Update invoiceDate with the current date when the component mounts
        setInvoiceDetails((prevInvoiceDetails) => ({
            ...prevInvoiceDetails,
            invoiceDate: new Date(),
        }));
    }, []);
    const handleCreateInvoice = () => {
        // Increment the Invoice Number
        setInvoiceNumber((prevInvoiceNumber) => prevInvoiceNumber + 1);
    };
    const handlePrintPOS = () => {
        window.print();
    };

    const handlePrintA4 = () => {
        window.print();
    };
    return (
        <div>
            <MDBContainer className="py-5">
                <MDBCard>
                    <MDBCardBody className="mx-4" >
                        <MDBContainer>
                            <div class="modal-content">
                                <div id="invoiceCapture">
                                    <div class="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
                                        <div class="w-100">
                                            <h4 class="fw-bold my-2">Sales Invoice</h4>
                                            <h6 class="fw-bold text-secondary mb-1">Invoice #: 3</h6>
                                        </div>
                                        <div class="text-end ms-4">
                                            <h6 class="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
                                            <h5 class="fw-bold text-secondary">{itemInfo.reduce((total, item) => total + (item.price || 0) * (item.qty || 1), 0) +
                                                      itemInfo.reduce((total, item) => total + (item.price || 0) *(item.vat || 0)* (item.qty || 1), 0)} $</h5>
                                        </div></div><div class="p-4">
                                        <div class="mb-4 row">
                                            <div class="col-md-4">
                                                <div class="fw-bold">Billed to:</div>
                                                <div>{customerInfo && customerInfo.length > 0 ? customerInfo[0].customerCode : 'N/A'}</div>
                                                <div>{customerInfo && customerInfo.length > 0 ? customerInfo[0].englishName : 'N/A'}</div>
                                                <div className='fw-bold'>Remarks:</div>
                                                <textarea placeholder="Thanks for your business!" name="notes" rows="1" class="my-2 form-control"></textarea>

                                            </div>
                                            <div class="col-md-4">
                                                <div class="fw-bold">Total Amount:</div>
                                                <div>
                                                    {(itemInfo.reduce((total, item) => total + (item.price || 0) * (item.qty || 1), 0)).toFixed(2)} $
                                                </div>

                                                <div class="fw-bold">Tax:</div>
                                                <div>
                                                {itemInfo.reduce((total, item) => total + (item.price || 0) *(item.vat || 0)* (item.qty || 1), 0).toFixed(2)} $
                                                </div>

                                                {/* <div class="fw-bold">Total Sales Invoice Amount + VAT Amount:</div>
                                                <div>
                                                    {itemInfo.reduce((total, item) => total + (item.price || 0) * (item.qty || 1), 0) +
                                                        itemInfo.reduce((totalVAT, item) => totalVAT +( (item.vat || 0)), 0)}
                                                </div> */}
                                            </div>
                                            <div class="col-md-4"><div class="fw-bold mt-2">Date Of Issue:</div>
                                                <div>{invoiceDetails.invoiceDate.toDateString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <SalesInvoiceDetail />
                        </MDBContainer>
                    </MDBCardBody>
                </MDBCard>
            </MDBContainer>



        </div>
    );
}
