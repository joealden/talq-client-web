# talq

A modern communication platform built with React and GraphQL.

## Plan

### Frontend

- React (Using a high level context provider to give login info)
- Next.js (For file based routing and easy SSR)
- Apollo client (To interface with the API)
- Styled Components (For Styling and theming)

### API

- Node
- Prisma
- GraphQL Yoga (Or possibly Apollo server 2.0 when it comes out of RC)
- JWT token creation and verification for login
- GraphQL Subscriptions (For live message updates)
  - For both currently viewed contact and all contacts to show in sidebar

### Both

- Typescript
- TSLint
- Jest

### Route Plan

If a user attempts to visit any page (That is not the login or signup pages)
when they are not logged in, (checked through a boolean passed down by a context
provider that checks local storage) they will be redirected to the login page
(`/login`). The login page will also provide a link to the signup page
(`/signup`).

If a user tries to access either the login or signup pages when they are already
logged in, they with be redirected to `/` (which will then redirect them to
their most recent chat as described below).

#### `/`

Redirect to most recent chat (`/chat/:chatId` where `:chatid` is the id of the
user's most recent chat).

#### `/login`

(Not logged in) Show a login page with email and password fields as well as a
link to signup page.

#### `/signup`

(Not logged in) Show a signup page with email, name and password with double
check. Also with a link to login page.

- email must be unique
- name does not have to be unique as it going to have a first and last name with
  people could share
- password must meet some security requirements (possibly using an existing
  lib), for example:
  - Minimum length
  - requires at least 1 number

#### `/settings`

When a user is logged in, shows a settings page where the user can change their
details. The following list shows what the user will be able to change for this
page:

#### `/chat`

Redirect to `/`.

#### `/chat/:chatId`

Shows the chat that has an id of `:chatId`. This could be a chat between two
people or a group chat. The user requesting to view this chat must be one of the
chats members.

### Data Plan

Shown in `api/__schema.gql` written in GraphQL SDL.

### Feature Plan

#### Base Feature Set

- Allow users to create and login to their accounts
- Allow users to add friends by searching for their email
  - Allow users to remove friends as well
  - Start by not requiring other user added to accept
  - Eventually switch so that searched by name + image
- Allow users to create chats with user that are their friends
  - Can be with one or more people (possibly limit)
- Allow users to create messages within a chat
  - Messages that are sent by the user themselves are put on the right side of
    the screen in a blue bubble to indicate that they sent it
  - Messages that are sent by users other than themselves are put on the left
    side of the screen in a grey bubble along with their name above the message.
    If a user sends consecutive messages, collect them together and only display
    their name at the top of the first message in the consecutive list.
- Allow users to change their settings (name, email etc.)
  - Eventually require them to verify
    - Name change requires password verification
    - Email + password change requires email sent link + password verification
- Make is so that chats and sidebar live update when other chat member has sent
  a message
- Make it so that the user can change theme (Light / dark mode), changing:
  - Background color
  - Possibly icon colors
  - Text
  - Bubble colors
- Implement paging, both for sidebar and chat
  - In sidebar, load first 15 / 20 chats
    - When user scrolls down, load the next 10 / 15 / 20 chats
  - In chat, load first 20 / 25 messages
    - When user scrolls up, load previous 20 / 25 message
- When another user sends a message in a chat, if a user is already scrolled to
  the bottom of the chat, scroll the user to the bottom of the chat when the
  message has been recieved. Do not scroll the user when they have scrolled to
  somewhere that is not at the bottom.
  - Do the same for the sidebar, if they are at the top of the sidebar and
    someone in another chat sends a message, move the sidebar location to the
    top so that the user can see that a new message has been sent.
- Allow the user to search in the sidebar (with an search bar at the top) for
  chats. This will search for the chat title / the members of the chat.
- When a user sends a message, use optimistic updates to add new message to
  chat, then add some kind of indicator to tell the user that the message was
  actually sent (bubble color change / check mark etc.)
- In sidebar, if most recent message in a chat was posted by you, prepend "You:"
  to the start of the message

#### Extra Feature Set

- Allow users to reset password without being logged in if they have forgot it
  - Requires email sent link verification
- Allow users to reset email without being logged in if they have forgot it
  - Requires more checks to be made to ensure that it is them
  - Maybe security questions?
  - Maybe recovery email that added during signup phase
- Add 'seen' message when another member has seen a message
- Allow users to create their own themes
- Add voice / video calls (with WebRTC)
- Allow people to add people / remove themselves from a chat
  - Handle case where only two people are in a chat
  - Possibly implement chat admins (Can remove / add anyone)
    - Regular users would only be able to remove themselves
- Make a block list
  - Other users cannot create a chat with you if you have blocked them
  - Blocking a user will automatically remove them from a users friends list
  - You will not be able to see them when searching for new friends
- Allow searching in a chat
- Make chat bold in sidebar when the user has not read the message
- Make the friendship system work like Facebook
  - Where when a user goes to add a friend, they make a request
  - The user they made a request to can either accept or decline it
  - If they accept it, a friendship is created
  - This means that for both of them, the other user is added to their friends
    list
  - Create new Prisma type of `Friendship` that has the following fields:
    - id: ID! @unique
    - friend1Id: ID!
    - friend2Id: ID!
