// Automation execution engine
// Evaluates triggers, executes action steps sequentially, logs results

import type { AutomationStep } from '@/types/database';

export interface ExecutionContext {
  automationId: string;
  orgId: string;
  triggeredBy: string;
  entityType?: string;
  entityId?: string;
  data: Record<string, unknown>;
}

export interface StepResult {
  stepId: string;
  success: boolean;
  output?: Record<string, unknown>;
  error?: string;
}

export interface ExecutionResult {
  status: 'success' | 'failed';
  stepsCompleted: number;
  results: StepResult[];
  error?: string;
}

// Step executor functions - each handles a specific step type
const stepExecutors: Record<string, (step: AutomationStep, ctx: ExecutionContext) => Promise<StepResult>> = {
  send_email: async (step, _ctx) => {
    // In production: integrate with Resend API
    console.log('[Automation] Send email:', step.config);
    return { stepId: step.id, success: true, output: { sent: true } };
  },
  create_task: async (step, _ctx) => {
    console.log('[Automation] Create task:', step.config);
    return { stepId: step.id, success: true, output: { task_created: true } };
  },
  update_field: async (step, _ctx) => {
    console.log('[Automation] Update field:', step.config);
    return { stepId: step.id, success: true, output: { field_updated: true } };
  },
  add_tag: async (step, _ctx) => {
    console.log('[Automation] Add tag:', step.config);
    return { stepId: step.id, success: true, output: { tag_added: true } };
  },
  remove_tag: async (step, _ctx) => {
    console.log('[Automation] Remove tag:', step.config);
    return { stepId: step.id, success: true, output: { tag_removed: true } };
  },
  change_status: async (step, _ctx) => {
    console.log('[Automation] Change status:', step.config);
    return { stepId: step.id, success: true, output: { status_changed: true } };
  },
  change_deal_stage: async (step, _ctx) => {
    console.log('[Automation] Change deal stage:', step.config);
    return { stepId: step.id, success: true, output: { stage_changed: true } };
  },
  send_webhook: async (step, _ctx) => {
    const url = (step.config as Record<string, string>).url;
    if (!url) return { stepId: step.id, success: false, error: 'No webhook URL configured' };
    console.log('[Automation] Send webhook to:', url);
    return { stepId: step.id, success: true, output: { webhook_sent: true } };
  },
  wait: async (step, _ctx) => {
    const minutes = ((step.config as Record<string, number>).minutes) || 0;
    console.log('[Automation] Wait step:', minutes, 'minutes');
    return { stepId: step.id, success: true, output: { waited: minutes } };
  },
  condition: async (step, _ctx) => {
    console.log('[Automation] Condition check:', step.config);
    return { stepId: step.id, success: true, output: { condition_met: true } };
  },
};

export async function executeAutomation(
  steps: AutomationStep[],
  context: ExecutionContext
): Promise<ExecutionResult> {
  const results: StepResult[] = [];
  let stepsCompleted = 0;

  const sortedSteps = [...steps].sort((a, b) => a.position - b.position);

  for (const step of sortedSteps) {
    try {
      const executor = stepExecutors[step.step_type];
      if (!executor) {
        results.push({ stepId: step.id, success: false, error: `Unknown step type: ${step.step_type}` });
        return { status: 'failed', stepsCompleted, results, error: `Unknown step type: ${step.step_type}` };
      }
      const result = await executor(step, context);
      results.push(result);
      if (!result.success) {
        return { status: 'failed', stepsCompleted, results, error: result.error };
      }
      stepsCompleted++;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      results.push({ stepId: step.id, success: false, error: errorMsg });
      return { status: 'failed', stepsCompleted, results, error: errorMsg };
    }
  }

  return { status: 'success', stepsCompleted, results };
}
