const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const MODE = import.meta.env.VITE_API_MODE || 'local';

// Placeholder local data
const localData = {
    pokemon: [
        { id: 1, name: "Bulbasaur", maxHp: 45, frontSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png", backSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png", skills: [{ name: "Tackle", damage: 10, type: "Normal" }, { name: "Vine Whip", damage: 15, type: "Grass" }] },
        { id: 4, name: "Charmander", maxHp: 39, frontSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png", backSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png", skills: [{ name: "Scratch", damage: 10, type: "Normal" }, { name: "Ember", damage: 15, type: "Fire" }] },
        { id: 7, name: "Squirtle", maxHp: 44, frontSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png", backSprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/7.png", skills: [{ name: "Tackle", damage: 10, type: "Normal" }, { name: "Water Gun", damage: 15, type: "Water" }] }
    ]
};

export const fetchPokemon = async () => {
    if (MODE === 'local') return localData.pokemon;
    const res = await fetch(`${API_URL}/pokemon`);
    return res.json();
};

export const fetchPlayerState = async (playerId = 1) => {
    if (MODE === 'local') return null; // Force new game in local mode
    const res = await fetch(`${API_URL}/playerState/${playerId}`);
    if (!res.ok) return null;
    return res.json();
};

export const savePlayerState = async (state) => {
    if (MODE === 'local') return state;

    console.log("Attempting to save state:", state);

    try {
        // First try to PUT (update existing)
        let res = await fetch(`${API_URL}/playerState/${state.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state)
        });

        // If we get a 404, it means it doesn't exist, so we POST instead
        if (res.status === 404) {
            console.log("Save not found, creating new state...");
            res = await fetch(`${API_URL}/playerState`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state)
            });
        }

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();
        console.log("Successfully saved state:", data);
        return data;
    } catch (error) {
        console.error("Failed to save player state:", error);
        // Even if API fails, we return the state so the game can continue in-memory
        return state;
    }
};
