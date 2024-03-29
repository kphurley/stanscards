import React from "react";
import { Nav } from "rsuite";

const TopNavigation = ({ openFileSelector, openStartGameModal, searchNemesisCards }) =>
  <Nav>
    <Nav.Menu title="File">
      <Nav.Item onClick={() => openFileSelector()}>Load Player Deck</Nav.Item>
      <Nav.Item onClick={openStartGameModal}>Start Game</Nav.Item>
    </Nav.Menu>
    <Nav.Menu title="Game">
      <Nav.Item onClick={() => searchNemesisCards()}>Nemesis Cards</Nav.Item>
    </Nav.Menu>
  </Nav>

export default TopNavigation;
