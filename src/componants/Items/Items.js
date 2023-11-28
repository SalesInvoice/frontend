import './Items.css';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import * as yup from 'yup';
import { Formik } from 'formik';

export const getStoredItemInfo = () => {
    const storedItemInfo = JSON.parse(localStorage.getItem('itemInfo')) || [];
    const storedError = localStorage.getItem('error') || null;

    return { itemInfo: Array.isArray(storedItemInfo) ? storedItemInfo : [], error: storedError };
};

function Items() {
    const [selectedItems, setSelectedItems] = useState([]);
    const [itemInfo, setItemInfo] = useState([]);
    const [errors, setError] = useState(null);

    useEffect(() => {
        const storedItemInfo = JSON.parse(localStorage.getItem('itemInfo'));
        const storedError = localStorage.getItem('error');

        if (storedItemInfo) {
            setItemInfo(storedItemInfo);
        }

        if (storedError) {
            setError(storedError);
        }
    }, []);

    const handleItemSubmit = async (values) => {
        try {
            const existingItemIndex = itemInfo.findIndex((item) => item.itemCode === values.itemCode);

            if (existingItemIndex !== -1) {
                console.log("Item with the same code already exists. Not adding again.");
                return;
            }

            // If the item is new, set the quantity to the specified value or 1 if not provided
            const newItem = { ...values, qty: values.qty || 1 };

            const response = await fetch('https://localhost:7173/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });

            if (!response.ok) {
                throw new Error(`Failed to add item information`);
            }

            const addedItem = await response.json();

            // Update the state with the new data
            setItemInfo((prevItemInfo) => [{ ...addedItem, qty: newItem.qty }, ...prevItemInfo]);

            // Save to local storage with qty set to the specified value or 1 if not provided
            localStorage.setItem('itemInfo', JSON.stringify([{ ...addedItem, qty: newItem.qty }, ...itemInfo]));

            setError(null);

            // Update the quantity in the selectedItems array
            setSelectedItems((prevSelectedItems) => [...prevSelectedItems, newItem]);
            window.location.reload();

        } catch (error) {
            console.error('Error updating item information:', error.message);
            setError('Failed to update item information');
        }
    };


    const schema = yup.object().shape({
        itemCode: yup.string().required('Item Code is required'),
        itemEnglishName: yup.string(),
        itemArabicName: yup.string(),
        price: yup.number().required('Price is required').positive('Price must be a positive number'),
        vat: yup.number().min(0, 'VAT must be a positive number').nullable(),
    });

    const handleDeleteItem = async (index) => {
        const updatedItemInfo = [...itemInfo];
        updatedItemInfo.splice(index, 1);
        setItemInfo(updatedItemInfo);
        localStorage.setItem('itemInfo', JSON.stringify(updatedItemInfo));
    };

    return (
        <div className='Countriesdiv'>
            <p className='title'>Item Form</p>
            <Formik
                validationSchema={schema}
                onSubmit={console.log}
                initialValues={{
                    itemCode: '',
                    itemEnglishName: '',
                    itemArabicName: '',
                    price: '',
                    vat: 0,
                    qty: 1,
                }}
            >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <div className='countrydiv'>
                            <Row className="mb-3">
                                {/* itemCode */}
                                <Form.Group as={Col} md="4" controlId="validationFormik02">
                                    <Form.Label>Item Code *</Form.Label>
                                    <Form.Control type="number" name="itemCode" value={values.itemCode} onChange={handleChange} isValid={touched.itemCode && !errors.itemCode} />
                                    <Form.Control.Feedback type="invalid">{errors.itemCode}</Form.Control.Feedback>
                                </Form.Group>

                                {/* itemEnglishName */}
                                <Form.Group as={Col} md="4" controlId="validationFormikUsername">
                                    <Form.Label>Item English Name *</Form.Label>
                                    <Form.Control type="text" name="itemEnglishName" value={values.itemEnglishName} onChange={handleChange} isValid={touched.itemenglishName && !errors.itemenglishName} />
                                    <Form.Control.Feedback type="invalid">{errors.itemEnglishName}</Form.Control.Feedback>
                                </Form.Group>

                                {/* itemArabicName */}
                                <Form.Group as={Col} md="4" controlId="validationFormik01">
                                    <Form.Label>Item Arabic Name</Form.Label>
                                    <Form.Control type="text" name="itemArabicName" value={values.itemArabicName} onChange={handleChange} isValid={touched.itemarabicName && !errors.itemarabicName} />
                                    <Form.Control.Feedback type="invalid">{errors.itemArabicName}</Form.Control.Feedback>
                                </Form.Group>

                                {/* price */}
                                <Form.Group as={Col} md="4" controlId="validationFormik01">
                                    <Form.Label>Price *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={values.price}
                                        onChange={handleChange}
                                        isValid={touched.price && !errors.price}
                                        step="0.01"
                                        precision="2"
                                        min="1"
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                                </Form.Group>

                                {/* VAT */}
                                <Form.Group as={Col} md="4" controlId="validationFormik02">
                                    <Form.Label>VAT%</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="vat"
                                        value={values.vat}
                                        onChange={handleChange}
                                        isValid={touched.vat && !errors.vat}
                                        step="0.01"
                                        precision="2"
                                        min="0.0"
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.vat}</Form.Control.Feedback>
                                </Form.Group>

                                {/* QTY */}
                                <Form.Group as={Col} md="4" controlId="validationFormik02">
                                    <Form.Label>QTY</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="qty"
                                        value={values.qty}
                                        onChange={(e) => handleChange(e)} />
                                </Form.Group>
                            </Row>
                            <Button type="button" onClick={() => handleItemSubmit(values)}>Add Item</Button>

                        </div>
                    </Form>
                )}
            </Formik>

            <div className="mt-3">
                {itemInfo && Array.isArray(itemInfo) && (
                    <div>
                        <h5>Items Information</h5>

                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Item Code</th>
                                    <th>Item English Name</th>
                                    <th>Item Arabic Name</th>
                                    <th>Price</th>
                                    <th>VAT%</th>
                                    <th>QTY</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemInfo.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.itemCode}</td>
                                        <td>{item.itemEnglishName}</td>
                                        <td>{item.itemArabicName}</td>
                                        <td>{item.price}</td>
                                        <td>{item.vat}</td>
                                        <td>{item.qty}</td>
                                        <td>
                                            <Button variant="danger" onClick={() => handleDeleteItem(index)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
                <hr />
            </div>
        </div>
    );
}

export default Items;
