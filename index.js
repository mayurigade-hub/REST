const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { v4 : uuidv4 } = require('uuid');
// uuidv4(); // ⇨ 'b18794e8-5d0d-417c-b361-ba38e78411b4'
const methodOverride = require('method-override')

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'))

const posts = [
    {
    id : uuidv4(),
    username : "John Doe",
    content: "Learn Without Limits!"
    },
    {
    id : uuidv4(),
    username : "all.about.mayuri",
    content: "FuckEveryone!"
    },
    {
    id : uuidv4(),
    username : "Alice",
    content: "FuckCollegeMan"
    }
]

app.get('/posts', (req, res) => {
  res.render("index.ejs", { posts });
});

app.get('/posts/new', (req, res) => {
  res.render("new.ejs");
});

app.post('/posts', (req, res) => {
  let { username, content } = req.body;
  let id = uuidv4();
  posts.push({ id, username, content });
  res.redirect('/posts');
});

app.patch('/posts/:id', (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => id === p.id);
  let newContent = req.body.content;
  post.content = newContent;
  res.redirect('/posts');
});

app.get('/posts/edit/:id', (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs", { post });
});

app.get('/posts/:id', (req,res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    console.log(post);
    res.render("show.ejs", { post });   
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});