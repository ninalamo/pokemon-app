import React from 'react';
import { useGame } from './game/useGame';
import Overworld from './components/Overworld';
import Battle from './components/Battle';
import GameOver from './components/GameOver';
import PokemonSelection from './components/PokemonSelection';

function App() {
    const {
        worldMap,
        player,
        setPlayer,
        gameState,
        setGameState,
        battle,
        setBattle,
        move,
        selectStarter,
        handleBattleEnd
    } = useGame();

    const handleRestart = () => {
        window.location.reload();
    };

    return (
        <div className="app-container">
            {gameState === 'loading' && <h2>Loading Game...</h2>}

            {gameState === 'selection' && <PokemonSelection onSelect={selectStarter} />}

            {gameState === 'overworld' && player && (
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
                    handleBattleEnd={handleBattleEnd}
                />
            )}

            {(gameState === 'gameover' || (player && player.hp <= 0 && gameState !== 'battle')) && (
                <GameOver onRestart={handleRestart} />
            )}
        </div>
    );
}

export default App;
