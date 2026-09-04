-- Run in the Supabase SQL Editor after supabase/lockdown.sql.
-- It intentionally rolls back, so probes never persist portfolio changes.

begin;

set local role anon;

do $$
declare
  profile_count integer;
  settings_count integer;
  row_count integer;
  relation_name text;
begin
  select count(*) into profile_count from public.portfolio_profile;
  select count(*) into settings_count from public.portfolio_site_settings;
  if profile_count <> 1 or settings_count <> 1 then
    raise exception 'anon cannot read the required public profile/settings rows (% / %)', profile_count, settings_count;
  end if;

  foreach relation_name in array array['portfolio_projects', 'portfolio_skills']
  loop
    execute format('select count(*) from public.%I', relation_name) into row_count;
    raise notice 'anon public view read succeeded: % (% rows)', relation_name, row_count;
  end loop;
end $$;

do $$
declare
  relation_name text;
  operation text;
  ignored integer;
begin
  foreach relation_name in array array['profile', 'site_settings', 'projects', 'skills']
  loop
    begin
      execute format('select 1 from public.%I limit 1', relation_name) into ignored;
      raise exception 'anon unexpectedly read public.%', relation_name;
    exception when insufficient_privilege then
      raise notice 'anon base read denied as expected: %', relation_name;
    end;
  end loop;

  foreach relation_name in array array[
    'profile', 'site_settings', 'projects', 'skills',
    'portfolio_profile', 'portfolio_site_settings', 'portfolio_projects', 'portfolio_skills'
  ]
  loop
    foreach operation in array array['insert', 'update', 'delete']
    loop
      begin
        if operation = 'insert' then
          execute format('insert into public.%I default values', relation_name);
        elsif operation = 'update' then
          execute format('update public.%I set id = id where false', relation_name);
        else
          execute format('delete from public.%I where false', relation_name);
        end if;
        raise exception 'anon unexpectedly % public.%', operation, relation_name;
      exception when insufficient_privilege then
        raise notice 'anon % denied as expected: public.%', operation, relation_name;
      end;
    end loop;
  end loop;
end $$;

reset role;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000000', true);
set local role authenticated;

do $$
declare
  relation_name text;
  operation text;
  row_count integer;
  affected_rows integer;
begin
  select count(*) into row_count from public.portfolio_profile;
  if row_count <> 1 then
    raise exception 'non-admin authenticated user cannot read the public profile view';
  end if;

  foreach relation_name in array array['admin_users', 'profile', 'site_settings', 'projects', 'skills']
  loop
    execute format('select count(*) from public.%I', relation_name) into row_count;
    if row_count <> 0 then
      raise exception 'non-admin authenticated user unexpectedly read % rows from public.%', row_count, relation_name;
    end if;
    raise notice 'non-admin base read denied by RLS as expected: %', relation_name;
  end loop;

  foreach relation_name in array array[
    'profile', 'site_settings', 'projects', 'skills',
    'portfolio_profile', 'portfolio_site_settings', 'portfolio_projects', 'portfolio_skills'
  ]
  loop
    foreach operation in array array['insert', 'update', 'delete']
    loop
      begin
        -- Authenticated users receive table-level write grants so an admin can
        -- edit content. RLS instead filters their base-table updates/deletes to
        -- zero rows; a `where false` probe would never exercise that behavior.
        if relation_name = any (array['profile', 'site_settings', 'projects', 'skills'])
          and operation in ('update', 'delete') then
          if operation = 'update' then
            execute format('update public.%I set id = id where true', relation_name);
          else
            execute format('delete from public.%I where true', relation_name);
          end if;
          get diagnostics affected_rows = row_count;
          if affected_rows <> 0 then
            raise exception 'non-admin unexpectedly % % rows in public.%', operation, affected_rows, relation_name;
          end if;
          raise notice 'non-admin base % affected no rows due to RLS as expected: public.%', operation, relation_name;
        elsif operation = 'insert' then
          execute format('insert into public.%I default values', relation_name);
          raise exception 'non-admin authenticated user unexpectedly % public.%', operation, relation_name;
        elsif operation = 'update' then
          execute format('update public.%I set id = id where false', relation_name);
          raise exception 'non-admin authenticated user unexpectedly % public.%', operation, relation_name;
        else
          execute format('delete from public.%I where false', relation_name);
          raise exception 'non-admin authenticated user unexpectedly % public.%', operation, relation_name;
        end if;
      exception when insufficient_privilege then
        raise notice 'non-admin % denied as expected: public.%', operation, relation_name;
      end;
    end loop;
  end loop;
end $$;

reset role;

do $$
declare
  admin_id uuid;
begin
  select user_id into admin_id from public.admin_users order by created_at limit 1;
  if admin_id is null then
    raise exception 'No admin_users row exists; add an admin before verifying admin CRUD.';
  end if;
  perform set_config('request.jwt.claim.sub', admin_id::text, true);
end $$;

set local role authenticated;

do $$
declare
  project_id uuid;
  skill_id uuid;
  affected_rows integer;
begin
  if (select count(*) from public.profile) <> 1 or (select count(*) from public.site_settings) <> 1 then
    raise exception 'admin could not read the singleton base rows';
  end if;

  insert into public.projects (title, description, tech, published)
  values ('__acl_probe_project__', 'Temporary ACL verification row.', array['SQL'], false)
  returning id into project_id;
  update public.projects set title = title where id = project_id;
  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then raise exception 'admin project update failed'; end if;
  delete from public.projects where id = project_id;
  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then raise exception 'admin project delete failed'; end if;

  insert into public.skills (name, category, icon, color, published)
  values ('__acl_probe_skill__', 'Tools', 'TbApi', '#22d3ee', false)
  returning id into skill_id;
  update public.skills set name = name where id = skill_id;
  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then raise exception 'admin skill update failed'; end if;
  delete from public.skills where id = skill_id;
  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then raise exception 'admin skill delete failed'; end if;

  update public.profile set id = id where id = 1;
  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then raise exception 'admin profile update failed'; end if;
  update public.site_settings set id = id where id = 1;
  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then raise exception 'admin settings update failed'; end if;
end $$;

rollback;
