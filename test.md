# Data Processing Requests Schema (PostgreSQL)

This document defines the database schema for managing document processing requests, including identification, classification, specialized storage for photos and documents, notifications, events, and status transitions.

---

## 1. Reference Tables

```sql
-- === Reference tables (codes, human names, flags) ===

create table products (
  code        text primary key,                     -- e.g. 'IRS','IRE','NA','NL_PLUS','COMMANDE_PASS','SAV'
  name        text not null,
  description text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table document_types (
  code        text primary key,                     -- e.g. 'PHOTO','IDENTITY','SCOLARITE','OCTROI_BOURSE', ...
  name        text not null,
  description text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table request_statuses (
  code        text primary key,                     -- 'RECEIVED','IN_PROGRESS','PENDING_INFO','VALID','INVALID','ON_HOLD','NOTIFIED','NOTIFICATION_FAILED'
  name        text not null,
  description text,
  is_terminal boolean not null default false,       -- terminal states
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table rejection_reasons (
  code        text primary key,                     -- 'NON_VALIDE','NON_LISIBLE','AUCUN_DOCUMENT','LANGUE_NON_CONFORME', ...
  name        text not null,
  description text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table requesting_systems (
  code        text primary key,                     -- 'SELV2', ...
  name        text not null,
  default_notification_endpoint text,               -- optional per-system endpoint
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);


-- table already created
create table users (
  user_id     uuid primary key,                     -- BO/internal users
  external_sub text unique,                         -- Cognito sub or equivalent
  role_id     int,
  status      text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

```

---

## 2. Core Table: Processing Requests

```sql
create table processing_requests (
  request_id             uuid primary key default gen_random_uuid(),
  -- Business identifiers
  contract_reference     varchar(100),
  document_reference     varchar(100) not null,
  client_reference       varchar(100),
  requesting_system_code text not null references requesting_systems(code),
  external_request_id    varchar(100),              -- idempotency from source

  -- Classification
  product_code           text not null references products(code),
  document_type_code     text not null references document_types(code),

  -- Storage & file metadata (never store full URL)
  s3_bucket              varchar(63) not null,
  s3_object_key          text not null,             -- encrypt at rest (app side)
  content_type           varchar(100),
  file_size_bytes        bigint,
  file_sha256            char(64),
  language_code          char(2),

  -- Notifications
  notification_endpoint  text,                      -- override per-request

  -- State
  current_status         text not null references request_statuses(code) default 'RECEIVED',
  rejection_reason_code  text references rejection_reasons(code),
  status_changed_at      timestamptz,
  notified_at            timestamptz,

  -- Audit & lifecycle
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  deleted_at             timestamptz,
  expires_at             timestamptz,               -- GDPR retention
  processed_by           uuid references users(user_id),
  version                int  not null default 0    -- optimistic locking
);

-- Idempotency: either (system, external id) OR (system, document_reference)
create unique index uq_pr_sys_ext on processing_requests(requesting_system_code, external_request_id)
  where external_request_id is not null;
create unique index uq_pr_sys_docref on processing_requests(requesting_system_code, document_reference);

-- Helpful filters
create index ix_pr_status_created_desc on processing_requests(current_status, created_at desc);
create index ix_pr_system_created_desc on processing_requests(requesting_system_code, created_at desc);
create index ix_pr_product_type_created_desc on processing_requests(product_code, document_type_code, created_at desc);
create index ix_pr_status_changed_desc on processing_requests(status_changed_at desc);

```

### Indexes & Constraints

```sql
create unique index uq_pr_sys_ext on processing_requests(requesting_system_code, external_request_id)
  where external_request_id is not null;
create unique index uq_pr_sys_docref on processing_requests(requesting_system_code, document_reference);

create index ix_pr_status_created_desc on processing_requests(current_status, created_at desc);
create index ix_pr_system_created_desc on processing_requests(requesting_system_code, created_at desc);
create index ix_pr_product_type_created_desc on processing_requests(product_code, document_type_code, created_at desc);
create index ix_pr_status_changed_desc on processing_requests(status_changed_at desc);
```

---

## 3. Specialized Tables

```sql
-- A) Photos
create table photo_requests (
  request_id              uuid primary key references processing_requests(request_id) on delete cascade,
  is_retouched            boolean,
  image_format            varchar(10),        -- to validate with symphony team
  photo_quality_score     int check (photo_quality_score between 0 and 100),        -- to validate with symphony team
  face_detection_passed   boolean,        -- to validate with symphony team
  background_compliant    boolean,        -- to validate with symphony team
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- B) Autres justificatifs
create table document_requests (
  request_id              uuid primary key references processing_requests(request_id) on delete cascade,
  document_validity_date  date,
  issuing_authority       varchar(200),
  document_number         varchar(100),             -- consider hashing/encryption if PII
  is_certified_copy       boolean,
  ocr_confidence_score    numeric(5,2) check (ocr_confidence_score between 0 and 100),
  extracted_text_hash     char(64),
  metadata                jsonb,                    -- extra analysis results
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

```

