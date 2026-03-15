// Map Michigan cities to their counties
export const cityToCounty: { [key: string]: string } = {
  // Metro Detroit - Wayne County
  'Detroit': 'Wayne',
  'Livonia': 'Wayne',
  'Plymouth': 'Wayne',
  'Dearborn': 'Wayne',
  'Westland': 'Wayne',
  'Taylor': 'Wayne',
  
  // Oakland County
  'Southfield': 'Oakland',
  'Troy': 'Oakland',
  'Farmington Hills': 'Oakland',
  'Pontiac': 'Oakland',
  'Royal Oak': 'Oakland',
  'Novi': 'Oakland',
  'Rochester': 'Oakland',
  'Auburn Hills': 'Oakland',
  
  // Macomb County
  'Richmond': 'Macomb',  // ← ADD THIS if missing!
  'Warren': 'Macomb',
  'Sterling Heights': 'Macomb',
  'Clinton Township': 'Macomb',
  
  // Ann Arbor Area
  'Ann Arbor': 'Washtenaw',
  'Ypsilanti': 'Washtenaw',

  // Grand Rapids Area
  'Grand Rapids': 'Kent',
  'Wyoming': 'Kent',
  'Kentwood': 'Kent',

  // Lansing Area
  'Lansing': 'Ingham',
  'East Lansing': 'Ingham',

  // Flint Area
  'Flint': 'Genesee',
  'Burton': 'Genesee',

  // Kalamazoo Area
  'Kalamazoo': 'Kalamazoo',
  'Portage': 'Kalamazoo',

  // Other Major Cities
  'Saginaw': 'Saginaw',
  'Bay City': 'Bay',
  'Midland': 'Midland',
  'Jackson': 'Jackson',
  'Battle Creek': 'Calhoun',
  'Muskegon': 'Muskegon',
  'Holland': 'Ottawa',
  'Grand Haven': 'Ottawa',
  'Traverse City': 'Grand Traverse',
  'Marquette': 'Marquette',
  'Monroe': 'Monroe',
  'Adrian': 'Lenawee',
  'Benton Harbor': 'Berrien',
  'St. Joseph': 'Berrien',
};

// Get county from city name
export function getCounty(city: string): string {
  return cityToCounty[city] || 'Other';
}

// Aggregate jobs by county
export function aggregateByCounty(cityData: { name: string; jobCount: number }[]): { county: string; jobCount: number }[] {
  const countyMap: { [county: string]: number } = {};

  cityData.forEach(({ name, jobCount }) => {
    const county = getCounty(name);
    if (county !== 'Other') {
      countyMap[county] = (countyMap[county] || 0) + jobCount;
    }
  });

  return Object.entries(countyMap)
    .map(([county, jobCount]) => ({ county, jobCount }))
    .sort((a, b) => b.jobCount - a.jobCount);
}