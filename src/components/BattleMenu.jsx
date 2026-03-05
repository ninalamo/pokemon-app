import React from 'react';

const BattleMenu = ({ skills, onAction, disabled }) => {
    return (
        <div className="battle-menu" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {skills.map((skill, i) => (
                <button
                    key={i}
                    onClick={() => onAction({ type: 'skill', skill })}
                    disabled={disabled}
                >
                    {skill.name} ({skill.type})
                </button>
            ))}
            <button onClick={() => onAction({ type: 'run' })} disabled={disabled}>Run</button>
        </div>
    );
};

export default BattleMenu;
