import { GLOBAL_SUPER_STATE } from "./global";
import { BoxData, GameState } from "./zones";

const ZONES = Object.keys(GLOBAL_SUPER_STATE)

export const DEFAULT_INITIAL_STATE: GameState = {
  stats: {
    available: {
      money: 5,
      internet: 5,
      law: 5,
    },
    zone: ZONES.reduce((acc:any, zone) => {
      acc[zone] = GLOBAL_SUPER_STATE[zone].INITIAL_STATS_ZONE;
      return acc;
    }, {})
  }
};

export const ZONE_SHAPES = ZONES.reduce((acc:any, zone) => {
  acc[zone] = GLOBAL_SUPER_STATE[zone].MODEL_SHAPE;
  return acc;
}, {});

export const ZONES_TO_POSITIONS = ZONES.reduce((acc:any, zone) => {
  acc[zone] = GLOBAL_SUPER_STATE[zone].POSITION;
  return acc;
}, {});

export const ZONES_COLOR_POSITIONS: BoxData[] = ZONES.map(zone => ({
  position: GLOBAL_SUPER_STATE[zone].POSITION,
  zone: zone,
  color: GLOBAL_SUPER_STATE[zone].BASE_COLOR, // Assuming getColorForZone is a function that returns a color based on the zone
}));


export const POSITION_COLOR_LOOKUP = ZONES_COLOR_POSITIONS.reduce((acc:any, { position, color }:any) => {
    acc[position.join(',')] = color;
    return acc;
}, {} as {[key: string]: string});

export const ZONE_TO_MUTECOLOR = ZONES.reduce((acc:any, zone) => {
  acc[zone] = GLOBAL_SUPER_STATE[zone].MUTED_COLOR;
  return acc;
}, {});


export const REGION_LOCAL_POSITIONS = ZONES.reduce((acc:any, zone) => {
  acc[zone] = GLOBAL_SUPER_STATE[zone].LOCAL_POSITION;
  return acc;
}, {});