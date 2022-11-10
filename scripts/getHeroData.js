const fs = require("fs");
const fetch = require("node-fetch");

const _ = require("lodash");
const Promise = require("bluebird");

fetch("http://localhost:8010/proxy/api/public/packs")
  .then((data) => data.json())
  .then((packJson) => {
    const codes = packJson.map((p) => p.code);

    return Promise.mapSeries(codes, (code) => {
      console.log(`Fetching set: ${code}`);
      return fetch(`http://localhost:8010/proxy/api/public/cards/${code}.json`).then((d) => d.json());
    });
  })
  .then((cardPacks) => {
    const heroData = {};

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

        const obligation = cardPack.find((card) => card.card_set_code === hero.card_set_code && card.type_code === "obligation")
        if (obligation) {
          heroData[octgnId].obligation = _.pick(obligation, ["octgn_id", "name"]);
        }

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
