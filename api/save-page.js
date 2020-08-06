import faunadb from "faunadb";
import Pusher from "pusher";

import { client } from "../src/js/db";

const { Get, Match, Index, Update, Create, Collection } = faunadb.query;

export default async (req, res) => {
  let {
    cookies: { token },
    body: { email, html },
    headers: { host },
  } = req;

  const sessionId = token;

  // parse page information from host

  let isDev = host.includes("localhost");
  let splitHost = host.split(".");

  if ((!isDev && splitHost.length === 3) || (isDev && splitHost.length === 2)) {
    let page = splitHost[0];
    // check to see if page exists in db
    try {
      const {
        data: { sessionId: savedPageSessionId },
        ref,
      } = await client.query(Get(Match(Index("subdomain_by_name"), page)));

      if (sessionId === savedPageSessionId) {
        await client.query(
          Update(ref, {
            data: {
              html,
              email,
            },
          })
        );
      }

      res.setHeader("Set-Cookie", `token=${token}`);
      res.status(200).json({ editLink: `${req.headers.host}/?edit=${token}'` });
      return;
    } catch (e) {
      if (e.name === "NotFound") {
        try {
          // Create a document in a collection
          await client.query(
            Create(Collection("subdomains"), {
              data: {
                sessionId,
                html,
                email,
                name: page,
              },
            })
          );
          res.setHeader("Set-Cookie", `token=${token}`);
          res
            .status(200)
            .json({ editLink: `${req.headers.host}/?edit=${token}'` });
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
  }
};
