const { Socket } = require('dgram');
var net = require('net')
var rl = require('readline')

var HOST = '127.0.0.1'
var PORT = 5000

var client = new net.Socket()
var readline = rl.createInterface(process.stdin, process.stdout)
var state = 0

readline._normalWrite = function(b) {
    if(b == undefined) {
        return;
    }
    if(!this._line_buffer) {
        this._line_buffer = '';
    }
    this._line_buffer += b.toString();
    if(this._line_buffer.indexOf('\n') !=-1 ) {
        var lines = this._line_buffer.split('\n');
        // either '' or the unfinished portion of the next line
        this._line_buffer = lines.pop();
        lines.forEach(function(line) {
            this._onLine(line + '\n');
        }, this);
    }
};

client.connect(PORT, HOST, function(){
    console.log('Connected');
})

client.on('data',function(data){
    //console.log('!!! Log > state ' + state + ' data ' + data)
    console.log("" + data)
    switch(state){
        case 0:
            state = 1
            break
        case 1:
            readline.on('line', function (line) {
                console.log(`${state} Got ${line}!`)
                client.write("" + line)
                if(line == 1) state = 2
            })
            break
        case 2:
            readline.on('line', function (line) {
                console.log(`${state} Got ${line}!`)
                client.write("" + line)
                state = 1
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