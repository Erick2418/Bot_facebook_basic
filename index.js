var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

const APP_TOKEN= 'AQUI VA EL TOKEN GENERADO';



var app = express();


app.use(bodyParser.json()); 

app.listen(3000, function(){
    console.log('el server esta en el puerto 3000');
})

app.get('/',function(req,res){
    res.send('Hola welcome to world');
})


app.get('/webhook', function(req,res){
    
    if(req.query['hub.verify_token'] === 'test_token_say_hello' ){
        res.send(req.query['hub.challenge'] );
    }else{
        res.send('No debes estar aqui herman@, vete');

    }
    

})

app.post('/webhook', function(req,res){

    var data = req.body;
    console.log('recibid data: ');
    // console.log(data);
    if(data.object == 'page'){

        data.entry.forEach(
            function(pageEntry){
                pageEntry.messaging.forEach(function(messagingEvent){
                    // console.log('Entre');
                    if(messagingEvent.message){
                        receiveMessage(messagingEvent);
                    }
                    
                }
                
                )
            }
        
        );

        res.sendStatus(200);


    }

})

function receiveMessage(event){

    console.log(event);
    var senderID = event.sender.id;
    var messageText = event.message.text;
    
    evaluateMessage(senderID, messageText);
}

function evaluateMessage(recipiendId, message){

    var finalMessage = '';

    if( message.includes('@gmail.com') || message.includes('@outlook.com') || message.includes('@yahoo.com') ){
        
        finalMessage = 'Correo recibido con exito';



    }else{
        finalMessage = "No he recibido tu correo";
    }
    sendMessageText(recipiendId, finalMessage)
}

function sendMessageText(recipiendId, message){
    var messageDate = {
        recipient:{
            id: recipiendId
        },
        message:{
            text: message
        }
    };
    callSendAPI(messageDate);
}

function callSendAPI(messageData) {

    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token : APP_TOKEN},
        method: 'POST',
        json: messageData
    },function (error, response, data) {
        if(error){
            console.log('no se envio el mensaje')
        }else{
            console.log('el mensaje se envio')
        }
    })
    
}

function isContain(sentence, word){
    return sentence.indexOf(word) >-1;
}
