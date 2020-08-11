// small test to see if I can pubsub from the service worker, even if it's context is gone

const pingText = "Ping!";
let i = 0;
let timerId;
let node, theTopic;

const receiveMsg = async (msg) => {
  //console.log(`Pubsub Msg rx'd: \n ${msg.data.toString()} `)

  //handle Ping
  if (msg.data.toString() == pingText) {
    // respond by broadcasting the r00t hash
    //console.log(`respond by broadcasting the r00t hash \n ${addedFileHash} \nto topic \n ${topic} `)
    // sign the msg, so they know it's legit
    /*
    const msgSignature = signMessage($rootHash, $keys.privateKey);
    const msgObj = { data: $rootHash, sig: msgSignature };
    const msgString = JSON.stringify(msgObj);
    await $ipfsNode.pubsub.publish(topic, msgString);
    console.log(`published to ${topic} in rxMsg`);
    */
    console.log(`${i} Rx'd ${msg.data.toString()}`);
  } else {
    // handle data response
    console.log(`got acutal data: \n ${JSON.parse(msg.data.toString())} `);

    const msgObj = JSON.parse(msg.data);
    //console.log(`check the signature: \n Does ${JSON.parse(msg.data.toString()).data} \n Signature: ${JSON.parse(msg.data.toString()).sig}\nmatch ${$keys.publicKey}`)

    //const legit = verifySignature(msgObj.data, msgObj.sig, $keys.publicKey);
    //console.log(`legit: ${legit} `);
    // save the data to the proper location
    console.log(`topicIDs: ${JSON.stringify(msg.topicIDs)} `);
  }
};

async function subscribe(ipfsNode, topic) {
  console.log(`subscribing to ${topic}`);
  try {
    return await ipfsNode.pubsub.subscribe(topic, receiveMsg); // return a promise
  } catch {
    return new Error("error"); //throw
  }
}

const launchPings = async () => {
  i++;
  console.log(i + " " + pingText + " <" + theTopic + ">");
  try {
    await node.pubsub.publish(theTopic, pingText);
  } catch (error) {
    console.log(error);
  }
  if (i > 100) clearInterval(timerId);
};

export const startPings = async (ipfsNode, topic) => {
  node = ipfsNode;
  theTopic = topic;

  // subscribe and ping, as long as its not already pinging and subscribed
  if (i == 0 && !timerId) {
    await subscribe(ipfsNode, topic);
    timerId = setInterval(launchPings, 5000);
  }
};
