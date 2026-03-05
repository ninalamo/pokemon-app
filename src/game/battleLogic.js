const getTimestamp = () => {
    const now = new Date();
    return `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}] `;
};

export const battleAction = (action, player, battle, setPlayer, setBattle) => {
    const { enemy } = battle;
    let newLogs = [];
    let nextTurn = 'enemy';
    let nextEnemy = { ...enemy };

    // damage multiplier based on level
    const damageMult = 1 + (player.level - 1) * 0.1;

    if (action.type === 'skill') {
        const damage = Math.floor(action.skill.damage * damageMult);
        nextEnemy.hp -= damage;
        newLogs.push(`${getTimestamp()}${player.selectedPokemon.name} uses ${action.skill.name} for ${damage} damage!`);
    } else if (action.type === 'run') {
        if (Math.random() > 0.5) {
            return 'escaped';
        } else {
            newLogs.push(`${getTimestamp()}Failed to escape!`);
        }
    }

    if (nextEnemy.hp <= 0) {
        nextEnemy.hp = 0;
        newLogs.push(`${getTimestamp()}Wild ${enemy.name} fainted!`);

        // XP calculation: enemyLevel * 20
        const xpGain = enemy.level * 20;
        newLogs.push(`${getTimestamp()}${player.selectedPokemon.name} gained ${xpGain} XP!`);

        return { ...battle, enemy: nextEnemy, logs: [...battle.logs, ...newLogs], turn: 'win', xpGain };
    }

    return { ...battle, enemy: nextEnemy, logs: [...battle.logs, ...newLogs], turn: nextTurn };
};

export const enemyTurn = (player, battle, setPlayer, setBattle) => {
    const { enemy } = battle;

    let skillName = "Attack";
    let baseDamage = 10;

    if (enemy.skills && enemy.skills.length > 0) {
        const randomSkill = enemy.skills[Math.floor(Math.random() * enemy.skills.length)];
        skillName = randomSkill.name;
        baseDamage = randomSkill.damage;
    }

    // enemy damage multiplier
    const enemyMult = 1 + (enemy.level - 1) * 0.1;
    const damage = Math.floor(baseDamage * enemyMult);

    const newPlayerHp = Math.max(0, player.hp - damage);
    const log = `${getTimestamp()}Wild ${enemy.name} (Lvl ${enemy.level}) uses ${skillName}! ${player.selectedPokemon.name} takes ${damage} damage!`;

    setPlayer(p => ({ ...p, hp: newPlayerHp }));
    setBattle(b => ({
        ...b,
        logs: [...b.logs, log],
        turn: newPlayerHp <= 0 ? 'loss' : 'player',
    }));
};