---

## 4. Notifications & Events

```sql
-- Outbox for reliable delivery (producer owns retries)
create table notifications_outbox (
  id               uuid primary key default gen_random_uuid(),
  request_id       uuid not null references processing_requests(request_id) on delete cascade,
  endpoint_url     text not null,                       -- frozen at emission time
  payload          jsonb not null,
  status           text not null check (status in ('PENDING','SENT','FAILED','GIVE_UP')),
  attempts         int  not null default 0,
  next_try_at      timestamptz,
  last_error       text,
  response_code    smallint,
  response_time_ms int,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index ix_outbox_pending on notifications_outbox(status, next_try_at);
create index ix_outbox_req_created on notifications_outbox(request_id, created_at desc);

-- Domain events (short retention or archived elsewhere)
create table request_events (
  id              uuid primary key default gen_random_uuid(),
  request_id      uuid not null references processing_requests(request_id) on delete cascade,
  event_type      text not null,                        -- 'STATUS_CHANGED','FILE_UPLOADED','OCR_EXTRACTED','NOTIFICATION_ATTEMPTED','NOTIFICATION_CONFIRMED','REJECTED','ERROR'
  payload         jsonb,
  occurred_at     timestamptz not null default now(),
  actor_user_id   uuid references users(user_id),
  correlation_id  varchar(64),
  unique (request_id, event_type, correlation_id)
);
create index ix_events_req_time on request_events(request_id, occurred_at desc);
create index ix_events_type_time on request_events(event_type, occurred_at desc);

```

---

## 5. Status Transitions & History

```sql
-- Allowed status transitions (govern business rules)
create table status_transitions (
  from_code      text not null references request_statuses(code),
  to_code        text not null references request_statuses(code),
  requires_reason boolean not null default false,
  is_auto         boolean not null default false,
  primary key (from_code, to_code)
);

-- Status change history (explicit audit trail)
create table request_status_history (
  id             uuid primary key default gen_random_uuid(),
  request_id     uuid not null references processing_requests(request_id) on delete cascade,
  old_status     text references request_statuses(code),
  new_status     text not null references request_statuses(code),
  reason_code    text references rejection_reasons(code),
  changed_at     timestamptz not null default now(),
  actor_user_id  uuid references users(user_id),
  payload        jsonb
);
create index ix_hist_req_time on request_status_history(request_id, changed_at desc);

```

---

## 6. Triggers

- Auto update `updated_at`
- Optimistic locking via version bump
- Guard INVALID status with rejection_reason_code
- Log status changes into history and events
- Specialization constraints (PHOTO vs DOCUMENT)
- Outbox retry policy with exponential backoff

NB : tout est DEFERRABLE INITIALLY DEFERRED quand c’est pertinent, pour permettre des insertions en plusieurs étapes dans une transaction.

Example trigger snippets:

