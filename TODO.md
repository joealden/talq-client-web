# TODO

## Note

The message duplication issue that was happening on slow network connections has
been mitigated, however it was it a rather hacky fashion. The issue was that for
some reason, the cache was not getting correctly rolled back, causing the
optimistic response version of the message to remain when the client got a
response from the server. I believe the cause of the issue lies somewhere in the
implementation of Apollo cache, possibly something to do with the `@connection`
directive. The issue was mitigated by performing a check in the `messageReducer`
found in `/components/chat/MessageList.tsx` to ensure that no messages in the
list have the same message id. While this means that the user no longer sees the
issue, the duplicated messages still exist in the apollo cache, we are just
ignoring them. As noted in the reducer, a better solution should be found as the
check may cause performance issues (as the whole message array has to be
iterated over).

## Now

- Investigate the following issue:
  - REPRODUCTION
    - Two users are logged in
    - The users are not friends
    - One of the users adds the other as a friend
    - The same user then creates a chat with this new friend
  - ISSUE
  - The user that did not create the chat does not get their chat list updated
    with this new chat

## Later

- Implement pagination
- Better document development and production deployments of both client and API
  including using seperate staging environments for the prisma service
- Figure out a way to duduplicate cache storage due to race condition. This is
  explained more at the top of `components/layout/ChatList.tsx`.
- Extract out common code in new chat components
- Extract out Remove and Add buttons in friends lists
- Extract out common code between new chat page and friends page (into root
  `/utils` folder)
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
- Look into https://github.com/lfades/next-with-apollo more
  - Had problem in \_app.js where apollo was not being accepted as a prop by
    TypeScript
  - Would be useful to add becuase from the looks of things, it provides a 0C
    way to fetch the page data before it is sent to the user (Would be even more
    useful is the application server and the web server were on the same host).
