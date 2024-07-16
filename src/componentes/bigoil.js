import React, { useState } from 'react';
import { Container } from 'react-bootstrap';

const engines = [
    { number: 1, element: 'Nitrogen', hydrogen: '1 x H', pressure: '< 5812 PSI' },
    { number: 2, element: 'Deuterium', hydrogen: '1 x H', pressure: '> 5783 PSI' },
    { number: 3, element: '', hydrogen: '', pressure: '' },
    { number: 4, element: '', hydrogen: '', pressure: '' },
    { number: 5, element: 'Deuterium', hydrogen: '2 x H', pressure: '< 5812 PSI' },
    { number: 6, element: 'Helium', hydrogen: '2 x H', pressure: '> 5783 PSI' },
    { number: 7, element: 'Helium', hydrogen: '3 x H', pressure: '< 5812 PSI' },
    { number: 8, element: 'Nitrogen', hydrogen: '3 x H', pressure: '< 5812 PSI' },
    { number: 9, element: 'Deuterium', hydrogen: '3 x H', pressure: '< 5812 PSI' },
    { number: 10, element: '', hydrogen: '', pressure: '' },
    { number: 11, element: 'Nitrogen', hydrogen: '3 x H', pressure: '> 5783 PSI' },
    { number: 12, element: 'Deuterium', hydrogen: '3 x H', pressure: '> 5783 PSI' }
  ];

const BigOil = () => {
  const [selectedElement, setSelectedElement] = useState('???');
  const [selectedHydrogen, setSelectedHydrogen] = useState('???');
  const [selectedPressure, setSelectedPressure] = useState('???');

const filteredEngines = engines.filter(engine =>
    (selectedElement === null || selectedElement === '???') ||
    engine.element === selectedElement
  ).filter(engine =>
    (selectedHydrogen === null || selectedHydrogen === '???') ||
    engine.hydrogen === selectedHydrogen
  ).filter(engine =>
    (selectedPressure === null || selectedPressure === '???') ||
    engine.pressure === selectedPressure
  );
  
  const renderEngine = (number) => {
    const isSelected = filteredEngines.some(engine => engine.number === number);
    const allUnselected = selectedElement === "???" && selectedHydrogen === "???" && selectedPressure === "???";
    return (
      <div className={`engine ${allUnselected ? 'allUnselected' : ''} ${isSelected ? 'selectedEngine' : ''}`} key={number}>
        {number}
      </div>
    );
  };

return (
<div className="backgroundImage bigOil">

<Container className="bigOil-container">
    <div className="bigOilHydrogenElement-container">
        <div className={selectedElement === '???' ? 'selected null' : ''} onClick={() => setSelectedElement('???')}>???</div>
        <div className={selectedHydrogen === '???' ? 'selected null' : ''} onClick={() => setSelectedHydrogen('???')}>???</div>
        <div id="nitrogen" className={selectedElement === 'Nitrogen' ? 'selected' : ''}onClick={() => setSelectedElement('Nitrogen')}>Nitrogen</div>
        <div className={selectedHydrogen === '1 x H' ? 'selected hydrogen' : ''} onClick={() => setSelectedHydrogen('1 x H')}>∞ x H</div>
        <div id="deuterium" className={selectedElement === 'Deuterium' ? 'selected' : ''} onClick={() => setSelectedElement('Deuterium')}>Deuterium</div>
        <div className={selectedHydrogen === '2 x H' ? 'selected hydrogen' : ''} onClick={() => setSelectedHydrogen('2 x H')}>2 x H</div>
        <div id="helium" className={selectedElement === 'Helium' ? 'selected' : ''} onClick={() => setSelectedElement('Helium')}>Helium</div>
        <div className={selectedHydrogen === '3 x H' ? 'selected hydrogen' : ''} onClick={() => setSelectedHydrogen('3 x H')}>3 x H</div>
    </div>

    <div className="bigOilPressure-container">
        <div className={selectedPressure === '???' ? 'selected pressure' : ''} onClick={() => setSelectedPressure('???')}>???</div>
        <div className={selectedPressure === '> 5783 PSI' ? 'selected pressure' : ''} onClick={() => setSelectedPressure('> 5783 PSI')}>≥ 5783 PSI</div>
        <div className={selectedPressure === '< 5812 PSI' ? 'selected pressure' : ''} onClick={() => setSelectedPressure('< 5812 PSI')}>≤ 5812 PSI</div>
    </div>

    <div className="engine-grid bordered">

        <div className="engine-column">
            {renderEngine(12)}
            {renderEngine(10)}
            {renderEngine(8)}
        </div>
        <div className="engine-column">
            {renderEngine(7)}
            {renderEngine(9)}
            {renderEngine(11)}
        </div>
        <div id="room_stairs" className="engine-separator">Lab Stairs</div>
        <div className="engine-column">
            {renderEngine(2)}
            {renderEngine(4)}
            {renderEngine(6)}
        </div>
        <div className="engine-column">
            {renderEngine(1)}
            {renderEngine(3)}
            {renderEngine(5)}
        </div>

    </div>

</Container>

</div>
);
};
export default BigOil;