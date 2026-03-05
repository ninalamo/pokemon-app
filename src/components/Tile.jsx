import React from 'react';

const Tile = ({ terrain, hasHero }) => {
    return (
        <div className={`tile tile-${terrain}`}>
            {hasHero && <div className="hero" />}
        </div>
    );
};

export default Tile;
