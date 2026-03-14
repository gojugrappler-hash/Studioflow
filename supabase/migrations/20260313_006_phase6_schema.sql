-- ============================================================
-- STUDIOFLOW  Phase 6 Database Migration  Automation & AI
-- ============================================================

-- 1. AUTOMATIONS
CREATE TABLE IF NOT EXISTS public.automations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN (
    'contact_created', 'contact_updated', 'deal_stage_changed', 'deal_created',
    'form_submitted', 'task_completed', 'invoice_paid', 'manual', 'webhook_received', 'scheduled'
  )),
  trigger_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT false,
  run_count INT DEFAULT 0,
  last_run_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- 2. AUTOMATION_STEPS
CREATE TABLE IF NOT EXISTS public.automation_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id UUID REFERENCES public.automations(id) ON DELETE CASCADE NOT NULL,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  step_type TEXT NOT NULL CHECK (step_type IN (
    'send_email', 'create_task', 'update_field', 'add_tag', 'remove_tag',
    'change_status', 'change_deal_stage', 'send_webhook', 'wait', 'condition'
  )),
  config JSONB DEFAULT '{}',
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. AUTOMATION_LOGS
CREATE TABLE IF NOT EXISTS public.automation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id UUID REFERENCES public.automations(id) ON DELETE CASCADE NOT NULL,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'success', 'failed', 'skipped')),
  triggered_by TEXT,
  entity_type TEXT,
  entity_id UUID,
  steps_completed INT DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

-- 4. AI_CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type TEXT,
  entity_id UUID,
  model TEXT DEFAULT 'gemini-2.0-flash',
  messages JSONB DEFAULT '[]',
  total_tokens INT DEFAULT 0,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. WEBHOOK_ENDPOINTS
CREATE TABLE IF NOT EXISTS public.webhook_endpoints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] DEFAULT '{}',
  secret TEXT,
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  failure_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_automations_org_id ON public.automations(org_id);
CREATE INDEX IF NOT EXISTS idx_automations_trigger ON public.automations(trigger_type);
CREATE INDEX IF NOT EXISTS idx_automations_active ON public.automations(is_active);
CREATE INDEX IF NOT EXISTS idx_automation_steps_automation ON public.automation_steps(automation_id);
CREATE INDEX IF NOT EXISTS idx_automation_steps_position ON public.automation_steps(automation_id, position);
CREATE INDEX IF NOT EXISTS idx_automation_logs_automation ON public.automation_logs(automation_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_org ON public.automation_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_status ON public.automation_logs(status);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_org ON public.ai_conversations(org_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_entity ON public.ai_conversations(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_org ON public.webhook_endpoints(org_id);
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_active ON public.webhook_endpoints(is_active);

-- ROW LEVEL SECURITY
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_endpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view org automations" ON public.automations FOR SELECT USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert org automations" ON public.automations FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can update org automations" ON public.automations FOR UPDATE USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete org automations" ON public.automations FOR DELETE USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can view org automation steps" ON public.automation_steps FOR SELECT USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert org automation steps" ON public.automation_steps FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can update org automation steps" ON public.automation_steps FOR UPDATE USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete org automation steps" ON public.automation_steps FOR DELETE USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can view org automation logs" ON public.automation_logs FOR SELECT USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert org automation logs" ON public.automation_logs FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own ai conversations" ON public.ai_conversations FOR SELECT USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert ai conversations" ON public.ai_conversations FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own ai conversations" ON public.ai_conversations FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own ai conversations" ON public.ai_conversations FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view org webhook endpoints" ON public.webhook_endpoints FOR SELECT USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert org webhook endpoints" ON public.webhook_endpoints FOR INSERT WITH CHECK (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can update org webhook endpoints" ON public.webhook_endpoints FOR UPDATE USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete org webhook endpoints" ON public.webhook_endpoints FOR DELETE USING (org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can insert automation logs via webhook" ON public.automation_logs FOR INSERT WITH CHECK (true);

-- TRIGGERS
CREATE TRIGGER set_updated_at_automations BEFORE UPDATE ON public.automations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_automation_steps BEFORE UPDATE ON public.automation_steps FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_ai_conversations BEFORE UPDATE ON public.ai_conversations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_webhook_endpoints BEFORE UPDATE ON public.webhook_endpoints FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.increment_automation_runs()
RETURNS TRIGGER AS c:\Users\Campk\.gemini\antigravity\brain\8327bd9e-8479-46fd-82ab-44d98ebc7311\studioflowc:\Users\Campk\.gemini\antigravity\brain\8327bd9e-8479-46fd-82ab-44d98ebc7311\studioflow
BEGIN
  IF NEW.status = 'success' THEN
    UPDATE public.automations SET run_count = run_count + 1, last_run_at = now() WHERE id = NEW.automation_id;
  END IF;
  RETURN NEW;
END;
c:\Users\Campk\.gemini\antigravity\brain\8327bd9e-8479-46fd-82ab-44d98ebc7311\studioflowc:\Users\Campk\.gemini\antigravity\brain\8327bd9e-8479-46fd-82ab-44d98ebc7311\studioflow LANGUAGE plpgsql;

CREATE TRIGGER inc_automation_run_count
  AFTER UPDATE ON public.automation_logs
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'success')
  EXECUTE FUNCTION public.increment_automation_runs();
