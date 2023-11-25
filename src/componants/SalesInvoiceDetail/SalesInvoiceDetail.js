import { /* components or styles from mdb-react-ui-kit */ } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from "react";
import './SalesInvoiceDetail.css'
import {
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBTypography,
} from "mdb-react-ui-kit";
import { getStoredItemInfo } from '../Items/Items';

export default function SalesInvoiceDetail() {
    const { itemInfo, error2 } = getStoredItemInfo();

    const handlePrintPOS = () => {
        window.print();
    };

    const handlePrintA4 = () => {
        window.print();
    };
    return (
        <MDBContainer className="py-5">
            <MDBCard>
                <MDBCardBody className="mx-4" >
                    <MDBContainer>
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
                                <p className='font'>VAT%:</p>
                            </MDBCol>
                            <MDBCol xl="2">
                                <p className="float-end font"> {itemInfo.reduce((total, item) => total + (item.price || 0) * (item.vat || 0) * (item.qty || 1), 0).toFixed(2)} $
                                </p>
                            </MDBCol>
                            <hr style={{ border: "2px solid black" }} />
                        </MDBRow>
                        {/* <MDBRow>
                            <MDBCol xl="10">
                                <p>Total Amount + VAT</p>
                            </MDBCol>
                            <MDBCol xl="2">
                                <p className="float-end">$10.00</p>
                            </MDBCol>
                            <hr style={{ border: "2px solid black" }} />
                        </MDBRow> */}

                        <MDBRow className="text-black">
                            <MDBCol xl="12">
                                <p className="float-end fw-bold font">Total: {itemInfo.reduce((total, item) => total + (item.price || 0) * (item.qty || 1), 0) +
                                                      itemInfo.reduce((total, item) => total + (item.price || 0) *(item.vat || 0)* (item.qty || 1), 0)} $</p>
                            </MDBCol>
                            <hr style={{ border: "2px solid black" }} />
                        </MDBRow>
                        <div className="text-center" style={{ marginTop: "90px" }}>

                        </div>
                        <button type="button" className="btn btn-secondary me-2" onClick={handlePrintPOS}>
                            Print POS Small
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handlePrintA4}>
                            Print A4
                        </button>


                        {/* <div class="pb-4 px-4">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <button type="button" class="d-block w-100 btn btn-primary">
                                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="me-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" >
                                                    <path d="M20.563,3.34c-0.292-0.199-0.667-0.229-0.989-0.079l-17,8C2.219,11.429,1.995,11.788,2,12.18 c0.006,0.392,0.24,0.745,0.6,0.902L8,15.445v6.722l5.836-4.168l4.764,2.084c0.128,0.057,0.265,0.084,0.4,0.084 c0.181,0,0.36-0.049,0.52-0.146c0.278-0.169,0.457-0.463,0.479-0.788l1-15C21.021,3.879,20.856,3.54,20.563,3.34z M18.097,17.68 l-5.269-2.306L16,9.167l-7.649,4.25l-2.932-1.283L18.89,5.794L18.097,17.68z"></path>
                                                </svg>Send Invoice</button></div>
                                        <div class="col-md-6">
                                            <button type="button" class="d-block w-100 mt-3 mt-md-0 btn btn-outline-primary">
                                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="me-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" >
                                                    <path d="M18.948,11.112C18.511,7.67,15.563,5,12.004,5c-2.756,0-5.15,1.611-6.243,4.15C3.613,9.792,2.004,11.82,2.004,14 c0,2.757,2.243,5,5,5h1v-2h-1c-1.654,0-3-1.346-3-3c0-1.404,1.199-2.757,2.673-3.016l0.581-0.102l0.192-0.558 C8.153,8.273,9.898,7,12.004,7c2.757,0,5,2.243,5,5v1h1c1.103,0,2,0.897,2,2c0,1.103-0.897,2-2,2h-2v2h2c2.206,0,4-1.794,4-4 C22.004,13.119,20.699,11.538,18.948,11.112z"></path><path d="M13.004 14L13.004 10 11.004 10 11.004 14 8.004 14 12.004 19 16.004 14z"></path>
                                                </svg>Download Copy</button>
                                        </div></div></div> */}
                    </MDBContainer>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    );
}
