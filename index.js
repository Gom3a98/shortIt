const express = require('express')
const bodyParser = require("body-parser");
const cors = require("cors");
var admin = require('firebase-admin');
const randomstring = require("randomstring");
var serviceAccount = require("./config.json");

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.all("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lw-kbeer-qasqasoh-default-rtdb.firebaseio.com/"
});

async function generateURL(host, url) {

    var randStr = randomstring.generate({
        length: 5,
        charset: 'alphabetic'
    });

    var response = {
        url: url,
        short_url: host + "/" + randStr
    };

    await storePassword(randStr, response)
    return response
}

async function storePassword(id, response) {
    var db = admin.database();
    var ref = db.ref("restricted_access");
    ref.child("short_urls").child(id).set(response)
}

async function getUrl(urlID, res) {
    var db = admin.database();
    var ref = db.ref("restricted_access/short_urls/" + urlID);
    var data = {}
    ref.once("value", function (snapshot) {
        data = snapshot.val();
        res.redirect(data['url'])
    });

}

app.post('/url', cors(), async (req, res) => {
    var URL = req.body.url;
    const host = req.get('host');
    var generatedURL = await generateURL(host, URL)
    if (generatedURL != null)
        res.json(generatedURL)
    else
        res.sendStatus(500)
});

app.get('/:short_url_id', cors(), async (req, res) => {
    var url = await getUrl(req.params.short_url_id, res)
});

app.get('/', cors(), (req, res) => {
    res.send('Welcome To law kbeer qasqasoh app')
}) 


app.listen(process.env.PORT || 3001, () => {
    console.log("Started on PORT 3001");
})
