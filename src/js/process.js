import { entropyToMnemonic, mnemonicToSeed } from "bip39";
import IPFS from "ipfs";
import * as cryptoKeys from "human-crypto-keys";
import createWallet from "streamlined-idm-wallet-sdk";
import { DID_DOC_TLD } from "./constants.js";

var Buffer = require("buffer/").Buffer; // note: the trailing slash is important!

const LOCK_TYPE = "passphrase";

export const recordDNSLink = async (username, ipnsHash, tld) => {
  try {
    // add DNS record
    const dnsConfirmationCode = await fetch(
      `/api/dns?subdomain=${encodeURI(username)}&hash=${encodeURI(
        ipnsHash
      )}&tld=${encodeURI(tld)}`
    );
    return await dnsConfirmationCode.text();
  } catch (err) {
    console.log(`Error in process: \n ${err}`);
    return false;
  }
};

export const savePage = async (body) => {
  console.log("saving page to fauna");
  try {
    const res = await fetch("/api/save-page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      console.log("Saved to fauna");
      return true;
    } else {
      console.log("[FAIL] NOT Saved to fauna");
      return false;
    }
  } catch ({ name, message }) {
    console.log("Fauna ERROR");
    console.error(`${name}: ${message}`);
    return false;
  }
};

export const createNewWallet = async (ipfsNode, apiMultiAddr, wsMultiAddr) => {
  let wallet = await createWallet({
    ipfs: ipfsNode,
    apiMultiAddr,
    wsMultiAddr,
  });

  return wallet;
};
//await Promise.all([algorithm, mnemonic, seed, masterKeyPair, wallet])
export const createNewIdentity = async (
  wallet,
  username,
  password,
  deviceName,
  deviceType
) => {

  console.log(`Step 2: Create Master keypair`);
  const { algorithm, mnemonic, seed, masterKeyPair } = await passwordToPem(
    username,
    password
  );

  console.log(`Step 3: Create identity: ${username}`);
  return await wallet.identities.create("ipid", {
    profileDetails: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: username,
    },
    deviceInfo: {
      type: deviceType,
      name: deviceName,
    },
    backupData: {
      algorithm,
      mnemonic,
      seed,
      ...masterKeyPair,
    },
  });

};

// password >> JWK raw >> pem
// need JWK raw to create IPFS Node PeerId
// need pem to create DID
export async function passwordToPem(username, password, index = 0) {
  const tld = "syncs.info";
  const salt = `${username}${tld}`;
  const iterations = 1000;
  const keySize = 32;
  const hash = "sha2-256";
  const derivedKey = IPFS.crypto.pbkdf2(
    password,
    salt,
    iterations,
    keySize,
    hash
  ); // create key from password

  const buf = Buffer.from(derivedKey, "utf8");
  const seed32 = await IPFS.multihashing.digest(buf, "sha2-256"); // seed needs to be 32 byte uint8array
  const ent = Buffer.from(seed32); // use seed as entropy
  const mnemonic = entropyToMnemonic(ent);
  let seedBuffer = await mnemonicToSeed(mnemonic); // ensure you can get the seed from mnemonics
  if (index > 0) {
    seedBuffer = Buffer.from(
      Buffer.from(seedBuffer).toString("hex") +
        Buffer.from(index.toString()).toString("hex")
    );
  }
  const masterKeyPair = await cryptoKeys.getKeyPairFromSeed(seedBuffer, "rsa"); // keyPair is pem (privacy enhanced mail, key format)
  //const pem = masterKeyPair.privateKey; // it's in pem format
  return { algorithm: "rsa", mnemonic, masterKeyPair, seed: seedBuffer };
}
export async function pemToPeerId(pem) {
  const privKeyRaw = await IPFS.crypto.keys.import(pem); // privKeyRaw is JWK javascript web key
  const peerId = await IPFS.PeerId.createFromPrivKey(privKeyRaw.bytes);
  return peerId;
}

async function pemToIPFS(pem) {
  const privKeyRaw = await IPFS.crypto.keys.import(pem); // privKeyRaw is JWK javascript web key
  const b64pk = Buffer.from(privKeyRaw.bytes).toString("base64"); // key needs to be base64 to create IPFS node
  const pemHash = await IPFS.multihashing.digest(
    Buffer.from(privKeyRaw.bytes),
    "sha2-256"
  ); // hash the pem for the repo name

  // Create Options object
  let options = new Object();
  options.pass = "01234567890123456789"; // need this for keychain
  options.repo = "ipfs-" + pemHash.toString("hex"); //Math.random().toString(36).substring(2, 15);
  options.EXPERIMENTAL = { ipnsPubsub: true }; // needed to publish to ipns on go-ipfs server

  // using base64 privKey
  options.init = new Object();
  options.init.privateKey = b64pk;

  let ipfs = await IPFS.create(options);
  let peerId = await ipfs.id();

  console.log(`peerId.id\n`, peerId.id);

  return ipfs;
}
