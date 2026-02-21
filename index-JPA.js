const data = [
  { country: "germany", year: 2021, charging_point: 63898, ac_slow: 1809, dc_fast: 3451, total_power_kw: 1812933 },
  { country: "canada", year: 2023, charging_point: 26108, ac_slow: 15581, dc_fast: 2076, total_power_kw: 415585 },
  { country: "germany", year: 2019, charging_point: 31195, ac_slow: 416, dc_fast: 1975, total_power_kw: 836856 },
  { country: "germany", year: 2020, charging_point: 45073, ac_slow: 1047, dc_fast: 2814, total_power_kw: 1244489 },
  { country: "germany", year: 2022, charging_point: 90783, ac_slow: 2167, dc_fast: 4297, total_power_kw: 2748477 },
  { country: "malta", year: 2023, charging_point: 394, ac_slow: 0, dc_fast: 47, total_power_kw: 10164 },
  { country: "switzerland", year: 2023, charging_point: 13324, ac_slow: 1913, dc_fast: 887, total_power_kw: 470255 },
  { country: "türkiye", year: 2023, charging_point: 12084, ac_slow: 311, dc_fast: 2117, total_power_kw: 646699 },
  { country: "monaco", year: 2019, charging_point: 18, ac_slow: 3, dc_fast: 6, total_power_kw: 343 },
  { country: "germany", year: 2023, charging_point: 129456, ac_slow: 3017, dc_fast: 6467, total_power_kw: 4569267 }
];

let germany = data.filter(d => d.country==="germany");

let media_german_CP= germany.reduce((acc, d) => acc + d.charging_point, 0) / germany.length;

console.log(`The average charging point in Germany is ${media_german_CP}`);