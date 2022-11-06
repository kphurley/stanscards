import React, { useCallback, useEffect } from 'react';
import Draggable from 'react-draggable';
import { useFilePicker } from 'use-file-picker';

import "./styles/app.css";

import useBoardState from './hooks/useBoardState';
import { parseOctgnFileIntoPlayerDeck } from "./utils/parsers";

const App = () => {
  const [boardState, dispatch] = useBoardState();

  // clear is a function that clears all fileContent, seems useful
  const [openFileSelector, { clear, filesContent }] = useFilePicker({ accept: ['.o8d'], multiple: false });

  // Hook to handle processing the .o8d file upload
  useEffect(() => {
    // parse filesContent into a deck if there is one, otherwise, clear the content if there's more than one
    if (filesContent.length === 1 && boardState.playerDeck.length === 0) {
      const playerDeck = parseOctgnFileIntoPlayerDeck(filesContent[0]);
      dispatch({ type: "UPDATE_DECK", payload: playerDeck });
    } else if (filesContent.length > 1) {
      console.error("Multiple files detected, clearing the files content.  Try the upload again.")
      clear();
    }
  }, [boardState, filesContent])

  // Key handlers - extract somewhere
  const handleKeyPress = useCallback((e) => {
    const cardId = e.target.getAttribute("data-id");

    // Draw a card if this is a playerDeck or villianDeck
    if(e.key === "d") {
      if(cardId === "playerDeck") {
        dispatch({ type: "PLAYER_DRAW" });
      }
    }

    // Toggle exhaustion state of card
    if(e.key === "e") {
      const actionType = boardState.exhausted[cardId] ? "READY_CARD" : "EXHAUST_CARD";
      dispatch({ type: actionType, payload: cardId });
    }

    // Flip hero
    if(e.key === "f") {
      dispatch({ type: "FLIP_HERO", payload: !boardState.hero.alterEgo });
    }
  }, [boardState]);

  return (
    <div>
      {/* <-- cards in play --> */}
      { 
        boardState.playerBoard && boardState.playerBoard.map(({ id, name }) =>
          <Draggable key={id}>
            <div
              data-id={id}
              data-name={name}
              tabIndex="-1"
              className="cardContainer"
              onKeyPress={handleKeyPress}
            >
              <img
                className="card"
                src={`/images/${id}.jpg`}
                draggable="false"
                style={{ transform: boardState.exhausted[id] ? "rotate(90deg)" : "rotate(0)" }}
              />
            </div>
          </Draggable>
        )
      }

      {/* <-- encounter deck --> */}
      <Draggable positionOffset={{ x: "30vw", y: "0" }}>
        <div tabIndex="-1" className="cardContainer">
          <img
            className="card"
            src="/images/marvel-encounter-back.png"
            draggable="false"
          />
        </div>
      </Draggable>

      {/* <-- hero card --> */}
      {
        boardState.hero.card &&
          <Draggable>
            <div
              data-id={boardState.hero.card.id}
              data-name={boardState.hero.card.name}
              tabIndex="-1"
              className="cardContainer"
              onKeyPress={handleKeyPress}
            >
              <img
                className="card"
                src={`/images/${boardState.hero.card.id}${boardState.hero.alterEgo ? ".b" : ""}.jpg`}
                draggable="false"
              />
            </div>
          </Draggable>
      }

      {/* <-- player deck --> */}
      {
        boardState?.playerDeck?.length > 0 && (
          <Draggable positionOffset={{ x: "50vw", y: "70vh" }}>
            <div data-id="playerDeck" tabIndex="-1" className="cardContainer" onKeyPress={handleKeyPress}>
              <img
                className="card"
                src="/images/marvel-player-back.png"
                draggable="false"
              />
            </div>
          </Draggable>
        )
      }

      {/* <-- file selection for player deck import --> */}
      <div>
        <button onClick={() => openFileSelector()}>Select files </button>
      </div>
    </div>
  );
}

export default App;
