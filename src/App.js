import React, { useCallback, useEffect, useState } from 'react';
import { Container, Content, Header, Nav, Popover, Whisper } from 'rsuite';
import Draggable from 'react-draggable';
import { useFilePicker } from 'use-file-picker';
import _ from 'lodash';

import "./styles/app.css";
import "rsuite/dist/rsuite.min.css"

import StartGameModal from "./components/StartGameModal";
import useBoardState from './hooks/useBoardState';
import { createKeyHandler } from "./utils/commands";
import { parseEncounterSetSelectionToCardData, parseOctgnFileIntoPlayerDeck } from "./utils/parsers";

const App = () => {
  const [boardState, dispatch] = useBoardState();
  const [openFileSelector, { clear, filesContent }] = useFilePicker({ accept: ['.o8d'], multiple: false });
  const [modalIsOpen, setModalIsOpen] = useState(false);

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

  const handleKeyPress = useCallback(createKeyHandler(boardState, dispatch), [boardState, dispatch]);

  const openStartGameModal = () => setModalIsOpen(true);
  const closeStartGameModal = () => setModalIsOpen(false);

  // villain = string key from encounter sets
  // modulars = array of selected modulars
  // TODO - how to handle standard/expert selection?
  const closeModalAndStartGame = (villain, modulars) => {
    closeStartGameModal();

    const villainData = parseEncounterSetSelectionToCardData(villain, "villainSets");
    const modularCards = modulars.map((modular) => parseEncounterSetSelectionToCardData(modular, "modularSets").encounterCards)
                                .reduce((acc, set) => acc.concat(set));

    villainData.encounterCards = villainData.encounterCards.concat(modularCards);

    dispatch({ type: "UPDATE_VILLAIN", payload: {
      villainCards: villainData.villainCards,
      villainDeck: villainData.encounterCards,
      villainMainSchemes: villainData.mainSchemeCards,
    }})
  }

  const playerDeckContextMenu = (
    <Popover arrow={false}>
      <Nav>
        <Nav.Item onClick={() => dispatch({ type: "SHUFFLE_DECK", payload: "playerDeck" })}>Shuffle</Nav.Item>
      </Nav>
    </Popover>
  )
  
  return (
    <div className="mainContainer">
      <Container>
        <Header>
          <Nav>
            <Nav.Menu title="File">
              <Nav.Item onClick={() => openFileSelector()}>Load Player Deck</Nav.Item>
              <Nav.Item onClick={openStartGameModal}>Start Game</Nav.Item>
            </Nav.Menu>
          </Nav>
        </Header>
        <Content className="contentPane">
          <div className="villainRow">
            <div className="expand" />
            <div className="villainCardZone villainDiscard">Discard</div>
            <div className="villainCardZone villainDraw">
              Draw
              {/* <-- encounter deck --> */}
              <Draggable>
                <div tabIndex="-1" className="cardContainer">
                  <img
                    className="card"
                    src="/images/marvel-encounter-back.png"
                    draggable="false"
                  />
                </div>
              </Draggable>
            </div>
            <div className="villainCardZone villainCard">Villain</div>
            <div className="villainHorizontalCardZone villainMainScheme">Main Scheme</div>
            <div className="expand" />
          </div>

          <div className="heroRows">
            <Whisper trigger="contextMenu" speaker={playerDeckContextMenu}>
              <div className="playerDeckZone">
                Player Deck
                {/* <-- player deck --> */}
                {
                  boardState?.playerDeck?.length > 0 && (
                    <Draggable>
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
              </div>
            </Whisper>
            <div className="playerDiscardZone">
              Player Discard
            </div>
            <div className="playerHeroCardZone">
              Hero Card
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
                        style={{ transform: boardState.exhausted[boardState.hero.card.id] ? "rotate(90deg)" : "rotate(0)" }}
                      />
                    </div>
                  </Draggable>
              }
            </div>
            <div className="playerHandZone">
              <div className="playerHandZoneText">Player Hand</div>
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
            </div>
          </div>
        </Content>
      </Container>
      <StartGameModal
        handleCloseAndStartGameWithSelections={closeModalAndStartGame}
        handleClose={closeStartGameModal}
        modalIsOpen={modalIsOpen}
      />
    </div>
  );
}

export default App;
