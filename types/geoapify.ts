export interface GeoapifyResponse {
  features: Feature[];
  properties: Properties2;
  type: string;
}

interface Properties2 {
  mode: string;
  waypoints: Waypoint2[];
  units: string;
}

interface Waypoint2 {
  lat: number;
  lon: number;
}

interface Feature {
  type: string;
  properties: Properties;
  geometry: Geometry;
}

interface Geometry {
  type: string;
  coordinates: number[][][];
}

interface Properties {
  mode: string;
  waypoints: Waypoint[];
  units: string;
  distance: number;
  distance_units: string;
  time: number;
  legs: Leg[];
}

interface Leg {
  distance: number;
  time: number;
  steps: Step[];
}

interface Step {
  from_index: number;
  to_index: number;
  distance: number;
  time: number;
  instruction: Instruction;
}

interface Instruction {
  text: string;
}

interface Waypoint {
  location: number[];
  original_index: number;
}
