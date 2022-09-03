import * as app from "./src/app";

async function startServer() {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
}
startServer();
