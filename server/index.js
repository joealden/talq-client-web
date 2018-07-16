const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    /* ----------------- Custom Routes ----------------- */

    /*
     * Temp until implement client side redirect switch 
     * on login state
     */
    server.get("/", (_req, res) => {
      res.redirect("/chat");
    });

    /* Redirect due to common route name */
    server.get("/login", (_req, res) => {
      res.redirect("/signin");
    });

    /* Handle "/chat/" case - currently shows a 404 page */
    server.get("/chat/:id", (req, res) => {
      const queryParams = { id: req.params.id };
      app.render(req, res, "/chat", queryParams);
    });

    /* ------------------------------------------------- */

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error(error.stack);
    process.exit(1);
  });
