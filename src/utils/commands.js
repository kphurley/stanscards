// Return a function in the form (event) => handling code
export function createKeyHandler(boardState, dispatch) {
  return (event) => {
    const cardId = event.target.getAttribute("data-id");

    switch(event.key) {
      case "d":
        if(cardId === "playerDeck") {
          dispatch({ type: "PLAYER_DRAW" });
        }
        break;
      case "e":
        const actionType = boardState.exhausted[cardId] ? "READY_CARD" : "EXHAUST_CARD";
        dispatch({ type: actionType, payload: cardId });
        break;
      case "f":
        dispatch({ type: "FLIP_HERO", payload: !boardState.hero.alterEgo });
        break;
      default:
        break;
    }
  }
}
