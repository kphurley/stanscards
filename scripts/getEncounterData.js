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
    const villainSets = {};
    const modularSets = {};

    for(const cardPack of cardPacks) {
      const villainCards = cardPack.filter((card) => card.card_set_type_name_code === "villain");

      for(const villainCard of villainCards) {
        const setCode = villainCard.card_set_code;
        villainSets[setCode] ||= {};
        const octgnId = villainCard.octgn_id;

        let keyToModify;
        switch(villainCard.type_code) {
          case "villain":
            keyToModify = "villainCards";
            break;
          case "main_scheme":
            keyToModify = "mainSchemeCards";
            break;
          default:
            keyToModify = "encounterCards";
            break;
        }
        
        villainSets[setCode][keyToModify] ||= {};
        villainSets[setCode][keyToModify][octgnId] = _.pick(villainCard, ["octgn_id", "name", "quantity"]);
      }

      // Treat the standard and expert sets as "modular"
      const modularCards = cardPack.filter((card) => {
        return (
          card.card_set_type_name_code === "modular" ||
          card.card_set_type_name_code === "standard" ||
          card.card_set_type_name_code === "expert"
        );
      });

      for(const modularCard of modularCards) {
        const setCode = modularCard.card_set_code;
        modularSets[setCode] ||= {};
        const octgnId = modularCard.octgn_id;
        modularSets[setCode][octgnId] = _.pick(modularCard, ["octgn_id", "name", "quantity"]);
      }
    }

    const encounterCards = {
      modularSets,
      villainSets
    }

    fs.writeFileSync("./src/config/encounterData.json", JSON.stringify(encounterCards));

    process.exit(0);
  })
  .catch((err) => {
    console.error("ERROR:", err);
    process.exit(1);
  });
  