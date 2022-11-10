const fs = require("fs");
const fetch = require("node-fetch");

const _ = require("lodash");
const Promise = require("bluebird");

// Wrap fetch in a debounce to avoid triggering DDOS protection
//debouncedFetch = _.debounce(fetch, 1000);

// This is a listing of hero names to sets
// TODO - Update this to octgn IDs, otherwise we can't use Miles :(
// (In other words, heroes that don't have a pack named for them)

// Sadly, we need to keep this current
// const HERO_OCTGN_ID_TO_SET = {
//   //Captain Marvel
//   "78343f41-6bfd-456d-965a-d6456a01a581": "core",

//   //Black Panther
//   "ced52353-61f7-4ed1-8469-01d396904d61": "core",

//   //Iron Man
//   "9780ba79-44e4-4530-b865-5983a60372b0": "core",
  
//   //Spider-Man
//   "18ae183c-de26-4369-8a41-424d58f01631": "core",

//   //She-Hulk
//   "d46d5e03-c8b7-4ff5-8633-3941c0561812": "core",

//   Hawkeye: "trors",
//   "Spider-Woman": "trors",
//   Groot: "gmw",
//   "Rocket Raccoon": "gmw",
//   Spectrum: "mts",
//   "Adam Warlock": "mts",
//   "Ghost-Spider": "sm",

//   "Colossus": "mut_gen",
//   "Shadowcat": "mut_gen"

// }

fetch("http://localhost:8010/proxy/api/public/packs")
  .then((data) => data.json())
  .then((packJson) => {
    const codes = packJson.map((p) => p.code);

    /*
    For each pack:
    - Get the hero data from each pack:
      - key: octgn-id
      - value: hero (card), alterEgo (card), obligation (card), nemesis (cards), 
    */
    return Promise.mapSeries(codes, (code) => {
      console.log(`Fetching set: ${code}`);
      return fetch(`http://localhost:8010/proxy/api/public/cards/${code}.json`).then((d) => d.json());
    });
  })
  .then((cardPacks) => {
    const heroData = {};

    // In each cardPack:
    // - find the hero(es), group them with their alterEgo, obligation and nemesis
    // - once found and groups, create a new k-v pair with the goods
    for(const cardPack of cardPacks) {
      const heroCards = cardPack.filter((card) => card.type_code === "hero");

      for(const hero of heroCards) {
        const octgnId = hero.octgn_id
        heroData[octgnId] = {
          hero: {
            id: octgnId,
            name: hero.name
          }
        }

        // Find this hero's obligation card
        const obligation = cardPack.find((card) => card.card_set_code === hero.card_set_code && card.type_code === "obligation")
        if (obligation) {
          heroData[octgnId].obligation = _.pick(obligation, ["octgn_id", "name"]);
        }

        // Find this hero's nemesis set
        const nemesisType = hero.card_set_code + "_nemesis";
        const nemesisCards = cardPack.filter((card) => card.card_set_code === nemesisType)
                                     .map((card) => _.pick(card, ["octgn_id", "name", "quantity"]))

        if (nemesisCards.length > 0) {
          heroData[octgnId].nemesisCards = nemesisCards;
        }
      }
    }

    fs.writeFileSync("./src/config/heroData.json", JSON.stringify(heroData));

    process.exit(0);
  })
  .catch((err) => {
    console.error("ERROR:", err);
    process.exit(1);
  });
