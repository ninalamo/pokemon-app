import { useState, useCallback, useMemo, useEffect } from 'react';
import { generateMap, getRandomSpawn, MAP_SIZE, TERRAIN } from './generateMap';
import { shouldTriggerEncounter } from './encounter';
import { fetchPlayerState, savePlayerState, fetchPokemon } from '../api/client';

export const useGame = () => {
    const worldMap = useMemo(() => generateMap(), []);
    const initialPos = useMemo(() => getRandomSpawn(worldMap), [worldMap]);

    const [allPokemon, setAllPokemon] = useState([]);
    const [player, setPlayer] = useState(null);
    const [gameState, setGameState] = useState('loading');
    const [battle, setBattle] = useState(null);
    const [stepsSinceLast, setStepsSinceLast] = useState(0);

    useEffect(() => {
        fetchPokemon().then(pokemonList => {
            setAllPokemon(pokemonList);
            return fetchPlayerState(1);
        }).then(savedState => {
            if (savedState) {
                // Ensure new fields exist for legacy saves
                setPlayer({
                    level: 1,
                    experience: 0,
                    ...savedState
                });
                setGameState('overworld');
            } else {
                setGameState('selection');
            }
        });
    }, []);

    const selectStarter = async (pokemon) => {
        const newState = {
            id: 1,
            x: initialPos.x,
            y: initialPos.y,
            hp: pokemon.maxHp,
            maxHp: pokemon.maxHp,
            level: 1,
            experience: 0,
            selectedPokemon: pokemon
        };
        // ... rest of selectStarter ...
        try {
            await savePlayerState(newState);
            setPlayer(newState);
            setGameState('overworld');
        } catch (err) {
            setPlayer(newState);
            setGameState('overworld');
        }
    };

    const move = useCallback((dx, dy) => {
        if (gameState !== 'overworld') return;

        const nx = player.x + dx;
        const ny = player.y + dy;

        if (nx < 0 || nx >= MAP_SIZE || ny < 0 || ny >= MAP_SIZE) return;

        const terrain = worldMap[ny][nx];
        if (terrain === TERRAIN.WATER || terrain === TERRAIN.MOUNTAIN) return;

        // HP Replenish: +1 HP per step
        const newHp = Math.min(player.maxHp, player.hp + 1);
        const newSteps = stepsSinceLast + 1;

        setPlayer(prev => ({ ...prev, x: nx, y: ny, hp: newHp }));
        setStepsSinceLast(newSteps);

        if (shouldTriggerEncounter(terrain, newSteps) && allPokemon.length > 0) {
            const enemyBase = allPokemon[Math.floor(Math.random() * allPokemon.length)];

            // Random Enemy Level: player.level - 2 to player.level + 5
            const minLvl = Math.max(1, player.level - 2);
            const maxLvl = player.level + 5;
            const enemyLevel = Math.floor(Math.random() * (maxLvl - minLvl + 1)) + minLvl;

            // Scale enemy stats
            const enemyHp = enemyBase.maxHp + (enemyLevel - 1) * 15;

            setBattle({
                enemy: {
                    ...enemyBase,
                    level: enemyLevel,
                    hp: enemyHp,
                    maxHp: enemyHp
                },
                logs: [`A wild ${enemyBase.name} (Lvl ${enemyLevel}) appeared!`],
                turn: 'player'
            });
            setGameState('battle');
            setStepsSinceLast(0);
        }
    }, [player, worldMap, gameState, allPokemon, stepsSinceLast]);

    const handleBattleEnd = useCallback(async (result) => {
        if (result.type === 'win') {
            const xpGain = result.xpGain;
            let newExp = player.experience + xpGain;
            let newLevel = player.level;
            let newMaxHp = player.maxHp;
            let newHp = player.hp;

            // Level Up logic: Level * 100
            const xpNeeded = player.level * 100;
            if (newExp >= xpNeeded) {
                newExp -= xpNeeded;
                newLevel += 1;
                newMaxHp += 20; // +20 HP per level
                newHp = newMaxHp; // Heal to full on level up
                console.log(`Level Up! Now Level ${newLevel}`);
            }

            const updatedPlayer = {
                ...player,
                experience: newExp,
                level: newLevel,
                maxHp: newMaxHp,
                hp: newHp
            };

            setPlayer(updatedPlayer);
            await savePlayerState(updatedPlayer);
        }
        setGameState('overworld');
    }, [player]);

    return { worldMap, player, setPlayer, gameState, setGameState, battle, setBattle, move, selectStarter, handleBattleEnd };
};
