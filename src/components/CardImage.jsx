import React from "react";

const CardImage = ({ className, setMousedOver, src, style }) =>
  <img
    onMouseEnter={() => setMousedOver(src)}
    onMouseLeave={() => setMousedOver(null)}
    className={className || "card"}
    src={src}
    draggable="false"
    style={style}
  />;

export default CardImage;