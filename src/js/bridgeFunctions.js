import { exchangeMessages } from "./connectServiceWorker.js";

export const createUser = async (
  username,
  password,
  deviceName,
  deviceType
) => {
  try {
    let res = await exchangeMessages(
      JSON.stringify({
        func: "createUser",
        args: [username, password, deviceName, deviceType],
      })
    );
  } catch (error) {
    console.log(error);
  }
};

export function parseUserMsg(args) {
  let username, password, deviceName, deviceType;

  username = args.shift();
  password = args.shift();
  deviceName = args.shift();
  deviceType = args.shift();

  return { username, password, deviceName, deviceType };
}
