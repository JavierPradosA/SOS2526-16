<script>
	import { onMount } from 'svelte';

	let data = [];
	let years = $state([]);
	let selectedYear = $state(null);

	let Highcharts;
	let chart;

	const countryMap = {
		germany: 'Germany',
		canada: 'Canada',
		finland: 'Finland',
		malta: 'Malta',
		switzerland: 'Switzerland',
		turkiye: 'Turkey',
		monaco: 'Monaco'
	};

	async function loadScript(src) {
		return new Promise((resolve) => {
			if (document.querySelector(`script[src="${src}"]`)) return resolve();
			const s = document.createElement('script');
			s.src = src;
			s.onload = resolve;
			document.head.appendChild(s);
		});
	}

	const getGraticule = () => {
		const data = [];

		for (let x = -180; x <= 180; x += 15) {
			data.push({
				geometry: {
					type: 'LineString',
					coordinates: [[x, -80], [x, 80]]
				}
			});
		}

		for (let y = -80; y <= 80; y += 10) {
			const coords = [];
			for (let x = -180; x <= 180; x += 5) {
				coords.push([x, y]);
			}
			data.push({
				geometry: {
					type: 'LineString',
					coordinates: coords
				}
			});
		}

		return data;
	};

	async function renderChart() {
		if (!Highcharts || !selectedYear) return;

		const topology = await fetch(
			'https://code.highcharts.com/mapdata/custom/world.topo.json'
		).then(r => r.json());

		const filtered = data.filter(d => Number(d.year) === Number(selectedYear));

		const mapData = filtered.map(d => ({
			name: countryMap[d.country],
			value: Number(d.charging_point) || 0,
			custom: d
		}));

		if (chart) chart.destroy();

		chart = Highcharts.mapChart('container', {
			chart: {
				map: topology
			},

			title: {
				text: `EV Charging (${selectedYear})`
			},

			mapView: {
				projection: {
					name: 'Orthographic',
					rotation: [60, -30]
				}
			},

			mapNavigation: {
				enabled: true
			},

			colorAxis: {
				min: 0,
				minColor: '#BFCFAD',
				maxColor: '#31784B'
			},

			tooltip: {
				useHTML: true,
				pointFormatter: function () {
					if (!this.custom) return `<b>${this.name}</b><br/>Sin datos`;

					return `
						<b>${this.name}</b><br/>
						Año: ${this.custom.year}<br/>
						Charging: ${this.custom.charging_point}<br/>
						AC Slow: ${this.custom.ac_slow}<br/>
						DC Fast: ${this.custom.dc_fast}<br/>
						Power: ${this.custom.total_power_kw}
					`;
				}
			},

			series: [
				{
					type: 'mapline',
					data: getGraticule(),
					enableMouseTracking: false,
					color: 'rgba(0,0,0,0.1)'
				},
				{
					name: 'Charging Points',
					data: mapData,
					joinBy: 'name',
					states: {
						hover: {
							color: '#a4edba'
						}
					}
				}
			]
		});
	}

	function handleYearChange() {
		renderChart();
	}

	onMount(async () => {
		await Promise.all([
			loadScript('https://code.highcharts.com/maps/highmaps.js'),
			loadScript('https://code.highcharts.com/highcharts-more.js'),
			loadScript('https://code.highcharts.com/modules/accessibility.js')
		]);

		Highcharts = window.Highcharts;

		await fetch('/api/v1/global-ev-charging-infrastructures/loadInitialData');

		const res = await fetch('/api/v1/global-ev-charging-infrastructures');
		data = await res.json();

		years = [...new Set(data.map(d => Number(d.year)))].sort((a, b) => a - b);

		if (years.length > 0) {
			selectedYear = years[0];
			renderChart();
		}
	});
</script>

<h2>🌍 EV Globe Visualization</h2>

<label>Año:</label>
<select bind:value={selectedYear} on:change={handleYearChange}>
	{#each years as y}
		<option value={y}>{y}</option>
	{/each}
</select>

<div id="container" style="height: 650px; margin-top: 20px;"></div>