var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
let UserController = require("../controllers/UserController");
let AdminAuth = require("../middleware/AdminAuth");

router.get('/', HomeController.index);
router.post('/user', UserController.create);
router.get('/user', AdminAuth, UserController.index);
router.get('/user/:id', AdminAuth, UserController.findUser);
router.put('/user', AdminAuth, UserController.update);
router.delete('/user/:id', AdminAuth, UserController.delete);
router.post('/recoverypassword', UserController.recoveryPassword);
router.post('/resetpassword', UserController.changePassword);
router.post('/login', UserController.login);
router.post('/verify', AdminAuth, HomeController.verify);



module.exports = router;