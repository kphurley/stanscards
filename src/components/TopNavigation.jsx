import React from "react";
import { Nav } from "rsuite";

const TopNavigation = ({ openFileSelector, openStartGameModal }) =>
  <Nav>
    <Nav.Menu title="File">
      <Nav.Item onClick={() => openFileSelector()}>Load Player Deck</Nav.Item>
      <Nav.Item onClick={openStartGameModal}>Start Game</Nav.Item>
    </Nav.Menu>
    <Nav.Item>Hotkeys</Nav.Item>
  </Nav>

export default TopNavigation;
