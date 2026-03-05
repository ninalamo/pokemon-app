export const MAP_SIZE = 32;

export const TERRAIN = {
    GRASS: 'grass',
    FOREST: 'forest',
    MOUNTAIN: 'mountain',
    WATER: 'water',
    TOWN: 'town'
};

export const generateMap = () => {
    const map = Array(MAP_SIZE).fill(null).map(() => Array(MAP_SIZE).fill(TERRAIN.GRASS));

    // Helper to place clusters
    const placeCluster = (terrain, count, size) => {
        for (let i = 0; i < count; i++) {
            let rx = Math.floor(Math.random() * MAP_SIZE);
            let ry = Math.floor(Math.random() * MAP_SIZE);
            for (let j = 0; j < size; j++) {
                const nx = (rx + Math.floor(Math.random() * 3) - 1 + MAP_SIZE) % MAP_SIZE;
                const ny = (ry + Math.floor(Math.random() * 3) - 1 + MAP_SIZE) % MAP_SIZE;
                map[ny][nx] = terrain;
                rx = nx;
                ry = ny;
            }
        }
    };

    placeCluster(TERRAIN.WATER, 3, 40);
    placeCluster(TERRAIN.MOUNTAIN, 4, 25);
    placeCluster(TERRAIN.FOREST, 5, 35);

    // Place towns
    const townCount = Math.floor(Math.random() * 3) + 1;
    let placedTowns = 0;
    while (placedTowns < townCount) {
        const tx = Math.floor(Math.random() * MAP_SIZE);
        const ty = Math.floor(Math.random() * MAP_SIZE);
        if (map[ty][tx] === TERRAIN.GRASS) {
            map[ty][tx] = TERRAIN.TOWN;
            placedTowns++;
        }
    }

    return map;
};

export const getRandomSpawn = (map) => {
    while (true) {
        const x = Math.floor(Math.random() * MAP_SIZE);
        const y = Math.floor(Math.random() * MAP_SIZE);
        if (map[y][x] === TERRAIN.GRASS) return { x, y };
    }
};
