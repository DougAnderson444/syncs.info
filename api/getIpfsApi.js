module.exports = async (req, res) => {

  try {
    ipfsAPI = IpfsHttpClient(process.env.SAPPER_APP_API_URL);
    const { id } = await ipfsAPI.id();
    console.log(`fetched API`, id)
  } catch (error) {
    console.log(error)
  }
  res.status(200).json(ipfsAPI);
};