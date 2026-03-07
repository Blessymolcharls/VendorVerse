import React from 'react';
import './OrigamiUnfold.css';

/**
 * A sophisticated 3D Origami paper-fold animation.
 * Features a central tile and four hinged flaps that peel open sequentially,
 * before the entire structure flattens and scales up to cover the viewport.
 */
export default function OrigamiUnfold({ isSuccess }) {
  if (!isSuccess) return null;

  return (
    <div className="origami-container">
      {/* The 3D scene holding the folded object */}
      <div className="origami-scene">
        <div className="origami-object">
          {/* Center Tile (The base of the paper) */}
          <div className="facet center"></div>

          {/* Hinged Uneven Flaps (Paper Plane Geometry) */}
          <div className="facet flap top-nose"></div>
          <div className="facet flap right-wing"></div>
          <div className="facet flap left-wing"></div>
          <div className="facet flap bottom-tail"></div>
        </div>
      </div>
    </div>
  );
}
