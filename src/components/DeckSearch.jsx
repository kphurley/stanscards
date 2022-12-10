import React from "react";
import { Button, Modal, Nav, Popover, Whisper } from "rsuite";

import CardImage from "./CardImage";

const DeckSearch = ({
  activeDeck,
  deckBeingSearched,
  dispatch,
  handleClose,
  setMousedOverImageSrc
}) => {
  const targetDeck = activeDeck && activeDeck.includes("player") ? "playerBoard" : "villainBoard";

  const getContextMenuForCardIndex = (idx) => (
    <Popover arrow={false}>
      <Nav vertical>
        <Nav.Item onClick={() => dispatch({ type: "MOVE_CARD", payload: { idx, from: activeDeck, to: "villainDeck" }})}>
          Move into encounter deck
        </Nav.Item>
        <Nav.Item onClick={() => dispatch({ type: "MOVE_CARD", payload: { idx, from: activeDeck, to: "playerDeck" }})}>
          Move into player deck
        </Nav.Item>
        <Nav.Item onClick={() => dispatch({ type: "MOVE_CARD", payload: { idx, from: activeDeck, to: targetDeck }})}>
          Put card into play
        </Nav.Item>
      </Nav>
    </Popover>
  )

  return (
    <Modal size="lg" open={!!activeDeck} onClose={handleClose}>
      <Modal.Header>
        <Modal.Title>Search Deck</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          deckBeingSearched && deckBeingSearched.map((card, idx) =>
            <Whisper trigger="contextMenu" speaker={getContextMenuForCardIndex(idx)}>
              <div
                className="cardContainer cardInSearchContainer"
                data-id={card.id}
                tabIndex="-1"
              >
                <CardImage
                  setMousedOver={setMousedOverImageSrc}
                  src={`/images/${card.octgn_id}.jpg`}
                />
              </div>
            </Whisper>
          )
        }
      </Modal.Body>
      <Modal.Footer> 
        <Button onClick={() => dispatch({ type: "MOVE_ALL_CARDS", payload: { from: activeDeck, to: "villainDeck" }})} appearance="subtle">
          Shuffle Cards Into Encounter Deck
        </Button>
        <Button onClick={() => dispatch({ type: "MOVE_ALL_CARDS", payload: { from: activeDeck, to: "playerDeck" }})} appearance="subtle">
          Shuffle Cards Into Player Deck
        </Button>   
        <Button onClick={handleClose} appearance="primary">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeckSearch;