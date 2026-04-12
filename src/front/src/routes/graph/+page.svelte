<script>
	import Highcharts from 'highcharts';
	import { onMount } from 'svelte';

	onMount(async () => {

		Highcharts.chart('container', {
			title: {
				text: 'Evolución Vehículos Eléctricos',
				align: 'left'
			},

			subtitle: {
				text: 'Infraestructura vs Ventas vs Producción (datos de prueba)',
				align: 'left'
			},

			yAxis: {
				title: {
					text: 'Cantidad'
				}
			},

			xAxis: {
				categories: ['2018', '2019', '2020', '2021', '2022'],
				accessibility: {
					rangeDescription: 'Range: 2018 to 2022'
				}
			},

			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle'
			},

			plotOptions: {
				series: {
					label: {
						connectorAllowed: false
					}
				}
			},

			series: [
				{
					name: 'Puntos de carga',
					data: [5000, 8000, 12000, 15000, 20000]
				},
				{
					name: 'Ventas EV',
					data: [10000, 18000, 30000, 45000, 60000]
				},
				{
					name: 'Producción EV',
					data: [12000, 20000, 35000, 50000, 70000]
				}
			],

			responsive: {
				rules: [
					{
						condition: {
							maxWidth: 500
						},
						chartOptions: {
							legend: {
								layout: 'horizontal',
								align: 'center',
								verticalAlign: 'bottom'
							}
						}
					}
				]
			}
		});
	});
</script>

<div id="container" style="width: 100%; height: 400px; margin: 0 auto"></div>
