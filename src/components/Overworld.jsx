import React, { useEffect } from 'react';
import Tile from './Tile';
import { MAP_SIZE } from '../game/generateMap';
import HUD from './HUD';

const Overworld = ({ worldMap, player, move }) => {
    const VIEWPORT_SIZE = 9;
    const HALF_VIEWPORT = Math.floor(VIEWPORT_SIZE / 2);

    // Viewport logic: centered but clamped
    let startX = player.x - HALF_VIEWPORT;
    let startY = player.y - HALF_VIEWPORT;

    startX = Math.max(0, Math.min(startX, MAP_SIZE - VIEWPORT_SIZE));
    startY = Math.max(0, Math.min(startY, MAP_SIZE - VIEWPORT_SIZE));

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowUp') move(0, -1);
            if (e.key === 'ArrowDown') move(0, 1);
            if (e.key === 'ArrowLeft') move(-1, 0);
            if (e.key === 'ArrowRight') move(1, 0);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [move]);

    const tiles = [];
    for (let y = startY; y < startY + VIEWPORT_SIZE; y++) {
        for (let x = startX; x < startX + VIEWPORT_SIZE; x++) {
            tiles.push(
                <Tile
                    key={`${x}-${y}`}
                    terrain={worldMap[y][x]}
                    hasHero={player.x === x && player.y === y}
                />
            );
        }
    }

    return (
        <div className="overworld-container">
            <HUD player={player} />
            <div className="viewport-grid">
                {tiles}
            </div>
        </div>
    );
};

export default Overworld;
