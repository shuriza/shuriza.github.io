begin;

update public.profile
set hero_roles = array_remove(hero_roles, 'Laravel 12 · PHP · MySQL')
where id = 1;

commit;
