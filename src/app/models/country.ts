export interface Country {
  names: { common: string; official: string };
  codes: { alpha_2: string; alpha_3: string };
  capitals?: { name: string; coordinates?: { lat: number; lng: number } }[];
  population: number;
  region: string;
  subregion?: string;
  continents?: string[];
  flag: { emoji: string; url_svg: string; url_png: string; description?: string };
  coordinates: { lat: number; lng: number };
  area: { kilometers: number };
  borders?: string[];
  timezones?: string[];
  government_type?: string;
  links?: { google_maps?: string; wikipedia?: string };
  languages?: { name: string; native_name: string; bcp47: string }[];
  currencies?: { code: string; name: string; symbol: string }[];
}
