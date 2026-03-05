export const battleAction = (action, player, battle, setPlayer, setBattle) => {
    const { enemy } = battle;
    let newLogs = [];
    let nextTurn = 'enemy';
    let nextEnemy = { ...enemy };

    if (action.type === 'skill') {
        const damage = action.skill.damage;
        nextEnemy.hp -= damage;
        newLogs.unshift(`${player.selectedPokemon.name} uses ${action.skill.name} for ${damage} damage!`);
    } else if (action.type === 'run') {
        if (Math.random() > 0.5) {
            return 'escaped';
        } else {
            newLogs.unshift(`Failed to escape!`);
        }
    }

    if (nextEnemy.hp <= 0) {
        nextEnemy.hp = 0;
        newLogs.unshift(`Wild ${enemy.name} fainted!`);
        // Basic encounter won tracking could live here
        return { ...battle, enemy: nextEnemy, logs: [...newLogs, ...battle.logs], turn: 'win' };
    }

    return { ...battle, enemy: nextEnemy, logs: [...newLogs, ...battle.logs], turn: nextTurn };
};

export const enemyTurn = (player, battle, setPlayer, setBattle) => {
    const { enemy } = battle;

    // Enemy uses a random skill if they have them, else basic attack
    let skillName = "Attack";
    let damage = 10;

    if (enemy.skills && enemy.skills.length > 0) {
        const randomSkill = enemy.skills[Math.floor(Math.random() * enemy.skills.length)];
        skillName = randomSkill.name;
        damage = randomSkill.damage;
    }

    const newPlayerHp = Math.max(0, player.hp - damage);
    const log = `Wild ${enemy.name} uses ${skillName}! ${player.selectedPokemon.name} takes ${damage} damage!`;

    setPlayer(p => ({ ...p, hp: newPlayerHp }));
    setBattle(b => ({
        ...b,
        logs: [log, ...b.logs],
        turn: newPlayerHp <= 0 ? 'loss' : 'player',
    }));
};
