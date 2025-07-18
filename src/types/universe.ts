
export interface Universe {
  title: string;
  description: string;
  theme: string;
  setting: string;
  characters: Array<{
    name: string;
    role: string;
    personality: string;
  }>;
  locations: Array<{
    name: string;
    description: string;
  }>;
  activities: Array<{
    name: string;
    description: string;
    type: string;
  }>;
}

export interface UniverseResponse {
  universe: Universe;
  characters: Array<{
    name: string;
    role: string;
    personality: string;
  }>;
  locations: Array<{
    name: string;
    description: string;
  }>;
  activities: Array<{
    name: string;
    description: string;
    type: string;
  }>;
}
