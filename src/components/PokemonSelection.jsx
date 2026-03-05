import React, { useEffect, useState } from 'react';
import { fetchPokemon } from '../api/client';

const PokemonSelection = ({ onSelect }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        fetchPokemon().then(setOptions);
    }, []);

    if (options.length === 0) return <div>Loading Pokemon...</div>;

    return (
        <div className="selection-screen">
            <h2>Select Your Starter Pokemon!</h2>
            <div className="battle-menu" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                {options.map(p => (
                    <button key={p.id} onClick={() => onSelect(p)} className="pokemon-card">
                        <img src={p.frontSprite} alt={p.name} style={{ width: '100px', imageRendering: 'pixelated' }} />
                        <h3>{p.name}</h3>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PokemonSelection;
