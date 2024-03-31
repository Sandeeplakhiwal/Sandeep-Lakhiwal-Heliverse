import app from "./app";

const PORT = 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
