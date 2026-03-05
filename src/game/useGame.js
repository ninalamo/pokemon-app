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
                let team = savedState.pokemonTeam;
                let activeIndex = savedState.activePokemonIndex !== undefined ? savedState.activePokemonIndex : 0;

                if (!team) {
                    // Upgrade legacy saves directly to the full 3-starter team
                    team = pokemonList.map(p => ({
                        ...p,
                        hp: p.maxHp,
                        level: 1,
                        experience: 0
                    }));
                    // Set active index to the one they previously selected (if we can find it)
                    if (savedState.selectedPokemon) {
                        const foundIndex = team.findIndex(p => p.id === savedState.selectedPokemon.id);
                        if (foundIndex !== -1) activeIndex = foundIndex;
                    }
                }

                setPlayer({
                    ...savedState, // keeps x, y, id mostly
                    level: 1, // legacy fields, kept for safety 
                    experience: 0,
                    pokemonTeam: team,
                    activePokemonIndex: activeIndex,
                });
                setGameState('overworld');
            } else {
                setGameState('selection');
            }
        });
    }, []);

    const selectStarter = async (pokemon) => {
        // For the demo, we give all 3 starters but make the chosen one active
        const team = allPokemon.map(p => ({
            ...p,
            hp: p.maxHp,
            level: 1,
            experience: 0
        }));

        const selectedIndex = team.findIndex(p => p.id === pokemon.id);

        const newState = {
            id: 1,
            x: initialPos.x,
            y: initialPos.y,
            pokemonTeam: team,
            activePokemonIndex: selectedIndex
        };
        try {
            await savePlayerState(newState);
            setPlayer(newState);
            setGameState('overworld');
        } catch (err) {
            setPlayer(newState);
            setGameState('overworld');
        }
    };

    const switchPokemon = useCallback((index) => {
        if (gameState !== 'overworld' && gameState !== 'battle') return;
        setPlayer(prev => ({ ...prev, activePokemonIndex: index }));
    }, [gameState]);

    const move = useCallback((dx, dy) => {
        if (gameState !== 'overworld') return;

        const nx = player.x + dx;
        const ny = player.y + dy;

        if (nx < 0 || nx >= MAP_SIZE || ny < 0 || ny >= MAP_SIZE) return;

        const terrain = worldMap[ny][nx];
        if (terrain === TERRAIN.WATER || terrain === TERRAIN.MOUNTAIN) return;

        // Team-wide Healing: +1 HP per step for everyone
        const updatedTeam = player.pokemonTeam.map(p => ({
            ...p,
            hp: Math.min(p.maxHp, p.hp + 1)
        }));

        setPlayer(prev => ({
            ...prev,
            x: nx,
            y: ny,
            pokemonTeam: updatedTeam
        }));
        setStepsSinceLast(prev => prev + 1);

        if (shouldTriggerEncounter(terrain, stepsSinceLast + 1) && allPokemon.length > 0) {
            const enemyBase = allPokemon[Math.floor(Math.random() * allPokemon.length)];
            const activePoke = updatedTeam[player.activePokemonIndex];

            const minLvl = Math.max(1, activePoke.level - 2);
            const maxLvl = activePoke.level + 5;
            const enemyLevel = Math.floor(Math.random() * (maxLvl - minLvl + 1)) + minLvl;
            const enemyHp = enemyBase.maxHp + (enemyLevel - 1) * 15;

            setBattle({
                enemy: { ...enemyBase, level: enemyLevel, hp: enemyHp, maxHp: enemyHp },
                logs: [`A wild ${enemyBase.name} (Lvl ${enemyLevel}) appeared!`],
                turn: 'player'
            });
            setGameState('battle');
            setStepsSinceLast(0);
        }
    }, [player, worldMap, gameState, allPokemon, stepsSinceLast]);

    const handleBattleEnd = useCallback(async (result) => {
        if (result.type === 'win') {
            const activePoke = player.pokemonTeam[player.activePokemonIndex];
            let newExp = activePoke.experience + result.xpGain;
            let newLevel = activePoke.level;
            let newMaxHp = activePoke.maxHp;
            let newHp = activePoke.hp;

            const xpNeeded = activePoke.level * 100;
            if (newExp >= xpNeeded) {
                newExp -= xpNeeded;
                newLevel += 1;
                newMaxHp += 20;
                newHp = newMaxHp;
                console.log(`Level Up! ${activePoke.name} is now Level ${newLevel}`);
            }

            const updatedTeam = [...player.pokemonTeam];
            updatedTeam[player.activePokemonIndex] = {
                ...activePoke,
                experience: newExp,
                level: newLevel,
                maxHp: newMaxHp,
                hp: newHp
            };

            const updatedPlayer = { ...player, pokemonTeam: updatedTeam };
            setPlayer(updatedPlayer);
            await savePlayerState(updatedPlayer);
        }
        setGameState('overworld');
    }, [player]);

    return { worldMap, player, setPlayer, gameState, setGameState, battle, setBattle, move, selectStarter, switchPokemon, handleBattleEnd };
};
