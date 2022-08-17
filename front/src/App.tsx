import { useReducer, useRef, useState } from 'react';
import { Peer } from 'peerjs';

function createPeerConnection(key) {
    const peer = new Peer(key, {
        host: 'localhost',
        port: 9000,
        path: '/api',
    });

    peer.on('open', function (id) {
        console.log('My peer ID is: ' + id);
    });

    peer.on('connection', (conn) => {
        conn.on('open', () => {
            // 有任何人加入這個會話時，就會觸發
            console.log(`${conn.peer} is connected with me`);
        });
        conn.on('data', function (data) {
            // 當收到訊息時會執行
            console.log(`${conn.peer} : ` + data);
        });
    });

    return peer;
}

const reducer = (s) => {
    return ++s;
};
function App() {
    const [, forceUpdate] = useReducer(reducer, 0);

    const peerRef = useRef(null);
    const connectRef = useRef(null);

    const [name, setName] = useState('');
    const [target, setTarget] = useState('');
    const [msg, setMsg] = useState('');

    const startConversation = () => {
        peerRef.current = createPeerConnection(name);
        forceUpdate();
    };

    const connect = () => {
        if (peerRef.current) {
            connectRef.current = peerRef.current.connect(target);
            forceUpdate();
        }
    };

    const sendMsg = () => {
        if (connectRef.current) {
            connectRef.current.send(msg);
        }
    };

    return (
        <>
            <div>
                <p>Your ID</p>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    disabled={!!peerRef.current}
                />
                <button
                    onClick={startConversation}
                    disabled={!name || !!peerRef.current}
                >
                    register
                </button>
            </div>
            <div>
                <p>Target</p>
                <input
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    type="text"
                />
                <button onClick={connect} disabled={!peerRef.current}>
                    connect
                </button>
            </div>
            <div>
                <p>Message</p>
                <input
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    type="text"
                />
                <button onClick={sendMsg} disabled={!peerRef.current}>
                    send
                </button>
            </div>
        </>
    );
}

export default App;
