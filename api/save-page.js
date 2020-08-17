import faunadb from "faunadb";

import { client } from "../src/js/db";

const { Get, Match, Index, Update, Create, Collection } = faunadb.query;

export default async (req, res) => {
  let {
    cookies: { token },
    body: { username, ipns },
    headers: { host },
  } = req;

  const sessionId = token;

  console.log(`save <${username}> in db`);

  try {
    const { ref } = await client.query(
      Get(Match(Index("subdomain_by_name"), username))
    );
    console.log(`exists in db at ${ref}`);

    /* DO NOT UPDATE unless they have the key associated with this DID
    if (sessionId === savedPageSessionId) {
      await client.query(
        Update(ref, {
          data: {
            name,
            ipns,
          },
        })
      );
    }

    res.setHeader("Set-Cookie", `token=${token}`);
    */
    res.status(500).send();
    return;
  } catch (e) {
    if (e.name === "NotFound") {
      console.log(`page <${username}> not in db, create it`);
      try {
        // Create a document in a collection
        await client.query(
          Create(Collection("subdomains"), {
            data: {
              name: username,
              ipns,
            },
          })
        );
        res.status(200).send("Ok");
        return;
      } catch (e) {
        console.error(new Error(e.message));
        res.status(500).json({ stack: e.stack, message: e.message });
        return;
      }
    } else {
      console.error(new Error(e.message));
      res.status(500).json({ stack: e.stack, message: e.message });
      return;
    }
  }
};
