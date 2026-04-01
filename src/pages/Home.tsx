import React from "react";
import { TILES } from "../data/tiles";
import TileCard from "../components/TileCard";

export default function Home() {
  return (
    <div className="wrap">
      <header className="topbar">
        <h1>Optimalway</h1>
        <p>One problem, many solvers — and when each is best.</p>
      </header>

      {/* 👇 THIS is where the section goes: inside return(), under the header */}
      <section className="grid">
        {TILES.map((t) => (
          <TileCard key={t.id} {...t} />
        ))}
      </section>
    </div>
  );
}
