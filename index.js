const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, 'public')));

const posts = [
    {
    username : "John Doe",
    content: "Learn Without Limits!"
    },
    {
    username : "all.about.mayuri",
    content: "FuckEveryone!"
    },
    {
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
  posts.push({ username, content });
  res.send("post request working!")
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});