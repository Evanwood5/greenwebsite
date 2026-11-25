-- Distinct cities from job_postings_ingest.locations (a jsonb array of city
-- names), with how many postings list each one. Pass p_company to limit the
-- result to one company's postings (exact company_name match).
--
-- Used by:
--   GET /api/cities               -> get_job_locations()
--   GET /api/companies/locations  -> get_job_locations(p_company)
--
-- Applied to GreenifyProd on 2026-11-24 via the SQL editor.

create or replace function public.get_job_locations(p_company text default null)
returns table (city text, job_count bigint)
language sql
stable
set search_path = public
as $$
  select loc as city, count(distinct j.job_id) as job_count
  from job_postings_ingest j
  cross join lateral jsonb_array_elements_text(
    case when jsonb_typeof(j.locations) = 'array' then j.locations else '[]'::jsonb end
  ) as loc
  where (p_company is null or j.company_name = p_company)
    and btrim(loc) <> ''
  group by loc
  order by loc;
$$;

-- Superseded by 20261124000100_get_job_locations_listing_filters.sql.
