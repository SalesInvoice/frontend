import './Customer.css';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import Table from 'react-bootstrap/Table';
import { InputGroup } from 'react-bootstrap';
import { getStoredCountryInfo } from '../Countries/Countries';
import { getStoredCityInfo } from '../Cities/Cities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export const getStoredCustomerInfo = () => {
    const storedCustomerInfo = JSON.parse(localStorage.getItem('customerInfo')) || [];
    const storedError = localStorage.getItem('error') || null;

    return { customerInfo: Array.isArray(storedCustomerInfo) ? storedCustomerInfo : [], error: storedError };
};

function Customer() {

    const [customerInfo, setCustomerInfo] = useState([]);
    const [errors, setError] = useState(null);

    useEffect(() => {
        const { customerInfo, error } = getStoredCustomerInfo();
        setCustomerInfo(customerInfo);

        const storedCustomerInfo = JSON.parse(localStorage.getItem('customerInfo'));
        const storedError = localStorage.getItem('error');

        if (storedCustomerInfo) {
            setCustomerInfo(storedCustomerInfo);
        }

        if (storedError) {
            setError(storedError);
        }
    }, []);

    const handleCustomerSubmit = async (values) => {
        try {

            const { countryInfo } = getStoredCountryInfo();
            const { cityInfo } = getStoredCityInfo();

            const country = countryInfo.countryCode;
            const city = cityInfo.cityCode;
            console.log('country', country, 'city', city);

            values.CountryCode = country;
            values.cityCode = city;

            const existingCustomerIndex = customerInfo.findIndex((customer) => customer.CustomerCode === values.CustomerCode);
            // console.log('existingCustomerIndex', existingCustomerIndex)
            if (existingCustomerIndex !== -1) {
                const response = await fetch(
                    `https://localhost:7173/api/customers/${values.customerCode}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(values),
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to update customer information`);
                }

                // Update the state with the modified data
                const updatedCustomerInfo = [...customerInfo];
                updatedCustomerInfo[existingCustomerIndex] = { ...values };

                setCustomerInfo(updatedCustomerInfo);
                setError(null);

                // Update local storage
                localStorage.setItem('customerInfo', JSON.stringify([...customerInfo, updatedCustomerInfo]));
                localStorage.removeItem('error');
                window.location.reload();

            } else {
                // If the customer code doesn't exist, add a new entry
                const response = await fetch('https://localhost:7173/api/customers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                if (!response.ok) {
                    throw new Error(
                        `Failed to add customer information`
                    );
                }

                const newCustomer = await response.json();

                // Update the state with the new data
                setCustomerInfo((prevCustomerInfo) => [...prevCustomerInfo, newCustomer]);
                setError(null);
                // Update local storage
                localStorage.setItem('customerInfo', JSON.stringify([...customerInfo, newCustomer]));
                localStorage.removeItem('error');
                window.location.reload();

            }

        } catch (error) {
            console.error('Error updating customer information:', error.message);
            setError('Failed to update customer information');
        }
    };

    const schema = yup.object().shape({
        CountryCode: yup.number(),
        cityCode: yup.number(),
        customerCode: yup.string().required(),
        englishName: yup.string().required(),
        arabicName: yup.string(),
        mobileNo: yup.string(),
        email: yup.string(),
        addressLine1: yup.string(),
        addressLine2: yup.string(),
        addressLine3: yup.string(),
    });

    const handleDeleteCustomer = (customerCode) => {
        const updatedCustomerInfo = customerInfo.filter((customer) => customer.customerCode !== customerCode);
        setCustomerInfo(updatedCustomerInfo);
        localStorage.setItem('customerInfo', JSON.stringify(updatedCustomerInfo));
    };

    return (
        <div className='Countriesdiv'>
            <p className='title'>Customer </p>
            <Formik
                validationSchema={schema}
                onSubmit={handleCustomerSubmit}
                initialValues={{
                    customerCode: '',
                    englishName: '',
                    arabicName: '',
                    mobileNo: '',
                    email: '',
                    addressLine1: '',
                    addressLine2: '',
                    addressLine3: '',
                }}
            >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <div className='countrydiv'>
                            <Row className="mb-3">

                                <Form.Group as={Col} md="4" controlId="validationFormik02">
                                    <Form.Label>Customer Code *</Form.Label>
                                    <Form.Control type="text"
                                        name="customerCode"
                                        value={values.customerCode}
                                        onChange={handleChange}
                                        isValid={touched.customerCode && !errors.customerCode} />
                                    <Form.Control.Feedback type="invalid">{errors.customerCode}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="4" controlId="validationFormikUsername">
                                    <Form.Label>English Name *</Form.Label>
                                    <Form.Control type="text"
                                        name="englishName"
                                        value={values.englishName}
                                        onChange={handleChange}
                                        isValid={touched.englishName && !errors.englishName} />
                                    <Form.Control.Feedback type="invalid">{errors.englishName}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="4" controlId="validationFormik01">
                                    <Form.Label>Arabic Name</Form.Label>
                                    <Form.Control type="text"
                                        name="arabicName"
                                        value={values.arabicName}
                                        onChange={handleChange}
                                        isValid={touched.arabicName && !errors.arabicName} />
                                    <Form.Control.Feedback type="invalid">{errors.arabicName}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="4" controlId="validationFormik01">
                                    <Form.Label>Mobile No.</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            type="text"
                                            name="mobileNo"
                                            value={values.mobileNo}
                                            onChange={handleChange}
                                            isValid={touched.mobileNo && !errors.mobileNo}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.mobileNo}</Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group as={Col} md="4" controlId="validationFormik02">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="text"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        isValid={touched.email && !errors.email} />
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="4" controlId="validationFormikUsername">
                                    <Form.Label>Address Line 1</Form.Label>
                                    <Form.Control type="text"
                                        name="addressLine1"
                                        value={values.addressLine1}
                                        onChange={handleChange}
                                        isValid={touched.addressLine1 && !errors.addressLine1} />
                                    <Form.Control.Feedback type="invalid">{errors.addressLine1}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="4" controlId="validationFormik01">
                                    <Form.Label>Address Line 2</Form.Label>
                                    <Form.Control type="text"
                                        name="addressLine2"
                                        value={values.addressLine2}
                                        onChange={handleChange}
                                        isValid={touched.addressLine2 && !errors.addressLine2} />
                                    <Form.Control.Feedback type="invalid">{errors.addressLine2}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="4" controlId="validationFormik01">
                                    <Form.Label>Address Line 3</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            type="text"
                                            name="addressLine3"
                                            value={values.addressLine3}
                                            onChange={handleChange}
                                            isValid={touched.addressLine3 && !errors.addressLine3}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.addressLine3}</Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Row>

                            <Button type="submit">Submit</Button>
                        </div>
                    </Form>
                )}
            </Formik>

            <div className="mt-3">
                {customerInfo && Array.isArray(customerInfo) && (
                    <div>
                        <h5>Customer Information</h5>

                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Customer Code</th>
                                    <th>English Name</th>
                                    <th>Arabic Name</th>
                                    <th>Mobile No.</th>
                                    <th>Email</th>
                                    <th>Address Line 1</th>
                                    <th>Address Line 2</th>
                                    <th>Address Line 3</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customerInfo.map((customer, index) => (
                                    <tr key={index}>
                                        <td>{customer.customerCode}</td>
                                        <td>{customer.englishName}</td>
                                        <td>{customer.arabicName}</td>
                                        <td>{customer.mobileNo}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.addressLine1}</td>
                                        <td>{customer.addressLine2}</td>
                                        <td>{customer.addressLine3}</td>
                                        <td>
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                className="delete-icon"
                                                onClick={() => handleDeleteCustomer(customer.customerCode)}
                                            />
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

export default Customer;