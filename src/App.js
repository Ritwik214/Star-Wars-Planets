// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PlanetCard from './components/PlanetCard';
import Pagination from './components/Pagination'; // Import the Pagination component
import HomeIcon from '@mui/icons-material/Home';
import './App.css';

function App() {
  const [planets, setPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [visibleCardIndex, setVisibleCardIndex] = useState(0);
  const [showCards, setShowCards] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Track current page number
  const [planetsPerPage] = useState(3); // Adjust the number of planets per page

  const planetCardsRef = useRef([]);

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        const response = await axios.get(`https://swapi.dev/api/planets/?page=${currentPage}`);
        setPlanets(response.data.results);
      } catch (error) {
        console.error('Error fetching planets:', error.message);
      }
    };

    fetchPlanets();
  }, [currentPage]);

  const handlePlanetClick = (planet, index) => {
    setSelectedPlanet(planet);
    setVisibleCardIndex(index);
    setShowCards(false);
  };

  const handleScroll = () => {
    const scrollLeft = document.querySelector('.planet-small-cards').scrollLeft;
    const cardWidth = planetCardsRef.current[0]?.offsetWidth || 0;
    const newIndex = Math.round(scrollLeft / cardWidth);
    setVisibleCardIndex(newIndex);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate the index of the last planet on the current page
  const indexOfLastPlanet = currentPage * planetsPerPage;
  // Calculate the index of the first planet on the current page
  const indexOfFirstPlanet = indexOfLastPlanet - planetsPerPage;
  // Get the planets to display on the current page
  const currentPlanets = planets.slice(indexOfFirstPlanet, indexOfLastPlanet);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setShowCards(true); // Show cards when changing the page
  };

  return (
    <div className="App">
      {!selectedPlanet ? (
        <div className="intro-container">
          <h1 className="intro-text">Star Wars Planets Directory</h1>
        </div>
      ) : (
        <div className="planet-full-screen">
          <div className="home-button" onClick={() => { setSelectedPlanet(null); setShowCards(true); }}>
            <HomeIcon fontSize="large" />
          </div>
          <PlanetCard planet={selectedPlanet} />
        </div>
      )}
      {showCards && (
        <>
          <div className="planet-small-cards" onScroll={handleScroll}>
            {currentPlanets.map((planet, index) => (
              <div
                ref={(ref) => (planetCardsRef.current[index] = ref)}
                key={planet.name}
                className={`small-planet-card ${
                  visibleCardIndex === index ? 'visible' : 'hidden'
                } ${selectedPlanet === planet ? 'selected' : ''}`}
                onClick={() => handlePlanetClick(planet, index)}
              >
                {planet.name}
              </div>
            ))}
          </div>
          <Pagination
            planetsPerPage={planetsPerPage}
            totalPlanets={planets.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </>
      )}
    </div>
  );
}

export default App;
