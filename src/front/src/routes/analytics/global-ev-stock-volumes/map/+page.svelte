<script>
	import { onMount } from 'svelte';

	let data = [];
	let years = $state([]);
	let selectedYear = $state(null);
	let Highcharts;
	let chart = null;

	// Mapeo de tus países a códigos ISO-A3 (necesarios para el mapa)
	const countryMap = {
		brazil: 'BRA',
		canada: 'CAN',
		mexico: 'MEX',
		china: 'CHN',
		colombia: 'COL',
		'costa rica': 'CRI',
		denmark: 'DNK',
		finland: 'FIN'
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
			.filter(d => countryMap[d.region_country.toLowerCase()])
			.map(d => ({
				code: countryMap[d.region_country.toLowerCase()],
				value: Number(d.ev_stock) || 0, // El color del mapa dependerá del Stock
				custom: d
			}));

		if (chart) chart.destroy();

		chart = Highcharts.mapChart('container', {
			chart: { map: topology },

			title: { text: `Distribución Global de Stock EV (${selectedYear})` },

			subtitle: { text: 'El color representa el Volumen de Stock (ev_stock)' },

			mapNavigation: { enabled: true },

			colorAxis: {
				min: 0,
				stops: [
					[0, '#EFEFFF'],
					[0.5, '#4444FF'],
					[1, '#000022']
				]
			},

			tooltip: {
				useHTML: true,
				pointFormatter: function () {
					if (!this.custom) {
						return `<b>${this.name}</b><br/>Sin datos para este año`;
					}

					return `
						<div style="padding: 5px;">
							<b style="font-size: 14px;">${this.name} (${this.custom.year})</b><br/>
							<hr/>
							<b>EV Stock:</b> ${this.custom.ev_stock} uds<br/>
							<b>Macroregion:</b> ${this.custom.macro_region_stock || this.custom.macroregion_stock} uds<br/>
							<b>Worldwide:</b> ${this.custom.worldwide_stock} uds<br/>
							<b>Oil Displacement:</b> ${this.custom.oil_world_displacement} pts
						</div>
					`;
				}
			},

			series: [{
				name: 'EV Stock',
				joinBy: ['iso-a3', 'code'],
				data: mapData,
				nullColor: '#e6e6e6',
				states: {
					hover: { color: '#BADA55' }
				},
				dataLabels: {
					enabled: true,
					format: '{point.name}'
				}
			}]
		});
	}

	function handleYearChange() {
		renderChart();
	}

	onMount(async () => {
		try {
			// 1. Cargar librerías de Mapas
			await Promise.all([
				loadScript('https://code.highcharts.com/maps/highmaps.js'),
				loadScript('https://code.highcharts.com/modules/accessibility.js')
			]);

			Highcharts = window.Highcharts;

			// 2. Cargar tus datos (Asegúrate de que la ruta sea correcta)
			await fetch('/api/v1/global-ev-stock-volumes/loadInitialData');
			const res = await fetch('/api/v1/global-ev-stock-volumes');

			if (!res.ok) {
				console.error("Error API:", res.status);
				return;
			}

			data = await res.json();

			// 3. Generar lista de años única y ordenada
			years = [...new Set(data.map(d => Number(d.year)))]
				.filter(y => !isNaN(y))
				.sort((a, b) => a - b);

			if (years.length > 0) {
				selectedYear = years[0];
				await renderChart();
			}

		} catch (err) {
			console.error("Error cargando el mapa:", err);
		}
	});
</script>

<div style="text-align: center; padding: 20px;">
	<h2>Mapa Mundial de Stock de Vehículos Eléctricos</h2>

	<label for="year-select" style="font-weight: bold;">Selecciona el año de análisis:</label>
	<select id="year-select" bind:value={selectedYear} onchange={handleYearChange}>
		{#if years.length === 0}
			<option disabled>Cargando años...</option>
		{:else}
			{#each years as y}
				<option value={y}>{y}</option>
			{/each}
		{/if}
	</select>
</div>

<div id="container" style="height: 600px; width: 95%; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px;"></div>