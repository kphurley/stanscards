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

  // This is a hash for for villain cards.  Revealed means they are face up.
  revealed: {},

  activeMainScheme: 0,
  activeVillainStage: 0,

  playerBoard: [],
  playerDeck: [],
  playerDiscard: [],

  villainBoard: [],
  villainCards: [],
  villainDeck: [],
  villainDiscard: [],
  villainMainSchemes: [],

  // A hash containing all of the tokens currently in play
  tokens: {},
}

function boardStateReducer(state, action) {
  const updatedPlayerBoard = [...state.playerBoard];
  const updatedPlayerDiscard = [...state.playerDiscard];
  const updatedPlayerDeck = [...state.playerDeck];
  const updatedVillainBoard = [...state.villainBoard];
  const updatedVillainDeck = [...state.villainDeck];
  const updatedVillainDiscard = [...state.villainDiscard];

  const tokenId = action.payload?.tokenId;
  const tokenType = action.payload?.tokenType;

  switch (action.type) {
    case "DISCARD_CARD":
      if (action.payload?.cardType === "player") {
        const indexOfCardToRemove = updatedPlayerBoard.findIndex((card) => card.id === action.payload?.cardId)
        if (indexOfCardToRemove < 0) {
          return state;
        }

        const [removedCard] = updatedPlayerBoard.splice(indexOfCardToRemove, 1);
        updatedPlayerDiscard.push(removedCard);
      }
      else if (action.payload?.cardType === "villain") {
        const indexOfCardToRemove = updatedVillainBoard.findIndex((card) => card.id === action.payload?.cardId)
        if (indexOfCardToRemove < 0) {
          return state;
        }

        const [removedCard] = updatedVillainBoard.splice(indexOfCardToRemove, 1);
        updatedVillainDiscard.push(removedCard);
      };

      return {
        ...state,
        playerDiscard: updatedPlayerDiscard,
        playerBoard: updatedPlayerBoard,
        villainDiscard: updatedVillainDiscard,
        villainBoard: updatedVillainBoard,
      };
    case "EXHAUST_CARD":
      return { ...state, exhausted: { ...state.exhausted, [action.payload]: true }};
    case "FLIP_HERO":
      return { ...state, hero: { ...state.hero, alterEgo: action.payload }};
    case "PLAYER_DRAW":
      if (state.playerDeck.length === 0) {
        return state;
      }

      const drawnCard = updatedPlayerDeck.shift();
      updatedPlayerBoard.push(drawnCard);

      return { ...state, playerDeck: updatedPlayerDeck, playerBoard: updatedPlayerBoard };
    case "READY_CARD":
      return { ...state, exhausted: { ...state.exhausted, [action.payload]: false }};
    case "REVEAL_CARD":
      return { ...state, revealed: { ...state.revealed, [action.payload]: true }};
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
        octgn_id: obligation.octgn_id,
      }
      tempVillainDeck.push(formattedObligation);

      const formattedNemesisCards = []
      for (const card of nemesisCards) {
        const quantity = parseInt(card.quantity);
        if (isNaN(quantity)) { continue; }

        for (let i = 1; i <= quantity; i++) {
          const { octgn_id, name } = card;
          formattedNemesisCards.push({ name, octgn_id, id: `${octgn_id}-${i}`});
        }
      }

      return {
        ...state,
        hero: { nemesisCards: formattedNemesisCards, card: heroCard, exhausted: false, alterEgo: true },
        playerDeck: cards,
        villainDeck: tempVillainDeck
      };
    case "UPDATE_VILLAIN":
      const { villainCards, villainDeck, villainMainSchemes } = action.payload;
      return { ...state, villainCards, villainMainSchemes, villainDeck: [...state.villainDeck, ...villainDeck]};
    case "VILLAIN_DRAW":
      if (state.villainDeck.length === 0) {
        return state;
      }

      const drawnVillainCard = updatedVillainDeck.shift();
      updatedVillainBoard.push(drawnVillainCard);

      return { ...state, villainDeck: updatedVillainDeck, villainBoard: updatedVillainBoard };
    case "CREATE_TOKEN":
      return {...state, tokens: {...state.tokens, [tokenId]: {type: tokenType, count: 0 }}}
    case "CREATE_STATUS_TOKEN":
      return {...state, tokens: {...state.tokens, [tokenId]: {type: tokenType }}}
    case "INCREMENT_TOKEN":
      return { ...state, tokens: {...state.tokens, [tokenId]: { ...state.tokens[tokenId], count: state.tokens[tokenId].count + 1 }}}
    case "DECREMENT_TOKEN":
      return { ...state, tokens: {...state.tokens, [tokenId]: { ...state.tokens[tokenId], count: state.tokens[tokenId].count - 1 }}}
    case "DELETE_TOKEN":
      const updatedTokens = {...state.tokens};
      delete updatedTokens[tokenId];
      return { ...state, tokens: updatedTokens }
    case "NEXT_MAIN_SCHEME":
      if (state.activeMainScheme >= state.villainMainSchemes.length - 1) {
        return state;
      }

      return { ...state, activeMainScheme: state.activeMainScheme + 1 }
    case "PREVIOUS_MAIN_SCHEME":
      if (state.activeMainScheme <= 0) {
        return state;
      }

      return { ...state, activeMainScheme: state.activeMainScheme - 1 }
    case "NEXT_VILLAIN_STAGE":
      if (state.activeVillainStage >= state.villainCards.length - 1) {
        return state;
      }

      return { ...state, activeVillainStage: state.activeVillainStage + 1 }
    case "PREVIOUS_VILLAIN_STAGE":
      if (state.activeVillainStage <= 0) {
        return state;
      }

      return { ...state, activeVillainStage: state.activeVillainStage - 1 }
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
