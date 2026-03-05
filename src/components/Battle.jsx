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
            <div className="battle-screen">
                <h2>Victory!</h2>
                <div className="logs">{logs.map((l, i) => <p key={i}>{l}</p>)}</div>
                <button onClick={() => setGameState('overworld')}>Return</button>
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
