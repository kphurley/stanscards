import React from "react";
import { Modal } from "rsuite";

const DeckSearch = ({
  activeDeck,
  deckBeingSearched,
  handleClose
}) => {
  return (
    <Modal size="lg" open={!!activeDeck} onClose={handleClose}>
      <Modal.Header>
        <Modal.Title>Search Deck</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          deckBeingSearched && deckBeingSearched.map((card) =>
            <div
              className="cardContainer"
              data-id={card.id}
              tabIndex="-1"
            >
              <img
                className="card"
                src={`/images/${card.octgn_id}.jpg`}
                draggable="false"
              />
            </div>
          )
        }
      </Modal.Body>
      <Modal.Footer>    
      </Modal.Footer>
    </Modal>
  )
}

export default DeckSearch;