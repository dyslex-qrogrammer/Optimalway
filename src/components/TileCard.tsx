import React from "react";
import { Link } from "react-router-dom";
import type { Tile } from "../data/tiles";

export default function TileCard({ title, subtitle, path }: Tile) {
  return (
    <Link to={path} className="tile">
      <div className="tile-body">
        <h3 className="tile-title">{title}</h3>
        {subtitle && <p className="tile-sub">{subtitle}</p>}
      </div>
      <div className="tile-footer">
        <span>Open →</span>
      </div>
    </Link>
  );
}
