const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const payment = require('./src/payment')

const port = process.env.port || 3000;


/**
 * middle wear use
 */
app.use(express.urlencoded({
  extended: false
}))
app.use(bodyParser.json());
app.set('view-engine', 'ejs');

app.get('/', (req, res) => {
  res.render('drop_in.ejs')
})
app.get('/getToken', async (req, res) => {
    let token = await payment.generateToken();
    res.send(token)
})

app.listen(port, function () {
  console.log(`listening on *:${port}`);
});