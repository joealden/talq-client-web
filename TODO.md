# TODO

- Think about way to stop user from logging in then going back to the signin /
  signup page via the back button in the browser (client side routing). Possible
  solution is to create a site wide context that keeps track of if the user is
  logged in, and on the account pages, if this context state is true, redirect
  them to "/chat" or where they were before.
  - See if there is a way in next's router to execute a callback on every client
    side route change. If so, set it up so it checks if the user is logged in on
    every route change.

# Later

- Implement interface with API data
- Add apollo subscription support
- Look into https://github.com/lfades/next-with-apollo more
  - Had problem in \_app.js where apollo was not being accepted as a prop by
    TypeScript
  - Would be useful to add becuase from the looks of things, it provides a 0C
    way to fetch the page data before it is sent to the user (Would be even more
    useful is the application server and the web server were on the same host).
- Look into the sentry.io for client side (or SSR) error reporting
- Add now.json
- Look into setting up circleCI
