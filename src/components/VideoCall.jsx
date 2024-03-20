import Peer from "peerjs";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import io from "socket.io-client";

const socket = io("https://stag-api-web-rtc.vertiree.com/");

function VideoCall() {
    const [peerId, setPeerId] = useState("");
    const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
    const [currentStream, setCurrentStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const { address } = useAccount();
    const [status, setStatus] = useState("");
    const [callRemote, setCallRemote] = useState(null);
    const [detetedDisconnect, setDetetedDisconnect] = useState(false);

    useEffect(() => {
        if (address) {
            const peer = new Peer();

            peer.on("open", (id) => {
                setPeerId(id);
            });

            peer.on("call", (call) => {
                console.log(call);
                setStatus("someone is calling you");
                setCallRemote(call);
            });
        }
    }, [address]);

    useEffect(() => {
        socket.on("connect", () => {
            /* catch reject */
            socket.on("reject", (response) => {
                console.log("reject with info: ", response);
                setDetetedDisconnect(true);
            });
            /* catch accept */
            socket.on("accept", (response) => {
                console.log("accept with info: ", response);
            });
        });
    }, []);

    useEffect(() => {
        if (detetedDisconnect) {
            setStatus("");
            if (currentStream) {
                setCurrentStream(null);
                setRemoteStream(null);
                currentStream.getTracks().forEach((track) => {
                    track.stop();
                });
            }
            setDetetedDisconnect(false);
        }
    }, [detetedDisconnect, currentStream]);

    const call = (remotePeerId) => {
        setStatus("calling...");
        const newPeer = new Peer();
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        getUserMedia({ video: true, audio: true }, (mediaStream) => {
            setCurrentStream(mediaStream);

            const call = newPeer.call(remotePeerId, mediaStream);

            console.log(call);

            call.on("stream", (remoteStream) => {
                setRemoteStream(remoteStream);
                setStatus("starting...");
            });
        });
    };

    const answer = () => {
        setStatus("starting...");
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        getUserMedia({ video: true, audio: true }, (mediaStream) => {
            setCurrentStream(mediaStream);

            callRemote.answer(mediaStream);
            callRemote.on("stream", function (remoteStream) {
                setRemoteStream(remoteStream);
            });
        });
    };

    const disconnect = () => {
        const rejectMSG = {
            caller: remotePeerIdValue,
            roomId: peerId,
        };
        socket.emit("reject", rejectMSG);
    };

    return (
        <div className="App">
            <h1>Current user id is {peerId}</h1>
            <input
                type="text"
                placeholder="Enter address to call"
                value={remotePeerIdValue}
                onChange={(e) => setRemotePeerIdValue(e.target.value)}
            />
            {status && <h2>{status}</h2>}
            <button onClick={() => call(remotePeerIdValue)}>Call</button>
            {status === "someone is calling you" && (
                <>
                    {" "}
                    <button onClick={answer}>Answer</button>
                    <button onClick={disconnect}>Disconnect</button>
                </>
            )}
            {status === "calling..." && <button onClick={disconnect}>Disconnect</button>}
            {status === "starting..." && <button onClick={disconnect}>Disconnect</button>}
            <div>
                {currentStream && (
                    <video
                        autoPlay
                        ref={(ref) => {
                            if (ref) {
                                ref.srcObject = currentStream;
                            }
                        }}
                    />
                )}
            </div>
            <div>
                {remoteStream && (
                    <video
                        autoPlay
                        ref={(ref) => {
                            if (ref) {
                                ref.srcObject = remoteStream;
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default VideoCall;
