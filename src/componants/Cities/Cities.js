import './Cities.css';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { Formik } from 'formik';
import Table from 'react-bootstrap/Table';
import { InputGroup } from 'react-bootstrap';
import Customer from '../Customer/Customer';
import { getStoredCountryInfo } from '../Countries/Countries';

export const getStoredCityInfo = () => {
    const storedCityInfo = JSON.parse(localStorage.getItem('cityInfo')) || [];
    const storedError = localStorage.getItem('error') || null;

    return { cityInfo: Array.isArray(storedCityInfo) ? storedCityInfo : [], error: storedError };
};


function Cities() {

    const { countryInfo, error1 } = getStoredCountryInfo();
    console.log('Selected Country:', countryInfo.countryCode);


    const [cityInfo, setCityInfo] = useState([]);
    const [city, setCity] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const { cityInfo, error } = getStoredCityInfo();
        console.log('City Info:', cityInfo);
        setCityInfo(cityInfo);
        setError(error);
    }, []);

    // const handleCitySubmit = async (values) => {
    //     try {
    //         const response = await fetch(`https://localhost:7020/api/cities/${values.cityCode}`);

    //         if (response.ok) {
    //             // City code exists, update the entry
    //             const updateResponse = await fetch(
    //                 `https://localhost:7020/api/cities/${values.cityCode}`,
    //                 {
    //                     method: 'PUT',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify(values),
    //                 }
    //             );

    //             if (!updateResponse.ok) {
    //                 throw new Error(`Failed to update city information`);
    //             }

    //             const updatedCity = await updateResponse.json();

    //             // Update the state with the modified data
    //             const updatedCityInfo = [...cityInfo];
    //             const existingCityIndex = cityInfo.findIndex((city) => city.cityCode === values.cityCode);
    //             updatedCityInfo[existingCityIndex] = updatedCity;
    //             setCityInfo(updatedCityInfo);
    //             // Save to local storage
    //             localStorage.setItem('cityInfo', JSON.stringify(updatedCityInfo));
    //             // setCityInfo(updatedCityInfo);

    //             setError(null);
    //         } else {
    //             // City code doesn't exist, add a new entry
    //             const addResponse = await fetch('https://localhost:7020/api/cities', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify(values),
    //             });

    //             if (!addResponse.ok) {
    //                 throw new Error(`Failed to add city information`);
    //             }

    //             const newCity = await addResponse.json();

    //             // Update the state with the new data
    //             setCityInfo([newCity]);
    //             localStorage.setItem('cityInfo', JSON.stringify([newCity]));

    //             setError(null);
    //         }
    //     } catch (error) {
    //         console.error('Error updating city information:', error.message);
    //         setError('Failed to update city information');
    //     }
    // };
    const handleCitySubmit = async (values) => {
        try {
            const existingCityIndex = cityInfo.findIndex((city) => city.cityCode === values.cityCode);
    
            if (existingCityIndex !== -1) {
                const response = await fetch(
                    `https://localhost:7020/api/cities/${values.cityCode}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(values),
                    }
                );
    
                if (!response.ok) {
                    throw new Error(`Failed to update city information`);
                }

                
    
                // Update the state with the modified data
                const updatedCityInfo = [...cityInfo];
                updatedCityInfo[existingCityIndex] = { ...values };
                // Save to local storage
                localStorage.setItem('cityInfo', JSON.stringify(updatedCityInfo));
                setCityInfo(updatedCityInfo);
                setError(null);
            } else {
                // If the city code doesn't exist, add a new entry
                const response = await fetch('https://localhost:7020/api/cities', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });
    
                if (!response.ok) {
                    throw new Error(
                        `Failed to add city information`
                    );
                }
    
                const newCity = await response.json();
    
                // Update the state with the new data
                setCityInfo([newCity]); // Set the array with a single element
                localStorage.setItem('cityInfo', JSON.stringify([newCity]));  
                setError(null);
            }
        } catch (error) {
            console.error('Error updating city information:', error.message);
            setError('Failed to update city information');
        }
    };
    // const handleCityChange = (e) => {
    //     setCity({ ...city, [e.target.name]: e.target.value });
    // };

    const schema = yup.object().shape({
        cityCode: yup.string().required(),
        CountryCode: yup.number(),
        cityEnglishName: yup.string(),
        cityArabicName: yup.string(),
    });
    const handleDeleteCountry = (index) => {
        const updatedCityInfo = [...cityInfo];
        updatedCityInfo.splice(index, 1);
        setCityInfo(updatedCityInfo);
        localStorage.setItem('cityInfo', JSON.stringify(updatedCityInfo));
    };

    return (
        <div className='Countriesdiv'>
            <p className='title'>City Form</p>
            <Formik
                validationSchema={schema}
                onSubmit={handleCitySubmit}
                initialValues={{
                    cityCode: '',
                    CountryCode: countryInfo.countryCode,
                    cityEnglishName: '',
                    cityArabicName: '',
                }}
            >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <div className='countrydiv'>
                            <Row className="mb-3">
                                <Form.Group as={Col} md="4" controlId="validationFormik01">
                                    <Form.Label>Country Code</Form.Label>
                                    <InputGroup hasValidation>
                                        <Form.Control
                                            type="text"
                                            name="CountryCode"
                                            value={values.CountryCode}
                                            onChange={handleChange}
                                            isValid={touched.CountryCode && !errors.CountryCode}
                                            placeholder={countryInfo && countryInfo.CountryCode}
                                            disabled

                                        />
                                        <Form.Control.Feedback type="invalid">{errors.CountryCode}</Form.Control.Feedback>
                                    </InputGroup>

                                </Form.Group>
                                <Form.Group as={Col} md="4" controlId="validationFormik01">
                                    <Form.Label>City Code</Form.Label>
                                    <Form.Control type="number"
                                        name="cityCode"
                                        value={values.cityCode}
                                        onChange={handleChange}
                                        isValid={touched.cityCode && !errors.cityCode} />
                                    <Form.Control.Feedback type="invalid">{errors.cityCode}</Form.Control.Feedback>
                                </Form.Group>


                                <Form.Group as={Col} md="4" controlId="validationFormik02">
                                    <Form.Label>City English Name</Form.Label>
                                    <Form.Control type="text"
                                        name="cityEnglishName"
                                        value={values.cityEnglishName}
                                        onChange={handleChange}
                                        isValid={touched.cityEnglishName && !errors.cityEnglishName} />
                                    <Form.Control.Feedback type="invalid">{errors.cityEnglishName}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="4" controlId="validationFormikUsername">
                                    <Form.Label>City Arabic Name</Form.Label>
                                    <Form.Control type="text"
                                        name="cityArabicName"
                                        value={values.cityArabicName}
                                        onChange={handleChange}
                                        isValid={touched.cityArabicName && !errors.cityArabicName} />
                                    <Form.Control.Feedback type="invalid">{errors.cityArabicName}</Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Button type="submit">Submit</Button>
                        </div>
                    </Form>
                )}
            </Formik>

            <div className="mt-3">
                {cityInfo && Array.isArray(cityInfo) && (
                    <div>
                        <h5>City Information</h5>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>City Code</th>
                                    <th>City English Name</th>
                                    <th>City Arabic Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cityInfo.map((city, index) => (
                                    <tr key={index}>
                                        <td>{city.cityCode}</td>
                                        <td>{city.cityEnglishName}</td>
                                        <td>{city.cityArabicName}</td>
                                        <td>
                                            <Button variant="danger" onClick={() => handleDeleteCountry(index)}>Delete</Button>
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

export default Cities;