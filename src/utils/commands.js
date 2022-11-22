// Return a function in the form (event) => handling code
export function createKeyHandler(boardState, dispatch) {
  return (event) => {
    const cardId = event.target.getAttribute("data-id");
    const cardType = event.target.getAttribute("data-card-type");
    const tokenId = event.target.getAttribute("data-token-id");

    switch(event.key) {
      case "d":
        if (cardId === "playerDeck") {
          dispatch({ type: "PLAYER_DRAW" });
        }
        else if (cardId === "villainDeck") {
          dispatch({ type: "VILLAIN_DRAW" });
        }
        else if (tokenId) {
          dispatch({ type: "DELETE_TOKEN", payload: { tokenId } });
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
      case "n":
        if (cardType === "villain") {
          dispatch({ type: "NEXT_VILLAIN_STAGE" });
        }
        else if (cardType === "mainScheme") {
          dispatch({ type: "NEXT_MAIN_SCHEME" });
        }
        break;
      case "p":
        if (cardType === "villain") {
          dispatch({ type: "PREVIOUS_VILLAIN_STAGE" });
        }
        else if (cardType === "mainScheme") {
          dispatch({ type: "PREVIOUS_MAIN_SCHEME" });
        }
        break;
      case "r":
        dispatch({ type: "REVEAL_CARD", payload: cardId });
        break;
      case "+":
      case "=":
        if (tokenId) {
          dispatch({ type: "INCREMENT_TOKEN", payload: { tokenId }});
        }
        break;
      case "-":
        if (tokenId) {
          dispatch({ type: "DECREMENT_TOKEN", payload: { tokenId }});
        }
        break;
      default:
        break;
    }
  }
}
