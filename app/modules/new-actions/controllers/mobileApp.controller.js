var stringify = require('json-stringify-safe');
function mobileAppController(methods, options) {
	this.actionTestAction = (req,res) => {
		res.send("Action called");
	},
	  
	this.getMulter = (multer) =>{
		var upload = multer({ dest: 'uploads/' });
		upload = upload.array('avatar',1);
		console.log("upload")
		console.log(upload)
		console.log("upload")
		return upload; 
	  }
	this.test = (req,res) => {
		const Joi = require('joi');
 
		const schema = Joi.object().keys({
			username: Joi.string().alphanum().min(3).max(30).required(),
			password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
			access_token: [Joi.string(), Joi.number()],
			birthyear: Joi.number().integer().min(1900).max(2013),
			email: Joi.string().email({ minDomainAtoms: 2 })
		}).with('username', 'birthyear').without('password', 'access_token');

		const result = Joi.validate(req.params, schema);

		return res.send(result);
		var ret = {
			files: req.files,
			file: req.file,
			params: req.params,
			body: req.body,
			query: req.query,
			keywords: req.body.keywords

		};//npm i json-stringify-safe
		console.log(stringify(ret));
		res.send(ret);
	};
	 


}
module.exports = mobileAppController