import React from 'react';

const HUD = ({ player, onSwitch }) => {
    const { pokemonTeam, activePokemonIndex, x, y } = player;
    const selectedPokemon = pokemonTeam[activePokemonIndex];
    const hpPercentage = (selectedPokemon.hp / selectedPokemon.maxHp) * 100;

    const getHpColor = () => {
        if (hpPercentage > 50) return '#4caf50';
        if (hpPercentage > 20) return '#ffeb3b';
        return '#f44336';
    };

    return (
        <div className="game-hud">
            {/* Active Pokemon Info */}
            <div className="hud-pokemon-info">
                <img src={selectedPokemon.frontSprite} alt={selectedPokemon.name} className="hud-sprite" />
                <div className="hud-stats">
                    <div className="hud-header">
                        <span className="hud-name">{selectedPokemon.name}</span>
                        <span className="hud-level">LVL {selectedPokemon.level}</span>
                    </div>
                    <div className="hud-hp-container">
                        <div
                            className="hud-hp-bar"
                            style={{
                                width: `${hpPercentage}%`,
                                backgroundColor: getHpColor()
                            }}
                        />
                    </div>
                    <div className="hud-sub-stats">
                        <span className="hud-hp-text">{selectedPokemon.hp} / {selectedPokemon.maxHp} HP</span>
                        <span className="hud-xp-text">XP: {selectedPokemon.experience} / {selectedPokemon.level * 100}</span>
                    </div>
                </div>
            </div>

            {/* Team Tray */}
            <div className="hud-team-tray">
                {player.pokemonTeam.map((p, i) => (
                    <div
                        key={p.id}
                        className={`team-member-icon ${i === player.activePokemonIndex ? 'active' : ''}`}
                        onClick={() => onSwitch(i)}
                    >
                        <img src={p.frontSprite} alt={p.name} title={`${p.name} (HP: ${p.hp}/${p.maxHp})`} />
                        <div className="mini-hp-bar">
                            <div style={{ width: `${(p.hp / p.maxHp) * 100}%` }} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="hud-location">
                <span className="hud-coord">X: {x} Y: {y}</span>
            </div>
        </div>
    );
};

export default HUD;
