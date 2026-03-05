import { useState, useCallback, useMemo, useEffect } from 'react';
import { generateMap, getRandomSpawn, MAP_SIZE, TERRAIN } from './generateMap';
import { shouldTriggerEncounter } from './encounter';
import { ENEMIES } from './enemies';
import { fetchPlayerState, savePlayerState } from '../api/client';

export const useGame = () => {
    const worldMap = useMemo(() => generateMap(), []);
    const initialPos = useMemo(() => getRandomSpawn(worldMap), [worldMap]);

    const [player, setPlayer] = useState(null);
    const [gameState, setGameState] = useState('loading'); // 'loading', 'selection', 'overworld', 'battle', 'gameover'
    const [battle, setBattle] = useState(null);

    useEffect(() => {
        // Attempt to load existing save
        fetchPlayerState(1).then(savedState => {
            if (savedState) {
                setPlayer(savedState);
                setGameState('overworld');
            } else {
                setGameState('selection'); // No save found, go to starter selection
            }
        });
    }, []);

    const selectStarter = async (pokemon) => {
        const newState = {
            id: 1, // hardcoded for single player for now
            x: initialPos.x,
            y: initialPos.y,
            hp: pokemon.maxHp,
            maxHp: pokemon.maxHp,
            selectedPokemon: pokemon
        };
        await savePlayerState(newState);
        setPlayer(newState);
        setGameState('overworld');
    };

    const move = useCallback((dx, dy) => {
        if (gameState !== 'overworld') return;

        const nx = player.x + dx;
        const ny = player.y + dy;

        if (nx < 0 || nx >= MAP_SIZE || ny < 0 || ny >= MAP_SIZE) return;

        const terrain = worldMap[ny][nx];
        if (terrain === TERRAIN.WATER || terrain === TERRAIN.MOUNTAIN) return;

        setPlayer(prev => ({ ...prev, x: nx, y: ny }));
        // Note: we should auto-save here, but we will leave it to the user or later batch

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

    return { worldMap, player, setPlayer, gameState, setGameState, battle, setBattle, move, selectStarter };
};
