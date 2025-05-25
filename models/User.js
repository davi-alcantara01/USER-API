const knex = require("../database/connection")
const bcrypt = require("bcrypt")
require('dotenv').config();

let salt = parseInt(process.env.BCRYPT_SALT_ROUNDS);


class User {
  async new(name, email, password) {

    let hash = await bcrypt.hash(password, salt);

    await knex.insert({name, email, password: hash, role: 0}).table("users");
      
  }

  async findEmail(email) {
    try {
      let result = await knex("users").select("*").where({ email: email });
      if (result.length == 0) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async findAll() {
    try {
      let result = await knex("users").select(["id", "email", "name", "role"]).from("users");
      return result;
    } catch (err) { 
      return [];
    }
  }

  async findById(id) {
    try {
      let result = await knex("users").select(["id", "email", "name", "role"]).where({ id: id });
      if (result.length == 0) {
        return undefined;
      } else {
        return result[0];
      }
    } catch (err) {
      return undefined;
    }
  }

  async findByEmail(email) {
    try {
      let result = await knex("users").select(["id", "email", "password", "name", "role"]).where({ email: email });
      if (result.length == 0) {
        return undefined;
      } else {
        return result[0];
      }
    } catch (err) {
      return undefined;
    }
  }

  async update(id, email, name, role) {
    let user = await this.findById(id);

    if (user == undefined) {
      return {status: false, error: "User not found"};
    }

    let emailExists = await this.findEmail(email);

    if (emailExists && email != user.email) {
      return {status: false, error: "Email already exists"};
    }

    let editUser = {
      email: email,
      name: name,
      role: role
    }


    try {
      await knex("users")
        .where({ id: id }).update(editUser);
        return {status: true, error: null};
    } catch (err) {
      console.log(err);
      return {status: false, error: "Error updating user"};
    }
    

  }

  async delete(id) {
    let user = await this.findById(id);
    if (user == undefined) {
      return {status: false, error: "User not found"};
    }
    try {
      await knex("users").delete().where({id: id});
      return {status: true, error: null};
    } catch (err) {
      console.log(err);
      return {status: false, error: "Error deleting user"};
    }
  }

  async change(newPassword, id) {

    let hash = await bcrypt.hash(newPassword, salt);
    await knex("users").where({id: id}).update({password: hash});
  }

}
module.exports = new User();