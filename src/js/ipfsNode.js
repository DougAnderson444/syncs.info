// IPFS ipfs for the service worker
import IPFS from "ipfs";

var ipfs, nodeId;

export const get = async (username) => {
  if (!ipfs) {
    let repo = "ipfs-"+ username;
    
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
          Delegates: [
            "/dns4/node0.delegate.ipfs.io/tcp/443/https",
            "/dns4/node1.delegate.ipfs.io/tcp/443/https",
            "/dns4/node2.delegate.ipfs.io/tcp/443/https",
            "/dns4/node3.delegate.ipfs.io/tcp/443/https",
          ],
        },
      },
      libp2p: {
        config: {
          dht: {
            enabled: false,
            clientMode: true,
          },
        },
      },
    };

    ipfs = await IPFS.create(options);

    const { agentVersion, id } = await ipfs.id();
    nodeId = id;

    //console.log(`New ipfs ${id}`);
  } else {
    //console.log(`Existing ipfs ${nodeId}`);
  }

  let multiaddr =
    "/dns4/super.peerpiper.io/tcp/4033/wss/ipfs/QmPFeUqE4x17gy6cV3bb9yjfiZvwPAtmwmt4zZqgnfEoz5";
  try {
    await ipfs.swarm.connect(multiaddr);
    console.log(`Connected to ${multiaddr}`);
  } catch (e) {
    console.log(e);
  }

  return ipfs;
};

export const getIPLDObj = async (cid) => {
  cid = new IPFS.CID(cid)
  let cidObj = await ipfs.dag.get(cid, { path: '/' })
  return Object.fromEntries(await Promise.all(Object.entries(cidObj.value).map(async ([k, v]) => {
    if (IPFS.CID.isCID(v)) {
      let vals = (await ipfs.dag.get(v, { path: '/' }))
      v = vals.value
    }
    return [k, v]
  })));
}

export const toCID = async(obj)=>{

  return (new IPFS.CID(obj))
}