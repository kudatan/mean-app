const app = require('./app');
const port = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(port,  () => console.log(`Started ${port}`))