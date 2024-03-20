import { useAccount } from "wagmi";
import "./App.css";
import ButtonConnect from "./components/ButtonConnect";
import VideoCall from "./components/VideoCall";

function App() {
    const { isConnected } = useAccount();
    return <>{isConnected ? <VideoCall /> : <ButtonConnect />}</>;
}

export default App;
