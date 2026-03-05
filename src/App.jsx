import React from 'react';
import { useGame } from './game/useGame';
import Overworld from './components/Overworld';
import Battle from './components/Battle';
import GameOver from './components/GameOver';

function App() {
    const {
        worldMap,
        player,
        setPlayer,
        gameState,
        setGameState,
        battle,
        setBattle,
        move
    } = useGame();

    const handleRestart = () => {
        window.location.reload();
    };

    return (
        <div className="app-container">
            {gameState === 'overworld' && (
                <>
                    <h1>Overworld</h1>
                    <p>Use Arrow Keys to move</p>
                    <Overworld worldMap={worldMap} player={player} move={move} />
                </>
            )}

            {gameState === 'battle' && (
                <Battle
                    player={player}
                    setPlayer={setPlayer}
                    battle={battle}
                    setBattle={setBattle}
                    setGameState={setGameState}
                />
            )}

            {gameState === 'gameover' || player.hp <= 0 && (
                <GameOver onRestart={handleRestart} />
            )}
        </div>
    );
}

export default App;
