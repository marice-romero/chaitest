const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));
app.use(express.json());

const people = [];

// app.all("/api/v1/*", (req, res) => {
//   res.json({ error: "That route is not implemented." });
// });

app.get("/api/v1/people", async (req, res) => {
  try {
    res.status(200).json({ people });
    console.log(people.lastIndex);
  } catch (err) {
    console.log(err);
  }
});
app.post("/api/v1/people", async (req, res) => {
  try {
    const person = req.body;
    if (!person.name) {
      res.status(400).json({ error: "Please enter a name." });
    }
    if (!person.age) {
      res.status(400).json({ error: "Please enter an age." });
    }
    if (person.age < 0) {
      res.status(400).json({ error: "Please enter a valid age." });
    }
    let index = people.length;
    people.push(person);
    res.status(200).json({ msg: "A person record was added.", index: index });
  } catch (err) {
    console.log(err);
  }
});
app.get("/api/v1/people/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (id < 0 || id > people.length - 1) {
      res.status(404).json({ msg: "A person with that ID does not exist." });
    }
    const person = people[id];
    res.status(200).json({ person });
  } catch (err) {
    console.log(err);
  }
});

const server = app.listen(3000, () => {
  console.log("listening on port 3000...");
});

module.exports = { app, server };
