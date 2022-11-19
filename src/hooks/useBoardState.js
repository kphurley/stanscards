import { useReducer } from "react";
import arrayShuffle from 'array-shuffle';

import heroData from "../config/heroData.json";

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
  villainBoard: [],
  villainCards: [],
  villainDeck: [],
  villainDiscard: [],
  villainMainSchemes: [],
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
      const updatedBoard = [...state.playerBoard];

      const drawnCard = updatedDeck.shift();
      updatedBoard.push(drawnCard);

      return { ...state, playerDeck: updatedDeck, playerBoard: updatedBoard };
    case "SHUFFLE_DECK":
      const shuffledDeck = arrayShuffle(state[action.payload])
      return { ...state, [action.payload]: shuffledDeck };
    case "UPDATE_PLAYER_AND_VILLAIN_DECKS":
      const { heroCard, cards } = action.payload
      const { obligation, nemesisCards } = getEncounterCardsFromHeroCard(heroCard);
      const tempVillainDeck = [...state.villainDeck];
      const formattedObligation = {
        id: obligation.octgn_id,
        name: obligation.name,
      }
      tempVillainDeck.push(formattedObligation);

      return {
        ...state,
        hero: { nemesisCards, card: heroCard, exhausted: false, alterEgo: true },
        playerDeck: cards,
        villainDeck: tempVillainDeck
      };
    case "UPDATE_VILLAIN":
      const { villainCards, villainDeck, villainMainSchemes } = action.payload;
      return { ...state, villainCards, villainMainSchemes, villainDeck: [...state.villainDeck, ...villainDeck]};
    case "FLIP_HERO":
      return { ...state, hero: { ...state.hero, alterEgo: action.payload }};
    default:
      return state;
  }
}

function getEncounterCardsFromHeroCard(heroCard) {
  const { obligation, nemesisCards } = heroData[heroCard.id];

  return { obligation, nemesisCards };
}

// Return an array of the form [state, dispatch]
export default function useBoardState() {
  return useReducer(boardStateReducer, initialState);
}
