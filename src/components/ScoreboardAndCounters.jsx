import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { v4 as uuidv4 } from 'uuid';

const DraggableCounter = ({ count, id, type, keyHandler }) =>
  <Draggable>
    <div data-token-id={id} tabIndex="-1" className="draggableCounterContainer" onKeyPress={keyHandler}>
      <img draggable="false" src={`images/icons/${type}Icon.svg`} />
      <div className="draggableCounterCountText">{count}</div>
    </div>
  </Draggable>

const StaticCounter = ({ count, label, setCount }) =>
  <div className="counterContainer">
    <span className="counterIconContainer" onClick={() => setCount(count - 1)}><img className="counterIcon" src="images/icons/minus.svg" /></span>
    <span className="counterLabelContainer">{`${label}: ${count}`}</span>
    <span className="counterIconContainer" onClick={() => setCount(count + 1)}><img className="counterIcon" src="images/icons/plus.svg" /></span>
  </div>

const ScoreboardAndCounters = ({ createToken }) => {
  const [heroScore, setHeroScore] = useState(10);
  const [villainScore, setVillainScore] = useState(15);

  return (
    <div className="scoreboardAndCountersContainer">
      <StaticCounter count={villainScore} label="Villain" setCount={setVillainScore} />
      <StaticCounter count={heroScore} label="Hero" setCount={setHeroScore} />
      <div>
        <img onClick={() => createToken(uuidv4(), "damage")} src="images/icons/damageIcon.svg" />
        <img onClick={() => createToken(uuidv4(), "threat")} src="images/icons/threatIcon.svg" />
        <img onClick={() => createToken(uuidv4(), "counter")} src="images/icons/counterIcon.svg" />
      </div>
    </div>
  )
}

export {
  DraggableCounter,
  ScoreboardAndCounters
};