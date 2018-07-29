# TODO

- Display warning message when user uses back button to a page that they can no
  longer access. For example:
  - When a user signs in / signs up and is redirected to `/chat`, they could
    press the back button to get back to the sign in / sign up page through
    client side routing. In this scenario, show a message to tell them that they
    are already logged in, and give them the option to either continue using the
    account logged in (Show then the username) or log out (and be redirected to
    the login page).
  - When a user logs out, they could press the back button to get back to a page
    that requires authorization. In this secnario, show a message to tell them
    that they are not logged in, and this page requires auth. Then give them the
    option to either login or signup (with links).

# Later

- Make is so that on forms, only allow submittion if all fields are valid
  (entered)
- Make toast errors stack and dismissable like on prisma.io
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
