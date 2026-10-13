# Quora-Style Posts App --- Node.js, Express, and EJS

A small CRUD application that lets users create posts, view all posts,
view one post, edit post content, and delete posts. It uses **Express**
for routing, **EJS** for server-rendered HTML, **UUID** for post IDs,
and **method-override** to support PATCH and DELETE requests from HTML
forms.

> **Important:** Posts are stored in a JavaScript array in memory. They
> are reset to the initial sample posts whenever the server restarts.
> This project does not use a database yet.

## Features

-   View all posts.
-   Create a new post with a username and content.
-   View an individual post by its ID.
-   Edit a post's content.
-   Delete a post.
-   Render dynamic pages with EJS.
-   Serve CSS from the `public` directory.
-   Generate unique post IDs using UUIDs.

## Tech Stack

-   Node.js
-   Express
-   EJS
-   `uuid`
-   `method-override`
-   HTML and CSS

## Installation and Setup

### 1. Create the project and initialize npm

``` bash
mkdir posts-app
cd posts-app
npm init -y
```

### 2. Install dependencies

``` bash
npm install express ejs uuid method-override
```

### 3. Suggested folder structure

``` text
posts-app/
├── app.js
├── package.json
├── views/
│   ├── index.ejs
│   ├── new.ejs
│   ├── show.ejs
│   └── edit.ejs
└── public/
    └── style.css
```

The filenames and directories must match the paths used in the
application.

### 4. Run the application

Save the Express code in `app.js`, then run:

``` bash
node app.js
```

Open <http://localhost:3000/posts> in your browser.

The terminal should display:

``` text
Server is running on http://localhost:3000
```

## Understanding `app.js`

### 1. Importing packages

``` js
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
```

-   `express` creates the web server and defines routes.
-   `path` builds file-system paths that work across operating systems.
-   `uuidv4()` generates a unique ID for each post.
-   `method-override` allows HTML forms to trigger methods such as PATCH
    and DELETE.

### 2. Middleware and EJS configuration

``` js
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
```

-   `express.urlencoded({ extended: true })` parses URL-encoded form
    data and makes it available through `req.body`.
-   `app.set('view engine', 'ejs')` configures EJS as the template
    engine.
-   `app.set('views', ...)` tells Express where the EJS templates are
    located.
-   `express.static(...)` serves files such as `/style.css` from the
    `public` directory.
-   `methodOverride('_method')` reads the `_method` query parameter and
    overrides the submitted HTTP method.

Middleware should be registered before the routes that rely on it.

### 3. The posts array

``` js
let posts = [
    {
        id: uuidv4(),
        username: 'John Doe',
        content: 'Learn Without Limits!'
    }
];
```

The actual project starts with three sample posts. Each post is an
object with:

-   `id`: unique identifier.
-   `username`: the author's username.
-   `content`: the text of the post.

Because `posts` is an in-memory array, changes are not persistent. A
database can replace this array in a later version.

## Routes and CRUD Operations

### Route summary

  Method   Route               Purpose
  -------- ------------------- ------------------------------
  GET      `/posts`            Display all posts
  GET      `/posts/new`        Display the create-post form
  POST     `/posts`            Create a post
  GET      `/posts/:id`        Display one post
  GET      `/posts/:id/edit`   Display the edit form
  PATCH    `/posts/:id`        Update a post's content
  DELETE   `/posts/:id`        Delete a post

### 1. Index --- display all posts

``` js
app.get('/posts', (req, res) => {
    res.render('index.ejs', { posts });
});
```

Express passes the `posts` array to `index.ejs`. The template loops
through the array and displays each post.

### 2. New --- display the form

``` js
app.get('/posts/new', (req, res) => {
    res.render('new.ejs');
});
```

This route displays the form for creating a post. It does not create the
post itself.

### 3. Create --- process the form

``` js
app.post('/posts', (req, res) => {
    let { username, content } = req.body;
    let id = uuidv4();

    posts.push({ id, username, content });
    res.redirect('/posts');
});
```

The form submits `username` and `content`. The URL-encoded body-parsing
middleware makes those fields available through `req.body`. The route
creates a UUID, adds the new post to the array, and redirects to the
index page.

### 4. Show --- display one post

``` js
app.get('/posts/:id', (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);

    console.log(post);
    res.render('show.ejs', { post });
});
```

For a URL such as `/posts/abc123`, Express puts the path value in
`req.params.id`. `find()` searches for the post whose ID matches.

The `show.ejs` template uses the `post` object to display its ID,
username, and content.

### 5. Edit --- display the edit form

``` js
app.get('/posts/:id/edit', (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);

    res.render('edit.ejs', { post });
});
```

This route finds the existing post and passes it to `edit.ejs`, which
pre-fills the form with the current username and content.

### 6. Update --- save edited content

``` js
app.patch('/posts/:id', (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    let newContent = req.body.content;

    post.content = newContent;
    res.redirect('/posts');
});
```

The route finds the post by ID, reads the new content from the submitted
form, updates the object, and redirects to `/posts`.

This implementation edits only the content; it does not update the
username.

### 7. Destroy --- delete a post

``` js
app.delete('/posts/:id', (req, res) => {
    let { id } = req.params;
    posts = posts.filter((p) => p.id !== id);

    res.redirect('/posts');
});
```

`filter()` creates a new array containing every post except the one
whose ID matches the requested ID. Reassigning `posts` removes that post
from the in-memory collection.

## How the EJS Templates Work

### `index.ejs` --- all posts

The index template loops through the `posts` array:

``` ejs
<% for (post of posts) { %>
    <div class="post">
        <h3 class="user"><%= post.username %></h3>
        <h4><%= post.content %></h4>

        <a href="/posts/<%= post.id %>">View Post in detail</a>
        <a href="/posts/<%= post.id %>/edit">Edit your Post</a>

        <form method="POST" action="/posts/<%= post.id %>?_method=DELETE">
            <button type="submit">Delete Post</button>
        </form>
    </div>
<% } %>
```

-   `<% ... %>` executes JavaScript without directly outputting it.
-   `<%= ... %>` outputs a value and HTML-escapes it.
-   The links include each post's ID so the server can identify the
    selected post.
-   The delete form submits POST, and method-override turns it into
    DELETE.

### `new.ejs` --- create a post

``` html
<form method="POST" action="/posts">
    <input type="text" name="username" placeholder="enter username">
    <textarea name="content" placeholder="write your post here"></textarea>
    <button type="submit">Create Post</button>
</form>
```

The `name` attributes are important: they become the keys in `req.body`
after Express parses the form submission.

### `show.ejs` --- post details

``` ejs
<h1>Here is your post in detail</h1>
<p>Post id: <%= post.id %></p>

<div class="post">
    <h3 class="user">@<%= post.username %></h3>
    <h4><%= post.content %></h4>
</div>
```

The route supplies one `post` object to this template.

### `edit.ejs` --- edit a post

``` ejs
<form method="POST" action="/posts/<%= post.id %>?_method=PATCH">
    <textarea name="content" rows="10" cols="35"><%= post.content %></textarea>
    <button type="submit">Update Post</button>
</form>
```

HTML forms natively support GET and POST, not PATCH or DELETE. The form
therefore submits POST with `?_method=PATCH`, and `method-override`
makes Express handle it as PATCH.

## How CSS Is Served

The CSS file is stored at:

``` text
public/style.css
```

Example CSS:

``` css
h1 {
    color: maroon;
}

.post {
    background-color: blanchedalmond;
}

.user {
    font-style: italic;
}
```

Templates link to the stylesheet with:

``` html
<link rel="stylesheet" href="/style.css">
```

Because `express.static()` serves the `public` folder, `/style.css` maps
to `public/style.css`.

## Request Flow

``` text
Browser
  |
  | GET /posts
  v
Express route: app.get('/posts', ...)
  |
  | res.render('index.ejs', { posts })
  v
EJS generates HTML
  |
  v
Browser displays the posts
```

For creating a post:

``` text
Browser submits POST /posts
  |
  v
express.urlencoded() parses form fields
  |
  v
req.body contains username and content
  |
  v
Express creates an ID and adds the post to the array
  |
  v
res.redirect('/posts')
  |
  v
Browser requests GET /posts and sees the updated list
```

## Important Improvements for a More Robust App

The current code is a learning project. Before using it as a real
application, consider these improvements:

1.  **Handle missing IDs.** `find()` can return `undefined`. The show,
    edit, and update routes should return a 404 response when a post is
    not found instead of trying to use a missing post.
2.  **Validate form input.** Check that `username` and `content` are
    present and have acceptable lengths.
3.  **Persist the data.** Use a database because the array resets when
    the server restarts.
4.  **Use consistent IDs.** Generate UUIDs for new posts, as the current
    code does.
5.  **Avoid unsafe assumptions.** Treat form input as untrusted and
    validate it on the server.
6.  **Keep dependencies installed.** Commit `package.json` and
    `package-lock.json`, but normally do not commit `node_modules/`.

## Key Takeaways

-   Express handles HTTP requests through routes.
-   Middleware parses form submissions, serves static files, and
    supports method overriding.
-   EJS renders dynamic HTML using data passed by `res.render()`.
-   UUIDs identify posts.
-   `find()` locates one post; `push()` adds a post; `filter()` removes
    a post by creating a new array.
-   `method-override` lets HTML forms trigger PATCH and DELETE routes.
-   The project implements the core CRUD flow, but currently stores
    posts only in memory.
