import { useReducer } from "react";

// Each of these contains zero or more cards, each card having the following shape:
// { id: uuid, name: string }

// The exception being the exhausted object, which is a hash with { <card-id>: boolean }
const initialState = {
  // A hash of card-ids to their state
  exhausted: {},
  // Special state for the hero, includes exhausted, flipped
  // Definitely will need stuff to capture multiple hero cards (Ironheart) or triple cards (Ant-Man, Wasp)
  hero: {},
  playerBoard: [],
  playerDeck: [],
  playerDiscard: [],
  //playerHand: [],
  villianBoard: [],
  villianDeck: [],
  villianDiscard: [],
}

// action: { type: string, payload: string | array }
function boardStateReducer(state, action) {
  switch (action.type) {
    case "EXHAUST_CARD":
      return { ...state, exhausted: { ...state.exhausted, [action.payload]: true }};
    case "READY_CARD":
      return { ...state, exhausted: { ...state.exhausted, [action.payload]: false }};
    case "PLAYER_DRAW":
      if (state.playerDeck.length === 0) {
        return state;
      }

      const updatedDeck = [...state.playerDeck];

      //TODO - Do we need a distinction between a player's hand and board?
      //const updatedHand = [...state.playerHand];
      const updatedBoard = [...state.playerBoard];

      const drawnCard = updatedDeck.shift();
      updatedBoard.push(drawnCard);

      return { ...state, playerDeck: updatedDeck, playerBoard: updatedBoard };
    case "UPDATE_DECK":
      const { heroCard, cards } = action.payload
      return { ...state, hero: { card: heroCard, exhausted: false, alterEgo: true }, playerDeck: cards };
    case "FLIP_HERO":
      return { ...state, hero: { ...state.hero, alterEgo: action.payload }};
    default:
      return state;
  }
}

// Return an array of the form [state, dispatch]
export default function useBoardState() {
  return useReducer(boardStateReducer, initialState);
}
