import React from 'react';
import { Whisper } from 'rsuite';
import Draggable from 'react-draggable';

const DrawDeckContainer = ({
  cardBackImgSrc,
  containerClassName,
  contextMenu,
  dataId,
  deck,
  keyHandler,
  label,
}) =>
  <Whisper trigger="contextMenu" speaker={contextMenu}>
    <div className={containerClassName}>
      { label }
      {
        deck?.length > 0 && (
          <Draggable>
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
          </Draggable>
        )
      }
    </div>
  </Whisper>

export default DrawDeckContainer;
