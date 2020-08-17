//import fetch from "node-fetch";

import { DID_DOC_TLD } from "./constants.js";
import last from "it-last"; // gets last value of async iterator

async function fetchJSONData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      accept: "application/dns-json",
    },
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

export const getDNSLinkFromName = async (value) => {
  //if (ipfsNode) results = await resolve(ipfsNode, value) else results = 'Wait a moment, IPFS needs to finish loading'
  let url = `https://cloudflare-dns.com/dns-query?name=${value}&type=TXT`;
  let res = await fetchJSONData(url);
  //console.log(res);
  if (!res.Answer[0]) return null;

  let results = res.Answer[0].data;

  // if contains dnslink=
  if (!results.includes("dnslink=")) return null;

  let strippedQuotes = results.replace(/['"]+/g, "");
  let ipnsHash = strippedQuotes.replace(/(^dnslink=\/ipns\/)/g, "");

  return ipnsHash;
};

export const catchAndLog = (fn, log) => {
  return async (...args) => {
    try {
      await fn(...args);
    } catch (err) {
      console.log(err);
    }
  };
};

export const getData = async (ipfsNode, username) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dnsLink = await getDNSLinkFromName(`${username}.${DID_DOC_TLD}`);
      const resolvedDnsLink = await last(ipfsNode.name.resolve(dnsLink));
      const didDoc = await ipfsNode.dag.get(
        resolvedDnsLink.replace("/ipfs/", "")
      );

      if (
        didDoc &&
        didDoc.value &&
        didDoc.value.service &&
        didDoc.value.service.length > 0
      ) {
        const resolvedDataSvcLink = await ipfsNode.resolve(didDoc.value.service[0].serviceEndpoint);
        const cid = resolvedDataSvcLink.replace("/ipfs/", "")
        const data = await ipfsNode.dag.get(cid)
        console.log("Resolving promise with ", {cid, data: data.value});
        resolve({cid, data: data.value});
      } else {
        console.log(new Error(`Something was false in the Did Doc`));
        reject(false);
      }
    } catch (error) {
      console.log(error)
      reject(false);
    }
  });
};
