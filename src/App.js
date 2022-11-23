import React, { useCallback, useEffect, useState } from 'react';
import { Container, Content, Header, Nav, Popover, Whisper } from 'rsuite';
import Draggable from 'react-draggable';
import { useFilePicker } from 'use-file-picker';
import _ from 'lodash';

import "rsuite/dist/rsuite.min.css"
import "./styles/app.css";

import DrawDeckContainer from "./components/DrawDeckContainer";
import DeckSearch from "./components/DeckSearch";
import { DraggableCounter, ScoreboardAndCounters } from './components/ScoreboardAndCounters';
import StartGameModal from "./components/StartGameModal";
import TopNavigation from "./components/TopNavigation";

import useBoardState from './hooks/useBoardState';
import { createKeyHandler } from "./utils/commands";
import { parseEncounterSetSelectionToCardData, parseOctgnFileIntoPlayerDeck } from "./utils/parsers";

const App = () => {
  const [boardState, dispatch] = useBoardState();
  const [openFileSelector, { clear, filesContent }] = useFilePicker({ accept: ['.o8d'], multiple: false });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeDeckSearch, setActiveDeckSearch] = useState(null);

  // Hook to handle processing the .o8d file upload
  useEffect(() => {
    // parse filesContent into a deck if there is one, otherwise, clear the content if there's more than one
    if (filesContent.length === 1 && boardState.playerDeck.length === 0) {
      const playerDeck = parseOctgnFileIntoPlayerDeck(filesContent[0]);
      dispatch({ type: "UPDATE_PLAYER_AND_VILLAIN_DECKS", payload: playerDeck });
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

  const villainDeckContextMenu = (
    <Popover arrow={false}>
      <Nav>
        <Nav.Item onClick={() => dispatch({ type: "SHUFFLE_DECK", payload: "villainDeck" })}>Shuffle</Nav.Item>
      </Nav>
    </Popover>
  )
  
  return (
    <div className="mainContainer">
      <Container>
        <Header>
          <TopNavigation
            openFileSelector={openFileSelector}
            openStartGameModal={openStartGameModal}
          />
        </Header>
        <Content className="contentPane">
          <div className="villainRow">
            <div className="expand">
              <ScoreboardAndCounters
                createToken={(tokenId, tokenType) => { dispatch({ type: "CREATE_TOKEN", payload: { tokenId, tokenType }})}}
                createStatusToken={(tokenId, tokenType) => { dispatch({ type: "CREATE_STATUS_TOKEN", payload: { tokenId, tokenType }})}}
              />
            </div>
            <div className="villainCardZone villainDiscard">
              <span className="drawDeckLabelAndIconContainer">
                <span className="drawDeckLabel">Discard</span>
                <img className="menuBurger" onClick={() => setActiveDeckSearch("villainDiscard")} src="images/icons/menu-burger.png" />
              </span>
              {
                boardState.villainDiscard.length > 0 && (
                  <div
                    className="cardContainer"
                    data-id={boardState.villainDiscard[boardState.villainDiscard.length - 1].id}
                    data-card-type="player"
                    tabIndex="-1"
                  >
                    <img
                      className="card"
                      src={`/images/${boardState.villainDiscard[boardState.villainDiscard.length - 1].octgn_id}.jpg`}
                      draggable="false"
                    />
                  </div>
                )
              }
            </div>
            <DrawDeckContainer
              cardBackImgSrc="/images/marvel-encounter-back.png"
              containerClassName="villainCardZone villainDraw"
              contextMenu={villainDeckContextMenu}
              dataId="villainDeck"
              deck={boardState.villainDeck}
              deckName={"villainDeck"}
              keyHandler={handleKeyPress}
              label="Draw"
              searchDeck={setActiveDeckSearch}
            />
            <div className="villainCardZone villainCard">
              Villain
              {
                boardState?.villainCards?.length > 0 && (
                  <div
                    data-id={boardState.villainCards[boardState.activeVillainStage].id}
                    data-card-type="villain"
                    tabIndex="-1"
                    className="cardContainer"
                    onKeyPress={handleKeyPress}
                  >
                    <img
                      className="card"
                      src={`/images/${boardState.villainCards[boardState.activeVillainStage].octgn_id}.jpg`}
                      draggable="false"
                    />
                  </div>
                )
              }
            </div>
            <div className="villainHorizontalCardZone villainMainScheme">
              Main Scheme
              {
                boardState?.villainMainSchemes?.length > 0 && (
                  <div
                    data-id={boardState.villainMainSchemes[boardState.activeMainScheme].octgn_id}
                    data-card-type="mainScheme"
                    tabIndex="-1"
                    className="cardContainer"
                    onKeyPress={handleKeyPress}
                  >
                    <img
                      className="cardHorizontal"
                      src={
                        boardState.revealed[boardState.villainMainSchemes[boardState.activeMainScheme].octgn_id]
                        ? `/images/${boardState.villainMainSchemes[boardState.activeMainScheme].octgn_id}.b.jpg`
                        : `/images/${boardState.villainMainSchemes[boardState.activeMainScheme].octgn_id}.jpg`
                      }
                      draggable="false"
                    />
                  </div>
                )
              }
            </div>
            <div className="expand" />
          </div>

          <div className="heroRows">
            <DrawDeckContainer
              cardBackImgSrc="/images/marvel-player-back.png"
              containerClassName="playerDeckZone"
              contextMenu={playerDeckContextMenu}
              dataId="playerDeck"
              deck={boardState.playerDeck}
              deckName={"playerDeck"}
              keyHandler={handleKeyPress}
              label="Player Deck"
              searchDeck={setActiveDeckSearch}
            />
            <div className="playerDiscardZone">
              <span className="drawDeckLabelAndIconContainer">
                <span className="drawDeckLabel">Player Discard</span>
                <img className="menuBurger" onClick={() => setActiveDeckSearch("playerDiscard")} src="images/icons/menu-burger.png" />
              </span>
              {
                boardState.playerDiscard.length > 0 && (
                  <div
                    className="cardContainer"
                    data-id={boardState.playerDiscard[boardState.playerDiscard.length - 1].id}
                    data-card-type="player"
                    tabIndex="-1"
                  >
                    <img
                      className="card"
                      src={`/images/${boardState.playerDiscard[boardState.playerDiscard.length - 1].octgn_id}.jpg`}
                      draggable="false"
                    />
                  </div>
                )
              }
            </div>
            <div className="playerHeroCardZone">
              Hero Card
              {/* <-- hero card --> */}
              {
                boardState.hero.card &&
                  <div
                    data-id={boardState.hero.card.id}
                    data-card-type="player"
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
              }
            </div>
            <div className="playerHandZone">
              <div className="playerHandZoneText">Player Hand</div>
              {/* <-- cards in play --> */}
              { 
                boardState.playerBoard && boardState.playerBoard.map(({ id, name, octgn_id }) =>
                  <Draggable key={id}>
                    <div
                      data-id={id}
                      data-card-type="player"
                      data-name={name}
                      tabIndex="-1"
                      className="cardContainer"
                      onKeyPress={handleKeyPress}
                    >
                      <img
                        className="card"
                        src={`/images/${octgn_id}.jpg`}
                        draggable="false"
                        style={{ transform: boardState.exhausted[id] ? "rotate(90deg)" : "rotate(0)" }}
                      />
                    </div>
                  </Draggable>
                )
              }
            </div>
              { 
                boardState.villainBoard && boardState.villainBoard.map(({ id, name, octgn_id }) =>
                  <Draggable key={id}>
                    <div
                      data-id={id}
                      data-card-type="villain"
                      data-name={name}
                      tabIndex="-1"
                      className="cardContainer"
                      onKeyPress={handleKeyPress}
                    >
                      <img
                        className="card"
                        src={boardState.revealed[id] ? `/images/${octgn_id}.jpg` : "/images/marvel-encounter-back.png"}
                        draggable="false"
                        style={{ transform: boardState.exhausted[id] ? "rotate(90deg)" : "rotate(0)" }}
                      />
                    </div>
                  </Draggable>
                )
              }

              {/* TODO - Set the token count */}
              {
                Object.keys(boardState.tokens).map((tokenId) =>
                  <DraggableCounter
                    key={tokenId}
                    count={boardState.tokens[tokenId].count}
                    id={tokenId}
                    type={boardState.tokens[tokenId].type}
                    keyHandler={handleKeyPress}
                  />
                )
              }
          </div>
        </Content>
      </Container>
      <StartGameModal
        handleCloseAndStartGameWithSelections={closeModalAndStartGame}
        handleClose={closeStartGameModal}
        modalIsOpen={modalIsOpen}
      />
      <DeckSearch
        activeDeck={activeDeckSearch}
        deckBeingSearched={boardState[activeDeckSearch]}
        handleClose={() => setActiveDeckSearch(null)}
      />
    </div>
  );
}

export default App;
