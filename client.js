const { Socket } = require('dgram');
var net = require('net')

var HOST = '127.0.0.1'
var Port = 5000

var client =new net.Socket()
const readline = require('readline').createInterface(
{
    input: process.stdin,
    output: process.stdout
})
var state = 0

client.connect(PORT, HOST, function(){
    console.log('Connected');
    client.write('I want to play games!!!');
    console.log('Wait for your player-Id');
})

client.on('data',function(data){
    console.log("" + data)
    switch(state){
        
        case 0:
            state = 1;

        case 1:
            readline.question(`Choose your option: `, datainput => 
            {
                client.write("" + datainput)
                if(datainput == 1)
                    state = 2
                readline.close()
            })
            break

        case 2:
            readline.question(`Choose your target: `, datainput => 
            {
                client.write("" + datainput)
                state = 1;
                readline.close()
            })
            break

        default: 
            console.log('Game error: state'+ state + 'data' + data)
            client.destroy()
            break
    }
})

client.on('close',function(){
    console.log('GoodBye')
})