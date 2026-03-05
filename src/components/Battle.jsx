import React, { useEffect } from 'react';
import BattleMenu from './BattleMenu';
import { battleAction, enemyTurn } from '../game/battleLogic';

const Battle = ({ player, setPlayer, battle, setBattle, setGameState }) => {
    const { enemy, logs, turn } = battle;

    useEffect(() => {
        if (turn === 'enemy') {
            const timer = setTimeout(() => {
                enemyTurn(player, battle, setPlayer, setBattle);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [turn, player, battle, setPlayer, setBattle]);

    const handleAction = (action) => {
        const result = battleAction(action, player, battle, setPlayer, setBattle);
        if (result === 'escaped') {
            setGameState('overworld');
        } else {
            setBattle(result);
        }
    };

    if (turn === 'win') {
        return (
            <div className="battle-screen end-screen victory">
                <div className="end-content">
                    <h1>VICTORY!</h1>
                    <img src={enemy.frontSprite} alt="fainted" style={{ filter: 'grayscale(1) brightness(0.5)', width: '100px' }} />
                    <p>Wild {enemy.name} was defeated!</p>
                    <div className="logs-summary">
                        {logs.slice(0, 3).map((l, i) => <p key={i}>{l}</p>)}
                    </div>
                    <button className="primary-button" onClick={() => setGameState('overworld')}>Continue Adventure</button>
                </div>
            </div>
        );
    }

    if (turn === 'loss') {
        return (
            <div className="battle-screen end-screen defeat">
                <div className="end-content">
                    <h1>DEFEATED...</h1>
                    <img src={selectedPokemon.frontSprite} alt="fainted" style={{ filter: 'grayscale(1) brightness(0.5)', width: '100px' }} />
                    <p>{selectedPokemon.name} fainted!</p>
                    <button className="primary-button" onClick={() => setGameState('gameover')}>End Journey</button>
                </div>
            </div>
        );
    }

    const { selectedPokemon } = player;

    return (
        <div className="battle-screen">
            <div className="battle-entities">
                <div className="entity-info enemy-entity">
                    <div className="health-bar-container">
                        <h3>{enemy.name}</h3>
                        <p>HP: {enemy.hp} / {enemy.maxHp}</p>
                    </div>
                    {enemy.frontSprite && <img src={enemy.frontSprite} alt={enemy.name} className="sprite enemy-sprite" />}
                </div>
                <div className="entity-info player-entity">
                    {selectedPokemon.backSprite && <img src={selectedPokemon.backSprite} alt={selectedPokemon.name} className="sprite player-sprite" />}
                    <div className="health-bar-container">
                        <h3>{selectedPokemon.name}</h3>
                        <p>HP: {player.hp} / {player.maxHp}</p>
                    </div>
                </div>
            </div>

            <div className="logs">
                {logs.map((l, i) => <p key={i}>{l}</p>)}
            </div>

            <BattleMenu
                skills={selectedPokemon.skills}
                onAction={handleAction}
                disabled={turn !== 'player'}
            />
        </div>
    );
};

export default Battle;
