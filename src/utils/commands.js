// Return a function in the form (event) => handling code
export function createKeyHandler(boardState, dispatch) {
  return (event) => {
    const cardId = event.target.getAttribute("data-id");
    const cardType = event.target.getAttribute("data-card-type");

    switch(event.key) {
      case "d":
        if (cardId === "playerDeck") {
          dispatch({ type: "PLAYER_DRAW" });
        }
        else if (cardId === "villainDeck") {
          dispatch({ type: "VILLAIN_DRAW" });
        }
        else {
          dispatch({ type: "DISCARD_CARD", payload: { cardId, cardType }});
        }
        break;
      case "e":
        const actionType = boardState.exhausted[cardId] ? "READY_CARD" : "EXHAUST_CARD";
        dispatch({ type: actionType, payload: cardId });
        break;
      case "f":
        dispatch({ type: "FLIP_HERO", payload: !boardState.hero.alterEgo });
        break;
      case "r":
        dispatch({ type: "REVEAL_CARD", payload: cardId });
        break;
      default:
        break;
    }
  }
}
