import React from "react";
import { Modal, Nav, Popover, Whisper } from "rsuite";

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
      </Modal.Footer>
    </Modal>
  )
}

export default DeckSearch;