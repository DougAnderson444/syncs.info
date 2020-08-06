import { exchangeMessages } from "./connectServiceWorker.js";

export const createUser = async (
  username,
  password,
  deviceName,
  deviceType,
  apiUrl,
  wsUrl
) => {
  try {
    let res = await exchangeMessages(
      JSON.stringify({
        func: "createUser",
        args: [username, password, deviceName, deviceType, apiUrl, wsUrl],
      })
    );
  } catch (error) {
    console.log(error);
  }
};

export function parseCreateUserMsg(args) {
  let username, password, deviceName, deviceType, apiUrl, wsUrl;

  username = args.shift();
  password = args.shift();
  deviceName = args.shift();
  deviceType = args.shift();
  apiUrl = args.shift();
  wsUrl = args.shift();

  return { username, password, deviceName, deviceType, apiUrl, wsUrl };
}
