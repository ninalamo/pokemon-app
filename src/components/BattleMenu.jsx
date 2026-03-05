import React from 'react';

const BattleMenu = ({ onAction, disabled }) => {
    return (
        <div className="battle-menu">
            <button onClick={() => onAction('attack')} disabled={disabled}>Attack</button>
            <button onClick={() => onAction('defend')} disabled={disabled}>Defend</button>
            <button onClick={() => onAction('skill')} disabled={disabled}>Skill</button>
            <button onClick={() => onAction('run')} disabled={disabled}>Run</button>
        </div>
    );
};

export default BattleMenu;
