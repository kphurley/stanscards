import React from 'react';
import { Whisper } from 'rsuite';

import CardImage from "./CardImage";

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
  setMousedOverImageSrc,
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
            <CardImage
              setMousedOver={setMousedOverImageSrc}
              src={cardBackImgSrc}
            />
          </div>
        )
      }
    </div>
  </Whisper>

export default DrawDeckContainer;
