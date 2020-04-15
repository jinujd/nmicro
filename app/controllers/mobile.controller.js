
function mobileController(methods, options) {
	const District = methods.loadModel('district');
	const LsgiType = methods.loadModel('lsgiType');
	const Lsgi = methods.loadModel('lsgi');
	const Ward = methods.loadModel('ward');
	const Category = methods.loadModel('category');
	const CategoryRelationship = methods.loadModel('categoryRelationship');
	const Meta = methods.loadModel('meta');
	const User = methods.loadModel('user');
	const FacilitySurvey = methods.loadModel('facilitySurvey');
	const FacilitySurveyQuestion = methods.loadModel('facilitySurveyQuestion');
	const CategoryFacilitySurveyQuestion = methods.loadModel('categoryFacilitySurveyQuestion');
	const Survey = methods.loadModel('survey');
	const SurveyAnswer = methods.loadModel('surveyAnswer');
	const QuestionOption = methods.loadModel('questionOption');
	const Question = methods.loadModel('question');
	const PercentageConfiguarationSlab = methods.loadModel('percentageConfiguarationSlab');
	const Version = methods.loadModel('version');
	const FacilityType = methods.loadModel('facilityType');
	const Otp = methods.loadModel('otp');

	var bcrypt = require('bcryptjs');
	const salt = bcrypt.genSaltSync(10);
	const Sequelize = require('sequelize');
	const constants = require("../helpers/constants")
	const jwt = require('jsonwebtoken'); 

 
	var config = require('../../config/app.config.js');
	const profileConfig = config.profile;
 
	var otpConfig = config.otp;
	this.getMulter = (multer) =>{
		var upload = multer({ dest: 'uploads/' });
		upload = upload.single('avatar');
		console.log("upload")
		console.log(upload)
		console.log("upload")
		return upload; 
	  }

	this.appListDistrict = async (req, res) => {
		let params = req.query;
		let lang = "";
		lang = req.headers.x_lang;

		let attributesArray = []
		if (constants.APP_LANG_MALAYALAM === lang) {
			attributesArray.push('name_ml');
		} else if (constants.APP_LANG_ENGLISH === lang) {
			attributesArray.push('name_en');
		} else {
			return res.send({
				success: 0,
				message: 'Please specify language'
			})
		}

		let page = params.page || 1;
		let perPage = Number(params.perPage) || 10;
		perPage = perPage > 0 ? perPage : 10;
		var offset = (page - 1) * perPage;

		var districts = await District.findAll({
			raw: true,
			order: [
				['modified_at', 'DESC']
			],
			offset: offset,
			where: {
				status: 1
			},
			attributes: attributesArray,
			limit: perPage,
		})
			.catch(err => {
				return res.send({
					success: 0,
					message: 'Something went wrong while fetching districts data',
					error: err
				})
			});

		var count = await District.count({
			where: {
				status: 1
			}
		})
			.catch(err => {
				return res.send({
					success: 0,
					message: 'Something went wrong while fetching district count data',
					error: err
				})
			});

		totalPages = count / perPage;
		totalPages = Math.ceil(totalPages);
		var hasNextPage = page < totalPages;
		let response = {
			items: districts,
			totalItems: count,
			hasNextPage,
			message: "Districts listed successfully",
			success: 1,
		}
		res.send(response);
	},


		this.listAppLsgiType = async (req, res) => {
			let params = req.query;
			let lang = "";
			lang = req.headers.x_lang;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;


			let attributesArray = []
			if (constants.APP_LANG_MALAYALAM === lang) {
				attributesArray.push('name_ml');
			} else if (constants.APP_LANG_ENGLISH === lang) {
				attributesArray.push('name_en');
			} else {
				return res.send({
					success: 0,
					message: 'Please specify language'
				})
			}

			var lsgiTypes = await LsgiType.findAll({
				raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: {
					status: 1
				},
				attributes: attributesArray,
				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching lsgi types data',
						error: err
					})
				});

			var count = await LsgiType.count({
				where: {
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching lsgi types count data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: lsgiTypes,
				totalItems: count,
				hasNextPage,
				message: "Lsgi types listed successfully",
				success: 1,
			}
			res.send(response);
		},


		this.appListLsgi = async (req, res) => {
			let params = req.query;
			let lang = "";
			lang = req.headers.x_lang;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {
				status: 1
			}
			if (params.district_id) {
				whereCondition.district_id = params.district_id
			}
			if (params.lsgi_type_id) {
				whereCondition.lsgi_type_id = params.lsgi_type_id
			}
			if (params.lsgi_block_id) {
				whereCondition.lsgi_block_id = params.lsgi_block_id
			}
			let lsgiAttributesArray = ['id', 'lsgi_type_id', 'district_id', 'lsgi_block_id']
			let lsgiTypeAttributeArray = ['id'];
			let districtAttributeArray = ['id'];
			if (constants.APP_LANG_MALAYALAM === lang) {
				lsgiAttributesArray.push('name_ml');
				lsgiTypeAttributeArray.push('name_ml')
				districtAttributeArray.push('name_ml')
			} else if (constants.APP_LANG_ENGLISH === lang) {
				lsgiAttributesArray.push('name_en');
				lsgiTypeAttributeArray.push('name_en')
				districtAttributeArray.push('name_en')
			} else {
				return res.send({
					success: 0,
					message: 'Please specify language'
				})
			}
			var lsgis = await Lsgi.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				include: [{
					model: LsgiType,
					attributes: lsgiTypeAttributeArray,

				}, {
					model: District,
					attributes: districtAttributeArray,

				}],
				attributes: lsgiAttributesArray,
				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching lsgi data',
						error: err
					})
				});

			var count = await Lsgi.count({
				where: whereCondition,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching lsgi data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: lsgis,
				totalItems: count,
				hasNextPage,
				message: "Lsgi listed successfully",
				success: 1,
			}
			res.send(response);
		},
		this.getLsgi = async (req, res) => {
			let lsgiId = req.params.id;
			let lsgiObj = await Lsgi.findOne({
				where: {
					id: lsgiId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting lsgi data',
						error: err
					})
				})
			let response = {
				lsgi: lsgiObj,
				success: 1,
			}
			res.send(response);
		},


		this.appListWard = async (req, res) => {
			let params = req.query;
			let lang = "";
			lang = req.headers.x_lang;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;

			let wardAttributesArray = ['id', 'ward_no', 'lsgi_id', 'district_id']
			let lsgiAttributesArray = ['id'];
			let districtAttributesArray = ['id'];
			if (constants.APP_LANG_MALAYALAM === lang) {
				lsgiAttributesArray.push('name_ml');
				districtAttributesArray.push('name_ml')
			} else if (constants.APP_LANG_ENGLISH === lang) {
				lsgiAttributesArray.push('name_en');
				districtAttributesArray.push('name_en')
			} else {
				return res.send({
					success: 0,
					message: 'Please specify language'
				})
			}


			let whereCondition = {
				status: 1
			}
			var wards = await Ward.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				limit: perPage,
				attributes: wardAttributesArray,
				include: [{
					model: Lsgi,
					attributes: lsgiAttributesArray
				}, {
					model: District,
					attributes: districtAttributesArray

				}]
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching ward data',
						error: err
					})
				});

			var count = await Ward.count({
				where: whereCondition,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching ward data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: wards,
				totalItems: count,
				hasNextPage,
				message: "Wards listed successfully",
				success: 1,
			}
			res.send(response);
		},

		this.appListCategory = async (req, res) => {
			let params = req.query;
			let lang = '';
			lang = req.headers.x_lang;

			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;

			let whereCondition = {
				status: 1
			}
			if (params.name_en) {
				whereCondition.name_en = params.name_en
			}
			if (params.name_ml) {
				whereCondition.name_ml = params.name_ml
			}
			if (params.children_page_layout) {
				whereCondition.children_page_layout = params.children_page_layout
			}
			let categoryAttributesArray = ['id', 'children_page_layout', 'status', 'created_at', 'modified_at'];
			if (constants.APP_LANG_MALAYALAM === lang) {
				categoryAttributesArray.push('name_ml');
			} else if (constants.APP_LANG_ENGLISH === lang) {
				categoryAttributesArray.push('name_en');
			} else {
				return res.send({
					success: 0,
					message: 'Please specify language'
				})
			}

			var categories = await Category.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],

				offset: offset,
				where: whereCondition,
				attributes: categoryAttributesArray,
				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching category data',
						error: err
					})
				});

			var count = await Category.count({
				where: whereCondition,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching category data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: categories,
				totalItems: count,
				hasNextPage,
				message: "Categories listed successfully",
				success: 1,
			}
			res.send(response);
		},

		this.appListCategoryRelationship = async (req, res) => {
			let params = req.query;

			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;

			let whereCondition = {
				status: 1
			}
			if (params.parent_cat_id) {
				whereCondition.parent_cat_id = params.parent_cat_id
			}
			if (params.child_cat_id) {
				whereCondition.child_cat_id = params.child_cat_id
			}
			if (params.sort_order) {
				whereCondition.sort_order = params.sort_order
			}

			var categoryRelationshipData = await CategoryRelationship.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],

				offset: offset,
				where: whereCondition,
				// include:[{
				//   model : Category
				// }],
				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching category relationship data',
						error: err
					})
				});

			var count = await CategoryRelationship.count({
				where: whereCondition,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching category relationship data',
						error: err
					})
				});


			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: categoryRelationshipData,
				totalItems: count,
				hasNextPage,
				message: "categoryRelationship listed successfully",
				success: 1,
			}
			res.send(response);
		},
		this.appListMeta = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;

			var metaData = await Meta.findAll({
				raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: {
					status: 1
				},
				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching meta data',
						error: err
					})
				});

			var count = await Meta.count({
				where: {
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching meta count data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: metaData,
				totalItems: count,
				hasNextPage,
				message: "Meta listed successfully",
				success: 1,
			}
			res.send(response);
		},

		this.signup = async (req, res) => {
			let params = req.body;

			if (!params.name) {
				return res.send({
					success: 0,
					message: 'Require name'
				})
			}
			if (!params.email) {
				return res.send({
					success: 0,
					message: 'Require email'
				})
			}
			if (!params.phone) {
				return res.send({
					success: 0,
					message: 'Require phone'
				})
			}
			if (!params.lsgiId) {
				return res.send({
					success: 0,
					message: 'Require lsgiId'
				})
			}
			if (!params.password) {
				return res.send({
					success: 0,
					message: 'Require password'
				})
			}
			let userObj = {
				name: params.name,
				email: params.email,
				phone: params.phone,
				lsgi_id: params.lsgiId,
				password: params.password,
				is_approved: 0,
				status: 1
			}

			let checkEmail = await User.findOne({
				where: {
					email: params.email,
					//  status : 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking email',
						error: err
					})
				})
			console.log("checkEmail")
			console.log(checkEmail)
			console.log("checkEmail")
			if (checkEmail && checkEmail !== null) {
				return res.send({
					success: 0,
					message: 'Email already exists..',
				})
			}
			let checkPhone = await User.findOne({
				where: {
					phone: params.phone,
					// status : 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking phone',
						error: err
					})
				})
			if (checkPhone && checkPhone !== null) {
				return res.send({
					success: 0,
					message: 'Phone already exists..',
				})
			}
			console.log("userObj")
			console.log(userObj)
			console.log("userObj")
			try {
				let data = await User.create(userObj);
				res.status(200).send({
					success: 1,
					message: "User created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while creating a user'
				})
			}
		},

		this.login = async (req, res) => {
			var username = req.body.username;
			var password = req.body.password;
			if (!username || !password) {
				var errors = [];
				if (!username) {
					errors.push({
						field: "username",
						message: "Username cannot be empty"
					});
				}
				if (!password) {
					errors.push({
						field: "password",
						message: "Password cannot be empty"
					});
				}
				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};

			
            let findCriteria = {};

			
				let emailObj = {
					email:  username ,
				};
				let phoneObj = {
					phone: username
				};
				findCriteria = Sequelize.or(emailObj ,  phoneObj )
			
			findCriteria.status = 1;

			let userData = await User.findOne({
				where: findCriteria
			});
			if (!userData) {
				return res.send({
					success: 0,
					statusCode: 401,
					message: 'Incorrect phone or email'
				})
			};
			let matched = await bcrypt.compare(password, userData.password);
			if (matched) {

				var payload = {
					id: userData.id,
					name: userData.name,
					email: userData.email,
					phone: userData.phone,
					user_type: userData.user_type
				};
				var token = jwt.sign({
					data: payload,
				}, JWT_KEY, {
					expiresIn: '10h'
				});


				var versionData = await Version.findOne({
					limit: 1,
					where: {
						status: 1,
					},
					raw: true,
					order: [
						['created_at', 'DESC']
					]
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while fetching version data',
							error: err
						})
					});

				res.send({
					success: 1,
					statusCode: 200,
					version: versionData.version,
					token: token,
					userDetails: payload,
					message: 'Successfully logged in'
				})

			} else {
				return res.send({
					success: 0,
					statusCode: 401,
					message: 'Incorrect password'
				})
			}
		},

		this.changeUserPassword = async (req, res) => {
			let params = req.body;
			let userId = req.params.id;

			if (!params.new_password || !params.current_password) {
				var errors = [];

				if (!params.new_password) {
					errors.push({
						field: "new_password",
						message: "Require new password"
					});
				}
				if (!params.current_password) {
					errors.push({
						field: "current_password",
						message: "Require current password"
					});
				}


				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};
			let userData = await User.findOne({
				where: {
					id: userId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking user id exists or not',
						error: err
					})
				})
			if (!userData || userData === null || (userData.user_type === constants.Type_ADMIN)) {
				return res.send({
					success: 0,
					message: 'Invalid user '
				})
			}
			let matched = await bcrypt.compare(params.current_password, userData.password);
			if (matched) {
				const hash = bcrypt.hashSync(params.new_password, salt);

				let update = {
					password: hash,
					modified_at: new Date()
				}
				await User.update(update, {
					where: {
						id: userId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating user password',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "User updated password successfully."
				});
			} else {
				return res.send({
					success: 0,
					message: 'Invalid current password '
				})
			}

		},

		this.sendOtp = async (req, res) => {

			const uuidv4 = require('uuid/v4');

			var params = req.body;
			if (!params.phone) {
				return res.send({
					success: 0,
					message: 'Phone number cannot be empty'
				})
			}
			let result = await User.findOne({
				where: {
					phone: params.phone,
					user_type: constants.TYPE_USER,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while updating user password',
						error: err
					})
				})
			if (!result) {
				return res.send({
					success: 0,
					message: 'Please enter a registered phone number'
				})
			}
			var otp = Math.floor(1000 + Math.random() * 9000);
			const expiry = Date.now() + (otpConfig.expirySeconds * 1000);
			const apiToken = uuidv4();
			// msg91.send(params.phone, `${otp} is the OTP to reset password. Your OTP will expire in 2 minutes. Do not share this OTP with anyone.`, function (err, response) {
			//   if (response) {

			let otpData = await Otp.create({
				phone: params.phone,
				is_used: 0,
				otp: otp,
				api_token: apiToken,
				expiry: expiry
			})
			// .catch(err => {
			//   return res.send({
			//     success: 0,
			//     message: 'Something went wrong while create otp',
			//     error: err
			//   })
			// })
			var responseObject = {
				success: 1,
				phone: result.phone,
				userToken: otp,
				apiToken: apiToken
			};
			return res.send(responseObject);

			// }
			// else {
			//   return res.send({
			//     success: 0,
			//     message: 'Some error occured. Couldnot send sms',
			//     error: err
			//   })
			// }
			// })


		},

		this.validateOtp = async (req, res) => {
			var params = req.body;
			var otp = params.otp;
			var apiToken = params.api_token;
			var currentTime = Date.now();
			if (!otp || !apiToken) {
				var errors = [];
				if (!otp) {
					errors.push({
						field: "otp",
						message: "otp is missing"
					});
				}
				if (!apiToken) {
					errors.push({
						field: "apiToken",
						message: "api Token is missing"
					});
				}
				return res.status(200).send({
					success: 0,
					errors: errors,
					code: 200
				});
			}
			let result = await Otp.findOne({
				where: {
					otp: params.otp,
					api_token: apiToken,
					is_used: 0
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting otp',
						error: err
					})
				})
			if (result) {
				if (parseInt(currentTime) > parseInt(result.expiry)) {
					return res.send({
						success: 0,
						message: 'otp expired,please resend otp to get a new one'
					})
				} else {
					var update = {
						is_used: 1
					}
					let data = await Otp.update(update, {
						where: {
							otp: params.otp,
							api_token: apiToken
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while updating otp',
								error: err
							})
						})
					return res.send({
						success: 1,
						message: 'Otp verified successfully'
					})
				}
			} else {
				return res.send({
					success: 0,
					message: 'Otp does not matching'
				})
			}
		},

		this.resetPassword = async (req, res) => {

			// var userData = req.identity;
			// var userId = userData.data.id;
			var userId = 8;
			var password;
			var params = req.body;
			var currentPassword = params.current_password;
			var newPassword = params.new_password;
			let result = await User.findOne({
				where: {
					id: userId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting user',
						error: err
					})
				});
			password = result.password;
			let isMatched = await bcrypt.compare(currentPassword, password);
			if (isMatched) {
				var encrypted = bcrypt.hashSync(newPassword, salt);
				var update = {
					password: encrypted
				}
				let userUpdate = await User.update(update, {
					where: {
						id: userId
					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while reset password',
							error: err
						})
					});
				return res.send({
					success: 1,
					message: 'Password updated  successfully'
				})

			} else {
				return res.send({
					success: 0,
					message: 'Current password is incorrect'
				})
			}


		},

		this.attendFacilitySurvey = async (req, res) => {
			let params = req.body;

			if (!params.lsgi_id || !params.category_relationship_id) {
				var errors = [];

				if (!params.lsgi_id) {
					errors.push({
						field: "lsgi_id",
						message: 'Require lsgi id'

					});
				}

				if (!params.category_relationship_id) {
					errors.push({
						field: "category_relationship_id",
						message: 'Require category relationship id'

					});
				}

				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};


			let facilitySurveyObj = req.body;
			facilitySurveyObj.status = 1;
			//  {
			// 	category_id: params.category_id,
			// 	facility_survey_question_id: params.facility_survey_question_id,
			// 	sort_order: params.sort_order,
			// 	status: 1
			// }
			let categoryRelationshipCheck = await CategoryRelationship.findOne({
				where: {
					id: params.category_relationship_id,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking category relationship',
						error: err
					})
				})
			if (!categoryRelationshipCheck) {
				return res.send({
					success: 0,
					message: 'Invalid category relationship id'
				})
			}

			let lsgiCheck = await Lsgi.findOne({
				where: {
					id: params.lsgi_id,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking Lsgi',
						error: err
					})
				})
			if (!lsgiCheck) {
				return res.send({
					success: 0,
					message: 'Invalid Lsgi'
				})
			}


			try {
				let data = await FacilitySurvey.create(facilitySurveyObj);

				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "FacilitySurvey created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a FacilitySurvey'
				})
			}
		},
		this.facilitySurveyCommonDetails = async (req, res) => {
			let params = req.query;
			let lang = "";
			lang = req.headers.x_lang;

			// 	let attributesArray = []
			// 	if (constants.APP_LANG_MALAYALAM === lang) {
			// 		attributesArray.push('name_ml');
			// 	} else if (constants.APP_LANG_ENGLISH === lang) {
			// 		attributesArray.push('name_en');
			// 	} else {
			// 		return res.send({
			// 			success: 0,
			// 			message: 'Please specify language'
			// 		})
			// 	}
			// 	let lsgiData = await Lsgi.findAll({
			// 		where : {
			// 			status : 1
			// 		},
			// 		include:[{
			// 			model : District,
			// 			attributes :[]
			// 		},{
			// 			model : LsgiType,
			// 			attributes :[]

			// 		}
			// 	],
			// 	attributes :  []
			// 	})

			// }
			let whereCondition = {
				status: 1
			}
			let lsgiAttributesArray = ['id', 'lsgi_type_id', 'district_id', 'lsgi_block_id']
			let lsgiTypeAttributeArray = ['id'];
			let districtAttributeArray = ['id'];
			let wardAttributeArray = ['id', 'lsgi_id', 'district_id'];
			let facilityTypeAttributeArray = ['id', 'category_id'];
			let categoryAttributesArray = ['id', 'children_page_layout']
			if (constants.APP_LANG_MALAYALAM === lang) {
				lsgiAttributesArray.push(['name_ml', 'name']);
				lsgiTypeAttributeArray.push(['name_ml', 'name'])
				districtAttributeArray.push(['name_ml', 'name']);
				wardAttributeArray.push(['name_ml', 'name']);
				facilityTypeAttributeArray.push(['name_ml', 'name']);
				categoryAttributesArray.push(['name_ml', 'name']);
			} else if (constants.APP_LANG_ENGLISH === lang) {
				lsgiAttributesArray.push(['name_en', 'name']);
				lsgiTypeAttributeArray.push(['name_en', 'name'])
				districtAttributeArray.push(['name_en', 'name'])
				wardAttributeArray.push(['name_en', 'name'])
				facilityTypeAttributeArray.push(['name_en', 'name'])
				categoryAttributesArray.push(['name_en', 'name'])
			} else {
				return res.send({
					success: 0,
					message: 'Please specify language'
				})
			}
			var lsgis = await Lsgi.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				where: whereCondition,
				include: [{
					model: LsgiType,
					attributes: lsgiTypeAttributeArray,

				}, {
					model: District,
					attributes: districtAttributeArray,

				}],
				attributes: lsgiAttributesArray,
				// limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching lsgi data',
						error: err
					})
				});


			var wards = await Ward.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				where: whereCondition,
				include: [{
					model: Lsgi,
					attributes: lsgiAttributesArray,

				}, {
					model: District,
					attributes: districtAttributeArray,

				}],
				attributes: wardAttributeArray,
				// limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching ward data',
						error: err
					})
				});

			var facilityTypes = await FacilityType.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				where: whereCondition,
				include: [{
					model: Category,
					attributes: categoryAttributesArray,

				}],
				attributes: facilityTypeAttributeArray,
				// limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching fecilitytype data',
						error: err
					})
				});


			var facilitySurveyQuestions = await FacilitySurveyQuestion.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				where: whereCondition,

				// attributes: facilityTypeAttributeArray,
				// limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching FacilitySurveyQuestion data',
						error: err
					})
				});

			var categoryFacilitySurveyQuestions = await CategoryFacilitySurveyQuestion.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				where: whereCondition,
				include: [{
					model: Category
				}, {
					model: FacilitySurveyQuestion
				}

				]

				// attributes: facilityTypeAttributeArray,
				// limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching CategoryFacilitySurveyQuestion data',
						error: err
					})
				});

			var categories = await Category.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				where: whereCondition,
				attributes: categoryAttributesArray
				// attributes: facilityTypeAttributeArray,
				// limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching categories data',
						error: err
					})
				});

			var categoryRelationships = await CategoryRelationship.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				where: whereCondition,

				// attributes: facilityTypeAttributeArray,
				// limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching category relationships data',
						error: err
					})
				});
			// FacilitySurveyQuestion
			var versionData = await Version.findOne({
				limit: 1,
				where: {
					status: 1,
				},
				raw: true,
				order: [
					['created_at', 'DESC']
				]
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching version data',
						error: err
					})
				});

			res.status(200).send({
				success: 1,
				version: versionData.version,
				imageBase: profileConfig.imageBase,
				lsgis,
				wards,
				categories,
				categoryRelationships,
				facilityTypes,
				facilitySurveyQuestions,
				categoryFacilitySurveyQuestions,
				message: "Common details"
			});
		},
		this.attendSurvey = async function (req, res) { 
			console.log("Files recieved are: "+JSON.stringify(req.files));
			res.send({ok:true});
		},

		this.mainSurveyCommonDetails = async (req, res) => {
			let params = req.query;
			let lang = "";
			lang = req.headers.x_lang;

			// 	let attributesArray = []
			// 	if (constants.APP_LANG_MALAYALAM === lang) {
			// 		attributesArray.push('name_ml');
			// 	} else if (constants.APP_LANG_ENGLISH === lang) {
			// 		attributesArray.push('name_en');
			// 	} else {
			// 		return res.send({
			// 			success: 0,
			// 			message: 'Please specify language'
			// 		})
			// 	}
			// 	let lsgiData = await Lsgi.findAll({
			// 		where : {
			// 			status : 1
			// 		},
			// 		include:[{
			// 			model : District,
			// 			attributes :[]
			// 		},{
			// 			model : LsgiType,
			// 			attributes :[]

			// 		}
			// 	],
			// 	attributes :  []
			// 	})

			// }
			let whereCondition = {
				status: 1
			}
			let lsgiAttributesArray = ['id', 'lsgi_type_id', 'district_id', 'lsgi_block_id']
			let lsgiTypeAttributeArray = ['id'];
			let districtAttributeArray = ['id'];
			let wardAttributeArray = ['id', 'lsgi_id', 'district_id'];
			let facilityTypeAttributeArray = ['id', 'category_id'];
			let categoryAttributesArray = ['id', 'children_page_layout']
			if (constants.APP_LANG_MALAYALAM === lang) {
				lsgiAttributesArray.push(['name_ml', 'name']);
				lsgiTypeAttributeArray.push(['name_ml', 'name'])
				districtAttributeArray.push(['name_ml', 'name']);
				wardAttributeArray.push(['name_ml', 'name']);
				facilityTypeAttributeArray.push(['name_ml', 'name']);
				categoryAttributesArray.push(['name_ml', 'name']);
			} else if (constants.APP_LANG_ENGLISH === lang) {
				lsgiAttributesArray.push(['name_en', 'name']);
				lsgiTypeAttributeArray.push(['name_en', 'name'])
				districtAttributeArray.push(['name_en', 'name'])
				wardAttributeArray.push(['name_en', 'name'])
				facilityTypeAttributeArray.push(['name_en', 'name'])
				categoryAttributesArray.push(['name_en', 'name'])
			} else {
				return res.send({
					success: 0,
					message: 'Please specify language'
				})
			}
			var lsgis = await Lsgi.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				where: whereCondition,
				include: [{
					model: LsgiType,
					attributes: lsgiTypeAttributeArray,

				}, {
					model: District,
					attributes: districtAttributeArray,

				}],
				attributes: lsgiAttributesArray,
				// limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching lsgi data',
						error: err
					})
				});


			var wards = await Ward.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				where: whereCondition,
				include: [{
					model: Lsgi,
					attributes: lsgiAttributesArray,

				}, {
					model: District,
					attributes: districtAttributeArray,

				}],
				attributes: wardAttributeArray,
				// limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching ward data',
						error: err
					})
				});

			var questions = await Question.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				where: whereCondition,
				// include: [{
				// 	model: Category,
				// 	attributes: categoryAttributesArray,

				// }],
				// attributes: facilityTypeAttributeArray,
				// limit: perPage,
			})
			// .catch(err => {
			// 	return res.send({
			// 		success: 0,
			// 		message: 'Something went wrong while fetching Question data',
			// 		error: err
			// 	})
			// });


			var questionOption = await QuestionOption.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				where: whereCondition,

				// attributes: facilityTypeAttributeArray,
				// limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching QuestionOption data',
						error: err
					})
				});


			var versionData = await Version.findOne({
				limit: 1,
				where: {
					status: 1,
				},
				raw: true,
				order: [
					['created_at', 'DESC']
				]
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching version data',
						error: err
					})
				});


			res.status(200).send({
				success: 1,
				version: versionData.version,
				imageBase: profileConfig.imageBase,
				lsgis,
				// wards,
				// categories,
				// categoryRelationships,
				// facilityTypes,
				questions,
				questionOption,
				message: "Common details"
			});
		}

	this.getVersion = async (req, res) => {
		var versionData = await Version.findOne({
			limit: 1,
			where: {
				status: 1,
			},
			raw: true,
			order: [
				['created_at', 'DESC']
			]
		})
			.catch(err => {
				return res.send({
					success: 0,
					message: 'Something went wrong while fetching version data',
					error: err
				})
			});
		let response = {
			version: versionData.version,
			// totalItems: count,
			// hasNextPage,
			message: "Success",
			success: 1,
		}
		return res.send(response);
	}



}
module.exports = mobileController