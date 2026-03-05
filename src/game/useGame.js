import { useState, useCallback, useMemo, useEffect } from 'react';
import { generateMap, getRandomSpawn, MAP_SIZE, TERRAIN } from './generateMap';
import { shouldTriggerEncounter } from './encounter';
import { fetchPlayerState, savePlayerState, fetchPokemon } from '../api/client';

export const useGame = () => {
    const worldMap = useMemo(() => generateMap(), []);
    const initialPos = useMemo(() => getRandomSpawn(worldMap), [worldMap]);

    const [allPokemon, setAllPokemon] = useState([]);
    const [player, setPlayer] = useState(null);
    const [gameState, setGameState] = useState('loading'); // 'loading', 'selection', 'overworld', 'battle', 'gameover'
    const [battle, setBattle] = useState(null);

    useEffect(() => {
        // Fetch wild pokemon list for encounters, then attempt to load existing save
        fetchPokemon().then(pokemonList => {
            setAllPokemon(pokemonList);
            return fetchPlayerState(1);
        }).then(savedState => {
            if (savedState) {
                setPlayer(savedState);
                setGameState('overworld');
            } else {
                setGameState('selection'); // No save found, go to starter selection
            }
        });
    }, []);

    const selectStarter = async (pokemon) => {
        console.log("Selecting starter:", pokemon);
        const newState = {
            id: 1, // hardcoded for single player for now
            x: initialPos.x,
            y: initialPos.y,
            hp: pokemon.maxHp,
            maxHp: pokemon.maxHp,
            selectedPokemon: pokemon
        };
        try {
            await savePlayerState(newState);
            console.log("Starter selection saved, transitioning to overworld.");
            setPlayer(newState);
            setGameState('overworld');
        } catch (err) {
            console.error("Error in selectStarter:", err);
            // Fallback anyway so the game is playable
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

        setPlayer(prev => ({ ...prev, x: nx, y: ny }));
        // Note: we can trigger a save in the background if we want, but omitting to prevent lag on every step.

        if (shouldTriggerEncounter(terrain) && allPokemon.length > 0) {
            // Pick random Pokemon for encounter
            const enemyBase = allPokemon[Math.floor(Math.random() * allPokemon.length)];
            setBattle({
                enemy: { ...enemyBase, hp: enemyBase.maxHp },
                logs: [`A wild ${enemyBase.name} appeared!`],
                turn: 'player'
            });
            setGameState('battle');
        }
    }, [player, worldMap, gameState, allPokemon]);

    return { worldMap, player, setPlayer, gameState, setGameState, battle, setBattle, move, selectStarter };
};
