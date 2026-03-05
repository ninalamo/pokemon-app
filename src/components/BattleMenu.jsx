import React from 'react';

const BattleMenu = ({ skills, onAction, disabled }) => {
    return (
        <div className="battle-menu" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <button onClick={() => onAction({ type: 'skill', skill: skills[0] })} disabled={disabled}>Attack</button>
            <button onClick={() => onAction({ type: 'defend' })} disabled={disabled}>Defend</button>
            <button onClick={() => onAction({ type: 'switch' })} disabled={disabled}>Switch</button>
            <button onClick={() => onAction({ type: 'run' })} disabled={disabled}>Run</button>
        </div>
    );
};

export default BattleMenu;
