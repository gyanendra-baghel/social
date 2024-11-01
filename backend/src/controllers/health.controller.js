const health = async (req, res) => {
  return res.status(200).json({ message: "Good!" });
};

export { health };
