import React, { useCallback, useEffect } from 'react';
import { Container, Content, Header, Nav } from 'rsuite';
import Draggable from 'react-draggable';
import { useFilePicker } from 'use-file-picker';

import "./styles/app.css";
import "rsuite/dist/rsuite.min.css"

import useBoardState from './hooks/useBoardState';
import { createKeyHandler } from "./utils/commands";
import { parseOctgnFileIntoPlayerDeck } from "./utils/parsers";

const App = () => {
  const [boardState, dispatch] = useBoardState();
  const [openFileSelector, { clear, filesContent }] = useFilePicker({ accept: ['.o8d'], multiple: false });

  // On load, fetch all of the sets from marvelcdb.
  // This is needed to map heroes to their nemesis sets, among other things
  // useEffect(() => {
  //   fetch("http://localhost:8010/proxy/api/public/packs")
  //     .then((data) => {
  //       return data.json();
  //     })
  //     .then((json) => {
  //       dispatch({ type: "SET_PACKS", payload: json })
  //     });
  // }, [])

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

  // Hook to get the hero's obligation card and nemesis content
  // Replace the hardcoded stuff here with a lookup to a set code (need to get this from marvelcdb)
  // useEffect(() => {
  //   if (boardState.hero.card && !(boardState.hero.obligation)) {
  //     fetch("http://localhost:8010/proxy/api/public/cards/ironheart.json")
  //       .then((data) => {
  //         return data.json();
  //       })
  //       .then((json) => {
  //         console.log("json", json);
  //         const obData = json.find((card) => card["type_code"] === "obligation");
  //         const obligation = { id: obData["octgn_id"], name: obData["name"] }
  //         const nemesisData = json.filter((card) => card["card_set_code"] === "ironheart_nemesis");
  //         const nemesisSet = []
  //         for(const card of nemesisData) {
  //           for(let i = 1; i <= card.quantity; i++) {
  //             nemesisSet.push({ id: card["octgn_id"], name: card["name"]})
  //           }
  //         }
  //         dispatch({ type: "UPDATE_HERO", payload: { obligation, nemesisSet }})
  //       });  
  //   }
  // }, [boardState.hero])

  const handleKeyPress = useCallback(createKeyHandler(boardState, dispatch), [boardState, dispatch]);
  
  return (
    <div className="mainContainer">
      <Container>
        <Header>
          <Nav>
            <Nav.Menu title="File">
              <Nav.Item onClick={() => openFileSelector()}>Load Player Deck</Nav.Item>
              <Nav.Item>Load Villain</Nav.Item>
            </Nav.Menu>
          </Nav>
        </Header>
        <Content className="contentPane">
          <div className="villainRow">
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
            <div className="villainHealth">
              <img className="villainHealthItem" src="/images/minus.svg" alt="A Rectangle Image with SVG" height="36px" width="36px" />
              <div className="villainHealthItem villainHealthCount">12</div>
              <img className="villainHealthItem" src="/images/plus.svg" alt="A Rectangle Image with SVG" height="36px" width="36px" />
            </div>
            <div className="villainHorizontalCardZone villainMainScheme">Main Scheme</div>
            <div className="villainHorizontalCardZone expandable villainSideSchemes">Side Scheme</div>
          </div>

          <div className="heroRows">
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
    </div>
  );
}

export default App;
