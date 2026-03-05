import React from 'react';

const GameOver = ({ onRestart }) => {
    return (
        <div className="game-over">
            <h1>GAME OVER</h1>
            <button onClick={onRestart}>Try Again</button>
        </div>
    );
};

export default GameOver;
