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
