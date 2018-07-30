# TODO

- Continue working on chat page
  - Delete test message from most recent chat
  - Add mutation to CreateMessageBox.tsx so users can send messages to chat
  - Complete the todo in MessageList.tsx
  - Scroll to the bottom of the chat to start
    - Will require pagigation of messages (Load last 25 messages or so)
    - Will require button (at first) / trigger to load more when scrolling up

# Later

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
