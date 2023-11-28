import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, Col, Form, Row } from 'react-bootstrap';
import CitiesSett from './CitiesSett';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './CountriesSett.css';


function CountriesSett() {
    const [countriesSettInfo, setCountriesSettInfo] = useState([]);
    const [errors, setError] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const [countryList, setCountryList] = useState([]);

    useEffect(() => {
        // Fetch the list of countries
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://localhost:7173/api/countries');
                if (response.ok) {
                    const countries = await response.json();
                    setCountryList(countries);
                } else {
                    throw new Error('Failed to fetch countries');
                }
            } catch (error) {
                console.error('Error fetching countries:', error.message);
            }
        };

        fetchCountries();
    }, []);

    const handleCountriesSettSubmit = async (values) => {
        try {
            // If the country code doesn't exist, add a new entry
            const response = await fetch('https://localhost:7173/api/countries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error(`Failed to add country information`);
            }

            console.log('Country added successfully');

            // Clear the form
            setCountriesSettInfo([]);
            setSelectedCountry(null);
            setError(null);
            window.location.reload();
        } catch (error) {
            console.error('Error updating country information:', error.message);
            // setError('Failed to update country information');
        }
    };

    const handleGetCountry = async (countryCode) => {
        try {
            const response = await fetch(`https://localhost:7173/api/countries/${countryCode}`);

            if (!response.ok) {
                throw new Error(`Failed to get country information`);
            }

            const countryData = await response.json();
            setSelectedCountry(countryData);
        } catch (error) {
            console.error('Error getting country information:', error.message);
            setSelectedCountry(null);
        }
    };

    const handleUpdateCountry = async (values) => {
        try {
            const response = await fetch(`https://localhost:7173/api/countries/${selectedCountry.countryCode}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error(`Failed to update country information`);
            }
            window.location.reload();


            const updatedCountry = await response.json();

            // Display a message or handle success as needed
            console.log('Country updated successfully');

            // Clear the form
            setCountriesSettInfo([]);
            setSelectedCountry(null);
            setError(null);
            window.location.reload();
        } catch (error) {
            console.error('Error updating country information:', error.message);
            // setError('Failed to update country information');
        }
    };

    const handleDeleteCountry = async () => {
        try {
            const response = await fetch(`https://localhost:7173/api/countries/${selectedCountry.countryCode}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete country information`);
            }

            // Display a message or handle success as needed
            console.log('Country deleted successfully');

            // Clear the form
            setCountriesSettInfo([]);
            setSelectedCountry(null);
            setError(null);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting country information:', error.message);
            setError('Failed to delete country information');
        }
    };

    const schema = yup.object().shape({
        countryCode: yup.number().required(),
        countryEnglishName: yup.string().required(),
        countryArabicName: yup.string(),
    });

    return (
        <div className='Countriesdiv'>
            <header>
                <Header />
            </header>
            <main>


                <div className='control'>
                    <div className='f'>
                        <p className='title'>Add Country</p>
                        <Formik
                            validationSchema={schema}
                            onSubmit={handleCountriesSettSubmit}
                            initialValues={{
                                countryCode: '',
                                countryEnglishName: '',
                                countryArabicName: '',
                            }}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <div className='countrydiv'>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} md="4" controlId="validationFormik02">
                                                <Form.Label>Country Code *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="countryCode"
                                                    value={values.countryCode}
                                                    onChange={handleChange}
                                                    isValid={touched.countryCode && !errors.countryCode}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.countryCode}</Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group as={Col} md="4" controlId="validationFormikUsername">
                                                <Form.Label>Country English Name *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="countryEnglishName"
                                                    value={values.countryEnglishName}
                                                    onChange={handleChange}
                                                    isValid={touched.countryEnglishName && !errors.countryEnglishName}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.countryEnglishName}</Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group as={Col} md="4" controlId="validationFormik01">
                                                <Form.Label>Country Arabic Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="countryArabicName"
                                                    value={values.countryArabicName}
                                                    onChange={handleChange}
                                                    isValid={touched.countryArabicName && !errors.countryArabicName}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.countryArabicName}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>

                                        <Button type="submit">Add</Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                        {/* <p class="fs-3 text-center">City and Country Management: This page allows you to seamlessly add, update, and delete cities and countries, providing a comprehensive tool for efficient location management.</p> */}

                        <br />
                        <p className='title'>Update/Delete Country</p>
                        <Formik
                            validationSchema={yup.object().shape({
                                selectedCountryCode: yup.number().required(),
                            })}
                            onSubmit={(values) => handleGetCountry(values.selectedCountryCode)}
                            initialValues={{
                                selectedCountryCode: '',
                            }}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                <Form noValidate onSubmit={handleSubmit} className="mt-3">
                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="4" controlId="validationFormik03">
                                            <Form.Label>Select Country</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="selectedCountryCode"
                                                value={values.selectedCountryCode}
                                                onChange={handleChange}
                                                isValid={touched.selectedCountryCode && !errors.selectedCountryCode}
                                            >
                                                <option value="">Select a country</option>
                                                {countryList.map((country) => (
                                                    <option key={country.countryCode} value={country.countryCode}>
                                                        {country.countryEnglishName}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                            <Form.Control.Feedback type="invalid">{errors.selectedCountryCode}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <Button type="submit" className='c'>Country Info</Button>
                                </Form>
                            )}
                        </Formik>


                        {selectedCountry && (
                            <Formik
                                validationSchema={schema}
                                onSubmit={handleUpdateCountry}
                                initialValues={{
                                    countryCode: selectedCountry.countryCode,
                                    countryEnglishName: selectedCountry.countryEnglishName,
                                    countryArabicName: selectedCountry.countryArabicName,
                                }}
                            >
                                {({ handleSubmit, handleChange, values, touched, errors }) => (
                                    <Form noValidate onSubmit={handleSubmit} className="mt-3">
                                        <div className='countrydiv'>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} md="4" controlId="validationFormik04">
                                                    <Form.Label>Country Code *</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="countryCode"
                                                        value={values.countryCode}
                                                        onChange={handleChange}
                                                        isValid={touched.countryCode && !errors.countryCode}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{errors.countryCode}</Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group as={Col} md="4" controlId="validationFormik05">
                                                    <Form.Label>Country English Name *</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="countryEnglishName"
                                                        value={values.countryEnglishName}
                                                        onChange={handleChange}
                                                        isValid={touched.countryEnglishName && !errors.countryEnglishName}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{errors.countryEnglishName}</Form.Control.Feedback>
                                                </Form.Group>

                                                <Form.Group as={Col} md="4" controlId="validationFormik06">
                                                    <Form.Label>Country Arabic Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="countryArabicName"
                                                        value={values.countryArabicName}
                                                        onChange={handleChange}
                                                        isValid={touched.countryArabicName && !errors.countryArabicName}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{errors.countryArabicName}</Form.Control.Feedback>
                                                </Form.Group>
                                            </Row>
                                            <Button type="submit" className='upd'>Update</Button>

                                            <Button type="submit" onClick={handleDeleteCountry} className="updr">
                                                Delete
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        )}

                        {errors && <p className="text-danger mt-3">{errors}</p>}
                        <hr />
                        <CitiesSett />

                    </div>
                </div>
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default CountriesSett;
