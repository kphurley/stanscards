import _ from 'lodash';
import { XMLParser } from 'fast-xml-parser';

import encounterData from "../config/encounterData.json";

export function parseOctgnFileIntoPlayerDeck(octgnFile) {{
  const options = {
    ignoreAttributes : false,
    attributeNamePrefix: '',
    textNodeName: 'name',
  };

  const parser = new XMLParser(options);
  const parsedObj = parser.parse(octgnFile.content);
  const rawCardData = parsedObj?.deck?.section?.card;

  // At this point if rawCardData has no length, something went wrong
  if (!rawCardData.length) {
    console.error("Problem getting card data");
  }

  // Otherwise, we need to convert the qty property into multiple copies of the object, i.e.
  // { id: 'some-id', name: 'card name', qty: "2" } => [{ id: 'some-id', name: 'card name' }, { id: 'some-id', name: 'card name'} ]
  const deckData = {}

  // This assumes the hero is always the first card
  deckData.heroCard = rawCardData.shift();
  deckData.cards = []
  
  for (const card of rawCardData) {
    const quantity = parseInt(card.qty);
    if (isNaN(quantity)) { continue; }

    for (let i = 1; i <= quantity; i++) {
      const { id, name } = card;
      deckData.cards.push({ id, name });
    }
  }

  // Goal:  return an array of cards: { id: uuid, name: string }
  return deckData;
}}

// Given a selection and a type (e.g.: ("bomb_scare", "modular"), or ("rhino", "villain")
// Return an object of the form { villain, mainScheme, encounter }
// (if it's a modular set, just return encounter)
export function parseEncounterSetSelectionToCardData(selection, type) {
  const cardData = {};
  const rawCardData = encounterData[type][selection];
  let encounterKeys;

  if (type === "villainSets") {
    cardData.villainCards = Object.keys(rawCardData.villainCards).map((key) => rawCardData.villainCards[key]);
    cardData.mainSchemeCards = Object.keys(rawCardData.mainSchemeCards).map((key) => rawCardData.mainSchemeCards[key]);
    encounterKeys = Object.keys(rawCardData.encounterCards);
  } else {
    encounterKeys = Object.keys(rawCardData);
  }

  const encounterCards = [];
  for (const cardId of encounterKeys) {
    const card = type === "villainSets" ? rawCardData.encounterCards[cardId] : rawCardData[cardId];
    const quantity = parseInt(card.quantity);
    if (isNaN(quantity)) { continue; }

    for (let i = 1; i <= quantity; i++) {
      const { octgn_id, name } = card;
      encounterCards.push({ name, id: octgn_id });
    }
  }

  cardData.encounterCards = encounterCards;

  console.log(cardData);
  return cardData;
}
