export const battleAction = (type, player, battle, setPlayer, setBattle) => {
    const { enemy } = battle;
    let newLogs = [];
    let nextTurn = 'enemy';
    let nextEnemy = { ...enemy };
    let nextPD = false;

    if (type === 'attack') {
        const damage = player.attack;
        nextEnemy.hp -= damage;
        newLogs.unshift(`Player attacks ${enemy.name} for ${damage} damage!`);
    } else if (type === 'defend') {
        nextPD = true;
        newLogs.unshift(`Player defends!`);
    } else if (type === 'skill') {
        const damage = player.attack * 2;
        nextEnemy.hp -= damage;
        newLogs.unshift(`Player uses Skill! ${enemy.name} takes ${damage} damage!`);
    } else if (type === 'run') {
        if (Math.random() > 0.5) {
            return 'escaped';
        } else {
            newLogs.unshift(`Failed to escape!`);
        }
    }

    if (nextEnemy.hp <= 0) {
        nextEnemy.hp = 0;
        newLogs.unshift(`${enemy.name} was defeated!`);
        return { ...battle, enemy: nextEnemy, logs: [...newLogs, ...battle.logs], turn: 'win' };
    }

    return { ...battle, enemy: nextEnemy, logs: [...newLogs, ...battle.logs], turn: nextTurn, playerDefending: nextPD };
};

export const enemyTurn = (player, battle, setPlayer, setBattle) => {
    const { enemy, playerDefending } = battle;
    let damage = enemy.attack;
    if (playerDefending) damage = Math.floor(damage / 2);

    const newPlayerHp = Math.max(0, player.hp - damage);
    const log = `${enemy.name} attacks! Player takes ${damage} damage!`;

    setPlayer(p => ({ ...p, hp: newPlayerHp }));
    setBattle(b => ({
        ...b,
        logs: [log, ...b.logs],
        turn: newPlayerHp <= 0 ? 'loss' : 'player',
        playerDefending: false
    }));
};
