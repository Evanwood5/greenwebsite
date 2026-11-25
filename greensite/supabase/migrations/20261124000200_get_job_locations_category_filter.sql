-- Adds an optional p_category filter to get_job_locations so the Analytics
-- city dropdown only offers cities with postings in the selected field
-- (Tech, Engineering, ...). Matches Analytics' own filter in
-- lib/services/analytics.ts: job_field_counts.category = '<Field>' (exact).
-- Called without p_category it behaves exactly like the previous version.
-- Adding a parameter would create an overload, so the old signature is dropped first.
--
-- Callers:
--   GET /api/cities?category=&timeframe=  -> get_job_locations(p_category, p_since)   (Analytics)
--   GET /api/cities?scope=listed          -> get_job_locations(p_since, p_exclude_initial_load, p_exclude_field_id)   (Jobs)
--   GET /api/companies/locations          -> get_job_locations(p_company)   (Tracking)

drop function if exists public.get_job_locations(text, timestamptz, boolean, int);

create function public.get_job_locations(
  p_company text default null,
  p_since timestamptz default null,          -- only postings created after this
  p_exclude_initial_load boolean default false,
  p_exclude_field_id int default null,       -- e.g. the "irrelevant" field
  p_category text default null               -- job_field_counts.category, e.g. 'Tech'
)
returns table (city text, job_count bigint)
language sql stable set search_path = public
as $$
  select loc as city, count(distinct j.job_id) as job_count
  from job_postings_ingest j
  cross join lateral jsonb_array_elements_text(
    case when jsonb_typeof(j.locations) = 'array' then j.locations else '[]'::jsonb end
  ) as loc
  where (p_company is null or j.company_name = p_company)
    and (p_since is null or j.created_at >= p_since)
    and (not p_exclude_initial_load or j.is_initial_load = false)
    and (p_exclude_field_id is null or j.job_field_id is distinct from p_exclude_field_id)
    and (p_category is null or exists (
      select 1 from job_field_counts f
      where f.id = j.job_field_id and f.category = p_category
    ))
    and btrim(loc) <> ''
  group by loc
  order by loc;
$$;

-- Optional hardening (not yet applied): only the server calls this function.
-- revoke execute on function public.get_job_locations(text, timestamptz, boolean, int, text) from public, anon, authenticated;
-- grant execute on function public.get_job_locations(text, timestamptz, boolean, int, text) to service_role;
