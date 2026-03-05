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

    const handleAction = (type) => {
        const result = battleAction(type, player, battle, setPlayer, setBattle);
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

    return (
        <div className="battle-screen">
            <div className="battle-entities">
                <div className="entity-info">
                    <h3>{enemy.name}</h3>
                    <p>HP: {enemy.hp} / {enemy.maxHp}</p>
                </div>
                <div className="entity-info">
                    <h3>Player</h3>
                    <p>HP: {player.hp} / {player.maxHp}</p>
                </div>
            </div>

            <div className="logs">
                {logs.map((l, i) => <p key={i}>{l}</p>)}
            </div>

            <BattleMenu onAction={handleAction} disabled={turn !== 'player'} />
        </div>
    );
};

export default Battle;
