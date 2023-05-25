const venom = require('venom-bot');
const express = require('express');
const app = express();
const port = 3000;

//VENOM
const chromiumArgs = [
  '--disable-web-security', '--no-sandbox', '--disable-web-security',
  '--aggressive-cache-discard', '--disable-cache', '--disable-application-cache',
  '--disable-offline-load-stale-cache', '--disk-cache-size=0',
  '--disable-background-networking', '--disable-default-apps', '--disable-extensions',
  '--disable-sync', '--disable-translate', '--hide-scrollbars', '--metrics-recording-only',
  '--mute-audio', '--no-first-run', '--safebrowsing-disable-auto-update',
  '--ignore-certificate-errors', '--ignore-ssl-errors', '--ignore-certificate-errors-spki-list'
];

venom.create({
    useChrome: false,
    browserArgs: chromiumArgs,
    session: 'session-name',
  }).then((client) => main(client))
  .catch((erro) => {
    console.log(erro);
  });

var globalClient = venom.Whatsapp
function main(client) {
  globalClient = client
}

//EXPRESS
app.use(express.json());
app.post('/wa', (req, res) => {
  const { number, message } = req.body;

  if (number == '' || message == '') {
    var data = {
      status: false,
      message: "message and number is required"
    };

    return res.status(401).json(data);
  } 

  var numberFormat = number.toString()+"@c.us";
  var send = sendMessage(numberFormat,message)
  if (send == false){
    var data = {
      status: false,
      message: "number not found"
    };

    return res.status(404).json(data);
  }

  var data = {
    status: true,
    message: "-"
  };
  return res.status(200).json(data);
});

function sendMessage(number,message){
  var flag = true
  globalClient.sendText(number, message)
    .then((result) => {
      flag = true
    });

  if (flag == true){
    return true
  }else{
    return false
  }
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});