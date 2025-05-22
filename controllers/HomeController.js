class HomeController{

    async index(req, res){
        res.send("STARTING API");
    }

    async verify(req, res) {
        res.send("OK");
    }

}

module.exports = new HomeController();