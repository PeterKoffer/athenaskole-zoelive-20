
/**
 * Core data structures for the Scenario Engine
 * Phase 1: Basic scenario representation interfaces
 */

/**
 * Represents a single node in a scenario tree/graph
 * Each node can be a question, explanation, activity, or branching point
 */
export interface ScenarioNode {
  /** Unique identifier for this node */
  id: string;
  
  /** Type of scenario node */
  type: 'question' | 'explanation' | 'activity' | 'branching' | 'summary';
  
  /** Display title for this node */
  title: string;
  
  /** Main content/description for this node */
  content: string;
  
  /** Educational metadata */
  educational: {
    /** Subject area (e.g., 'mathematics', 'science', 'english') */
    subject: string;
    
    /** Specific skill or topic being addressed */
    skillArea: string;
    
    /** Difficulty level (1-10) */
    difficultyLevel: number;
    
    /** Estimated time to complete in minutes */
    estimatedDuration: number;
    
    /** Learning objectives for this node */
    learningObjectives: string[];
  };
  
  /** Connections to other nodes */
  connections: {
    /** Default next node (for linear progression) */
    next?: string;
    
    /** Conditional branches based on responses/outcomes */
    branches?: Array<{
      /** Condition that triggers this branch */
      condition: string;
      
      /** Target node ID */
      targetNodeId: string;
      
      /** Optional description of why this branch is taken */
      reason?: string;
    }>;
    
    /** Fallback node if no conditions are met */
    fallback?: string;
  };
  
  /** Node-specific configuration */
  config: {
    /** Whether this node is required or can be skipped */
    required: boolean;
    
    /** Maximum attempts allowed (for questions/activities) */
    maxAttempts?: number;
    
    /** Whether to show hints */
    allowHints: boolean;
    
    /** Custom properties for specific node types */
    customProperties?: Record<string, any>;
  };
  
  /** Optional metadata for tracking and analytics */
  metadata?: {
    /** When this node was created */
    createdAt?: Date;
    
    /** Last modification time */
    updatedAt?: Date;
    
    /** Tags for categorization */
    tags?: string[];
    
    /** Version number for content updates */
    version?: string;
  };
}

/**
 * Basic resource definition (Phase 1 - simple version)
 * Will be expanded in later phases
 */
export interface ScenarioResource {
  /** Unique identifier for the resource */
  id: string;
  
  /** Type of resource */
  type: 'image' | 'video' | 'audio' | 'document' | 'interactive';
  
  /** Display name */
  name: string;
  
  /** URL or path to the resource */
  url: string;
  
  /** Optional description */
  description?: string;
  
  /** Basic metadata */
  metadata?: {
    /** File size in bytes */
    size?: number;
    
    /** MIME type */
    mimeType?: string;
    
    /** Tags for organization */
    tags?: string[];
  };
}

/**
 * Complete scenario definition containing all nodes and metadata
 */
export interface ScenarioDefinition {
  /** Unique identifier for the scenario */
  id: string;
  
  /** Scenario title */
  title: string;
  
  /** Brief description of the scenario */
  description: string;
  
  /** Educational context */
  educational: {
    /** Primary subject area */
    subject: string;
    
    /** Grade level or age range */
    gradeLevel: number;
    
    /** Overall difficulty (1-10) */
    difficulty: number;
    
    /** Estimated total duration in minutes */
    estimatedDuration: number;
    
    /** Key learning outcomes */
    learningOutcomes: string[];
    
    /** Prerequisites or assumed knowledge */
    prerequisites?: string[];
  };
  
  /** All nodes that make up this scenario */
  nodes: ScenarioNode[];
  
  /** Entry point - ID of the first node */
  entryNodeId: string;
  
  /** Possible exit points */
  exitNodeIds: string[];
  
  /** Resources used in this scenario */
  resources?: ScenarioResource[];
  
  /** Scenario configuration */
  config: {
    /** Whether nodes can be revisited */
    allowRevisit: boolean;
    
    /** Whether to save progress automatically */
    autoSave: boolean;
    
    /** Maximum time limit for the entire scenario (minutes) */
    maxDuration?: number;
    
    /** Passing criteria if applicable */
    passingCriteria?: {
      /** Minimum score percentage */
      minScore?: number;
      
      /** Required nodes that must be completed */
      requiredNodes?: string[];
    };
  };
  
  /** Scenario metadata */
  metadata: {
    /** Author/creator information */
    author: string;
    
    /** Creation date */
    createdAt: Date;
    
    /** Last modification date */
    updatedAt: Date;
    
    /** Version number */
    version: string;
    
    /** Status of the scenario */
    status: 'draft' | 'review' | 'published' | 'archived';
    
    /** Tags for categorization and search */
    tags: string[];
    
    /** Usage statistics */
    usage?: {
      /** Number of times used */
      timesUsed: number;
      
      /** Average completion rate */
      avgCompletionRate: number;
      
      /** Average user rating */
      avgRating?: number;
    };
  };
}

/**
 * Runtime state for tracking scenario progress
 * This will be used when students are actively working through scenarios
 */
export interface ScenarioSession {
  /** Unique session identifier */
  sessionId: string;
  
  /** Reference to the scenario being used */
  scenarioId: string;
  
  /** Student/user identifier */
  userId: string;
  
  /** Current state */
  currentNodeId: string;
  
  /** Nodes that have been visited */
  visitedNodes: string[];
  
  /** Responses/data collected during the session */
  responses: Record<string, any>;
  
  /** Session timestamps */
  timestamps: {
    /** When the session started */
    startedAt: Date;
    
    /** Last activity time */
    lastActiveAt: Date;
    
    /** When completed (if applicable) */
    completedAt?: Date;
  };
  
  /** Session status */
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  
  /** Progress metrics */
  progress: {
    /** Percentage complete (0-100) */
    percentComplete: number;
    
    /** Number of nodes completed */
    nodesCompleted: number;
    
    /** Total nodes in scenario */
    totalNodes: number;
    
    /** Current score if applicable */
    score?: number;
  };
}
