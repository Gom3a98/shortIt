const express = require('express')
const bodyParser = require("body-parser");
const cors = require("cors");
var admin = require('firebase-admin');
var path = require("path")
const randomstring = require("randomstring");
// var serviceAccount = require("./secret/config.json");
require("dotenv").config();
const app = express()
const serviceAccount = {
    "type": process.env.TYPE,
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY,
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri":process.env.TOKEN_URI,
    "auth_provider_x509_cert_url":process.env.AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL
  }  
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
        res.json({
            generatedURL
        })
    else
        res.sendStatus(500)
});

app.get('/:short_url_id', cors(), async (req, res) => {
    var url = await getUrl(req.params.short_url_id, res)
});

app.get('/', cors(), (req, res) => {
    res.sendFile(path.join(__dirname, "views" , "./index.html"));
}) 


app.listen(process.env.PORT || 3001, () => {
    console.log("Started on PORT 3001");
})
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));
