# TODO

- Create New Chat Page
- Create Settings Page
- Work on switching chat page over to use subscriptions
  - will require API work as well

# Later

- Implement Apollo CLI codegen workflow to automatically creates types for query
  and mutation responses
- Type component data props better
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
