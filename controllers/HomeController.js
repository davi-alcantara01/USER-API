class HomeController{

    async index(req, res){
        res.send("STARTING API");
    }

}

module.exports = new HomeController();