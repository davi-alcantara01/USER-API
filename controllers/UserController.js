const PasswordToken = require("../models/PasswordToken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
require('dotenv').config();


let secret = process.env.JWT_SECRET;

class UserController{
  async index(req, res) {
    let users = await User.findAll();
    res.json(users);
  }

  async findUser(req, res) {
    let id = req.params.id;
    let result = await User.findById(parseInt(id));
    if (result == undefined) {  
      res.status(404);
      res.send("User not found");
      return
    }
    res.json(result);
  }

  async create(req, res) {
    let { name, email, password } = req.body;

    if (email == undefined) {
      res.status(400);
      res.send("Email is required");
      return
    }
    if (name == undefined) {
      res.status(400);
      res.send("Name is required");
      return
    }
    if (password == undefined) {
      res.status(400);
      res.send("Password is required");
      return
    }
    let emailExists = await User.findEmail(email);
    if (emailExists) {
      res.status(406);
      res.send("Email already exists");
      return
    }

    await User.new(name, email, password);

    console.log(name, email, password);
    res.send("User created");
  }

  async update(req,res) {
    let {id, email, name} = req.body;

    let userJson = await User.findById(id);
    if (userJson == undefined) {
      res.status(404);
      res.send("User not found");
      return
    }

    if (id == undefined) {
      res.status(400);
      res.send("Id is required");
      return
    }

    if (email == undefined) {
      email = userJson.email;
    }
    if (name == undefined) {
      name = userJson.name;
    }

    let user = await User.update(id, email, name);
    if (user.status == false) {
      res.status(406);
      res.send(user.error);
      return
    }
    res.send("User updated");
  }

  async delete(req, res) {
    let id = req.params.id;
    if (id == undefined) {
      res.status(400);
      res.send("Id is required");
      return
    }
    let del = await User.delete(id);
    if (del.status == false) {
      res.status(406);
      res.send(del.error);
      return
    }

    res.send("User deleted");
  }

  async recoveryPassword(req, res) {
    let email = req.body.email;
    if (email == undefined) {
      res.status(400);
      res.send("Email is required");
      return
    }

    let result = await PasswordToken.create(email);
    if (result.status == false) {
      res.status(406);
      res.send(result.error);
      return
    }

    res.send(`Your token is: ${result.token}`);
  }

  async changePassword(req, res) {
    let token = req.body.token;
    let password = req.body.password;

    let result = await PasswordToken.validate(token);
    if (result.status == false) {
      res.status(406);
      res.send(result.error);
      return
    }

    await User.change(password, result.token.user_id, result.token.token);
    res.send("Password changed");

  }

  async login(req, res) {
    let { email, password } = req.body;
    if (email == undefined) {
      res.status(400);
      res.send("Email is required");
      return
    }
    if (password == undefined) {
      res.status(400);
      res.send("Password is required");
      return
    }
    let user = await User.findByEmail(email);
    if (user == undefined) {
      res.status(406);
      res.send("User not found");
      return
    }

    let match = await bcrypt.compare(password, user.password);

    if (!match) {
      res.status(406);
      res.send("Invalid password");
      return
    }
    let token = jwt.sign({ email: user.email, role: user.role}, secret);
    res.send("Welcome " + user.name + ", your token is: " + token);
  }
}

module.exports = new UserController();