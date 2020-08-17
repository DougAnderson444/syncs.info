export const saveToIPFS = async (node, path, content) => {
  let cid;

  try {
    await node.files.write(path, content, {
      create: true,
      parents: true,
    });
    // write to disk
    cid = await node.files.flush("/");
    console.log(`Flushed ${path} / ${content} to ${cid}`)
  } catch (err) {
    console.log(err);
  }

  return cid;
};

const removeKey = async (node, keyName) => {
  const keysList = await node.key.list();
  const hasKey = keysList.some(({ name }) => name === keyName);

  if (!hasKey) {
    return;
  }

  await node.key.rm(keyName);
};

export const importKey = async (node, keyName, pem, password) => {
  await removeKey(node, keyName);

  await node.key.import(keyName, pem, password);
};

const generateKeyName = () => `js-ipid-${generateRandomString()}`;

const generateRandomString = () => {
  Math.random().toString(36).substring(2);
};