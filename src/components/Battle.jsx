import React, { useEffect, useRef, useState } from 'react';
import BattleMenu from './BattleMenu';
import { battleAction, enemyTurn } from '../game/battleLogic';

const getTimestamp = () => {
    const now = new Date();
    return `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}] `;
};

const Battle = ({ player, setPlayer, battle, setBattle, setGameState, handleBattleEnd }) => {
    const { enemy, logs, turn } = battle;
    const [showSwitchMenu, setShowSwitchMenu] = useState(false);

    useEffect(() => {
        if (turn === 'enemy') {
            const timer = setTimeout(() => {
                enemyTurn(player, battle, setPlayer, setBattle);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [turn, player, battle, setPlayer, setBattle]);

    const handleAction = (action) => {
        if (action.type === 'switch') {
            setShowSwitchMenu(true);
            return;
        }

        if (action.type === 'do-switch') {
            // Swap active pokemon
            // handleBattleEnd({ type: 'switch', index: action.index }); // Note: reuse end/update logic or separate?
            // Actually, let's just update player state directly and end turn
            setPlayer(prev => ({ ...prev, activePokemonIndex: action.index }));
            setBattle(prev => ({
                ...prev,
                logs: [...prev.logs, `${getTimestamp()}Trainer switched to ${player.pokemonTeam[action.index].name}!`],
                turn: 'enemy'
            }));
            setShowSwitchMenu(false);
            return;
        }

        const result = battleAction(action, player, battle, setPlayer, setBattle);
        if (result === 'escaped') {
            setGameState('overworld');
        } else if (result.turn === 'win') {
            setBattle(result);
        } else {
            setBattle(result);
        }
    };

    if (turn === 'win') {
        const activePoke = player.pokemonTeam[player.activePokemonIndex];
        return (
            <div className="battle-screen end-screen victory">
                <div className="end-content">
                    <h1>VICTORY!</h1>
                    <img src={enemy.frontSprite} alt="fainted" style={{ filter: 'grayscale(1) brightness(0.5)', width: '100px' }} />
                    <p>Wild {enemy.name} was defeated!</p>
                    <div className="logs-summary">
                        {logs.slice(-3).map((l, i) => <p key={i}>{l}</p>)}
                    </div>
                    <button className="primary-button" onClick={() => handleBattleEnd({ type: 'win', xpGain: battle.xpGain })}>Continue Adventure</button>
                </div>
            </div>
        );
    }

    if (turn === 'loss') {
        const activePoke = player.pokemonTeam[player.activePokemonIndex];
        return (
            <div className="battle-screen end-screen defeat">
                <div className="end-content">
                    <h1>DEFEATED...</h1>
                    <img src={activePoke.frontSprite} alt="fainted" style={{ filter: 'grayscale(1) brightness(0.5)', width: '100px' }} />
                    <p>{activePoke.name} fainted!</p>
                    <button className="primary-button" onClick={() => setGameState('gameover')}>End Journey</button>
                </div>
            </div>
        );
    }

    const logEndRef = useRef(null);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const activePoke = player.pokemonTeam[player.activePokemonIndex];

    return (
        <div className="battle-screen">
            <div className="battle-entities">
                {/* Player on the Left */}
                <div className="entity-info player-entity">
                    <span className="entity-label">YOUR POKEMON</span>
                    <div className="health-bar-container">
                        <h3>{activePoke.name} <span className="lvl-tag">Lvl {activePoke.level}</span></h3>
                        <p>HP: {activePoke.hp} / {activePoke.maxHp}</p>
                    </div>
                    {activePoke.frontSprite && <img src={activePoke.frontSprite} alt={activePoke.name} className="sprite player-sprite flipped" />}
                </div>

                <div className="battle-vs">VS</div>

                {/* Enemy on the Right */}
                <div className="entity-info enemy-entity">
                    <span className="entity-label">WILD POKEMON</span>
                    <div className="health-bar-container">
                        <h3>{enemy.name} <span className="lvl-tag">Lvl {enemy.level}</span></h3>
                        <p>HP: {enemy.hp} / {enemy.maxHp}</p>
                    </div>
                    {enemy.frontSprite && <img src={enemy.frontSprite} alt={enemy.name} className="sprite enemy-sprite" />}
                </div>
            </div>

            <div className="logs">
                {logs.map((l, i) => <p key={i}>{l}</p>)}
                <div ref={logEndRef} />
            </div>

            {showSwitchMenu ? (
                <div className="switch-overlay">
                    <div className="switch-menu">
                        <h3>Switch Pokemon</h3>
                        <div className="switch-options">
                            {player.pokemonTeam.map((p, i) => (
                                <button
                                    key={p.id}
                                    disabled={i === player.activePokemonIndex || p.hp <= 0}
                                    onClick={() => handleAction({ type: 'do-switch', index: i })}
                                >
                                    <img src={p.frontSprite} alt={p.name} />
                                    <span>{p.name} (HP: {p.hp})</span>
                                </button>
                            ))}
                        </div>
                        <button className="cancel-button" onClick={() => setShowSwitchMenu(false)}>Cancel</button>
                    </div>
                </div>
            ) : (
                <BattleMenu
                    skills={activePoke.skills}
                    onAction={handleAction}
                    disabled={turn !== 'player'}
                />
            )}
        </div>
    );
};

export default Battle;
