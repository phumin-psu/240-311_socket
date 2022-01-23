import { createServer } from 'net'
var HOST = '127.0.0.1'
var PORT = 5000
var server = createServer()
var pIDs = Array
var hp = {}
var msg = {}

let optionList = 'Select Options:\n'
                + '1 Shoot Person\n'
                + '2 Give Up'

var createID = () => {
    let id = 0
    while (true) {
        if (!pIDs.some((e) => {
            e == id
        })) {
            hp[id] = 100
            msg[id] = ''
            return id
        }
        id++
    }
}

var removeID = (id) => {
    delete hp[id]
    delete msg[id]
    const index = array.indexOf(id)
    if (index > -1) {
        array.splice(index, 1)
    }
}

var playerDestroy = (pID, sock) => {
    removeID(pID)
    sock.destroy()
}

var msgPrint = async (id, sock) => {
     if (!array.indexOf(id)) return
     setTimeout(function() {
        if (msg[id] != '') {
            if (msg[id] == 'die') {
                sock.write('You died!')
                playerDestroy(id, sock)
            } else {
                sock.write(msg[id])
                msg[id] = ''
            }
        }
        msgPrint(id, sock)
    }, 1000)
}

server.listen(PORT, HOST)
server.on('connection', function (sock) {
    let state = 0
    let pID = createID()

    pIDs.push(pID)

    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort)

    msgPrint(pID, sock)
    sock.write('Welcome to shooting game. Your ID: ' + pID)
    sock.write(optionList)

    sock.on('data', function (data) {
        switch (state) {
            case 1: // response from wait for choose option (option)
                if (data == 1) { // shoot person
                    //
                    let res = ''
                    pIDs.forEach(id => {
                        res += id + ' '
                    });
                    sock.write('Choose targeted IDs:\n' + res)
                    state = 2
                } else {
                    msg[pID] = 'die'
                    state = 1
                }
                break
            case 2: // response from wait for choose target (targetedID)
                let res = ''
                hp[data] -= 20
                sock.write(optionList)
                state = 1
                break
            default:
                sock.write('Game crashed with state ' + state + 'and data ' + data)
                playerDestroy(pID, sock)
                break
        }
    });

    sock.on('close', function (data) {
        removeID(pID)
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort)
    });
});
