import { useState, useEffect } from 'react';
import './Cities.css';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Formik } from 'formik';
import * as yup from 'yup';
import { getStoredCountryInfo } from '../Countries/Countries';

export const getStoredCityInfo = () => {
    const storedCityInfo = JSON.parse(localStorage.getItem('cityInfo')) || [];
    const storedError = localStorage.getItem('error') || null;

    return { cityInfo: storedCityInfo, error: storedError };
};

// form values
const validationSchema = yup.object().shape({
    SelectedCity: yup.string().required('City is required'),
});

function Cities() {
    //declare state variables
    const { countryInfo, error2 } = getStoredCountryInfo();
    console.log('countryInfo', countryInfo.countryCode);

    const [cityInfo, setCityInfo] = useState(null);
    const [error, setError] = useState(null);
    const [citiesDropdown, setCitiesDropdown] = useState([]);

    // fetches stored city information, updates the component's state, and initiates the fetching of Cities for a dropdown list
    useEffect(() => {
        const { cityInfo, error } = getStoredCityInfo();
        setCityInfo(cityInfo);
        setError(error);

        if (cityInfo) {
            // Only fetch city names if cityInfo is available
            fetchCitiesForDropdown();
        }
    }, []);

    const fetchCitiesForDropdown = async () => {
        try {

            const response = await fetch(`https://localhost:7173/api/cities/bycountrycode/${countryInfo.countryCode}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch city names`);
            }

            const cityNames = await response.json();
            console.log('cityNames', cityNames);
            setCitiesDropdown(cityNames);
        } catch (error) {
            console.error('Error fetching city names:', error.message);
            setError('Failed to fetch city names');
        }
    };

    const handleFieldChange = async (values, { resetForm }) => {
        try {
            console.log('SelectedCity', values.SelectedCity);
            const response = await fetch(`https://localhost:7173/api/cities/code/${values.SelectedCity}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch city information: ${response.statusText}`);
            }

            const cityInfo = await response.json();

            // Update the state for cityInfo
            setCityInfo(cityInfo);
            setError(null);

            // Save to local storage
            localStorage.setItem('cityInfo', JSON.stringify(cityInfo));


            resetForm();
            // window.location.reload();
        } catch (error) {
            console.error('Error adding city information:', error.message);
            setError('Failed to add city information');
        }
    };
    return (
        <div className='CountriesContainer'>
            <div className='CountriesForm'>
                <div className='form'>
                    <Formik
                        initialValues={{
                            SelectedCity: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => handleFieldChange(values, { resetForm })}
                    >
                        {({ handleSubmit, handleChange, values, errors }) => (
                            <Form onSubmit={handleSubmit}>
                                <div className='countrydiv'>
                                    <Row className='mb-3'>
                                        <Col md='4'>
                                            <Form.Label>City</Form.Label>
                                            <Form.Control
                                                as='select'
                                                name='SelectedCity'
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    // Call the function to handle form submission on field change
                                                    handleFieldChange({ SelectedCity: e.target.value }, { resetForm: () => { } });
                                                }}
                                                value={values.SelectedCity}
                                            >
                                                <option value='' disabled>
                                                    Select a City
                                                </option>
                                                {citiesDropdown.map((city, index) => (
                                                    <option key={index} value={city.cityCode}>
                                                        {city.cityEnglishName}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                            {errors.SelectedCity && (
                                                <div className='error'>{errors.SelectedCity}</div>
                                            )}
                                        </Col>
                                    </Row>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
                <p>
                    {cityInfo && (
                        <div>
                            <p>{cityInfo.cityEnglishName}</p>
                            <hr style={{ border: "2px solid black" }} />
                        </div>
                    )}
                </p>
                <hr />
            </div>
        </div>
    );
}

export default Cities;