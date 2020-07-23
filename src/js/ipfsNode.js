// IPFS node for the service worker
import IPFS from "ipfs";

var node, nodeId

export const get = async () => {
  if (!node) {
    let repo = "ipfs"; //+ "-"+ username;

    // pass must be at least 20 char long
    const pass = "01234567890123456789";

    const options = {
      repo: repo, // default is "ipfs", string or ipfs.Repo instance, file path at which to store the IPFS node’s data, String(Math.random() + Date.now())
      pass: pass, // https://github.com/ipfs/js-ipfs/issues/1138
      EXPERIMENTAL: { ipnsPubsub: true },
      config: {
        //dht: {
        //enabled: true,
        //},
        Addresses: {
          Swarm: [
            // "/dns4/ws-star1.par.dwebops.pub/tcp/443/wss/p2p-websocket-star",
            // "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star",
            // "/dns4/super.peerpiper.io/tcp/13577/wss/p2p-webrtc-star",
            // "/dns4/super.peerpiper.io/tcp/4033/wss/p2p/QmPFeUqE4x17gy6cV3bb9yjfiZvwPAtmwmt4zZqgnfEoz5",
          ],
        },
      },
    };

    node = await IPFS.create(options);

    const { agentVersion, id } = await node.id();
    nodeId = id;

    console.log(`New node ${id}`);
  } else {
    console.log(`Existing node ${nodeId}`);
  }

  let multiaddr =
    "/dns4/super.peerpiper.io/tcp/4033/wss/ipfs/QmPFeUqE4x17gy6cV3bb9yjfiZvwPAtmwmt4zZqgnfEoz5";
  try {
    await node.swarm.connect(multiaddr);
    console.log(`Connected to ${multiaddr}`);
  } catch (e) {
    console.log(e);
  }
  
  return node;
};
