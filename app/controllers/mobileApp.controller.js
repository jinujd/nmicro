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