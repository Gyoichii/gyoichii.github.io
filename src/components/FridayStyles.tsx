"use client";
import { useState } from "react";
import { Gallery, type MediaItem } from "./MediaViewer";

const styles = [
  { id: "classic", label: "Classic", caption: "The watchlist groups the film card, votes and filters beneath the group header." },
  { id: "cinema", label: "Projection", caption: "The selected film fills the marquee, with its title set beside a large poster." },
  { id: "type", label: "Type in motion", caption: "Large numerals, angled rules and oversized titles turn the list into a film programme." },
  { id: "dotmatrix", label: "Matrix programme", caption: "The watchlist takes the form of a dot-matrix display with a gridded programme below." },
  { id: "dvd", label: "DVD shelf", caption: "Each film occupies a spine on the shelf. Opening a case reveals the film." },
  { id: "theater", label: "Movie theater", caption: "A projector previews the selected film alongside the vertical filmstrip." },
  { id: "win95", label: "Windows 95", caption: "Desktop shortcuts, window title bars and a taskbar organize the group’s watchlist." },
];

export function FridayStyles() {
  const [id, setId] = useState("dvd");
  const selected = styles.find(style => style.id === id)!;
  const item: MediaItem = {
    id, project: "friday-night", title: selected.label + " watchlist", caption: selected.caption,
    art: "web", hint: "English desktop capture", fit: "contain",
    sources: [{ src: `/media/friday-night/styles/${id}.webp`, mime: "image/webp", type: "image" }],
  };
  return <div className="style-browser">
    <fieldset className="style-choices"><legend>Watchlist style</legend>
      {styles.map(style => <label key={style.id}>
        <input type="radio" name="watchlist-style" value={style.id} checked={id === style.id} onChange={() => setId(style.id)} />
        <img src={`/media/friday-night/styles/${style.id}.webp`} width="1360" height="840" alt="" loading="lazy" />
        <span>{style.label}</span>
      </label>)}
    </fieldset>
    <Gallery items={[item]} key={id} />
  </div>;
}
