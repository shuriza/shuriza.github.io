-- Phase 2 (contract): run only after the application version that reads
-- portfolio_* views is deployed and anonymous view reads have been verified.
-- This removes legacy direct table access, so do not run it before Phase 1.

begin;

do $$
begin
  if to_regclass('public.portfolio_profile') is null
    or to_regclass('public.portfolio_site_settings') is null
    or to_regclass('public.portfolio_projects') is null
    or to_regclass('public.portfolio_skills') is null then
    raise exception 'Public views are missing. Run supabase/upgrade.sql and deploy the compatible application first.';
  end if;
end $$;

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.profile enable row level security;
alter table public.site_settings enable row level security;

-- This project owns all policies on these tables. Removing every existing
-- policy prevents an unknown permissive policy from widening access via OR.
do $$
declare
  policy_record record;
begin
  for policy_record in
    select tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('admin_users', 'projects', 'skills', 'profile', 'site_settings')
  loop
    execute format('drop policy if exists %I on public.%I', policy_record.policyname, policy_record.tablename);
  end loop;
end $$;

create policy "Admins can read their admin record" on public.admin_users for select to authenticated
  using (user_id = auth.uid());

create policy "Admins can read projects" on public.projects for select to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admins can insert projects" on public.projects for insert to authenticated
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admins can update projects" on public.projects for update to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admins can delete projects" on public.projects for delete to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "Admins can read skills" on public.skills for select to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admins can insert skills" on public.skills for insert to authenticated
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admins can update skills" on public.skills for update to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admins can delete skills" on public.skills for delete to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "Admins can read profile" on public.profile for select to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admins can insert profile" on public.profile for insert to authenticated
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admins can update profile" on public.profile for update to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "Admins can read site settings" on public.site_settings for select to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admins can insert site settings" on public.site_settings for insert to authenticated
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
create policy "Admins can update site settings" on public.site_settings for update to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

revoke all on table public.admin_users, public.projects, public.skills, public.profile, public.site_settings
  from anon, authenticated, PUBLIC;
grant select on table public.admin_users to authenticated;
grant select, insert, update, delete on table public.projects to authenticated;
grant select, insert, update, delete on table public.skills to authenticated;
grant select, insert, update on table public.profile to authenticated;
grant select, insert, update on table public.site_settings to authenticated;

-- Public views are simple and automatically updatable, so their ACL must be
-- read-only even though their base tables are protected by RLS.
revoke all on table public.portfolio_profile, public.portfolio_site_settings,
  public.portfolio_projects, public.portfolio_skills from anon, authenticated, PUBLIC;
grant select on table public.portfolio_profile to anon, authenticated;
grant select on table public.portfolio_site_settings to anon, authenticated;
grant select on table public.portfolio_projects to anon, authenticated;
grant select on table public.portfolio_skills to anon, authenticated;

notify pgrst, 'reload schema';

commit;
