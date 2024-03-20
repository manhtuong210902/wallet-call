import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";

function ButtonConnect() {
    const { open } = useWeb3Modal();
    const { address } = useAccount();

    return <div>{address ? <p>{address}</p> : <button onClick={open}>Connect</button>}</div>;
}

export default ButtonConnect;