```sql
-- Utility: generic "touch updated_at" trigger
create or replace function trg_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- Attach to tables having updated_at
create trigger t_products_touch           before update on products           for each row execute function trg_touch_updated_at();
create trigger t_document_types_touch     before update on document_types     for each row execute function trg_touch_updated_at();
create trigger t_request_statuses_touch   before update on request_statuses   for each row execute function trg_touch_updated_at();
create trigger t_rejection_reasons_touch  before update on rejection_reasons  for each row execute function trg_touch_updated_at();
create trigger t_requesting_systems_touch before update on requesting_systems for each row execute function trg_touch_updated_at();
create trigger t_users_touch              before update on users              for each row execute function trg_touch_updated_at();
create trigger t_processing_touch         before update on processing_requests for each row execute function trg_touch_updated_at();
create trigger t_photo_touch              before update on photo_requests     for each row execute function trg_touch_updated_at();
create trigger t_doc_touch                before update on document_requests  for each row execute function trg_touch_updated_at();
create trigger t_outbox_touch             before update on notifications_outbox for each row execute function trg_touch_updated_at();
create trigger t_events_touch             before update on request_events     for each row execute function trg_touch_updated_at();

-- 6.1 Optimistic locking: bump version on update
create or replace function trg_bump_version()
returns trigger language plpgsql as $$
begin
  new.version := old.version + 1;
  return new;
end $$;
create trigger t_processing_bump_version
  before update on processing_requests
  for each row execute function trg_bump_version();

-- 6.2 Enforce INVALID => reason present (and the converse)
create or replace function trg_status_reason_guard()
returns trigger language plpgsql as $$
begin
  if new.current_status = 'INVALID' and new.rejection_reason_code is null then
    raise exception 'rejection_reason_code must be set when status is INVALID';
  end if;
  if new.current_status <> 'INVALID' and new.rejection_reason_code is not null then
    -- normalize: clear reason when not invalid
    new.rejection_reason_code := null;
  end if;
  return new;
end $$;
create trigger t_processing_reason_guard
  before insert or update on processing_requests
  for each row execute function trg_status_reason_guard();

-- 6.3 Status change bookkeeping: set status_changed_at + history row + event
create or replace function trg_status_change()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    new.status_changed_at := now();
    return new;
  end if;

  if new.current_status is distinct from old.current_status then
    new.status_changed_at := now();
    insert into request_status_history(request_id, old_status, new_status, reason_code, actor_user_id, payload)
    values (old.request_id, old.current_status, new.current_status, new.rejection_reason_code, new.processed_by, null);

    insert into request_events(request_id, event_type, payload, occurred_at, actor_user_id, correlation_id)
    values (old.request_id, 'STATUS_CHANGED', jsonb_build_object('from', old.current_status, 'to', new.current_status), now(), new.processed_by, gen_random_uuid()::text);
  end if;
  return new;
end $$;
create trigger t_processing_status_change_ins
  before insert on processing_requests
  for each row execute function trg_status_change();
create trigger t_processing_status_change_upd
  before update on processing_requests
  for each row execute function trg_status_change();

-- 6.4 Specialization constraint:
-- if document_type_code='PHOTO' => must have photo_requests row (and no document_requests).
-- otherwise => must have document_requests row (and no photo_requests).
create or replace function trg_specialization_guard()
returns trigger language plpgsql as $$
declare
  has_photo boolean;
  has_doc   boolean;
begin
  -- defer check to end of transaction for convenience
  perform 1;  -- no-op
  return new;
end $$;

-- Constraint trigger (deferred) performing the check
create or replace function fn_check_specialization(p_request_id uuid)
returns void language plpgsql as $$
declare
  dt text;
  has_photo boolean;
  has_doc   boolean;
begin
  select document_type_code into dt from processing_requests where request_id = p_request_id;
  select exists(select 1 from photo_requests     where request_id = p_request_id) into has_photo;
  select exists(select 1 from document_requests  where request_id = p_request_id) into has_doc;

  if dt = 'PHOTO' then
    if not has_photo or has_doc then
      raise exception 'PHOTO type requires one row in photo_requests and none in document_requests (request_id=%)', p_request_id;
    end if;
  else
    if not has_doc or has_photo then
      raise exception 'Non-PHOTO type requires one row in document_requests and none in photo_requests (request_id=%)', p_request_id;
    end if;
  end if;
end $$;

create or replace function trg_processing_deferred_check()
returns trigger language plpgsql as $$
begin
  perform fn_check_specialization(new.request_id);
  return null;
end $$;

create constraint trigger ct_processing_specialization
  after insert or update on processing_requests
  deferrable initially deferred
  for each row execute function trg_processing_deferred_check();

-- 6.5 Outbox retry policy (exponential backoff + jitter; cap to GIVE_UP)
create or replace function trg_outbox_retry_policy()
returns trigger language plpgsql as $$
declare
  base_interval interval := interval '15 minutes';
  capped int;
  jitter_ms int;
begin
  if TG_OP = 'INSERT' then
    if new.status = 'PENDING' and new.next_try_at is null then
      new.next_try_at := now();
    end if;
    return new;
  end if;

  if new.status = 'FAILED' then
    new.attempts := old.attempts + 1;
    capped := least(new.attempts, 5); -- cap growth
    jitter_ms := (random()*30000)::int; -- up to 30s jitter
    new.next_try_at := now() + (base_interval * (2 ^ capped)) + make_interval(secs => jitter_ms/1000.0);
    if new.attempts >= 10 then
      new.status := 'GIVE_UP';
      new.next_try_at := null;
    end if;
  end if;
  return new;
end $$;

create trigger t_outbox_retry_ins
  before insert on notifications_outbox
  for each row execute function trg_outbox_retry_policy();

create trigger t_outbox_retry_upd
  before update on notifications_outbox
  for each row execute function trg_outbox_retry_policy();

```

(Other triggers include status change logging, specialization enforcement, and retry backoff for notifications).

---

## 7. Relations Summary

- products (1) — (N) processing_requests
- document_types (1) — (N) processing_requests
- request_statuses (1) — (N) processing_requests
- rejection_reasons (1) — (0..N) processing_requests
- requesting_systems (1) — (N) processing_requests
- processing_requests (1) — (0..1) photo_requests
- processing_requests (1) — (0..1) document_requests
- processing_requests (1) — (0..N) notifications_outbox
- processing_requests (1) — (0..N) request_events
- users (1) — (0..N) processing_requests
- users (1) — (0..N) request_events
- status_transitions defines allowed flows
- request_status_history tracks state changes
```

---

## 8. Compliance Notes

- Encrypt `s3_object_key` client-side if sensitive.
- Activate SSE-KMS for S3.
- Consider hashing/encryption for PII like `document_number`.
- Use UTC everywhere (`timestamptz`).
- Apply purge job using `expires_at`.
- Row Level Security possible with `requesting_system_code`.

---
