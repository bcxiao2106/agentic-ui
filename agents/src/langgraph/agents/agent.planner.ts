export interface Agent {
  name: string;
  run?: (...args: any[]) => Promise<any>;
}

export const plannerAgent: Agent = {
  name: 'planner',
  async run(task: any) {
    // Planner coordinates domain, UI and localization agents.
    // This is a stub for the real implementation.
    return Promise.resolve({ status: 'not-implemented', task });
  },
};
// Planner agent for coordination and task planning
// This file will contain the planner agent implementation

export class PlannerAgent {
  // TODO: Implement planner agent logic
}