# TODO

## Important Note

Subsciptions get completely borked by HMR updates when in dev mode. This will
results in a network error from Apollo. This is likely because HMR uses a
WebSocket connection to provide the updates to the browser, and this is messing
with the WebSocket connection that Apollo creates.

## Now

- Implement `overflow-wrap: break-word` in chat page correctly so continuous
  words in messages that would be longer than 60% of the width of the container
  break at 60% width.

## Later

- Extract out common code in new chat components
- Extract out Remove and Add buttons in friends lists
- Extract out common code between new chat page and friends page (into root
  `/utils` folder)
- Update chatlist cache when sending a message from a chat page
- Add GraphQL Subscriptions for:
  - Chats in sidebar
- Add more features to chat page
  - Will require modifying Layout component to accept arbitrary component
  - Button and popup to change chat title
  - List of current members
    - Ability to add and remove users
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
