let exp = require("express");
let cool = require("cool-ascii-faces");
const app =exp();

let html = `<hmtl><body>${cool()}</body></html>`;

app.get('/', (req,res) => {
    res.send(`${html}`)
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000")
})