import React, { useCallback, useState } from "react";
import { Button, Divider, Modal, Placeholder, TagPicker, TreePicker } from "rsuite";
import _ from "lodash";

import encounterData from "../config/encounterData.json";

const StartGameModal = ({
  handleCloseAndStartGameWithSelections,
  handleClose,
  modalIsOpen
}) => {
  const [selectedVillain, setSelectedVillain] = useState(null);
  const [selectedModulars, setSelectedModulars] = useState([]);

  let mainSchemeOctgnId;
  if (selectedVillain) {
    mainSchemeOctgnId = Object.keys(encounterData.villainSets[selectedVillain].mainSchemeCards)[0]
  }

  const mainSchemeImgSrc = selectedVillain && `/images/${mainSchemeOctgnId}.jpg`;

  const mapSetToPickerData = (setCollection) => {
    return Object.keys(setCollection).map((setKey) => {
      return (
        { value: setKey, label: _.startCase(setKey) }
      );
    });
  }

  // The way we're doing this doesn't work for this encounter, so omit it for now
  const VILLAINS_TO_OMIT = ["wrecking_crew", "wrecker", "thunderball", "piledriver", "bulldozer"];

  const villainTreePickerData = mapSetToPickerData(encounterData.villainSets)
                                .filter((data) => !VILLAINS_TO_OMIT.includes(data.value));
  
  const modularTreePickerData = mapSetToPickerData(encounterData.modularSets);

  const startGame = useCallback(() => {
    handleCloseAndStartGameWithSelections(selectedVillain, selectedModulars);
  }, [selectedVillain, selectedModulars])

  return (
    <Modal size="lg" open={modalIsOpen} onClose={handleClose}>
      <Modal.Header>
        <Modal.Title>Start Game</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="villainSelectionContainer">
          <div className="villainSelectionColumn">
            <div>Select Villain</div>
            <TreePicker
              defaultExpandAll
              data={villainTreePickerData}
              onChange={setSelectedVillain}
              style={{ width: "250px" }}
            />
          </div>
          <div className="villainSelectionColumn expand flex-centerContent">
            {
              selectedVillain
                ? <img className="maxWidth-400px" src={mainSchemeImgSrc} />
                : <Placeholder.Graph className="maxWidth-400px" />
            }
          </div>
        </div>
        <Divider />
        <div className="modularSelectionContainer">
          <div className="villainSelectionColumn">
            <div>Select Modular</div>
            <TagPicker
              data={modularTreePickerData}
              onChange={setSelectedModulars}
              style={{ width: "250px" }}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} appearance="subtle">
          Cancel
        </Button>
        <Button onClick={startGame} appearance="primary">
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default StartGameModal;
