import React from 'react';

const HUD = ({ player }) => {
    const { hp, maxHp, selectedPokemon, x, y } = player;
    const hpPercentage = (hp / maxHp) * 100;

    const getHpColor = () => {
        if (hpPercentage > 50) return '#4caf50';
        if (hpPercentage > 20) return '#ffeb3b';
        return '#f44336';
    };

    return (
        <div className="game-hud">
            <div className="hud-pokemon-info">
                <img src={selectedPokemon.frontSprite} alt={selectedPokemon.name} className="hud-sprite" />
                <div className="hud-stats">
                    <span className="hud-name">{selectedPokemon.name}</span>
                    <div className="hud-hp-container">
                        <div
                            className="hud-hp-bar"
                            style={{
                                width: `${hpPercentage}%`,
                                backgroundColor: getHpColor()
                            }}
                        />
                    </div>
                    <span className="hud-hp-text">{hp} / {maxHp} HP</span>
                </div>
            </div>
            <div className="hud-location">
                <span className="hud-coord">X: {x} Y: {y}</span>
            </div>
        </div>
    );
};

export default HUD;
