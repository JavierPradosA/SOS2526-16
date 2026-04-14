<script>
	import { onMount } from 'svelte';

	let data = [];

	onMount(async () => {

		// 🔥 cargar datos iniciales
		await fetch('/api/v1/global-ev-charging-infrastructures/loadInitialData');

		const res = await fetch('/api/v1/global-ev-charging-infrastructures');

		if (!res.ok) {
			console.error("Error API:", res.status);
			return;
		}

		data = await res.json();

		// 🔥 limitar años para que quepan bien (puedes cambiar 4 → 5 si quieres)
		const years = [...new Set(data.map(d => d.year))]
			.sort((a, b) => a - b)
			.slice(-5);

		const series = years.map(year => {

			const dataYear = data.filter(d => d.year === year);

			return {
				name: `Year ${year}`,
				data: dataYear.map(d => ({
					name: d.country,
					value: Number(d.charging_point) || 0,

					custom: {
						charging_point: Number(d.charging_point) || 0,
						ac_slow: Number(d.ac_slow) || 0,
						dc_fast: Number(d.dc_fast) || 0,
						total_power_kw: Number(d.total_power_kw) || 0
					}
				}))
			};
		});

		const Highcharts = window.Highcharts;

		Highcharts.chart('container', {
			chart: {
				type: 'packedbubble',
				height: '900px' // 🔥 clave para que entren todos
			},

			title: {
				text: 'EV Charging Infrastructure'
			},

			subtitle: {
				text: 'Nivel 1: Año | Nivel 2: País'
			},

			tooltip: {
				useHTML: true,
				pointFormat: `
					<b>{point.name}</b><br/>
					Charging: {point.custom.charging_point}<br/>
					AC Slow: {point.custom.ac_slow}<br/>
					DC Fast: {point.custom.dc_fast}<br/>
					Power: {point.custom.total_power_kw}
				`
			},

			plotOptions: {
				packedbubble: {
					minSize: '10%',
					maxSize: '60%',
					zMin: 0,
					zMax: 2000000,

					layoutAlgorithm: {
						gravitationalConstant: 0.015,
						splitSeries: true,
						seriesInteraction: false,
						dragBetweenSeries: false,
						parentNodeLimit: true
					},

					dataLabels: {
						enabled: true,
						format: '{point.name}',
						allowOverlap: false,
						style: {
							color: 'black',
							textOutline: 'none',
							fontSize: '9px'
						}
					}
				}
			},

			series
		});
	});
</script>

<!-- 🔥 Highcharts desde navegador -->
<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/highcharts-more.js"></script>
</svelte:head>

<div id="container" style="width:100%; height:900px; max-width:1000px; margin:auto;"></div>