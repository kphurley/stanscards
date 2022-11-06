import { XMLParser } from 'fast-xml-parser';

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
