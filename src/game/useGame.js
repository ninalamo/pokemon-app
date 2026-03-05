import { useState, useCallback, useMemo } from 'react';
import { generateMap, getRandomSpawn, MAP_SIZE, TERRAIN } from './generateMap';
import { shouldTriggerEncounter } from './encounter';
import { ENEMIES } from './enemies';

export const useGame = () => {
    const worldMap = useMemo(() => generateMap(), []);
    const initialPos = useMemo(() => getRandomSpawn(worldMap), [worldMap]);

    const [player, setPlayer] = useState({
        x: initialPos.x,
        y: initialPos.y,
        hp: 100,
        maxHp: 100,
        attack: 10
    });

    const [gameState, setGameState] = useState('overworld'); // 'overworld', 'battle', 'gameover'
    const [battle, setBattle] = useState(null);

    const move = useCallback((dx, dy) => {
        if (gameState !== 'overworld') return;

        const nx = player.x + dx;
        const ny = player.y + dy;

        if (nx < 0 || nx >= MAP_SIZE || ny < 0 || ny >= MAP_SIZE) return;

        const terrain = worldMap[ny][nx];
        if (terrain === TERRAIN.WATER || terrain === TERRAIN.MOUNTAIN) return;

        setPlayer(prev => ({ ...prev, x: nx, y: ny }));

        if (shouldTriggerEncounter(terrain)) {
            const enemyBase = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];
            setBattle({
                enemy: { ...enemyBase, hp: enemyBase.maxHp },
                logs: [`A wild ${enemyBase.name} appeared!`],
                turn: 'player',
                playerDefending: false
            });
            setGameState('battle');
        }
    }, [player, worldMap, gameState]);

    return { worldMap, player, setPlayer, gameState, setGameState, battle, setBattle, move };
};
