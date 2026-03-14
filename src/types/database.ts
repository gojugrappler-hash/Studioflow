// Studioflow Database Types  Phase 2

export type UserRole = 'owner' | 'admin' | 'manager' | 'member' | 'viewer' | 'client';
export type ContactStatus = 'lead' | 'prospect' | 'active' | 'inactive' | 'archived';
export type ContactSource = 'manual' | 'website' | 'referral' | 'social' | 'walk_in' | 'other';
export type Industry = 'tattoo' | 'photography' | 'other';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  industry: Industry;
  logo_url: string | null;
  field_config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  org_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  role: UserRole;
  email: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrgMember {
  id: string;
  org_id: string;
  user_id: string;
  role: UserRole;
  invited_at: string;
  joined_at: string | null;
}

export interface Contact {
  id: string;
  org_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company_id: string | null;
  status: ContactStatus;
  source: ContactSource;
  avatar_url: string | null;
  notes: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  instagram: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Joined
  company?: Company | null;
  tags?: Tag[];
}

export interface Company {
  id: string;
  org_id: string;
  name: string;
  industry: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Joined
  contact_count?: number;
}

export interface Pipeline {
  id: string;
  org_id: string;
  name: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  stages?: PipelineStage[];
}

export interface PipelineStage {
  id: string;
  pipeline_id: string;
  org_id: string;
  name: string;
  color: string;
  position: number;
  is_won: boolean;
  is_lost: boolean;
  created_at: string;
}

export interface Deal {
  id: string;
  org_id: string;
  pipeline_id: string;
  stage_id: string | null;
  contact_id: string | null;
  company_id: string | null;
  title: string;
  value: number;
  currency: string;
  expected_close_date: string | null;
  assigned_to: string | null;
  notes: string | null;
  position: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  deleted_at: string | null;
  // Joined
  contact?: Contact | null;
  company?: Company | null;
  stage?: PipelineStage | null;
}

export interface Tag {
  id: string;
  org_id: string;
  name: string;
  color: string;
  created_at: string;
}

// Phase 3 Types
export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'status_change' | 'deal_update' | 'task' | 'other';
export type EntityType = 'contact' | 'company' | 'deal';
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationType = 'task_due' | 'task_assigned' | 'activity' | 'mention' | 'system';

export interface Activity {
  id: string;
  org_id: string;
  entity_type: EntityType;
  entity_id: string;
  activity_type: ActivityType;
  description: string;
  metadata: Record<string, unknown>;
  performed_by: string | null;
  created_at: string;
  updated_at: string;
  performer?: Profile | null;
}

export interface Note {
  id: string;
  org_id: string;
  entity_type: EntityType;
  entity_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  creator?: Profile | null;
}

export interface Task {
  id: string;
  org_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  assigned_to: string | null;
  entity_type: EntityType | null;
  entity_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  deleted_at: string | null;
}

