import React from 'react';
import { Whisper } from 'rsuite';

const DrawDeckContainer = ({
  cardBackImgSrc,
  containerClassName,
  contextMenu,
  dataId,
  deck,
  deckName,
  keyHandler,
  label,
  searchDeck,
}) =>
  <Whisper trigger="contextMenu" speaker={contextMenu}>
    <div className={containerClassName}>
      <span className="drawDeckLabelAndIconContainer">
        <span className="drawDeckLabel">{ label }</span>
        <img className="menuBurger" onClick={() => searchDeck(deckName)} src="images/icons/menu-burger.png" />
      </span>
      {
        deck?.length > 0 && (
          <div
            className="cardContainer"
            data-id={dataId}
            onKeyPress={keyHandler}
            tabIndex="-1"
          >
            <img
              className="card"
              src={cardBackImgSrc}
              draggable="false"
            />
          </div>
        )
      }
    </div>
  </Whisper>

export default DrawDeckContainer;
