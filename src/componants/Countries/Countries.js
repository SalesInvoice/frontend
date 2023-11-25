import { useState, useEffect } from 'react';
import './Countries.css';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { Formik } from 'formik';
import * as yup from 'yup';

export const getStoredCountryInfo = () => {
  const storedCountryInfo = JSON.parse(localStorage.getItem('countryInfo')) || [];
  const storedError = localStorage.getItem('error') || null;

  return { countryInfo: storedCountryInfo, error: storedError };
};

// form values
const validationSchema = yup.object().shape({
  SelectedCountry: yup.string().required('Country is required'),
});

function Countries() {
  //declare state variables
  const [countryInfo, setCountryInfo] = useState(null);
  const [error, setError] = useState(null);
  const [countriesDropdown, setCountriesDropdown] = useState([]);

  // fetches stored country information, updates the component's state, and initiates the fetching of countries for a dropdown list
  useEffect(() => {
    const { countryInfo, error } = getStoredCountryInfo();
    setCountryInfo(countryInfo);
    setError(error);

    fetchCountriesForDropdown();
  }, []);

  const fetchCountriesForDropdown = async () => {
    try {
      const response = await fetch('https://localhost:7020/api/countries/names');
      if (!response.ok) {
        throw new Error(`Failed to fetch country names`);
      }

      const countryNames = await response.json();
      setCountriesDropdown(countryNames);
    } catch (error) {
      console.error('Error fetching country names:', error.message);
      setError('Failed to fetch country names');
    }
  };

  const handleFieldChange = async (values, { resetForm }) => {
    try {
      const response = await fetch(`https://localhost:7020/api/countries/name/${values.SelectedCountry}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch country information: ${response.statusText}`);
      }

      const countryInfo = await response.json();

      // Update the state for CountryInfo with the new data
      setCountryInfo(countryInfo);
      setError(null);

      // Save to local storage
      localStorage.setItem('countryInfo', JSON.stringify(countryInfo));

      // Reset the form after successful submission
      resetForm();
    } catch (error) {
      console.error('Error adding country information:', error.message);
      setError('Failed to add country information');
    }
  };

  const handleDeleteRow = () => {
    // Clear local storage
    localStorage.removeItem('countryInfo');

    // Clear state
    setCountryInfo(null);

    // Reload the page
    window.location.reload();
  };

  return (
    <div className='CountriesContainer'>
      <div className='CountriesForm'>
        <div className='form'>
          <p className='title'>Countries Form</p>
          <Formik
            initialValues={{
              SelectedCountry: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => handleFieldChange(values, { resetForm })}
          >
            {({ handleSubmit, handleChange, values, errors }) => (
              <Form onSubmit={handleSubmit}>
                <div className='countrydiv'>
                  <Row className='mb-3'>
                    <Col md='4'>
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        as='select'
                        name='SelectedCountry'
                        onChange={(e) => {
                          handleChange(e);
                          // Call the function to handle form submission on field change
                          handleFieldChange({ SelectedCountry: e.target.value }, { resetForm: () => {} });
                        }}
                        value={values.SelectedCountry}
                      >
                        <option value='' disabled>
                          Select a country
                        </option>
                        {countriesDropdown.map((country, index) => (
                          <option key={index} value={country}>
                            {country}
                          </option>
                        ))}
                      </Form.Control>
                      {errors.SelectedCountry && (
                        <div className='error'>{errors.SelectedCountry}</div>
                      )}
                    </Col>
                  </Row>
                  {/* <Button type='submit'>Submit</Button> */}
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className='CountriesTable'>
          <h5>Country Information</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Country Code</th>
                <th>Country English Name</th>
                <th>Country Arabic Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {countryInfo && (
                <tr>
                  <td>{countryInfo?.countryCode || ''}</td>
                  <td>{countryInfo?.countryEnglishName || ''}</td>
                  <td>{countryInfo?.countryArabicName || ''}</td>
                  <td>
                    <Button variant='danger' onClick={handleDeleteRow}>
                      Delete
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <hr />
      </div>
    </div>
  );
}

export default Countries;