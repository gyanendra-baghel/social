
const health =  async (req, res) => {
    // TODO: Build a health response
    return res.status(200).json({ message: "Good!"});
}

export {
    health
}