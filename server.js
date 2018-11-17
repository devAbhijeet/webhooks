require('dotenv').config()

const express = require('express')
const crypto = require('crypto')
const bodyParser = require('body-parser')
const compare = require('secure-compare')
const app = express()
const port = 3000

const verify_signature = function(payload_body, req, res){
    hash = 'sha1=' + crypto.createHmac('sha1', process.env.SECRET_TOKEN).update(JSON.stringify(payload_body)).digest('hex')
    if(!compare(hash, req.get('x-hub-signature'))){
        res.status(500)
        res.json({ error: 'The x-hub-signature in request header does not matches with the computed hash signature' })
    }else{
        res.status(200)
        res.json({ message: 'Succesfully matched computed hash and x-hub-signature in request header' })
    }
}

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.post('/payload', function(req, res) {

    let payload_body = req.body
    console.log("payload_body is ", JSON.stringify(payload_body));
    verify_signature(payload_body, req, res)
});

app.listen(port, function(){
    console.log(`Example appsss listening on port ${port}!`)
});