<script>

    let stocks = $state([]);
    //Listar todos los recursos
    async function getData(){
        const res = await fetch ('http://localhost:3000/api/v1/glonal-ev-stock-volumes/',{
            method: 'GET'
        });
        const data = await res.json();
        stocks = data


    }
</script>
<p>Global EV Stock Volumes</p>
<ul>
    {#each stocks as stock }
    <li>
        {}
    </li>
    {/each}
</ul>