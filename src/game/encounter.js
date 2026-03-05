import { TERRAIN } from "./generateMap";

export const getEncounterRate = (terrain) => {
    switch (terrain) {
        case TERRAIN.GRASS: return 0.10;
        case TERRAIN.FOREST: return 0.20;
        case TERRAIN.MOUNTAIN: return 0.30;
        default: return 0;
    }
};

export const shouldTriggerEncounter = (terrain) => {
    return Math.random() < getEncounterRate(terrain);
};
