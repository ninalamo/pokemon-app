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
    if (MODE === 'local') return state; // Don't persist in local mode
    const method = state.id ? 'PUT' : 'POST';
    const url = state.id ? `${API_URL}/playerState/${state.id}` : `${API_URL}/playerState`;

    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
    });
    return res.json();
};