export interface Notification {
  id: string;
  org_id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

// Phase 4 Types
export type PriceType = 'fixed' | 'hourly' | 'package';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'square' | 'cash' | 'check' | 'bank_transfer' | 'other';

export interface Product {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  price: number;
  price_type: PriceType;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Invoice {
  id: string;
  org_id: string;
  contact_id: string | null;
  deal_id: string | null;
  invoice_number: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string | null;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  notes: string | null;
  square_checkout_id: string | null;
  square_payment_url: string | null;
  paid_at: string | null;
  sent_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Joined
  contact?: Contact | null;
  deal?: Deal | null;
  items?: InvoiceItem[];
  payments?: Payment[];
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  org_id: string;
  product_id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  sort_order: number;
  created_at: string;
  // Joined
  product?: Product | null;
}

export interface Payment {
  id: string;
  org_id: string;
  invoice_id: string;
  amount: number;
  method: PaymentMethod;
  square_payment_id: string | null;
  reference_number: string | null;
  notes: string | null;
  paid_at: string;
  created_at: string;
  // Joined
  invoice?: Invoice | null;
}

// Phase 5 Types
export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok' | 'x' | 'linkedin' | 'pinterest';
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';
export type CampaignType = 'email' | 'social' | 'mixed';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';
export type CampaignContactStatus = 'enrolled' | 'sent' | 'opened' | 'clicked' | 'converted' | 'unsubscribed';
export type FormFieldType = 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'number' | 'date' | 'checkbox';

export interface SocialAccount {
  id: string;
  org_id: string;
  platform: SocialPlatform;
  account_name: string;
  account_handle: string | null;
  avatar_url: string | null;
  access_token: string | null;
  refresh_token: string | null;
  token_expires_at: string | null;
  is_connected: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SocialPost {
  id: string;
  org_id: string;
  social_account_id: string | null;
  content: string;
  media_urls: string[];
  scheduled_for: string | null;
  published_at: string | null;
  status: PostStatus;
  platform_post_id: string | null;
  platform: SocialPlatform | null;
  engagement: Record<string, unknown>;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  social_account?: SocialAccount | null;
}

export interface Campaign {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  type: CampaignType;
  status: CampaignStatus;
  start_date: string | null;
  end_date: string | null;
  budget: number;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  contacts?: CampaignContact[];
  contact_count?: number;
}

export interface CampaignContact {
  id: string;
  campaign_id: string;
  contact_id: string;
  org_id: string;
  status: CampaignContactStatus;
  enrolled_at: string;
  last_action_at: string | null;
  contact?: Contact | null;
}

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface Form {
  id: string;
  org_id: string;
  name: string;
  slug: string;
  description: string | null;
  fields: FormField[];
  redirect_url: string | null;
  success_message: string;
  is_active: boolean;
  submission_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  org_id: string;
  contact_id: string | null;
  data: Record<string, unknown>;
  ip_address: string | null;
  source_url: string | null;
  created_at: string;
  contact?: Contact | null;
}

// Phase 6 Types
export type TriggerType = 'contact_created' | 'contact_updated' | 'deal_stage_changed' | 'deal_created' | 'form_submitted' | 'task_completed' | 'invoice_paid' | 'manual' | 'webhook_received' | 'scheduled';
export type StepType = 'send_email' | 'create_task' | 'update_field' | 'add_tag' | 'remove_tag' | 'change_status' | 'change_deal_stage' | 'send_webhook' | 'wait' | 'condition';
export type AutomationStatus = 'active' | 'inactive';
export type AutomationLogStatus = 'running' | 'success' | 'failed' | 'skipped';
export type AIGenerateType = 'email' | 'caption' | 'score' | 'suggestion';

export interface Automation {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  trigger_type: TriggerType;
  trigger_config: Record<string, unknown>;
  is_active: boolean;
  run_count: number;
  last_run_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  steps?: AutomationStep[];
  recent_logs?: AutomationLog[];
}

export interface AutomationStep {
  id: string;
  automation_id: string;
  org_id: string;
  step_type: StepType;
  config: Record<string, unknown>;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface AutomationLog {
  id: string;
  automation_id: string;
  org_id: string;
  status: AutomationLogStatus;
  triggered_by: string | null;
  entity_type: string | null;
  entity_id: string | null;
  steps_completed: number;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
  metadata: Record<string, unknown>;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIConversation {
  id: string;
  org_id: string;
  user_id: string | null;
  entity_type: string | null;
  entity_id: string | null;
  model: string;
  messages: AIMessage[];
  total_tokens: number;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface WebhookEndpoint {
  id: string;
  org_id: string;
  name: string;
  url: string;
  events: string[];
  secret: string | null;
  is_active: boolean;
  last_triggered_at: string | null;
  failure_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Phase 8 Types - Email & Calendar
export type EmailStatus = 'draft' | 'sent' | 'delivered' | 'opened' | 'bounced' | 'failed';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface EmailMessage {
  id: string;
  org_id: string;
  contact_id: string | null;
  from_email: string;
  from_name: string;
  to_email: string;
  to_name: string | null;
  cc: string[];
  bcc: string[];
  subject: string;
  body_html: string;
  body_text: string | null;
  status: EmailStatus;
  template_id: string | null;
  deal_id: string | null;
  opened_at: string | null;
  sent_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  contact?: Contact | null;
}

export interface EmailTemplate {
  id: string;
  org_id: string;
  name: string;
  subject: string;
  body_html: string;
  category: string;
  merge_tags: string[];
  is_active: boolean;
  usage_count: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Appointment {
  id: string;
  org_id: string;
  contact_id: string | null;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  status: AppointmentStatus;
  color: string | null;
  google_event_id: string | null;
  assigned_to: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  contact?: Contact | null;
}

export interface Availability {
  id: string;
  org_id: string;
  user_id: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}
