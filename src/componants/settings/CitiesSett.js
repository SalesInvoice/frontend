import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, Col, Form, Row } from 'react-bootstrap';

function CitiesSett() {
    const [cityInfo, setCityInfo] = useState([]);
    const [error, setError] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

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

    useEffect(() => {
        // Fetch city information from the database
        const fetchCityInfo = async () => {
            try {
                const response = await fetch('https://localhost:7173/api/cities');
                if (response.ok) {
                    const cities = await response.json();
                    setCityInfo(cities);
                } else {
                    throw new Error('Failed to fetch city information');
                }
            } catch (error) {
                console.error('Error fetching city information:', error.message);
                setError('Failed to fetch city information');
            }
        };

        fetchCityInfo();
    }, []);

    const handleCitySubmit = async (values) => {
        try {

            // If the city code doesn't exist, add a new entry
            const response = await fetch('https://localhost:7173/api/cities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error(`Failed to add city information`);
            }

            console.log('City added successfully');

            // Clear the form
            setCityInfo([]);
            setSelectedCity(null);
            setError(null);
            window.location.reload();
        } catch (error) {
            console.error('Error updating city information:', error.message);
            // setError('Failed to update city information');
        }
    };

    const handleGetCity = async (cityCode) => {
        try {
            const response = await fetch(`https://localhost:7173/api/cities/${cityCode}`);

            if (!response.ok) {
                throw new Error(`Failed to get city information`);
            }

            const cityData = await response.json();
            setSelectedCity(cityData);
        } catch (error) {
            console.error('Error getting city information:', error.message);
            setSelectedCity(null);
        }
    };

    const handleUpdateCity = async (values) => {
        try {
            const response = await fetch(`https://localhost:7173/api/cities/${selectedCity.cityCode}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error(`Failed to update city information`);
            }

            const updatedCity = await response.json();

            console.log('City updated successfully');

            // Clear the form
            setCityInfo([]);
            setSelectedCity(null);
            setError(null);
            window.location.reload();
        } catch (error) {
            console.error('Error updating city information:', error.message);
            // setError('Failed to update city information');
        }
    };

    const handleDeleteCity = async () => {
        try {
            const response = await fetch(`https://localhost:7173/api/cities/${selectedCity.cityCode}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete city information`);
            }


            console.log('City deleted successfully');

            // Clear the form
            setCityInfo([]);
            setSelectedCity(null);
            setError(null);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting city information:', error.message);
            setError('Failed to delete city information');
        }
    };

    const schema = yup.object().shape({
        cityCode: yup.string().required(),
        cityEnglishName: yup.string(),
        cityArabicName: yup.string(),
        countryCode: yup.number().required(),
    });

    return (
        <div className='Citiesdiv'>

            <p className='title'>Add City</p>
            <Formik
                validationSchema={schema}
                onSubmit={handleCitySubmit}
                initialValues={{
                    cityCode: '',
                    cityEnglishName: '',
                    cityArabicName: '',
                    countryCode: '',
                }}
            >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <div className='countrydiv'>
                            <Row className="mb-3">
                                <Form.Group as={Col} md="4" controlId="validationFormik02">
                                    <Form.Label>City Code *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="cityCode"
                                        value={values.cityCode}
                                        onChange={handleChange}
                                        isValid={touched.cityCode && !errors.cityCode}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.cityCode}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="4" controlId="validationFormikUsername">
                                    <Form.Label>City English Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="cityEnglishName"
                                        value={values.cityEnglishName}
                                        onChange={handleChange}
                                        isValid={touched.cityEnglishName && !errors.cityEnglishName}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.cityEnglishName}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="4" controlId="validationFormik01">
                                    <Form.Label>City Arabic Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="cityArabicName"
                                        value={values.cityArabicName}
                                        onChange={handleChange}
                                        isValid={touched.cityArabicName && !errors.cityArabicName}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.cityArabicName}</Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Form.Group as={Col} md="4" controlId="validationFormikCountryCode">
                                <Form.Label>Country Code *</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="countryCode"
                                    value={values.countryCode}
                                    onChange={handleChange}
                                    isValid={touched.countryCode && !errors.countryCode}
                                >
                                    <option value="" disabled>Select Country Code</option>
                                    {countryList.map((country) => (
                                        <option key={country.countryCode} value={country.countryCode}>
                                            {country.countryCode}
                                        </option>
                                    ))}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">{errors.countryCode}</Form.Control.Feedback>
                            </Form.Group>
                            <br />
                            <Button type="submit">Add</Button>
                        </div>
                    </Form>
                )}
            </Formik>
            <br />
            <p className='title'>Update/Delete Cities</p>

            <Formik
                validationSchema={yup.object().shape({
                    selectedCityCode: yup.string().required(),
                })}
                onSubmit={(values) => handleGetCity(values.selectedCityCode)}
                initialValues={{
                    selectedCityCode: '',
                }}
            >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                    <Form noValidate onSubmit={handleSubmit} className="mt-3">
                        <Row className="mb-3">
                            <Form.Group as={Col} md="4" controlId="validationFormik03">
                                <Form.Label>Select City</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="selectedCityCode"
                                    value={values.selectedCityCode}
                                    onChange={handleChange}
                                    isValid={touched.selectedCityCode && !errors.selectedCityCode}
                                >
                                    <option value="">Select a city</option>
                                    {cityInfo.map((city) => (
                                        <option key={city.cityCode} value={city.cityCode}>
                                            {city.cityEnglishName}
                                        </option>
                                    ))}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">{errors.selectedCityCode}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Button type="submit">Get City</Button>
                    </Form>
                )}
            </Formik>

            {selectedCity && (
                <Formik
                    validationSchema={schema}
                    onSubmit={handleUpdateCity}
                    initialValues={{
                        cityCode: selectedCity.cityCode,
                        cityEnglishName: selectedCity.cityEnglishName,
                        cityArabicName: selectedCity.cityArabicName,
                        countryCode: selectedCity.countryCode,
                    }}
                >
                    {({ handleSubmit, handleChange, values, touched, errors }) => (
                        <Form noValidate onSubmit={handleSubmit} className="mt-3">
                            <div className='countrydiv'>
                                <Row className="mb-3">
                                    <Form.Group as={Col} md="4" controlId="validationFormik04">
                                        <Form.Label>City Code *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="cityCode"
                                            value={values.cityCode}
                                            onChange={handleChange}
                                            isValid={touched.cityCode && !errors.cityCode}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.cityCode}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} md="4" controlId="validationFormik05">
                                        <Form.Label>City English Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="cityEnglishName"
                                            value={values.cityEnglishName}
                                            onChange={handleChange}
                                            isValid={touched.cityEnglishName && !errors.cityEnglishName}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.cityEnglishName}</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} md="4" controlId="validationFormik06">
                                        <Form.Label>City Arabic Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="cityArabicName"
                                            value={values.cityArabicName}
                                            onChange={handleChange}
                                            isValid={touched.cityArabicName && !errors.cityArabicName}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.cityArabicName}</Form.Control.Feedback>
                                    </Form.Group>
                                </Row>

                                <Form.Group as={Col} md="4" controlId="validationFormikCountryCode">
                                    <Form.Label>Country Code *</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="countryCode"
                                        value={values.countryCode}
                                        onChange={handleChange}
                                        isValid={touched.countryCode && !errors.countryCode}
                                    >
                                        <option value="" disabled>Select Country Code</option>
                                        {countryList.map((country) => (
                                            <option key={country.countryCode} value={country.countryCode}>
                                                {country.countryCode}
                                            </option>
                                        ))}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">{errors.countryCode}</Form.Control.Feedback>
                                </Form.Group>

                                <Button type="submit" className='upd' >Update</Button>
                                <Button type="submit" onClick={handleDeleteCity} className="updr">
                                    Delete
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            )}

            {error && <p className="text-danger mt-3">{error}</p>}
            <hr />
        </div>
    );
}

export default CitiesSett;
