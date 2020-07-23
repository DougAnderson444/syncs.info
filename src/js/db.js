import faunadb from "faunadb";

export const client = new faunadb.Client({
  secret: process.env.SAPPER_APP_FAUNADB_SUBDOMAIN_MANAGER_KEY
});
