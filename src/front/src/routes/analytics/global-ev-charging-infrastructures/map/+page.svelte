<script>
	import { onMount } from 'svelte';

	let data = [];
	let years = $state([]);
	let selectedYear = $state(null);
	let Highcharts;
	let chart = null;

	const countryMap = {
		germany: 'DEU',
		canada: 'CAN',
		finland: 'FIN',
		malta: 'MLT',
		switzerland: 'CHE',
		turkiye: 'TUR',
		monaco: 'MCO'
	};

	async function loadScript(src) {
		return new Promise((resolve, reject) => {
			if (document.querySelector(`script[src="${src}"]`)) {
				resolve();
				return;
			}
			const script = document.createElement('script');
			script.src = src;
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		});
	}

	async function renderChart() {
		if (!Highcharts || !selectedYear) return;

		const topology = await fetch(
			'https://code.highcharts.com/mapdata/custom/world.topo.json'
		).then(res => res.json());

		const filtered = data.filter(d => Number(d.year) === Number(selectedYear));

		const mapData = filtered
			.filter(d => countryMap[d.country])
			.map(d => ({
				code: countryMap[d.country],
				value: Number(d.charging_point) || 0,
				custom: d
			}));

		if (chart) chart.destroy();

		chart = Highcharts.mapChart('container', {
			chart: {
				map: topology
			},

			title: {
				text: `EV Charging Infrastructure (${selectedYear})`
			},

			mapNavigation: {
				enabled: true
			},

			colorAxis: {
				min: 0
			},

			tooltip: {
				useHTML: true,
				pointFormatter: function () {
					if (!this.custom) {
						return `<b>${this.name}</b><br/>Sin datos`;
					}

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

			series: [{
				name: 'Charging Points',
				joinBy: ['iso-a3', 'code'],
				data: mapData,
				nullColor: '#e6e6e6'
			}]
		});
	}

	function handleYearChange() {
		renderChart();
	}

	onMount(async () => {
		try {
			// 🔥 cargar scripts Highcharts MAP
			await Promise.all([
				loadScript('https://code.highcharts.com/maps/highmaps.js'),
				loadScript('https://code.highcharts.com/modules/accessibility.js')
			]);

			Highcharts = window.Highcharts;

			// 🔥 cargar datos backend
			await fetch('/api/v1/global-ev-charging-infrastructures/loadInitialData');

			const res = await fetch('/api/v1/global-ev-charging-infrastructures');

			if (!res.ok) {
				console.error("Error API:", res.status);
				return;
			}

			data = await res.json();

			console.log("DATA:", data);

			// 🔥 generar años correctamente
			years = [...new Set(data.map(d => Number(d.year)))]
				.filter(y => !isNaN(y))
				.sort((a, b) => a - b);

			console.log("YEARS:", years);

			if (years.length > 0) {
				selectedYear = years[0];
				await renderChart();
			}

		} catch (err) {
			console.error("Error general:", err);
		}
	});
</script>

<h2>EV World Map</h2>

<label>Año:</label>

<select bind:value={selectedYear} on:change={handleYearChange}>
	{#if years.length === 0}
		<option disabled>No hay datos</option>
	{:else}
		{#each years as y}
			<option value={y}>{y}</option>
		{/each}
	{/if}
</select>

<div id="container" style="height: 600px; margin-top: 20px;"></div>