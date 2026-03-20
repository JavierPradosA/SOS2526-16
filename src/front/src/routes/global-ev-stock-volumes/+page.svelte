<script>

    let stocks = $state([]);
    //Listar todos los recursos
    async function getData(){
        const res = await fetch ('http://localhost:3000/api/v1/global-ev-stock-volumes/',{
            method: 'GET'
        });
        const data = await res.json();
        stocks = data


    }
</script>
<p>Global EV Stock Volumes</p>
<button onclick={getData}>Obtener Datos</button>
<ul>
    {#each stocks as stock (stock.country + stock.year) }
    <li>
    JSON.stringify(stock);
    </li>
    {/each}
</ul>