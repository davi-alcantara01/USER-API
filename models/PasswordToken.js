const knex = require("../database/connection");
const User = require("./User");
const crypt = require("crypto");


class PasswordToken {
  async create(email) {
    let user = await User.findByEmail(email);
    if (user == undefined) {
      return { status: false, error: "User not found" };
    }

    try {
      let token = crypt.randomBytes(16).toString("hex");

      await knex("passwordtokens").insert({
      user_id: user.id,
      used: 0,
      token: token
      });
      return { status: true, token: token };
    } catch (err) {
      return { status: false, error: err };
    }

    

  }

  async validate(token) {
    
        
    try {
      let tokenn = await knex("passwordtokens").select("*").where({ token: token });
      
      if (tokenn.length == 0) {
        return { status: false, error: "Token not found" };
      }
      
      
      if (tokenn[0].used == 1) {
        return { status: false, error: "Token already used" };
      } else {
        await knex("passwordtokens").where({ token: token }).update({ used: 1 });
        return { status: true, token: tokenn[0] };
      }


    } catch (err) {
      return { status: false, error: err };
    }


  }

}

module.exports = new PasswordToken();