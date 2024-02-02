
export const STATS_SFX_MAIN = {
    "money": "../sound/cash2.wav",
    "internet": "../sound/ping.wav",
    "law": "../sound/info.wav",
  }
  
  export interface ZoneSats {
      [key: string]: {
        money: number;
        internet: number;
        law: number;
      };
    }
    
    export interface GameState {
      stats: {
        available: {
          money: number
          internet: number
          law: number
        };
        zone: ZoneSats;
      };
    }
  export type StatType = 'money' | 'internet' | 'law';
  
  export const DEFAULT_ICON_LOOKUP:any = {
      '💰': 'money',
      '🌐': 'internet',
      '⚖️': 'law'
  };
  
  export interface BoxData {
      position: [number, number, number];
      color: string;
      zone: string;
  }
  
  export const BASE_ZONE_LIST = ["africa", "america", "antartic", "n.america", "oceania",];