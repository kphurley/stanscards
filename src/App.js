import React, { useState } from 'react';
import Draggable from 'react-draggable';

import "./styles/app.css";

const App = () => {
  const [exhausted, setExhausted] = useState(false);

  const degrees = exhausted ? "90deg" : "0";

  const toggleExhausted = () => setExhausted(!exhausted);

  const handleKeyPress = (e) => {
    if(e.key === "e") {
      toggleExhausted();
    }
  }

  return (
    <div>
      <Draggable>
        <div tabIndex="-1" className="cardContainer" onKeyPress={handleKeyPress}>
          <img
            className="card"
            data-id="0b68b17c-bf82-446c-933a-e6fafbca360e"
            src="/images/0b68b17c-bf82-446c-933a-e6fafbca360e.jpg"
            draggable="false"
            style={{ transform: `rotate(${degrees})`}}
          />
        </div>
      </Draggable>
    </div>
  );
}

export default App;
