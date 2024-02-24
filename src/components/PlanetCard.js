// PlanetCard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlanetCard.css';

const PlanetCard = ({ planet, onResidentClick }) => {
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const residentPromises = planet.residents.map((residentUrl) => axios.get(residentUrl));
        const residentResponses = await Promise.all(residentPromises);
        const residentData = residentResponses.map((response) => response.data);
        setResidents(residentData);
      } catch (error) {
        console.error('Error fetching residents:', error.message);
      }
    };

    fetchResidents();
  }, [planet.residents]);

  return (
    <div className="planet-details">
      <h2>{planet.name}</h2>
      <p>Population: {planet.population}</p>
      <p>Climate: {planet.climate}</p>
      <h3>Residents:</h3>
      <div className="resident-container">
        <ul>
          {residents.map((resident) => (
            <li key={resident.name}>
              <p>
                <strong>Name:</strong>{' '}
                <a href={resident.url} target="_blank" rel="noopener noreferrer">
                  {resident.name}
                </a>
              </p>
              <p>
                <strong>Height:</strong> {resident.height}cm,{' '}
                <strong>Mass:</strong> {resident.mass}kg,{' '}
                <strong>Gender:</strong> {resident.gender}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlanetCard;
