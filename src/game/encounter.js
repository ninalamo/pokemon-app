import { TERRAIN } from "./generateMap";

export const getEncounterRate = (terrain) => {
    switch (terrain) {
        case TERRAIN.GRASS: return 0.05; // 5%
        case TERRAIN.FOREST: return 0.10; // 10%
        case TERRAIN.MOUNTAIN: return 0.15; // 15%
        default: return 0;
    }
};

export const shouldTriggerEncounter = (terrain, stepsSinceLast) => {
    if (stepsSinceLast < 5) return false; // Safe steps
    return Math.random() < getEncounterRate(terrain);
};
