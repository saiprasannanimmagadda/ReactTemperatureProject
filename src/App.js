import React, { useState, useEffect } from "react";
import { Container, Row, Card, Button, Alert } from "react-bootstrap";
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const getTemp = async (city) => {
    if (city.trim() === '') {
      setErrorMessage('Please enter a city name');
      return;
    }
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=b57f81f061485a8870245c7f79608660`);
      const data = await response.json();
      console.log(data);
      if (data.cod && data.cod !== 200) {
        setErrorMessage(data.message || 'Weather data not found');
        return;
      } else {
        setErrorMessage('');
      }
      setWeatherData([...weatherData, data]);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setErrorMessage('Error fetching weather data. Please try again.');
    }
  };

  useEffect(() => {
    // Fetching weather data when the component mounts
    getTemp(city);
  }, []);

  const handleChange = (event) => {
    setCity(event.target.value);
  }

  const handleRemove = (index) => {
    const newWeatherData = [...weatherData];
    newWeatherData.splice(index, 1);
    setWeatherData(newWeatherData);
  }

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent form submission
    getTemp(city);
    setCity('');// Fetch weather data when submit button is clicked
  };

  return (
    <Container className="mt-4">
      {errorMessage && (
        <Row>
          <Alert variant="info">{errorMessage}</Alert>
        </Row>
      )}
      <Row>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-3" type="text" placeholder="Enter City" value={city} onChange={handleChange}></input>
          <Button type="submit">Submit</Button>
        </form>
      </Row>
      <Row>
        <p> </p>
      </Row>
      <Row xs={1} md={2} lg={3}>
        {weatherData.map((data, index) => (
          data && (
            <Card key={index} className="mb-3">
              <Card.Body>
                <Card.Title>{data.name}</Card.Title>
                {data.main && (
                  <Card.Text>
                    Temperature: {data.main.temp} Kelvin
                    <br />
                    Weather: {data.weather[0].main}
                    <br />
                    Wind Speed: {data.wind.speed} m/s
                    <br />
                    Humidity: {data.main.humidity}%
                  </Card.Text>
                )}
                <Button variant="danger" onClick={() => handleRemove(index)}>
                  Remove
                </Button>
              </Card.Body>
            </Card>
          )
        ))}
      </Row>
    </Container>
  );
}

export default App;
