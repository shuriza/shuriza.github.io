begin;

update public.profile
set hero_roles = array_remove(hero_roles, 'AI Automation · Gemini · Telegram Bot')
where id = 1;

commit;
