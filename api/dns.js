const fetch = require("node-fetch"); // to make fetch work in nodejs

module.exports = async (req, res) => {

  // TODO: Get old record id 
  // TODO: delete it (it's obsolete now!)

  const dnslinkurl = `datkey=${req.query.hash}`; // TODO: make did:method:... instead?

  let dataObj = {
    name: req.query.subdomain, //"_dnslink",  //subdomain
    type: "TXT",
    value: dnslinkurl,
  };

  var tld = req.query.tld || 'peerpiper.io' // top level domain, peerpiper or syncs.info

  const resp = await postData(
    `https://api.vercel.com/v2/domains/${tld}/records`,
    dataObj
  );
  console.log(`POST response is: ` + resp.uid);

  res.send(resp.uid); //json(resp) //.status(200).send(date);
};

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SAPPER_APP_VERCEL_TOKEN}`,
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

/** https://developers.cloudflare.com/1.1.1.1/dns-over-https/json-format/
 * curl -H 'accept: application/dns-json' 'https://cloudflare-dns.com/dns-query?name=example.com&type=AAAA' | json_pp
 * 
 * curl -H 'accept: application/dns-json' 'https://cloudflare-dns.com/dns-query?name=user6198428.peerpiper.io&type=TXT' | json_pp
 * 
 */