# TODO

- Complete todo found in pages/settings.tsx
- Add GraphQL Subscriptions for:
  - Chat messages
  - Chats in sidebar
- Add more features to chat page
  - List of current members
    - Will require modifying Layout component to accept arbitrary component

# Later

- Look at the following links for handling the scrolling of the chat page:
  - https://twitter.com/james_k_nelson/status/1024980685507973122
  - https://reactjs.org/docs/react-component.html#getsnapshotbeforeupdate
- Make is so that on forms, only allow submittion if fields are valid (entered)
- Make toast errors stack and dismissable like on prisma.io
- Type component data props better
  - Implement Apollo CLI codegen workflow to automatically creates types for
    query and mutation responses
- Add now.json
  - Add github hooks
- Look into https://github.com/lfades/next-with-apollo more
  - Had problem in \_app.js where apollo was not being accepted as a prop by
    TypeScript
  - Would be useful to add becuase from the looks of things, it provides a 0C
    way to fetch the page data before it is sent to the user (Would be even more
    useful is the application server and the web server were on the same host).
