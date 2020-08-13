//import fetch from "node-fetch";

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
  console.log(url);
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
      await fn(...args)
    } catch (err) {
      console.log(err)
    }
  }
}