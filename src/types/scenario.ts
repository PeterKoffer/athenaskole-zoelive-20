// src/types/scenario.ts

/**
 * Represents a single point or step within a scenario.
 * It can present information and/or offer decision options to the learner.
 */
export interface ScenarioNode {
  id: string; // Unique identifier for this node within the scenario
  scenarioId: string; // Identifier of the scenario this node belongs to

  title?: string; // Optional title for this node or situation
  description: string; // Main text content describing the situation or information

  // Optional multimedia element to display for this node
  multimedia?: {
    type: 'image' | 'audio' | 'video';
    url: string; // URL to the multimedia asset
    altText?: string; // Alt text for images, or caption/description
  };

  // Decision options available to the learner at this node
  // If undefined or empty, this node might be informational or an endpoint.
  decisionOptions?: Array<{
    text: string; // Text displayed for the decision option
    nextNodeId: string; // ID of the ScenarioNode to transition to if this option is chosen
    feedback?: string; // Optional immediate feedback to show when this option is chosen
    resourceChanges?: Record<string, number>; // Optional changes to resources (e.g., { budget: -100, time: 1 })
  }>;

  isEndPoint?: boolean; // Optional flag to indicate if this node is a terminal point of a scenario path
  kc_ids?: string[]; // Optional: Knowledge Components related to this node or the decision made here
}

/**
 * Defines a resource that can be tracked within a scenario (e.g., budget, time, score).
 * This is a stretch goal for Phase 1, initial scenarios might not use resources.
 */
export interface ScenarioResource {
  id: string; // Unique identifier for the resource (e.g., 'budget', 'time_remaining', 'reputation_score')
  label: string; // Displayable label for the resource (e.g., "Budget", "Time Left")
  initialValue: number;
  minValue?: number; // Optional minimum value for the resource
  maxValue?: number; // Optional maximum value for the resource
}

/**
 * Defines the overall structure for a scenario.
 * It contains all nodes, the starting point, and general information.
 */
export interface ScenarioDefinition {
  id: string; // Unique identifier for the entire scenario
  title: string; // Title of the scenario
  description: string; // Overall description or learning objectives for the scenario
  startNodeId: string; // The ID of the ScenarioNode where the scenario begins

  nodes: Record<string, ScenarioNode>; // A dictionary of all nodes in the scenario, keyed by their 'id'

  resources?: ScenarioResource[]; // Optional: Definitions of resources used in this scenario
}
