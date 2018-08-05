import * as express from "express";
import * as next from "next";
import * as dotenv from "dotenv";
import * as cookieParser from "cookie-parser";

/* Add env vars from .env file */
dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    /**
     * Redirect all requests but requests to the signup page to the
     * signin page.
     */

    server.use(cookieParser());

    /**
     * TODO: Do something with query string after '/signin', for example,
     * '/signin?redirect=true'. Then consume this value from the frontend
     * to display a message telling the user why they were redirected.
     * Also do the same for the other way round redirect.
     */
    server.use((req, res, next) => {
      if (
        /* There is no token cookie present */
        !req.cookies.token &&
        /* The user is already on the signin page */
        req.path !== "/signin" &&
        /* The user is on the signup page */
        req.path !== "/signup" &&
        /* The browser is requesting other page resources */
        req.path.startsWith("/_next") === false
      ) {
        res.redirect("/signin");
      } else if (
        req.cookies.token &&
        (req.path === "/signin" || req.path === "/signup")
      ) {
        res.redirect("/chat");
      } else {
        next();
      }
    });

    /* ------------------------ Custom Routes ------------------------ */

    /**
     * Temp until implement client side redirect switch
     * on login state
     */
    server.get("/", (_req, res) => {
      res.redirect("/chat");
    });

    /* Handle "/chat/" case - currently shows a 404 page */
    server.get("/chat/:id", (req, res) => {
      const queryParams = { id: req.params.id };
      app.render(req, res, "/chat", queryParams);
    });

    /* --------------------------------------------------------------- */

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
