// const District = require("../models/district.model");
// const District = require("../models/district.model");
var gateway = require('../components/gateway.component.js');

async function getMyPermissions(reqObj) {
	  let bearer = reqObj.bearer;
	  delete reqObj.bearer;
	// let permissions = await gateway.getWithAuth('/admin/masters/auth-role-permission/list/' + reqObj.role_id);
	  let permissions = await gateway.getWithAuth('/admin/masters/auth-role-permission/list/'+reqObj.role_id, reqObj, bearer);

	return permissions;
};



function adminController(methods, options) {
	const District = methods.loadModel('district');
	const LsgiType = methods.loadModel('lsgiType');
	const Lsgi = methods.loadModel('lsgi');
	const Ward = methods.loadModel('ward');
	const Category = methods.loadModel('category');
	const CategoryRelationship = methods.loadModel('categoryRelationship');
	const Meta = methods.loadModel('meta');
	const User = methods.loadModel('user');
	const GradeConfiguaration = methods.loadModel('gradeConfiguaration');
	const PercentageConfiguaration = methods.loadModel('percentageConfiguaration');
	const PercentageConfigSlab = methods.loadModel('percentageConfiguarationSlab');
	const Notification = methods.loadModel('notification');
	const SidebarMenu = methods.loadModel('sidebarMenu');
	const Question = methods.loadModel('question');
	const QuestionOption = methods.loadModel('questionOption');
	const FacilityType = methods.loadModel('facilityType');
	const FacilitySurveyQuestion = methods.loadModel('facilitySurveyQuestion');
	const CategoryFacilitySurveyQuestion = methods.loadModel('categoryFacilitySurveyQuestion');
	const FacilitySurvey = methods.loadModel('facilitySurvey');
	const Image = methods.loadModel('image');
	const FacilitySurveyImage = methods.loadModel('facilitySurveyImage');
	const MainSurveyMasterQuestion = methods.loadModel('mainSurveyMasterQuestion');
	const Version = methods.loadModel('version');
	const AuthController = methods.loadModel('authController');
	const AuthPermission = methods.loadModel('authPermission');
	const AuthRole = methods.loadModel('authRole');
	const Survey = methods.loadModel('survey');
	const SurveyAnswer = methods.loadModel('surveyAnswer');
	const AuthRolePermission = methods.loadModel("authRolePermission");
	const AuthPermissionSidebarMenu = methods.loadModel("authPermissionSidebarMenu");
	const FieldName = methods.loadModel("fieldName");
	const UserType = methods.loadModel("userType");


	
	var config = require('../../config/app.config.js');
	const profileConfig = config.profile;
	var paramsConfig = require('../../config/params.config');
	const JWT_KEY = paramsConfig.development.jwt.secret;
	const jwt = require('jsonwebtoken');

	const constants = require("../helpers/constants")
	const Sequelize = require('sequelize');
	const Op = Sequelize.Op;
	var bcrypt = require('bcryptjs');
	const salt = bcrypt.genSaltSync(10);
	this.createDistrict = async (req, res) => {
		let params = req.body;

		if (!params.name_ml || !params.name_en) {
			var errors = [];

			if (!params.name_ml) {
				errors.push({
					field: "name_ml",
					message: 'Require district Malayalam name'

				});
			}
			if (!params.name_en) {
				errors.push({
					field: "name_en",
					message: 'Require district English name'
				});
			}

			return res.send({
				success: 0,
				statusCode: 400,
				errors: errors,
			});
		};


		let districtObj = {
			name_ml: params.name_ml.trim(),
			name_en: params.name_en.trim(),
			status: 1
		}
		let nameMlCheck = await District.findOne({
			where: {
				name_ml: params.name_ml.trim(),
				status: 1
			}
		})
			.catch(err => {
				return res.send({
					success: 0,
					message: 'Something went wrong while checking malayalam district name exists or not',
					error: err
				})
			})
		if (nameMlCheck) {
			return res.send({
				success: 0,
				message: 'District malayalam name already exists..'
			})
		}

		let nameEnCheck = await District.findOne({
			where: {
				name_en: params.name_en.trim(),
				status: 1
			}
		})
			.catch(err => {
				return res.send({
					success: 0,
					message: 'Something went wrong while checking english district name exists or not',
					error: err
				})
			})
		if (nameEnCheck) {
			return res.send({
				success: 0,
				message: 'District english name already exists..'
			})
		}
		try {
			let data = await District.create(districtObj);

			res.status(200).send({
				success: 1,
				id: data.dataValues.id,
				message: "District created successfully."
			});
		} catch (err) {
			console.log(err);
			return res.send({
				success: 0,
				message: 'Error while create a district'
			})
		}
	},
		this.updateDistrict = async (req, res) => {
			let districtId = req.params.id;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!req.body.name_ml && !req.body.name_en) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (req.body.name_ml) {
				update.name_ml = req.body.name_ml.trim();
			}
			if (req.body.name_en) {
				update.name_en = req.body.name_en.trim();
			}
			let idData = await District.findOne({
				where: {
					id: districtId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking district id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid district '
				})
			} else {
				if (req.body.name_en) {
					let districtData = await District.findOne({
						where: {
							name_en: req.body.name_en.trim(),
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking English district name already exists or not',
								error: err
							})
						})
					if (districtData && (districtData.id !== districtId)) {
						return res.send({
							success: 0,
							message: 'District English name already exists '
						})
					}
				}

				if (req.body.name_ml) {
					let districtData = await District.findOne({
						where: {
							name_ml: req.body.name_ml.trim(),
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking malayalam district name already exists or not',
								error: err
							})
						})
					if (districtData && (districtData.id !== districtId)) {
						return res.send({
							success: 0,
							message: 'District Malayalam name already exists '
						})
					}
				}

				await District.update(update, {
					where: {
						id: districtId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating district name',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "District name updated successfully."
				});
			}


		},
		this.listDistrict = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			if (params.name) {
				let name_en = {
					[Op.like]: '%' + params.name + '%',
				};
				let name_ml = {
					[Op.like]: '%' + params.name + '%'
				};
				whereCondition = Sequelize.or({ name_en }, { name_ml })
			}
			whereCondition.status = 1;

			var districts = await District.findAll({
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,

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
				where: whereCondition,

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
			return res.send(response);
		},


		this.getDistrict = async (req, res) => {
			let districtId = req.params.id;
			let districtData = await District.findOne({
				where: {
					id: districtId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting district data',
						error: err
					})
				})
			let response = {
				district: districtData,
				success: 1,
			}
			return res.send(response);
		},
		this.deleteDistrict = async (req, res) => {
			let districtId = req.params.id;
			let districtData = await District.findOne({
				where: {
					id: districtId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting district data',
						error: err
					})
				})
			if (districtData) {
				let update = {
					status: 0
				}
				await District.update(update, {
					where: {
						id: districtData.id

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting district',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "District deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "District not exists."
				});
			}


		},

		this.createLsgiType = async (req, res) => {
			let params = req.body;
			if (!params.name_ml || !params.name_en) {
				var errors = [];

				if (!params.name_ml) {
					errors.push({
						field: "name_ml",
						message: 'Require lsgi type Malayalam name'

					});
				}
				if (!params.name_en) {
					errors.push({
						field: "name_en",
						message: 'Require lsgi type English name'
					});
				}

				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};

			if (!params.show_block_panchayath) {
				params.show_block_panchayath = 0;
			}
			let lsgiTypeObj = {
				name_ml: params.name_ml.trim(),
				name_en: params.name_en.trim(),
				show_block_panchayath: params.show_block_panchayath,
				status: 1
			}
			let nameMlCheck = await LsgiType.findOne({
				where: {
					name_ml: lsgiTypeObj.name_ml,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching LSGI Type',
						error: err
					})
				})
			if (nameMlCheck) {
				return res.send({
					success: 0,
					message: 'LSGI Type name in Malayalam already exists',
					error: err
				})
			}
			let nameEnCheck = await LsgiType.findOne({
				where: {
					name_en: lsgiTypeObj.name_en,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching LSGI Type',
						error: err
					})
				})
			if (nameEnCheck) {
				return res.send({
					success: 0,
					message: 'LSGI Type name in English already exists',
					error: err
				})
			}

			try {
				let data = await LsgiType.create(lsgiTypeObj);
				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "LSGI Type created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a lsgi type'
				})
			}
		},

		this.updateLsgiType = async (req, res) => {
			let lsgiTypeId = req.params.id;
			let update = {};
			update.modified_at = new Date();

			if (!req.body.name_ml && !req.body.name_en && !updreq.bodyate.show_block_panchayath) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (req.body.name_ml) {
				update.name_ml = req.body.name_ml.trim();
			}
			if (req.body.name_en) {
				update.name_en = req.body.name_en.trim();
			}
			if (req.body.show_block_panchayath) {
				update.show_block_panchayath = req.body.show_block_panchayath;
			}
			let idData = await LsgiType.findOne({
				where: {
					id: lsgiTypeId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking lsgi type id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid district '
				})
			} else {
				let lsgiTypeData = await LsgiType.findOne({
					where: {
						name_en: req.body.name_en,
						status: 1,
					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while checking lsgi type name already exists or not',
							error: err
						})
					})
				if (lsgiTypeData && (lsgiTypeData.id !== lsgiTypeId)) {
					return res.send({
						success: 0,
						message: 'lsgiType name already exists '
					})
				} else {

					await LsgiType.update(update, {
						where: {
							id: lsgiTypeId

						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while updating Lsgitype name',
								error: err
							})
						})
					res.status(200).send({
						success: 1,
						message: "Lsgitype name updated successfully."
					});
				}

			}
		},

		this.getLsgiType = async (req, res) => {
			let lsgiTypeId = req.params.id;
			let lsgiTypeObj = await LsgiType.findOne({
				where: {
					id: lsgiTypeId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting lsgi type data',
						error: err
					})
				})
			let response = {
				lsgiType: lsgiTypeObj,
				success: 1,
			}
			res.send(response);
		},

		this.listLsgiType = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;

			var lsgiTypes = await LsgiType.findAll({
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


		this.deleteLsgiType = async (req, res) => {
			let lsgiTypeId = req.params.id;
			let lsgiTypeData = await LsgiType.findOne({
				where: {
					id: lsgiTypeId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting lsgi type data',
						error: err
					})
				})
			if (lsgiTypeData) {
				let update = {
					status: 0
				}
				await LsgiType.update(update, {
					where: {
						id: lsgiTypeData.id

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating lsgi type name',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Lsgi type" + lsgiTypeData.name + " deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "Lsgi type not exists."
				});
			}


		},


		this.createLsgi = async (req, res) => {
			let params = req.body;
			if (!params.name_ml || !params.name_en || !params.district_id ||
				!params.lsgi_type_id) {
				var errors = [];

				if (!params.name_ml) {
					errors.push({
						field: "name_ml",
						message: 'Require lsgi Malayalam name'

					});
				}
				if (!params.name_en) {
					errors.push({
						field: "name_en",
						message: 'Require lsgi English name'
					});
				}
				if (!params.lsgi_type_id) {
					errors.push({
						success: 0,
						message: 'Require lsgi type id'
					})
				}
				if (!params.district_id) {
					errors.push({
						field: "name_en",
						message: 'Require lsgi district id'
					});
				}

				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};

			let lsgiObj = {
				name_ml: params.name_ml.trim(),
				name_en: params.name_en.trim(),
				district_id: params.district_id,
				lsgi_type_id: params.lsgi_type_id,
				status: 1
			}
			if (params.lsgiBlockId) {
				lsgiObj.lsgi_block_id = params.lsgiBlockId;
			}
			let lsgiEnData = await Lsgi.findOne({
				where: {
					district_id: params.district_id,
					name_en: lsgiObj.name_en,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking lsgi already exists ornot',
						error: err
					})
				})
			if (lsgiEnData) {
				return res.send({
					success: 0,
					message: 'Lsgi already exist in district'
				})
			}
			let lsgiMlData = await Lsgi.findOne({
				where: {
					district_id: params.district_id,
					name_en: lsgiObj.name_ml,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking lsgi already exists ornot',
						error: err
					})
				})
			if (lsgiMlData) {
				return res.send({
					success: 0,
					message: 'Lsgi already exist in district'
				})
			}
			try {
				let data = await Lsgi.create(lsgiObj);
				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "lsgi created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a lsgi'
				})
			}
		},


		this.updateLsgi = async (req, res) => {
			let lsgiId = req.params.id;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!req.body.name_ml && !req.body.name_en &&
				!req.body.district_id && !req.body.lsgi_type_id &&
				!req.body.lsgi_block_id) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (req.body.name_ml) {
				update.name_ml = req.body.name_ml.trim();
			}
			if (req.body.name_en) {
				update.name_en = req.body.name_en.trim();
			}
			if (req.body.district_id) {
				update.district_id = req.body.district_id;
			}
			if (req.body.lsgi_type_id) {
				update.lsgi_type_id = req.body.lsgi_type_id;
			}
			if (req.body.lsgi_block_id) {
				update.lsgi_block_id = req.body.lsgi_block_id;
			}
			let idData = await Lsgi.findOne({
				where: {
					id: lsgiId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking lsgi id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid lsgi '
				})
			} else {
				if (req.body.name_en) {
					let lsgiData = await Lsgi.findOne({
						where: {
							name_en: req.body.name_en,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking lsgi name already exists or not',
								error: err
							})
						})
					if (lsgiData && (lsgiData.id !== lsgiId)) {
						return res.send({
							success: 0,
							message: 'Lsgi name already exists '
						})
					}
				}

				await Lsgi.update(update, {
					where: {
						id: lsgiId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating lsgi name',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Lsgi updated successfully."
				});
			}


		},

		this.listLsgi = async (req, res) => {
			let params = req.query;
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

			var lsgis = await Lsgi.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				include: [{
					model: LsgiType,
				}, {
					model: District
				}],
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

		this.deleteLsgi = async (req, res) => {
			let lsgiId = req.params.id;
			let lsgiData = await Lsgi.findOne({
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
			if (lsgiData) {
				let update = {
					status: 0
				}
				await Lsgi.update(update, {
					where: {
						id: lsgiData.id

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating lsgi  name',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Lsgi deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "Lsgi  not exists."
				});
			}


		},

		this.createWard = async (req, res) => {
			let params = req.body;

			if (!params.name_ml || !params.name_en ||
				!params.lsgi_type_id || !params.lsgi_id || !params.district_id) {
				var errors = [];

				if (!params.name_ml) {
					errors.push({
						field: "name_ml",
						message: 'Require ward Malayalam name'

					});
				}
				if (!params.name_en) {
					errors.push({
						field: "name_en",
						message: 'Require ward English name'
					});
				}
				if (!params.lsgi_id) {
					errors.push({
						success: 0,
						message: 'Require ward lsgi id'
					})
				}
				if (!params.district_id) {
					errors.push({
						field: "name_en",
						message: 'Require ward district id'
					});
				}

				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};

			let wardObj = {
				name_en: params.name_en.trim(),
				name_ml: params.name_ml.trim(),
				// district_id: params.district_id,
				lsgi_id: params.lsgi_id,
				status: 1
			}

			let wardMlData = await Ward.findOne({
				where: {
					lsgi_id: params.lsgi_id,
					name_ml: params.name_ml,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking ward already exists or not',
						error: err
					})
				})
			if (wardMlData) {
				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "ward already exist in lsgi."
				});
			}

			let wardEnData = await Ward.findOne({
				where: {
					lsgi_id: params.lsgi_id,
					name_en: params.name_en,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking ward already exists or not',
						error: err
					})
				})

			if (wardEnData) {
				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "ward already exist in lsgi."
				});
			}

			try {
				let data = await Ward.create(wardObj);
				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "ward created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a ward'
				})
			}
		},

		this.updateWard = async (req, res) => {
			let wardId = req.params.id;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!req.body.name_en && !req.body.name_ml
				&& !req.body.lsgi_id) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (req.body.name_en) {
				update.name_en = req.body.name_en.trim();
			}
			if (req.body.name_ml) {
				update.name_ml = req.body.name_ml.trim();
			}
			
			if (req.body.lsgi_id) {
				update.lsgi_id = req.body.lsgi_id;
			}

			let idData = await Ward.findOne({
				where: {
					id: wardId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking ward id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid ward '
				})
			} else {
				if (req.body.name_en) {
					let wardData = await Ward.findOne({
						where: {
							name_en: req.body.name_en,
							lsgi_id: req.body.lsgi_id,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking ward name already exists or not',
								error: err
							})
						})
					if (wardData && (wardData.id !== wardId)) {
						return res.send({
							success: 0,
							message: 'Ward name already exists '
						})
					}
				}

				await Ward.update(update, {
					where: {
						id: wardId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating lsgi name',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Lsgi updated successfully."
				});
			}


		},


		this.getWard = async (req, res) => {
			let wardId = req.params.id;
			let wardObj = await Ward.findOne({
				where: {
					id: wardId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting ward data',
						error: err
					})
				})
			let response = {
				ward: wardObj,
				success: 1,
			}
			res.send(response);
		},

		this.listWard = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {
				status: 1
			}
			var wards = await Ward.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				include: [{
					model: Lsgi
				}, {
					model: District
				}],
				offset: offset,
				where: whereCondition,
				limit: perPage,
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


		this.deleteWard = async (req, res) => {
			let wardId = req.params.id;
			let wardData = await Ward.findOne({
				where: {
					id: wardId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting ward data',
						error: err
					})
				})
			if (wardData) {
				let update = {
					status: 0
				}
				await Ward.update(update, {
					where: {
						id: wardData.id

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating ward name',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Ward deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "Ward not exists."
				});
			}


		},

		this.createCategory = async (req, res) => {
			let params = req.body;


			if (!params.name_ml || !params.name_en || !params.children_page_layout) {
				var errors = [];

				if (!params.name_ml) {
					errors.push({
						field: "name_ml",
						message: 'Require  Malayalam name'

					});
				}
				if (!params.name_en) {
					errors.push({
						field: "name_en",
						message: 'Require  English name'
					});
				}
				if (!params.children_page_layout) {
					errors.push({
						success: 0,
						message: 'Require children page layout'
					})
				}

				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};

			let categoryObj = {
				name_ml: params.name_ml.trim(),
				name_en: params.name_en.trim(),
				children_page_layout: params.children_page_layout.trim(),
				status: 1
			}
			try {
				let data = await Category.create(categoryObj);
				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "Category created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a category'
				})
			}
		},
		this.updateCategory = async (req, res) => {
			let categoryId = req.params.id;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!req.body.name_ml && !req.body.name_en && !req.body.children_page_layout) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (req.body.name_ml) {
				update.name_ml = req.body.name_ml;
			}
			if (req.body.name_en) {
				update.name_en = req.body.name_en;
			}
			if (req.body.children_page_layout) {
				update.children_page_layout = req.body.children_page_layout;
			}
			let idData = await Category.findOne({
				where: {
					id: categoryId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking category id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid category '
				})
			} else {
				if (req.body.name_en) {
					let categoryData = await Category.findOne({
						where: {
							name_en: req.body.name_en,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking category name already exists or not',
								error: err
							})
						})
					if (categoryData && (categoryData.id !== categoryId)) {
						return res.send({
							success: 0,
							message: 'Category name already exists '
						})
					}
				}

				await Category.update(update, {
					where: {
						id: categoryId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating category',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Category updated successfully."
				});
			}


		},

		this.getCategory = async (req, res) => {
			let categoryId = req.params.id;
			let categoryObj = await Category.findOne({
				where: {
					id: categoryId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting category data',
						error: err
					})
				})
			let response = {
				category: categoryObj,
				success: 1,
			}
			res.send(response);
		},

		this.listCategory = async (req, res) => {
			let params = req.query;

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

			var categories = await Category.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],

				offset: offset,
				where: whereCondition,
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

		this.deleteCategory = async (req, res) => {
			let categoryId = req.params.id;
			let categoryData = await Category.findOne({
				where: {
					id: categoryId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting category data',
						error: err
					})
				})
			if (categoryData) {
				let update = {
					status: 0
				}
				await Category.update(update, {
					where: {
						id: categoryData.id

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting category',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Category deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "Category not exists."
				});
			}


		},
		this.createCategoryRelationship = async (req, res) => {
			let params = req.body;

			if (!params.parent_cat_id && !params.child_cat_id) {
				return res.send({
					success: 0,
					message: 'Atleast 1 category id '
				})
			}
			if (!params.sort_order) {
				return res.send({
					success: 0,
					message: 'Require sort order'
				})
			}

			let categoryRelationshipObj = {
				status: 1
			}
			if (params.parent_cat_id) {
				categoryRelationshipObj.parent_cat_id = params.parent_cat_id
			}
			if (params.child_cat_id) {
				categoryRelationshipObj.child_cat_id = params.child_cat_id
			}
			if (params.sort_order) {
				categoryRelationshipObj.sort_order = params.sort_order
			}
			try {
				let data = await CategoryRelationship.create(categoryRelationshipObj);
				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "Category relationship created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a category relationship'
				})
			}


		},
		this.updateCategoryRelationship = async (req, res) => {
			let categoryRelationshipId = req.params.id;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!req.body.parent_cat_id && !req.body.child_cat_id && !req.body.sort_rder) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (req.body.parent_cat_id) {
				update.parent_cat_id = req.body.parent_cat_id;
			}
			if (req.body.child_cat_id) {
				update.child_cat_id = req.body.child_cat_id;
			}
			if (req.body.sort_rder) {
				update.sort_order = req.body.sort_rder;
			}

			let categoryRelationshipData = await CategoryRelationship.findOne({
				where: {
					id: categoryRelationshipId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking categoryRelationshipId exists or not',
						error: err
					})
				})
			if (!categoryRelationshipData) {
				return res.send({
					success: 0,
					message: 'Invalid categoryRelationship '
				})
			} else {

				await CategoryRelationship.update(update, {
					where: {
						id: categoryRelationshipId
					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating Category Relationship',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "CategoryRelationship updated successfully."
				});
			}


		},

		this.listCategoryReletionship = async (req, res) => {
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
			if (params.sort_rder) {
				whereCondition.sort_order = params.sort_rder
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

		this.getCategoryRelationship = async (req, res) => {
			let categoryRelationshipId = req.params.id;
			let categoryRelationshipObj = await CategoryRelationship.findOne({
				where: {
					id: categoryRelationshipId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting category relationship data',
						error: err
					})
				})
			let response = {
				categoryRelationship: categoryRelationshipObj,
				success: 1,
			}
			res.send(response);
		},

		this.deleteCategoryRelationship = async (req, res) => {
			let categoryRelationshipId = req.params.id;
			let categoryRelationshipData = await CategoryRelationship.findOne({
				where: {
					id: categoryRelationshipId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while deleting category relationship data',
						error: err
					})
				})
			if (categoryRelationshipData) {
				let update = {
					status: 0
				}
				await CategoryRelationship.update(update, {
					where: {
						id: categoryRelationshipData.id

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting category relationship',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Category Relationship deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "Category Relationship not exists."
				});
			}


		},

		this.createMeta = async (req, res) => {
			let params = req.body;

			if (!params.key || !params.value || !params.flag) {
				var errors = [];
				if (!params.key) {
					errors.push({
						field: "key",
						message: "key is missing"
					});
				}
				if (!value) {
					errors.push({
						field: "value",
						message: "value is missing"
					});
				}
				if (!flag) {
					errors.push({
						field: "flag",
						message: "flag is missing"
					});
				}
				return res.status(200).send({
					success: 0,
					errors: errors,
					code: 200
				});
			}

			let metaObj = {
				status: 1
			}
			if (params.key) {
				metaObj.key = params.key
			}
			if (params.value) {
				metaObj.value = params.value
			}
			if (params.flag) {
				metaObj.flag = params.flag
			}

			let metaData = await Meta.findOne({
				key: params.key,
				value: params.value,
				status: 1
			})
			if (metaData != null) {
				try {
					let data = await Meta.create(metaObj);
					res.status(200).send({
						success: 1,
						id: data.dataValues.id,
						message: "Meta created successfully."
					});
				} catch (err) {
					console.log(err);
					return res.send({
						success: 0,
						message: 'Error while create a meta'
					})
				}
			} else {
				return res.send({
					success: 0,
					message: 'Already exists'
				})
			}
		},


		this.updateMeta = async (req, res) => {
			let metaId = req.params.id;
			let update = {};
			update.status = 1;
			update.modified_at = new Date();
			if (!req.body.key && !req.body.value && !req.body.value) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (req.body.key) {
				update.key = req.body.key;
			}
			if (req.body.value) {
				update.value = req.body.value;
			}
			if (req.body.flag) {
				update.flag = req.body.flag;
			}

			let metaData = await Meta.findOne({
				where: {
					id: metaId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking meta exists or not',
						error: err
					})
				})
			if (!metaData) {
				return res.send({
					success: 0,
					message: 'Invalid meta '
				})
			} else {
				if (req.body.key || req.body.value) {
					let metaCheckData = await Meta.findOne({
						where: {
							key: req.body.key,
							value: req.body.value,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking meta already exists or not',
								error: err
							})
						})
					if (metaCheckData && (metaCheckData.id !== metaId)) {
						return res.send({
							success: 0,
							message: 'Meta already exists '
						})
					}
				}

				await Meta.update(update, {
					where: {
						id: metaId
					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating Meta',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Meta updated successfully."
				});
			}


		},


		this.listMeta = async (req, res) => {
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

		this.getMeta = async (req, res) => {
			let metaId = req.params.id;
			let metaData = await Meta.findOne({
				where: {
					id: metaId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting meta data',
						error: err
					})
				})

			let response = {
				metaData: metaData,
				success: 1,
			}
			res.send(response);
		},
		this.deleteMeta = async (req, res) => {
			let metaId = req.params.id;
			let metaData = await Meta.findOne({
				where: {
					id: metaId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting meta data',
						error: err
					})
				})
			if (metaData != null) {
				let update = {
					status: 0
				}
				await Meta.update(update, {
					where: {
						id: metaData.id

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting meta',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Meta deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "Meta not exists."
				});
			}


		},
		this.getUserTypes = async (req,res) =>{
          let userTypes = await UserType.findAll({
			  where : {
				  status : 1
			  }
		  })
		  .catch(err => {
			return res.send({
				success: 0,
				message: 'Something went wrong while getting user types',
				error: err
			})
		})
		let response = {
			userTypeData: userTypes,
			success: 1,
			message: "User types listed."
		}
		res.status(200).send(response);
		},
		this.createUser = async (req, res) => {
			let params = req.body;

			if (!params.name ||
				!params.email || !params.phone ||
				!params.lsgi_id || !params.password || !params.role_id || !params.user_type) {
				var errors = [];

				if (!params.name) {
					errors.push({
						field: "name",
						message: "Require Name "
					});
				}
				if (!params.lsgi_id) {
					errors.push({
						field: "lsgi_id",
						message: "Require Lsgi Id "
					});
				}
				if (!params.user_type) {
					errors.push({
						field: "user_type",
						message: "Require User Type "
					});
				}
				if (!params.role_id) {
					errors.push({
						field: "role_id",
						message: "Require Role Id "
					});
				}
				// if (!params.name_en) {
				//   errors.push({
				//     field: "name_en",
				//     message: "Name in English cannot be empty"
				//   });
				// }
				// if (!params.name_ml ) {
				//   errors.push({
				//     field: "name_ml",
				//     message: "Name in Malayalam cannot be empty"
				//   });
				// }
				if (!params.email) {
					errors.push({
						field: "email",
						message: "Require email"
					});
				}
				if (!params.phone) {
					errors.push({
						field: "phone",
						message: "Require phone"
					});
				}
				if (!params.password) {
					errors.push({
						field: "password",
						message: "Require password"
					});
				}


				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};

			const hash = bcrypt.hashSync(params.password, salt);

			let userObj = {
				name: params.name.trim(),
				email: params.email.trim(),
				phone: params.phone.trim(),
				lsgi_id: params.lsgi_id,
				role_id: params.role_id,
				password: hash,
				user_type: params.user_type.trim(),
				is_approved: 1,
				status: 1
			}

			// let checkEmail = await User.findOne({
			//  where : { 
			//    email : params.email,
			//   //  status : 1
			//  }
			// })
			// .catch(err => {
			//   return res.send({
			//     success: 0,
			//     message: 'Something went wrong while checking email',
			//     error: err
			//   })
			// })

			// if(checkEmail && checkEmail !== null){
			//   return res.send({
			//     success: 0,
			//     message: 'Email already exists..',
			//   })
			// }
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

			let checkEmail = await User.findOne({
				where: {
					email: params.email,
					// status : 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking email',
						error: err
					})
				})
			if (checkEmail && checkEmail !== null) {
				return res.send({
					success: 0,
					message: 'Email already exists..',
				})
			}

			try {
				let data = await User.create(userObj);
				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
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
		// updateUser
		this.updateUser = async (req, res) => {
			let userId = req.params.id;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!req.body.phone && !req.body.email 
				 && !req.password && !req.lsgi_id
				 && !req.role_id) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (req.body.phone) {
				update.phone = req.body.phone;
			}
			if (req.body.email) {
				update.email = req.body.email;
			}
			if (req.body.password) {
				update.password = req.body.password;
			}
			if (req.body.lsgi_id) {
				update.lsgi_id = req.body.lsgi_id;
			}
			if (req.body.role_id) {
				update.role_id = req.body.role_id;
			}
			let idData = await User.findOne({
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
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid user '
				})
			} else {
				// if (req.body.email) {
				//   let emailData = await User.findOne({
				//       where: {
				//         email: req.body.email,
				//         status: 1,
				//       }
				//     })
				//     .catch(err => {
				//       return res.send({
				//         success: 0,
				//         message: 'Something went wrong while checking email already exists or not',
				//         error: err
				//       })
				//     })
				//   if (emailData && (emailData.id !== userId)) {
				//     return res.send({
				//       success: 0,
				//       message: 'Email already exists '
				//     })
				//   }
				// }

				if (req.body.phone) {
					let phoneData = await User.findOne({
						where: {
							email: req.body.phone,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking phone already exists or not',
								error: err
							})
						})
					if (phoneData && (phoneData.id !== userId)) {
						return res.send({
							success: 0,
							message: 'Phone already exists '
						})
					}
				}


				await User.update(update, {
					where: {
						id: userId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating user',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "User updated successfully."
				});
			}


		},

		this.listUser = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {
				status: 1
			}
			// if (params.districtId) {
			//   whereCondition.district_id = params.districtId
			// }
			// if (params.lsgiTypeId) {
			//   whereCondition.lsgi_type_id = params.lsgiTypeId
			// }
			// if (params.lsgiBlockId) {
			//   whereCondition.lsgi_block_id = params.lsgiBlockId
			// }

			var userData = await User.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				include: [{
					model: Lsgi,
				}],
				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching user data',
						error: err
					})
				});

			var count = await User.count({
				where: whereCondition,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching user data',
						error: err
					})
				});
			if (!userData || userData === null) {
				userData = [];
			}
			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: userData,
				totalItems: count,
				hasNextPage,
				message: "User data listed successfully",
				success: 1,
			}
			res.send(response);
		},


		this.getUser = async (req, res) => {
			let userId = req.params.id;
			let userData = await User.findOne({
				where: {
					id: userId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting user data',
						error: err
					})
				})
			let response = {
				user: userData,
				success: 1,
			}
			res.send(response);
		},


		this.deleteUser = async (req, res) => {
			let userId = req.params.id;
			let userData = await User.findOne({
				where: {
					id: userId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting user data',
						error: err
					})
				})
			if (userData) {
				let update = {
					status: 0
				}
				await userData.update(update, {
					where: {
						id: userData.id

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting user',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "User deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "User not exists."
				});
			}


		},

		this.changeUserPassword = async (req, res) => {
			let params = req.body;
			let userId = req.params.id;



			if (!params.new_password) {
				var errors = [];

				if (!params.new_password) {
					errors.push({
						field: "new_password",
						message: "Require new password"
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
			if (!userData || userData === null || (userData.user_type === constants.TYPE_ADMIN)) {
				return res.send({
					success: 0,
					message: 'Invalid user '
				})
			}

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


		},
		this.changeAdminPassword = async (req, res) => {
			let params = req.body;
			let userId = req.params.id;

			if (!params.new_password) {
				var errors = [];

				if (!params.new_password) {
					errors.push({
						field: "new_password",
						message: "Require new password"
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
			if (!userData || userData === null || (userData.user_type === constants.TYPE_ADMIN)) {
				return res.send({
					success: 0,
					message: 'Invalid user '
				})
			}

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
						message: 'Something went wrong while updating admin password',
						error: err
					})
				})
			res.status(200).send({
				success: 1,
				message: "Admin updated password successfully."
			});
		},


		// statusUpdate
		this.statusUpdate = async (req, res) => {
			if (!req.params.id) {
				return res.status(200).send({
					success: 1,
					message: "User ID missing."
				});
			}
			console.log((!req.body.isApproved) || (Number(req.body.isApproved) !== 0 && Number(req.body.isApproved) !== 1))
			if ((!req.body.isApproved) || (Number(req.body.isApproved) !== 0 && Number(req.body.isApproved) !== 1)) {
				return res.status(200).send({
					success: 1,
					message: "Status missing..."
				});
			}
			let params = req.body;
			let userId = req.params.id;
			let status = params.isApproved
			let update = {};
			update.is_approved = status;


			let idData = await User.findOne({
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
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid user '
				})
			} else {
				console.log("idData.isApproved : " + idData.is_approved)
				console.log("status : " + status)
				if (Number(idData.is_approved) === 1 && Number(status) === 1) {
					return res.send({
						success: 0,
						message: 'Already approved '
					})
				}
				if (Number(idData.is_approved) === 0 && Number(status) === 0) {
					return res.send({
						success: 0,
						message: 'Already disapproved '
					})
				}

				await User.update(update, {
					where: {
						id: userId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while user status',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "User updated status successfully."
				});
			}


		},


		this.createGradeConfig = async (req, res) => {
			let params = req.body;
			console.log("params");
			console.log(params);
			console.log("params");

			if (params.start_value === undefined || !params.end_value) {
				var errors = [];
				if (params.start_value === undefined) {
					errors.push({
						field: "otp",
						message: "otp is missing"
					});
				}
				if (!params.end_value) {
					errors.push({
						field: "apiToken",
						message: "api Token is missing"
					});
				}
				if (!params.grade) {
					errors.push({
						success: 0,
						message: 'Require grade'
					})
				}
				return res.status(200).send({
					success: 0,
					errors: errors,
					code: 200
				});
			}


			let gradeObj = {
				start_value: params.start_value,
				end_value: params.end_value,
				grade: params.grade,
				status: 1
			}
			let startEndCheck = await GradeConfiguaration.findOne({
				where: {
					start_value: params.start_value,
					end_value: params.end_value,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking grade configuaration exists or not',
						error: err
					})
				})
			if (startEndCheck) {
				return res.send({
					success: 0,
					message: 'Satrt end value already set..'
				})
			}

			try {
				let data = await GradeConfiguaration.create(gradeObj);
				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "Grade config created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a Grade config'
				})
			}
		},

		this.updateGradeConfig = async (req, res) => {
			let gradeConfigId = req.params.id;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!req.body.start_value === undefined && !req.body.end_value && !req.body.grade) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (req.body.start_value) {
				update.start_value = req.body.start_value;
			}
			if (req.body.end_value) {
				update.end_value = req.body.end_value;
			}
			if (req.body.grade) {
				update.grade = req.body.grade;
			}
			let idData = await GradeConfiguaration.findOne({
				where: {
					id: gradeConfigId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking grade config id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid grade config '
				})
			} else {
				if (req.body.start_value) {
					let startValueData = await GradeConfiguaration.findOne({
						where: {
							start_value: req.body.start_value,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking start value already exists or not',
								error: err
							})
						})
					if (startValueData && (startValueData.id !== gradeConfigId)) {
						return res.send({
							success: 0,
							message: 'Start value already exists '
						})
					}
				}

				if (req.body.end_value) {
					let endValueData = await GradeConfiguaration.findOne({
						where: {
							end_value: req.body.end_value,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking end value already exists or not',
								error: err
							})
						})
					if (endValueData && (endValueData.id !== gradeConfigId)) {
						return res.send({
							success: 0,
							message: 'End value already exists '
						})
					}
				}

				await GradeConfiguaration.update(update, {
					where: {
						id: gradeConfigId
					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating grade configuaration',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Grade configuaration updated successfully."
				});
			}


		},


		this.listGradeConfig = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			whereCondition.status = 1;
			// if(params.name){
			//   whereCondition.name_en = {
			//     [Op.like]: '%' + params.name + '%'
			//   };
			//   // whereCondition.name_ml = {
			//   //   [Op.like]: '%' + params.name + '%'
			//   // };
			// }

			var gradeConfiguarationData = await GradeConfiguaration.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				// where: {
				//   status: 1
				// },
				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching grade configuaration data',
						error: err
					})
				});

			var count = await GradeConfiguaration.count({
				where: whereCondition,

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching grade configuaration count data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: gradeConfiguarationData,
				totalItems: count,
				hasNextPage,
				message: "Grade configuaration listed successfully",
				success: 1,
			}
			return res.send(response);
		},
		this.getGradeConfiguaration = async (req, res) => {
			let gradeConfiguarationId = req.params.id;
			let gradeConfiguarationData = await GradeConfiguaration.findOne({
				where: {
					id: gradeConfiguarationId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting grade configuaration data',
						error: err
					})
				})
			let response = {
				gradeConfiguaration: gradeConfiguarationData,
				success: 1,
			}
			return res.send(response);
		},
		this.deleteGradeConfiguaration = async (req, res) => {
			let gradeConfiguarationId = req.params.id;
			let gradeConfiguarationData = await GradeConfiguaration.findOne({
				where: {
					id: gradeConfiguarationId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting grade configuaration data',
						error: err
					})
				})
			if (gradeConfiguarationData) {
				let update = {
					status: 0
				}
				await GradeConfiguaration.update(update, {
					where: {
						id: gradeConfiguarationData.id

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating GradeConfiguaration',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Grade configuation deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "Grade configuation not exists."
				});
			}


		},


		this.createPercentageConfig = async (req, res) => {
			let params = req.body;
			console.log("params");
			console.log(params);
			console.log("params");
			if (params.name === undefined) {
				return res.send({
					success: 0,
					message: 'Require name'
				})
			}

			let percentageObj = {
				name: params.name,
				status: 1
			}
			let nameCheck = await PercentageConfiguaration.findOne({
				where: {
					name: params.name,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking percentage configuaration exists or not',
						error: err
					})
				})
			if (nameCheck) {
				return res.send({
					success: 0,
					message: 'Name already set..'
				})
			}

			try {
				let data = await PercentageConfiguaration.create(percentageObj);
				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "Percentage config created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a Percentage config'
				})
			}
		},

		this.updatePercentageConfig = async (req, res) => {
			let percentageConfigId = req.params.id;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!req.body.name === undefined) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (req.body.name) {
				update.name = req.body.name;
			}

			let idData = await PercentageConfiguaration.findOne({
				where: {
					id: percentageConfigId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking percentage config id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid percentage config '
				})
			} else {
				if (req.body.name) {
					let nameData = await PercentageConfiguaration.findOne({
						where: {
							name: req.body.name,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking name value already exists or not',
								error: err
							})
						})
					if (nameData && (nameData.id !== percentageConfigId)) {
						return res.send({
							success: 0,
							message: 'Name already exists '
						})
					}
				}


				await PercentageConfiguaration.update(update, {
					where: {
						id: percentageConfigId
					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating percentage configuaration',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Percentage configuaration updated successfully."
				});
			}


		},


		this.listPercentageConfig = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			whereCondition.status = 1;
			// if(params.name){
			//   whereCondition.name_en = {
			//     [Op.like]: '%' + params.name + '%'
			//   };
			//   // whereCondition.name_ml = {
			//   //   [Op.like]: '%' + params.name + '%'
			//   // };
			// }

			var percentageConfiguarationData = await PercentageConfiguaration.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				// where: {
				//   status: 1
				// },
				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching percentage configuaration data',
						error: err
					})
				});

			var count = await PercentageConfiguaration.count({
				where: whereCondition,

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching Percentage configuaration count data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: percentageConfiguarationData,
				totalItems: count,
				hasNextPage,
				message: "Percentage configuaration listed successfully",
				success: 1,
			}
			return res.send(response);
		},
		this.getPercentageConfig = async (req, res) => {
			let percentageConfiguarationId = req.params.id;
			let percentageConfiguarationData = await PercentageConfiguaration.findOne({
				where: {
					id: percentageConfiguarationId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting percentage configuaration data',
						error: err
					})
				})
			let response = {
				percentageConfiguaration: percentageConfiguarationData,
				success: 1,
			}
			return res.send(response);
		},
		this.deletePercentageConfig = async (req, res) => {
			let percentageConfigId = req.params.id;
			let percentageConfigData = await PercentageConfiguaration.findOne({
				where: {
					id: percentageConfigId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting percentage configuaration data',
						error: err
					})
				})
			if (percentageConfigData) {
				let update = {
					status: 0
				}
				await PercentageConfiguaration.update(update, {
					where: {
						id: percentageConfigData.id

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting Percentage Config',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Percentage configuation deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "Percentage configuation not exists."
				});
			}


		},

		this.createPercentageConfigSlab = async (req, res) => {
			let params = req.body;
			console.log("params");
			console.log(params);
			console.log("params");

			if (params.start_value === undefined || params.end_value
				|| params.points === undefined || !params.percentage_config_id) {
				var errors = [];
				if (params.start_value === undefined) {
					errors.push({
						field: "otp",
						message: "otp is missing"
					});
				}
				if (params.end_value === undefined) {
					errors.push({
						field: "apiToken",
						message: "api Token is missing"
					});
				}
				if (params.points === undefined) {
					errors.push({
						success: 0,
						message: 'Require points'
					})
				}
				if (!params.percentage_config_id) {
					errors.push({
						success: 0,
						message: 'Require percentage config id'
					})
				}
				return res.status(200).send({
					success: 0,
					errors: errors,
					code: 200
				});
			}


			let percentageConfigSlabObj = {
				start_value: params.start_value,
				end_value: params.end_value,
				points: params.points,
				percentage_config_id: params.percentage_config_id,
				status: 1
			}
			let startValueCheck = await PercentageConfigSlab.findOne({
				where: {
					start_value: params.start_value,
					percentage_config_id: params.percentage_config_id,

					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking start value exists or not',
						error: err
					})
				})
			if (startValueCheck) {
				return res.send({
					success: 0,
					message: 'Start value already set..'
				})
			}

			let endValueCheck = await PercentageConfigSlab.findOne({
				where: {
					end_value: params.end_value,
					percentage_config_id: params.percentage_config_id,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking end value exists or not',
						error: err
					})
				})
			if (endValueCheck) {
				return res.send({
					success: 0,
					message: 'end value already set..'
				})
			}

			let percentageConfigIdCheck = await PercentageConfiguaration.findOne({
				where: {
					id: params.percentage_config_id,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking percentageConfigId exists or not',
						error: err
					})
				})
			if (!percentageConfigIdCheck) {
				return res.send({
					success: 0,
					message: 'percentageConfigId in valid..'
				})
			}


			try {
				let data = await PercentageConfigSlab.create(percentageConfigSlabObj);
				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "Percentage config slab created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a Percentage config slab'
				})
			}
		},

		this.updatePercentageConfigSlab = async (req, res) => {
			let percentageConfigSlabId = req.params.id;
			let params = req.body;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;

			if (params.start_value === undefined && !params.end_value &&
				!params.points && !params.percentage_config_id) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (params.start_value) {
				update.start_value = params.start_value
			}
			if (params.endValue) {
				update.end_value = params.end_value
			}
			if (params.points) {
				update.end_value = params.points
			}
			if (params.percentage_config_id) {
				update.percentage_config_id = params.percentage_config_id
			}
			let idData = await PercentageConfigSlab.findOne({
				where: {
					id: percentageConfigSlabId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking percentage config slab id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid percentage config slab id'
				})
			} else {
				if (params.percentage_config_id) {
					let percentageData = await PercentageConfiguaration.findOne({
						where: {
							id: params.percentage_config_id,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking percentage config id already exists or not',
								error: err
							})
						})
					if (!percentageData) {
						return res.send({
							success: 0,
							message: 'Percentage config id invalid'
						})
					}
				}
				if (req.body.start_value) {
					let startValueData = await PercentageConfigSlab.findOne({
						where: {
							start_value: req.body.start_value,
							percentage_config_id: params.percentage_config_id,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking start value value already exists or not',
								error: err
							})
						})
					if (startValueData && (startValueData.id !== percentageConfigSlabId)) {
						return res.send({
							success: 0,
							message: 'Start value already exists '
						})
					}
				}

				if (req.body.start_value) {
					let startValueData = await PercentageConfigSlab.findOne({
						where: {
							start_value: req.body.start_value,
							percentage_config_id: params.percentage_config_id,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking start value value already exists or not',
								error: err
							})
						})
					if (startValueData && (startValueData.id !== percentageConfigSlabId)) {
						return res.send({
							success: 0,
							message: 'Start value already exists '
						})
					}
				}
				if (req.body.end_value) {
					let endValueData = await PercentageConfigSlab.findOne({
						where: {
							end_value: req.body.end_value,
							percentage_config_id: params.percentage_config_id,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking end value value already exists or not',
								error: err
							})
						})
					if (endValueData && (endValueData.id !== percentageConfigSlabId)) {
						return res.send({
							success: 0,
							message: 'End value already exists '
						})
					}
				}

				await PercentageConfigSlab.update(update, {
					where: {
						id: percentageConfigSlabId
					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating percentage config slab',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Percentage config slab updated successfully."
				});
			}


		},


		this.listPercentageConfigSlab = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			whereCondition.status = 1;
			// if(params.name){
			//   whereCondition.name_en = {
			//     [Op.like]: '%' + params.name + '%'
			//   };
			//   // whereCondition.name_ml = {
			//   //   [Op.like]: '%' + params.name + '%'
			//   // };
			// }

			var percentageConfigSlabData = await PercentageConfigSlab.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				// where: {
				//   status: 1
				// },
				include: [{
					model: PercentageConfiguaration
				}],
				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching percentage configuaration slab data',
						error: err
					})
				});

			var count = await PercentageConfigSlab.count({
				where: whereCondition,

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching Percentage configuaration slab count data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: percentageConfigSlabData,
				totalItems: count,
				hasNextPage,
				message: "Percentage configuaration slab listed successfully",
				success: 1,
			}
			return res.send(response);
		},
		this.getPercentageConfigSlab = async (req, res) => {
			let percentageConfigSlabId = req.params.id;
			let percentageConfigSlabData = await PercentageConfigSlab.findOne({
				where: {
					id: percentageConfigSlabId,
					status: 1
				},
				include: [{
					model: PercentageConfiguaration
				}]
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting percentage configuaration slab data',
						error: err
					})
				})
			let response = {
				percentageConfiguarationSlab: percentageConfigSlabData,
				success: 1,
			}
			return res.send(response);
		},
		this.deletePercentageConfigSlab = async (req, res) => {
			let percentageConfigSlabId = req.params.id;
			let percentageConfiguarationSlabData = await PercentageConfigSlab.findOne({
				where: {
					id: percentageConfigSlabId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting percentage configuaration slab data',
						error: err
					})
				})
			if (percentageConfiguarationSlabData) {
				let update = {
					status: 0
				}
				await PercentageConfigSlab.update(update, {
					where: {
						id: percentageConfiguarationSlabData.id

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting Percentage Config Slab',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Percentage configuation slab deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "Percentage configuation slab not exists."
				});
			}


		},

		this.createNotification = async (req, res) => {
			let params = req.body;
			if (!params.title || !params.content) {
				var errors = [];
				if (!otp) {
					errors.push({
						field: "otp",
						message: "otp is missing"
					});
				}
				// if (!apiToken) {
				// 	errors.push({
				// 		field: "apiToken",
				// 		message: "api Token is missing"
				// 	});
				// }

				if (!params.title) {

					errors.push({
						field: "title",
						message: "title is missing"
					});
				}
				if (!params.content) {
					errors.push({
						field: "content",
						message: "content is missing"
					});
				}

				return res.status(200).send({
					success: 0,
					errors: errors,
					code: 200
				});
			}



			let notificationObj = {
				title: params.title,
				content: params.content,
				status: 1
			}

			try {
				let data = await Notification.create(notificationObj);
				res.status(200).send({
					id: data.dataValues.id,
					success: 1,
					message: "Notification created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a Notification'
				})
			}
		},

		this.updateNotification = async (req, res) => {
			let notifId = req.params.id;
			let params = req.body;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;

			if (!params.title && !params.content) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (params.title) {
				update.title = params.title
			}
			if (params.content) {
				update.content = params.content
			}

			let idData = await Notification.findOne({
				where: {
					id: notifId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking notification id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid percentage notif id'
				})
			} else {


				await Notification.update(update, {
					where: {
						id: notifId
					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating notif',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "notification updated successfully."
				});
			}


		},


		this.listNotification = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			whereCondition.status = 1;
			// if(params.name){
			//   whereCondition.name_en = {
			//     [Op.like]: '%' + params.name + '%'
			//   };
			//   // whereCondition.name_ml = {
			//   //   [Op.like]: '%' + params.name + '%'
			//   // };
			// }

			var notifData = await Notification.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				// where: {
				//   status: 1
				// },

				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching notification data',
						error: err
					})
				});

			var count = await Notification.count({
				where: whereCondition,

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching notification count data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: notifData,
				totalItems: count,
				hasNextPage,
				message: "NOtification listed successfully",
				success: 1,
			}
			return res.send(response);
		},
		this.getNotification = async (req, res) => {
			let notifId = req.params.id;
			let notifData = await Notification.findOne({
				where: {
					id: notifId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting notif data',
						error: err
					})
				})
			let response = {
				notification: notifData,
				success: 1,
			}
			return res.send(response);
		},
		this.deleteNotification = async (req, res) => {
			let notifId = req.params.id;
			let notifData = await Notification.findOne({
				where: {
					id: notifId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting notif data data',
						error: err
					})
				})
			if (notifData) {
				let update = {
					status: 0
				}
				await Notification.update(update, {
					where: {
						id: notifData.id

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting notification',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Notification deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "Notification not exists."
				});
			}


		},


		this.createSidebarMenu = async (req, res) => {
			let params = req.body;

			var name = req.body.name;
			var icon = req.body.icon;
			var link = req.body.link;
			var parentSidebarMenuId = req.body.parent_sidebar_menu_id;
			if (!name || !icon || !link) {
				var errors = [];
				if (!name) {
					errors.push({
						field: "name",
						message: "Name cannot be empty"
					});
				}
				if (!icon) {
					errors.push({
						field: "icon",
						message: "Icon cannot be empty"
					});
				}
				if (!link) {
					errors.push({
						field: "link",
						message: "Link cannot be empty"
					});
				}
				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};

			let sidebarMenuObj = {
				name: params.name,
				icon: params.icon,
				link: params.link,
				status: 1
			}
			if (parentSidebarMenuId) {
				sidebarMenuObj.parent_sidebar_menu_id = parentSidebarMenuId;

				let idData = await SidebarMenu.findOne({
					where: {
						id: parentSidebarMenuId
					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while checking parent sidebar menu id exists or not',
							error: err
						})
					})
				if (!idData) {
					return res.send({
						success: 0,
						message: 'Invalid parentsidebarmenu id',
					})
				}
			}

			try {
				let data = await SidebarMenu.create(sidebarMenuObj);
				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "Sidebar menu created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while creating a Sidebar menu'
				})
			}
		},

		this.updateSidebarMenu = async (req, res) => {
			let sidebarMenuId = req.params.id;
			let params = req.body;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;

			if (!params.name && !params.link && !params.icon && !params.parent_sidebar_menu_id) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (params.name) {
				update.name = params.name
			}
			if (params.link) {
				update.link = params.link
			}
			if (params.icon) {
				update.icon = params.icon
			}
			if (params.parent_sidebar_menu_id) {
				if (params.parent_sidebar_menu_id !== sidebarMenuId) {

					let idData = await SidebarMenu.findOne({
						where: {
							id: params.parent_sidebar_menu_id
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking parent sidebar menu id exists or not',
								error: err
							})
						})
					if (!idData) {
						return res.send({
							success: 0,
							message: 'Invalid parentsidebarmenu id',
						})
					} else {

						update.parent_sidebar_menu_id = params.parent_sidebar_menu_id

					}
				} else {
					return res.send({
						success: 0,
						message: 'Invalid parent id ',
					})
				}
			}

			let idData = await SidebarMenu.findOne({
				where: {
					id: sidebarMenuId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking sidebar menu id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid sidebar menu id'
				})
			} else {


				await SidebarMenu.update(update, {
					where: {
						id: sidebarMenuId
					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating sidebar menu',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Sidebar menu updated successfully."
				});
			}


		},


		this.listSidebarMenu = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			whereCondition.status = 1;
			// if(params.name){
			//   whereCondition.name_en = {
			//     [Op.like]: '%' + params.name + '%'
			//   };
			//   // whereCondition.name_ml = {
			//   //   [Op.like]: '%' + params.name + '%'
			//   // };
			// }

			var sideBarMenuData = await SidebarMenu.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				// where: {
				//   status: 1
				// },

				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching sidebarMenu data',
						error: err
					})
				});

			var count = await SidebarMenu.count({
				where: whereCondition,

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching sidebarMenu count data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: sideBarMenuData,
				totalItems: count,
				hasNextPage,
				message: "Sidebar menu data listed successfully",
				success: 1,
			}
			return res.send(response);
		},
		this.getSidebarMenu = async (req, res) => {
			let sideBarMenuId = req.params.id;
			let sideBarMenuData = await SidebarMenu.findOne({
				where: {
					id: sideBarMenuId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting sideBarMenu data',
						error: err
					})
				})
			let response = {
				sidebarMenu: sideBarMenuData,
				success: 1,
			}
			return res.send(response);
		},
		this.deleteSidebarMenu = async (req, res) => {
			let sideBarMenuId = req.params.id;
			let sideBarMenuData = await SidebarMenu.findOne({
				where: {
					id: sideBarMenuId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting sideBarMenu data',
						error: err
					})
				})
			if (sideBarMenuData) {
				let update = {
					status: 0
				}
				await SidebarMenu.update(update, {
					where: {
						id: sideBarMenuData.id

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting sidebarmenu',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Sidebarmenu deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "Sidebarmenu not exists."
				});
			}


		},


		this.createQuestion = async (req, res) => {
			let params = req.body;


			if (!params.question_en || !params.question_ml
				|| !params.type
				|| !params.error_message
				|| !params.sort_order) {
				var errors = [];
				if (!params.question_en) {
					errors.push({
						field: "question_en",
						message: "Question in English cannot be empty"
					});
				}
				if (!params.question_ml) {
					errors.push({
						field: "question_ml",
						message: "Name in Malayalam cannot be empty"
					});
				}

			


				if (!params.type) {
					errors.push({
						field: "type",
						message: "Type cannot be empty"
					});
				}
				if (!params.sort_order) {
					errors.push({
						field: "sort_order",
						message: "Sort order cannot be empty"
					});
				}

				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});

			};

			let questionObj = {
				question_en: params.question_en.trim(),
				question_ml: params.question_ml.trim(),
				error_message: params.error_message.trim(),
				type: params.type.trim(),
				sort_order: params.sort_order,
				status: 1
			}
			if (params.is_percentage_calculation === undefined) {
				questionObj.is_percentage_calculation = 0
			} else {
				questionObj.is_percentage_calculation = params.is_percentage_calculation;
			}
			if (params.is_mandatory === undefined) {
				questionObj.is_mandatory = 0
			} else {
				questionObj.is_mandatory = params.is_mandatory;
			}
			if (params.min !== undefined) {
				questionObj.min = params.min;

			}
			if (params.max !== undefined) {
				questionObj.max = params.max;
			}
			if (params.percentage_configuaration_id) {
				questionObj.percentage_configuaration_id = params.percentage_configuaration_id;

			}
			if (params.point) {
				questionObj.point = params.point;
			}
			try {
				let data = await Question.create(questionObj);
				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "Question created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while creating a Question'
				})
			}
		},

		this.updateQuestion = async (req, res) => {
			let questionId = req.params.id;
			let params = req.body;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;

			if (!params.question_en && !params.question_ml &&
				!params.point && (params.is_percentage_calculation === undefined)
				&& (params.is_mandatory === undefined) && !params.type
				&& (params.min === undefined) && (params.max === undefined)
				&& !params.error_message && !params.percentage_configuaration_id
				&& !params.sort_order) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			update = params;
			if (params.question_en) {
				update.question_en = params.question_en.trim()
			}
			if (params.question_ml) {
				update.question_ml = params.question_ml.trim()
			}
			if (params.error_message) {
				update.error_message = params.error_message.trim()
			}
			if (params.type) {
				update.type = params.type.trim()
			}



			let idData = await Question.findOne({
				where: {
					id: questionId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking question id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid question id'
				})
			} else {


				await Question.update(update, {
					where: {
						id: questionId
					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating question',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Question updated successfully."
				});
			}


		},


		this.listQuestion = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			whereCondition.status = 1;
			// if(params.name){
			//   whereCondition.name_en = {
			//     [Op.like]: '%' + params.name + '%'
			//   };
			//   // whereCondition.name_ml = {
			//   //   [Op.like]: '%' + params.name + '%'
			//   // };
			// }

			var questionData = await Question.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				// where: {
				//   status: 1
				// },

				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching question data',
						error: err
					})
				});

			var count = await Question.count({
				where: whereCondition,

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching question count data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: questionData,
				totalItems: count,
				hasNextPage,
				message: "Question data listed successfully",
				success: 1,
			}
			return res.send(response);
		},
		this.getQuestion = async (req, res) => {
			let questionId = req.params.id;
			let questionData = await Question.findOne({
				where: {
					id: questionId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting question data',
						error: err
					})
				})
			let response = {
				question: questionData,
				success: 1,
			}
			return res.send(response);
		},
		this.deleteQuestion = async (req, res) => {
			let questionId = req.params.id;
			let questionData = await Question.findOne({
				where: {
					id: questionId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting question data',
						error: err
					})
				})
			if (questionData) {
				let update = {
					status: 0
				}
				await Question.update(update, {
					where: {
						id: questionData.id

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting question',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Question deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "Question not exists."
				});
			}


		},

		this.createQuestionOption = async (req, res) => {
			let params = req.body;

			if (!params.name_en || !params.name_ml ||
				params.points === undefined ||
				//  !params.field_name ||
				!params.question_id ||
				!params.value ||
				!params.sort_order) {
				var errors = [];
				if (!params.name_en) {
					errors.push({
						field: "name_en",
						message: "Name in English cannot be empty"
					});
				}
				if (!params.name_ml) {
					errors.push({
						field: "name_ml",
						message: "Name in Malayalam cannot be empty"
					});
				}
				// if (!params.field_name) {
				// 	errors.push({
				// 		field: "field_name",
				// 		message: "Field name in Malayalam cannot be empty"
				// 	});
				// }
				if (params.points === undefined) {
					errors.push({
						field: "point",
						message: "Point cannot be empty"
					});
				}
				if (!params.question_id) {
					errors.push({
						field: "question_id",
						message: "Question ID cannot be empty"
					});
				}
				// if (!params.type) {
				// 	errors.push({
				// 		field: "type",
				// 		message: "Type cannot be empty"
				// 	});
				// }

				if (!params.value) {
					errors.push({
						field: "value",
						message: "Value cannot be empty"
					});
				}
				if (!params.sort_order) {
					errors.push({
						field: "sort_order",
						message: "Sort order cannot be empty"
					});
				}
				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};

			let questionOptionObj = {
				name_en: params.name_en.trim(),
				name_ml: params.name_ml.trim(),
				// field_name: params.field_name.trim(),
				points: params.points,
				value: params.value,
				// type: params.type.trim(),
				sort_order: params.sort_order,
				status: 1
			}
			if (params.child_question_id) {
				questionOptionObj.child_question_id = params.child_question_id
			}
			let questionData = await Question.findOne({
				where: {
					id: params.question_id
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking  question id exists or not',
						error: err
					})

				})
			if (!questionData) {
				return res.send({
					success: 0,
					message: "Invalid question id "
				})
			} else {
				questionOptionObj.question_id = params.question_id;

			}
			if (params.child_question_id) {
				let dependentData = await Question.findOne({
					where: {
						id: params.child_question_id
					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while checking child question id exists or not',
							error: err
						})

					})
				if (!dependentData) {
					return res.send({
						success: 0,
						message: "Invalid child question id "
					})
				} else {
					questionOptionObj.dependent_question_id = params.dependent_question_id;

				}
			}
			try {
				let data = await QuestionOption.create(questionOptionObj);
				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "Question option created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while creating a Question option'
				})
			}
		},

		this.updateQuestionOption = async (req, res) => {
			let questionOptionId = req.params.id;
			let params = req.body;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;

			if (!params.name_en && !params.name_ml &&
				params.points === undefined
			    && !params.question_id && !params.type &&
				!params.value &&
				!params.dependent_question_id &&
				!params.sort_order) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (params.name_en) {
				update.name_en = params.name_en.trim()
			}
			if (params.name_ml) {
				update.name_ml = params.name_ml.trim()
			}
			if (params.points !== undefined) {
				update.points = params.points
			}

			if (params.question_id) {
				let questionData = await Question.findOne({
					where: {
						id: params.question_id
					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while checking  question id exists or not',
							error: err
						})

					})
				if (!questionData) {
					return res.send({
						success: 0,
						message: "Invalid question id "
					})
				} else {
					update.question_id = params.question_id;

				}
			}
			if (params.value) {
				update.value = params.value
			}
			// if (params.fieldName) {
			// 	update.field_name = params.fieldName
			// }
			if (params.sortOrder) {
				update.sort_order = params.sortOrder
			}
			if (params.child_question_id) {
				let dependentData = await Question.findOne({
					where: {
						id: params.child_question_id
					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while checking child question id exists or not',
							error: err
						})

					})
				if (!dependentData) {
					return res.send({
						success: 0,
						message: "Invalid chils question id "
					})
				} else {
					update.child_question_id = params.child_question_id;

				}
			}

			let idData = await QuestionOption.findOne({
				where: {
					id: questionOptionId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking question id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid question id'
				})
			} else {


				await QuestionOption.update(update, {
					where: {
						id: questionOptionId
					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating question option id',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Question option updated successfully."
				});
			}


		},


		this.listQuestionOption = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			whereCondition.status = 1;
			// if(params.name){
			//   whereCondition.name_en = {
			//     [Op.like]: '%' + params.name + '%'
			//   };
			//   // whereCondition.name_ml = {
			//   //   [Op.like]: '%' + params.name + '%'
			//   // };
			// }
			if (!params.question_id) {
				return res.send({
					success: 0,
					message: 'Please specify question id'
				})
			} else {
				whereCondition.question_id = params.question_id
			}
			var questionOptionData = await QuestionOption.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				// where: {
				//   status: 1
				// },

				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching question option data',
						error: err
					})
				});

			var count = await QuestionOption.count({
				where: whereCondition,

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching question option count data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: questionOptionData,
				totalItems: count,
				hasNextPage,
				message: "Question option data listed successfully",
				success: 1,
			}
			return res.send(response);
		},
		this.getQuestionOption = async (req, res) => {
			let questionOptionId = req.params.id;
			let questionOptionData = await QuestionOption.findOne({
				where: {
					id: questionOptionId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting question option data',
						error: err
					})
				})
			let response = {
				questionOption: questionOptionData,
				success: 1,
			}
			return res.send(response);
		},
		this.deleteQuestionOption = async (req, res) => {
			let questionOptionId = req.params.id;
			let questionOptionData = await QuestionOption.findOne({
				where: {
					id: questionOptionId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting question option data',
						error: err
					})
				})
			if (questionOptionData) {
				let update = {
					status: 0
				}
				await QuestionOption.update(update, {
					where: {
						id: questionOptionData.id

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting question option',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Question option deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "Question option  not exists."
				});
			}


		},


		this.login = async (req, res) => {
			var phone = req.body.phone;
			var password = req.body.password;
			if (!phone || !password) {
				var errors = [];
				if (!phone) {
					errors.push({
						field: "phone",
						message: "Phone cannot be empty"
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

			var findCriteria = {
				status: 1,
				phone: phone,
				// user_type: constants.TYPE_ADMIN
				// password: hash
			}
			let userData = await User.findOne({
				where: findCriteria
			});
			if (!userData) {
				return res.send({
					success: 0,
					statusCode: 401,
					message: 'Incorrect phone'
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
				var permissionsToken = jwt.sign({
					data: payload,
				}, JWT_KEY, {
					expiresIn: '10h'
				});
				if(userData.user_type === constants.TYPE_ADMIN){
					return	res.send({
						success: 1,
						statusCode: 200,
						version: versionData.version,
						token: permissionsToken,
						userDetails: payload,
						// permissions : permissions.items,
						message: 'Successfully logged in'
					})
				}else{

				let bearerToken = "bearer " + permissionsToken;
				let reqObj = {};
				reqObj.bearer = bearerToken;
				reqObj.role_id = userData.role_id;
				let permissionsData = await getMyPermissions(reqObj)
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while getting my permissions',
							error: err
						})
					});
	let permissions = JSON.parse(permissionsData)
	payload.permissions = permissions;
	var token = jwt.sign({
		data: payload,
	}, JWT_KEY, {
		expiresIn: '10h'
	});
console.log("permissionsData")
console.log(permissionsData)
console.log("permissionsData")

			
		
			return	res.send({
					success: 1,
					statusCode: 200,
					version: versionData.version,
					token: token,
					userDetails: payload,
					// permissions : permissions.items,
					message: 'Successfully logged in'
				})
			}
			} else {
				return res.send({
					success: 0,
					statusCode: 401,
					message: 'Incorrect password'
				})
			}
		}






	this.createFacilityType = async (req, res) => {
		let params = req.body;

		if (!params.name_ml || !params.name_en || !params.category_id) {
			var errors = [];

			if (!params.name_ml) {
				errors.push({
					field: "name_ml",
					message: 'Require district Malayalam name'

				});
			}
			if (!params.name_en) {
				errors.push({
					field: "name_en",
					message: 'Require district English name'
				});
			}
			if (!params.category_id) {
				errors.push({
					field: "category_id",
					message: 'Require category id'
				});
			}
			return res.send({
				success: 0,
				statusCode: 400,
				errors: errors,
			});
		};


		let districtObj = {
			name_ml: params.name_ml.trim(),
			name_en: params.name_en.trim(),
			category_id: params.category_id,
			status: 1
		}
		let nameMlCheck = await FacilityType.findOne({
			where: {
				name_ml: params.name_ml,
				status: 1
			}
		})
			.catch(err => {
				return res.send({
					success: 0,
					message: 'Something went wrong while checking malayalam facility type name exists or not',
					error: err
				})
			})
		if (nameMlCheck) {
			return res.send({
				success: 0,
				message: 'Facility type malayalam name already exists..'
			})
		}

		let nameEnCheck = await FacilityType.findOne({
			where: {
				name_en: params.name_en,
				status: 1
			}
		})
			.catch(err => {
				return res.send({
					success: 0,
					message: 'Something went wrong while checking english facility type name exists or not',
					error: err
				})
			})
		if (nameEnCheck) {
			return res.send({
				success: 0,
				message: 'District english name already exists..'
			})
		}

		let categoryCheck = await Category.findOne({
			where: {
				id: params.category_id,
				status: 1
			}
		})
			.catch(err => {
				return res.send({
					success: 0,
					message: 'Something went wrong while checking category id exists or not',
					error: err
				})
			})
		if (!categoryCheck) {
			return res.send({
				success: 0,
				message: 'Invalid category Id..'
			})
		}
		try {
			let data = await FacilityType.create(districtObj);

			res.status(200).send({
				success: 1,
				id: data.dataValues.id,
				message: "Facility type created successfully."
			});
		} catch (err) {
			console.log(err);
			return res.send({
				success: 0,
				message: 'Error while create a facility type'
			})
		}
	},
		this.updateFacilityType = async (req, res) => {
			let facilityTypeId = req.params.id;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!req.body.name_ml && !req.body.name_en && !req.body.category_id) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (req.body.name_ml) {
				update.name_ml = req.body.name_ml.trim();
			}
			if (req.body.name_en) {
				update.name_en = req.body.name_en.trim();
			}
			if (req.body.category_id) {
				update.category_id = req.body.category_id;
			}
			let idData = await FacilityType.findOne({
				where: {
					id: facilityTypeId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking facility type id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid Facility type '
				})
			} else {
				if (req.body.name_en) {
					let nameEnData = await FacilityType.findOne({
						where: {
							name_en: req.body.name_en,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking English FacilityType name already exists or not',
								error: err
							})
						})
					if (nameEnData && (nameEnData.id !== facilityTypeId)) {
						return res.send({
							success: 0,
							message: 'Facility Type English name already exists '
						})
					}
				}

				if (req.body.name_ml) {
					let nameMlData = await FacilityType.findOne({
						where: {
							name_ml: req.body.name_ml,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking malayalam facilityType name already exists or not',
								error: err
							})
						})
					if (nameMlData && (nameMlData.id !== facilityTypeId)) {
						return res.send({
							success: 0,
							message: 'District Malayalam name already exists '
						})
					}
				}
				if (req.body.category_id) {
					let categoryCheck = await Category.findOne({
						where: {
							id: req.body.category_id,
							status: 1
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking category id exists or not',
								error: err
							})
						})
					if (!categoryCheck) {
						return res.send({
							success: 0,
							message: 'Invalid category Id..'
						})
					}
				}

				await FacilityType.update(update, {
					where: {
						id: facilityTypeId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating facilityType name',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Facility type updated successfully."
				});
			}


		},
		this.listFacilityType = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			whereCondition.status = 1;
			if (params.name) {
				whereCondition.name_en = {
					[Op.like]: '%' + params.name + '%'
				};
				// whereCondition.name_ml = {
				//   [Op.like]: '%' + params.name + '%'
				// };
			}

			var facilityTypeData = await FacilityType.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				include: [{
					model: Category
				}],
				// where: {
				//   status: 1
				// },
				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching facility type data',
						error: err
					})
				});

			var count = await FacilityType.count({
				where: whereCondition,

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching facility type  count data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: facilityTypeData,
				totalItems: count,
				hasNextPage,
				message: "Facility Types listed successfully",
				success: 1,
			}
			return res.send(response);
		},


		this.getFacilityType = async (req, res) => {
			let facilityTypeId = req.params.id;
			let facilityTypeData = await FacilityType.findOne({
				where: {
					id: facilityTypeId,
					status: 1
				},
				include: [{
					model: Category
				}]
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting FacilityType data',
						error: err
					})
				})
			let response = {
				facilityType: facilityTypeData,
				success: 1,
			}
			return res.send(response);
		},
		this.deleteFacilityType = async (req, res) => {
			let facilityTypeId = req.params.id;
			let facilityTypeData = await FacilityType.findOne({
				where: {
					id: facilityTypeId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting FacilityType data',
						error: err
					})
				})
			if (facilityTypeData) {
				let update = {
					status: 0
				}
				await FacilityType.update(update, {
					where: {
						id: facilityTypeId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting FacilityType',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "FacilityType deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "FacilityType not exists."
				});
			}


		},


		this.createFacilitySurveyQuestion = async (req, res) => {
			let params = req.body;

			if (!params.question_en || !params.question_ml || !params.field_name || !params.type) {
				var errors = [];

				if (!params.question_en) {
					errors.push({
						field: "question_en",
						message: 'Require question in English'

					});
				}

				if (!params.question_ml) {
					errors.push({
						field: "question_ml",
						message: 'Require question in Malayalam'

					});
				}

				if (!params.field_name) {
					errors.push({
						field: "field_name",
						message: 'Require field name'
					});
				}
				if (!params.type) {
					errors.push({
						field: "type",
						message: 'Require type'
					});
				}


				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};


			let facilitySurveyQuestionObj = {
				question_en: params.question_en.trim(),
				question_ml: params.question_ml.trim(),
				field_name: params.field_name.trim(),
				type: params.type.trim(),
				status: 1
			}

			let questionEnCheck = await FacilitySurveyQuestion.findOne({
				where: {
					question_en: params.question_en.trim(),
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking question english exists or not',
						error: err
					})
				})
			if (questionEnCheck) {
				return res.send({
					success: 0,
					message: 'Question English already exists..'
				})
			}

			let questionMlCheck = await FacilitySurveyQuestion.findOne({
				where: {
					question_ml: params.question_ml.trim(),
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking question malayalam exists or not',
						error: err
					})
				})
			if (questionMlCheck) {
				return res.send({
					success: 0,
					message: 'Question Malayalam already exists..'
				})
			}

			let fieldNameCheck = await FacilitySurveyQuestion.findOne({
				where: {
					field_name: params.field_name.trim(),
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking field name exists or not',
						error: err
					})
				})
			if (fieldNameCheck) {
				return res.send({
					success: 0,
					message: 'Field name already exists..'
				})
			}

			try {
				let data = await FacilitySurveyQuestion.create(facilitySurveyQuestionObj);

				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "FacilitySurveyQuestion created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a FacilitySurveyQuestion'
				})
			}
		},
		this.updateFacilitySurveyQuestion = async (req, res) => {
			let facilitySurveyQuestionId = req.params.id;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!req.body.question_en && req.body.question_ml && !req.body.field_name && !req.body.type) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (req.body.question_en) {
				update.question_en = req.body.question_en.trim();
			}
			if (req.body.question_ml) {
				update.question_ml = req.body.question_ml.trim();
			}
			if (req.body.field_name) {
				update.field_name = req.body.field_name.trim();
			}
			if (req.body.type) {
				update.type = req.body.type.trim();
			}
			let idData = await FacilitySurveyQuestion.findOne({
				where: {
					id: facilitySurveyQuestionId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking facilitySurveyQuestion exists or not',
						error: err
					})
				})

			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid facilitySurveyQuestionId '
				})
			} else {

				if (req.body.question_en) {
					let facilitySurveyQuestionData = await FacilitySurveyQuestion.findOne({
						where: {
							question_en: req.body.question_en,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking question English already exists or not',
								error: err
							})
						})
					if (facilitySurveyQuestionData && (facilitySurveyQuestionData.id !== facilitySurveyQuestionId)) {
						return res.send({
							success: 0,
							message: 'Question English already exists '
						})
					}
				}

				if (req.body.question_ml) {
					let facilitySurveyQuestionData = await FacilitySurveyQuestion.findOne({
						where: {
							question_ml: req.body.question_ml,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking question Malayalam already exists or not',
								error: err
							})
						})
					if (facilitySurveyQuestionData && (facilitySurveyQuestionData.id !== facilitySurveyQuestionId)) {
						return res.send({
							success: 0,
							message: 'Question Malayalam already exists '
						})
					}
				}


				if (req.body.field_name) {
					let facilitySurveyQuestionData = await FacilitySurveyQuestion.findOne({
						where: {
							field_name: idData.dataValues.field_name,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking field name already exists or not',
								error: err
							})
						})
					if (facilitySurveyQuestionData && (facilitySurveyQuestionData.id !== facilitySurveyQuestionId)) {
						return res.send({
							success: 0,
							message: 'Field name already exists '
						})
					}
				}


				await FacilitySurveyQuestion.update(update, {
					where: {
						id: facilitySurveyQuestionId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating FacilitySurveyQuestion',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "FacilitySurveyQuestion updated successfully."
				});
			}


		},
		this.listFacilitySurveyQuestion = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			whereCondition.status = 1;
			if (params.name) {
				whereCondition.name_en = {
					[Op.like]: '%' + params.name + '%'
				};
				// whereCondition.name_ml = {
				//   [Op.like]: '%' + params.name + '%'
				// };
			}

			var facilitySurveyQuestionData = await FacilitySurveyQuestion.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				// where: {
				//   status: 1
				// },
				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching facilitySurveyQuestion data',
						error: err
					})
				});

			var count = await FacilitySurveyQuestion.count({
				where: whereCondition,

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching facilitySurveyQuestion count',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: facilitySurveyQuestionData,
				totalItems: count,
				hasNextPage,
				message: "Facility Survey Question Data listed successfully",
				success: 1,
			}
			return res.send(response);
		},


		this.getFacilitySurveyQuestion = async (req, res) => {
			let facilitySurveyQuestionId = req.params.id;
			let facilitySurveyQuestionData = await FacilitySurveyQuestion.findOne({
				where: {
					id: facilitySurveyQuestionId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting facilitySurveyQuestionData data',
						error: err
					})
				})
			let response = {
				district: facilitySurveyQuestionData,
				success: 1,
			}
			return res.send(response);
		},
		this.deleteFacilitySurveyQuestion = async (req, res) => {
			let facilitySurveyQuestionId = req.params.id;
			let facilitySurveyQuestionData = await FacilitySurveyQuestion.findOne({
				where: {
					id: facilitySurveyQuestionId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting facilitySurveyQuestion data',
						error: err
					})
				})
			if (facilitySurveyQuestionData) {
				let update = {
					status: 0
				}
				await FacilitySurveyQuestion.update(update, {
					where: {
						id: facilitySurveyQuestionId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting FacilitySurveyQuestion',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "FacilitySurveyQuestion deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "FacilitySurveyQuestion not exists."
				});
			}


		},

		this.createCategoryFacilitySurveyQuestion = async (req, res) => {
			let params = req.body;

			if (!params.category_id || !params.facility_survey_question_id
				|| !params.sort_order) {
				var errors = [];

				if (!params.category_id) {
					errors.push({
						field: "category_id",
						message: 'Require category id'

					});
				}

				if (!params.facility_survey_question_id) {
					errors.push({
						field: "facility_survey_question_id",
						message: 'Require facility survey question id'

					});
				}
				if (!params.sort_order) {
					errors.push({
						field: "sort_order",
						message: 'Require sort order'
					});
				}

				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};


			let categoryFacilitySurveyQuestionObj = {
				category_id: params.category_id,
				facility_survey_question_id: params.facility_survey_question_id,
				sort_order: params.sort_order,
				status: 1
			}
			let categoryCheck = await Category.findOne({
				where: {
					id: params.category_id,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking category',
						error: err
					})
				})
			if (!categoryCheck) {
				return res.send({
					success: 0,
					message: 'Invalid category id'
				})
			}

			let facilitySurveyQuestionCheck = await FacilitySurveyQuestion.findOne({
				where: {
					id: params.facility_survey_question_id,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking FacilitySurveyQuestion',
						error: err
					})
				})
			if (!facilitySurveyQuestionCheck) {
				return res.send({
					success: 0,
					message: 'Invalid facility survey question check'
				})
			}
			let categoryFacilitySurveyQuestionCheck = await CategoryFacilitySurveyQuestion.findOne({
				where: {
					category_id: params.category_id,
					facility_survey_question_id: params.facility_survey_question_id,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking CategoryFacilitySurveyQuestionCheck',
						error: err
					})
				})
			if (categoryFacilitySurveyQuestionCheck) {
				return res.send({
					success: 0,
					message: 'Already exists'
				})
			}

			try {
				let data = await CategoryFacilitySurveyQuestion.create(categoryFacilitySurveyQuestionObj);

				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "CategoryFacilitySurveyQuestion created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a CategoryFacilitySurveyQuestion'
				})
			}
		},
		this.updateCategoryFacilitySurveyQuestion = async (req, res) => {
			let categoryFacilitySurveyQuestionId = req.params.id;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!req.body.category_id && !req.body.facility_survey_question_id
				|| !req.body.sort_order) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (req.body.category_id) {
				update.category_id = req.body.category_id;
			}
			if (req.body.facility_survey_question_id) {
				update.facility_survey_question_id = req.body.facility_survey_question_id;
			}
			if (req.body.sort_order) {
				update.sort_order = req.body.sort_order;
			}
			let idData = await CategoryFacilitySurveyQuestion.findOne({
				where: {
					id: categoryFacilitySurveyQuestionId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking categoryFacilitySurveyQuestionId',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid categoryFacilitySurveyQuestionId '
				})
			} else {
				let whereCondition = {}
				if (req.body.category_id) {
					let categoryCheck = await Category.findOne({
						where: {
							id: req.body.category_id,
							status: 1
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking category',
								error: err
							})
						})
					if (!categoryCheck) {
						return res.send({
							success: 0,
							message: 'Invalid category id'
						})
					}
				}

				if (req.body.facility_survey_question_id) {
					let facilitySurveyQuestionCheck = await FacilitySurveyQuestion.findOne({
						where: {
							id: req.body.facility_survey_question_id,
							status: 1
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking FacilitySurveyQuestion',
								error: err
							})
						})
					if (!facilitySurveyQuestionCheck) {
						return res.send({
							success: 0,
							message: 'Invalid facility survey question check'
						})
					}
				}

				if (req.body.facility_survey_question_id && req.body.category_id) {
					let categoryFacilitySurveyQuestionData = await CategoryFacilitySurveyQuestion.findOne({
						where: {
							category_id: req.body.category_id,
							facility_survey_question_id: req.body.facility_survey_question_id,
							status: 1
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking CategoryFacilitySurveyQuestionCheck',
								error: err
							})
						})
					if (categoryFacilitySurveyQuestionData && (categoryFacilitySurveyQuestionData.id !== categoryFacilitySurveyQuestionId)) {
						return res.send({
							success: 0,
							message: 'Already exists'
						})
					}
				}

				await CategoryFacilitySurveyQuestion.update(update, {
					where: {
						id: categoryFacilitySurveyQuestionId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while CategoryFacilitySurveyQuestion',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "CategoryFacilitySurveyQuestion updated successfully."
				});
			}


		},
		this.listCategoryFacilitySurveyQuestion = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			whereCondition.status = 1;
			if (params.name) {
				whereCondition.name_en = {
					[Op.like]: '%' + params.name + '%'
				};
				// whereCondition.name_ml = {
				//   [Op.like]: '%' + params.name + '%'
				// };
			}

			var categoryFacilitySurveyQuestions = await CategoryFacilitySurveyQuestion.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				// where: {
				//   status: 1
				// },
				include: [{
					model: Category
				}, {
					model: FacilitySurveyQuestion
				}],
				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching categoryFacilitySurveyQuestion data',
						error: err
					})
				});

			var count = await CategoryFacilitySurveyQuestion.count({
				where: whereCondition,

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching categoryFacilitySurveyQuestions count data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: categoryFacilitySurveyQuestions,
				totalItems: count,
				hasNextPage,
				message: "CategoryFacilitySurveyQuestion listed successfully",
				success: 1,
			}
			return res.send(response);
		},


		this.getCategoryFacilitySurveyQuestion = async (req, res) => {
			let categoryFacilitySurveyQuestionId = req.params.id;
			let categoryFacilitySurveyQuestionData = await CategoryFacilitySurveyQuestion.findOne({
				where: {
					id: categoryFacilitySurveyQuestionId,
					status: 1
				},
				include: [{
					model: Category
				}, {
					model: FacilitySurveyQuestion
				}]
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting categoryFacilitySurveyQuestion',
						error: err
					})
				})
			let response = {
				categoryFacilitySurveyQuestion: categoryFacilitySurveyQuestionData,
				success: 1,
			}
			return res.send(response);
		},
		this.deleteCategoryFacilitySurveyQuestion = async (req, res) => {
			let categoryFacilitySurveyQuestionId = req.params.id;
			let categoryFacilitySurveyQuestionData = await CategoryFacilitySurveyQuestion.findOne({
				where: {
					id: categoryFacilitySurveyQuestionId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting category facility survey question data',
						error: err
					})
				})
			if (categoryFacilitySurveyQuestionData) {
				let update = {
					status: 0,
					modified_at: new Date()
				}
				await CategoryFacilitySurveyQuestion.update(update, {
					where: {
						id: categoryFacilitySurveyQuestionData.id

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating CategoryFacilitySurveyQuestion',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "CategoryFacilitySurveyQuestion deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "CategoryFacilitySurveyQuestion not exists."
				});
			}


		},

		this.updateFacilitySurvey = async (req, res) => {
			let facilitySurveyId = req.params.id;
			let update = req.body;

			update.modified_at = new Date();
			update.status = 1;

			// if (!req.body.name_ml && !req.body.name_en) {
			// 	return res.send({
			// 		success: 0,
			// 		message: 'Nothing to update'
			// 	})
			// }
			// if (req.body.name_ml) {
			// 	update.name_ml = req.body.name_ml.trim();
			// }
			// if (req.body.name_en) {
			// 	update.name_en = req.body.name_en.trim();
			// }
			let idData = await FacilitySurvey.findOne({
				where: {
					id: facilitySurveyId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking facility survey id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid facility survey '
				})
			} else {

				// 	let districtData = await District.findOne({
				// 			where: {
				// 				name_en: req.body.name_en,
				// 				status: 1,
				// 			}
				// 		})
				// 		.catch(err => {
				// 			return res.send({
				// 				success: 0,
				// 				message: 'Something went wrong while checking English district name already exists or not',
				// 				error: err
				// 			})
				// 		})
				// 	if (districtData && (districtData.id !== districtId)) {
				// 		return res.send({
				// 			success: 0,
				// 			message: 'District English name already exists '
				// 		})
				// 	}
				// }

				// if (req.body.name_ml) {
				// 	let districtData = await District.findOne({
				// 			where: {
				// 				name_ml: req.body.name_ml,
				// 				status: 1,
				// 			}
				// 		})
				// 		.catch(err => {
				// 			return res.send({
				// 				success: 0,
				// 				message: 'Something went wrong while checking malayalam district name already exists or not',
				// 				error: err
				// 			})
				// 		})
				// 	if (districtData && (districtData.id !== districtId)) {
				// 		return res.send({
				// 			success: 0,
				// 			message: 'District Malayalam name already exists '
				// 		})
				// 	}
				// }

				await FacilitySurvey.update(update, {
					where: {
						id: facilitySurveyId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating facility survey',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Facility survey updated successfully."
				});
			}


		},
		this.listFacilitySurvey = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			whereCondition.status = 1;
			if (params.name) {
				whereCondition.name_en = {
					[Op.like]: '%' + params.name + '%'
				};
				// whereCondition.name_ml = {
				//   [Op.like]: '%' + params.name + '%'
				// };
			}

			var facilitySurveyData = await FacilitySurvey.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				// where: {
				//   status: 1
				// },
				include: [{
					model: Lsgi
				}, {
					model: CategoryRelationship
				}
				],
				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching facility survey data',
						error: err
					})
				});

			var count = await FacilitySurvey.count({
				where: whereCondition,

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching facility survey count data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: facilitySurveyData,
				totalItems: count,
				hasNextPage,
				message: "Facility survey listed successfully",
				success: 1,
			}
			return res.send(response);
		},


		this.getFacilitySurvey = async (req, res) => {
			let facilitySurveyId = req.params.id;
			let facilitySurveyData = await FacilitySurvey.findOne({
				where: {
					id: facilitySurveyId,
					status: 1
				},
				include: [{
					model: Lsgi
				}, {
					model: CategoryRelationship
				}
				]

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting facility data',
						error: err
					})
				})
			let response = {
				district: facilitySurveyData,
				success: 1,
			}
			return res.send(response);
		},
		this.deleteFacilitySurvey = async (req, res) => {
			let facilitySurveyId = req.params.id;
			let facilitySurveyData = await FacilitySurvey.findOne({
				where: {
					id: facilitySurveyId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting facility survey data',
						error: err
					})
				})
			if (facilitySurveyData) {
				let update = {
					status: 0
				}
				await FacilitySurvey.update(update, {
					where: {
						id: facilitySurveyId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting facility survey',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Facility survey deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "Facility survey not exists."
				});
			}


		},

		this.createImage = async (req, res) => {
			let params = req.body;

			if (!params.name) {
				var errors = [];

				if (!params.name) {
					errors.push({
						field: "name",
						message: 'Require name'

					});
				}

				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};


			let imageObj = {
				name: params.name,
				status: 1
			}
			let nameCheck = await Image.findOne({
				where: {
					name: params.name,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking image exists or not',
						error: err
					})
				})
			if (nameCheck) {
				return res.send({
					success: 0,
					message: 'Image name already exists..'
				})
			}


			try {
				let data = await Image.create(imageObj);

				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "Image created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a Image'
				})
			}
		},
		this.updateImage = async (req, res) => {
			let imageId = req.params.id;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!req.body.name) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (req.body.name) {
				update.name = req.body.name.trim();
			}

			let idData = await Image.findOne({
				where: {
					id: imageId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking image id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid image'
				})
			} else {
				if (req.body.name) {
					let imageData = await Image.findOne({
						where: {
							name: req.body.name,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking name already exists or not',
								error: err
							})
						})
					if (imageData && (imageData.id !== imageId)) {
						return res.send({
							success: 0,
							message: 'Image already exists '
						})
					}
				}

				await Image.update(update, {
					where: {
						id: imageId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating name',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Image name updated successfully."
				});
			}


		},
		this.listImage = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			whereCondition.status = 1;
			if (params.name) {
				whereCondition.name_en = {
					[Op.like]: '%' + params.name + '%'
				};
				// whereCondition.name_ml = {
				//   [Op.like]: '%' + params.name + '%'
				// };
			}

			var images = await Image.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				// where: {
				//   status: 1
				// },
				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching images data',
						error: err
					})
				});

			var count = await Image.count({
				where: whereCondition,

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching image count data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				imageBase: profileConfig.imageBase,
				items: images,
				totalItems: count,
				hasNextPage,
				message: "Images listed successfully",
				success: 1,
			}
			return res.send(response);
		},


		this.getImage = async (req, res) => {
			let imageId = req.params.id;
			let imageData = await Image.findOne({
				where: {
					id: imageId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting image data',
						error: err
					})
				})
			let response = {
				imageBase: profileConfig.imageBase,
				image: imageData,
				success: 1,
			}
			return res.send(response);
		},
		this.deleteImage = async (req, res) => {
			let imageId = req.params.id;
			let imageData = await Image.findOne({
				where: {
					id: imageId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting image data',
						error: err
					})
				})
			if (imageData) {
				let update = {
					status: 0
				}
				await Image.update(update, {
					where: {
						id: imageData.id

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting name',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Image deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "Image not exists."
				});
			}


		},




		this.createFacilitySurveyImage = async (req, res) => {
			let params = req.body;

			if (!params.facility_survey_id || !params.image_id) {
				var errors = [];

				if (!params.facility_survey_id) {
					errors.push({
						field: "name_ml",
						message: 'Require facility survey id'

					});
				}
				if (!params.image_id) {
					errors.push({
						field: "name_en",
						message: 'Require image id'
					});
				}

				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};

			let facilitySurveyData = await FacilitySurvey.findOne({
				where: {
					id: params.facility_survey_id,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting facility survey data',
						error: err
					})
				})
			if (!facilitySurveyData) {
				return res.send({
					success: 0,
					message: 'Facility survey id invalid',
				})
			}
			let facilitySurveyImageObj = req.body;
			facilitySurveyImageObj.status = 1


			try {
				let data = await FacilitySurveyImage.create(facilitySurveyImageObj);

				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "Facility survey image created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a Facility survey image'
				})
			}
		},
		this.updateDistrict = async (req, res) => {
			let districtId = req.params.id;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!req.body.name_ml && !req.body.name_en) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (req.body.name_ml) {
				update.name_ml = req.body.name_ml.trim();
			}
			if (req.body.name_en) {
				update.name_en = req.body.name_en.trim();
			}
			let idData = await District.findOne({
				where: {
					id: districtId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking district id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid district '
				})
			} else {
				if (req.body.name_en) {
					let districtData = await District.findOne({
						where: {
							name_en: req.body.name_en,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking English district name already exists or not',
								error: err
							})
						})
					if (districtData && (districtData.id !== districtId)) {
						return res.send({
							success: 0,
							message: 'District English name already exists '
						})
					}
				}

				if (req.body.name_ml) {
					let districtData = await District.findOne({
						where: {
							name_ml: req.body.name_ml,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking malayalam district name already exists or not',
								error: err
							})
						})
					if (districtData && (districtData.id !== districtId)) {
						return res.send({
							success: 0,
							message: 'District Malayalam name already exists '
						})
					}
				}

				await District.update(update, {
					where: {
						id: districtId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating district name',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "District name updated successfully."
				});
			}


		},
		this.listFacilitySurveyImage = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			whereCondition.status = 1;
			if (params.facility_survey_id) {
				whereCondition.facility_survey_id = params.facility_survey_id;
				// whereCondition.name_ml = {
				//   [Op.like]: '%' + params.name + '%'
				// };
			} else {
				return res.send({
					success: 0,
					message: 'Required Facility survey id ',
				})
			}

			var facilitySurveyImageData = await FacilitySurveyImage.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				include: [{
					model: Image
				}],
				// where: {
				//   status: 1
				// },
				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching facility survey images',
						error: err
					})
				});

			var count = await FacilitySurveyImage.count({
				where: whereCondition,

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching facility survey image count data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: facilitySurveyImageData,
				totalItems: count,
				hasNextPage,
				message: "FacilitySurveyImage listed successfully",
				success: 1,
			}
			return res.send(response);
		},


		this.getFacilitySurveyImage = async (req, res) => {
			let facilitySurveyImageId = req.params.id;
			let facilitySurveyImageData = await FacilitySurveyImage.findOne({
				where: {
					id: facilitySurveyImageId,
					status: 1
				},
				include: [{
					model: Image
				}]
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting facility survey iamge data',
						error: err
					})
				})
			let response = {
				district: facilitySurveyImageData,
				success: 1,
			}
			return res.send(response);
		},
		this.deleteFacilitySurveyImage = async (req, res) => {
			let facilitySurveyImageId = req.params.id;
			let facilitySurveyImageData = await FacilitySurveyImage.findOne({
				where: {
					id: facilitySurveyImageId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting facility survey image data',
						error: err
					})
				})
			if (facilitySurveyImageData) {
				let update = {
					status: 0
				}
				await FacilitySurveyImage.update(update, {
					where: {
						id: facilitySurveyImageId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting facility survey image',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Facility survey image deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "Facility survey image not exists."
				});
			}


		},





		this.createMainSurveyMasterQuestion = async (req, res) => {
			let params = req.body;

			if (!params.question_en || !params.question_ml
				|| !params.field_name || !params.type) {
				var errors = [];

				if (!params.question_en) {
					errors.push({
						field: "question_en",
						message: 'Require question in English'

					});
				}
				if (!params.question_ml) {
					errors.push({
						field: "question_ml",
						message: 'Require question Malayalam'

					});
				}
				if (!params.field_name) {
					errors.push({
						field: "field_name",
						message: 'Require field name'
					});
				}
				if (!params.type) {
					errors.push({
						field: "type",
						message: 'Require type'
					});
				}
				if (!params.sort_order) {
					errors.push({
						field: "type",
						message: 'Require type'
					});
				}

				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};


			let mainSurveyMasterQuestionObj = {
				question_en: params.question_en.trim(),
				question_ml: params.question_ml.trim(),
				field_name: params.field_name.trim(),
				type: params.type.trim(),
				sort_order: params.sort_order,
				status: 1
			}
			let mainSurveyMasterQuestionCheck = await MainSurveyMasterQuestion.findOne({
				where: {
					question_en: params.question_en.trim(),
					question_ml: params.question_ml.trim(),
					field_name: params.field_name.trim(),
					type: params.type.trim(),
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking question exists or not',
						error: err
					})
				})
			if (mainSurveyMasterQuestionCheck) {
				return res.send({
					success: 0,
					message: 'Question already exists..'
				})
			}

			// let nameEnCheck = await District.findOne({
			// 		where: {
			// 			name_en: params.name_en,
			// 			status: 1
			// 		}
			// 	})
			// 	.catch(err => {
			// 		return res.send({
			// 			success: 0,
			// 			message: 'Something went wrong while checking english district name exists or not',
			// 			error: err
			// 		})
			// 	})
			// if (nameEnCheck) {
			// 	return res.send({
			// 		success: 0,
			// 		message: 'District english name already exists..'
			// 	})
			// }
			try {
				let data = await MainSurveyMasterQuestion.create(mainSurveyMasterQuestionObj);

				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "MainSurveyMasterQuestion created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a MainSurveyMasterQuestion'
				})
			}
		},
		this.updateMainSurveyMasterQuestion = async (req, res) => {
			let mainSurveyMasterQuestionId = req.params.id;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!req.body.question_en && !req.body.question_ml
				&& !req.body.field_name && !req.body.type
				&& !req.body.sort_order) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (req.body.question_en) {
				update.question_en = req.body.question_en.trim();
			}
			if (req.body.question_ml) {
				update.question_ml = req.body.question_ml.trim();
			}
			if (req.body.field_name) {
				update.field_name = req.body.field_name.trim();
			}
			if (req.body.type) {
				update.type = req.body.type.trim();
			}
			if (req.body.sort_order) {
				update.sort_order = req.body.sort_order;
			}
			let idData = await MainSurveyMasterQuestion.findOne({
				where: {
					id: mainSurveyMasterQuestionId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking mainSurveyMasterQuestionId exists or not',
						error: err
					})
				})

			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid mainSurveyMasterQuestionId '
				})
			} else {

				if (req.body.question_en) {
					let mainSurveyMasterQuestionData = await MainSurveyMasterQuestion.findOne({
						where: {
							question_en: req.body.question_en.trim(),
							// field_name : idData.dataValues.field_name,
							// type : idData.dataValues.type,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking question in English already exists or not',
								error: err
							})
						})
					if (mainSurveyMasterQuestionData && (mainSurveyMasterQuestionData.id !== mainSurveyMasterQuestionId)) {
						return res.send({
							success: 0,
							message: 'Question in English already exists '
						})
					}
				}

				if (req.body.question_ml) {
					let mainSurveyMasterQuestionData = await MainSurveyMasterQuestion.findOne({
						where: {
							question_ml: req.body.question_ml.trim(),
							// field_name : idData.dataValues.field_name,
							// type : idData.dataValues.type,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking question in malayalam already exists or not',
								error: err
							})
						})
					if (mainSurveyMasterQuestionData && (mainSurveyMasterQuestionData.id !== mainSurveyMasterQuestionId)) {
						return res.send({
							success: 0,
							message: 'Question in Malayalam already exists '
						})
					}
				}

				if (req.body.field_name) {
					let mainSurveyMasterQuestionData = await MainSurveyMasterQuestion.findOne({
						where: {
							field_name: req.body.field_name.trim(),
							// field_name : idData.dataValues.field_name,
							// type : idData.dataValues.type,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking field name already exists or not',
								error: err
							})
						})
					if (mainSurveyMasterQuestionData && (mainSurveyMasterQuestionData.id !== mainSurveyMasterQuestionId)) {
						return res.send({
							success: 0,
							message: 'Field name is already exists '
						})
					}
				}

				// if (req.body.name_ml) {
				// 	let districtData = await District.findOne({
				// 			where: {
				// 				name_ml: req.body.name_ml,
				// 				status: 1,
				// 			}
				// 		})
				// 		.catch(err => {
				// 			return res.send({
				// 				success: 0,
				// 				message: 'Something went wrong while checking malayalam district name already exists or not',
				// 				error: err
				// 			})
				// 		})
				// 	if (districtData && (districtData.id !== districtId)) {
				// 		return res.send({
				// 			success: 0,
				// 			message: 'District Malayalam name already exists '
				// 		})
				// 	}
				// }

				await MainSurveyMasterQuestion.update(update, {
					where: {
						id: mainSurveyMasterQuestionId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating MainSurveyMasterQuestion',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "MainSurveyMasterQuestion updated successfully."
				});
			}


		},
		this.listMainSurveyMasterQuestion = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			whereCondition.status = 1;
			if (params.name) {
				whereCondition.name_en = {
					[Op.like]: '%' + params.name + '%'
				};
				// whereCondition.name_ml = {
				//   [Op.like]: '%' + params.name + '%'
				// };
			}

			var mainSurveyMasterQuestionData = await MainSurveyMasterQuestion.findAll({
				// raw: true,
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				// where: {
				//   status: 1
				// },
				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching mainSurveyMasterQuestion data',
						error: err
					})
				});

			var count = await MainSurveyMasterQuestion.count({
				where: whereCondition,

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching MainSurveyMasterQuestion count',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: mainSurveyMasterQuestionData,
				totalItems: count,
				hasNextPage,
				message: "Main Survey Master Question Data listed successfully",
				success: 1,
			}
			return res.send(response);
		},


		this.getMainSurveyMasterQuestion = async (req, res) => {
			let mainSurveyMasterQuestionId = req.params.id;
			let mainSurveyMasterQuestionObj = await MainSurveyMasterQuestion.findOne({
				where: {
					id: mainSurveyMasterQuestionId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting mainSurveyMasterQuestion data',
						error: err
					})
				})
			let response = {
				mainSurveyMasterQuestion: mainSurveyMasterQuestionObj,
				success: 1,
			}
			return res.send(response);
		},
		this.deleteMainSurveyMasterQuestion = async (req, res) => {
			let mainSurveyMasterQuestionId = req.params.id;
			let mainSurveyMasterQuestionObj = await MainSurveyMasterQuestion.findOne({
				where: {
					id: mainSurveyMasterQuestionId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting facilitySurveyQuestion data',
						error: err
					})
				})
			if (mainSurveyMasterQuestionObj) {
				let update = {
					status: 0
				}
				await MainSurveyMasterQuestion.update(update, {
					where: {
						id: mainSurveyMasterQuestionId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting MainSurveyMasterQuestion',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "MainSurveyMasterQuestion deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "MainSurveyMasterQuestion not exists."
				});
			}


		},


		this.listMainSurveyFieldName = async (req, res) => {
			// let params = req.query;
			// let page = params.page || 1;
			// let perPage = Number(params.perPage) || 10;
			// perPage = perPage > 0 ? perPage : 10;
			// var offset = (page - 1) * perPage;
			let whereCondition = {};
			whereCondition.status = 1;
			whereCondition.type = constants.MAIN_SURVEY_TYPE;
			// if (params.name) {
			// 	whereCondition.name_en = {
			// 		[Op.like]: '%' + params.name + '%'
			// 	};
			// 	// whereCondition.name_ml = {
			// 	//   [Op.like]: '%' + params.name + '%'
			// 	// };
			// }
            
			var fieldNameData = await FieldName.findAll({
				// raw: true,
				// order: [
				// 	['modified_at', 'DESC']
				// ],
				// offset: offset,
				where: whereCondition,
				// where: {
				//   status: 1
				// },
				// limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching fieldname data',
						error: err
					})
				});

			// var count = await MainSurveyMasterQuestion.count({
			// 		where: whereCondition,

			// 	})
			// 	.catch(err => {
			// 		return res.send({
			// 			success: 0,
			// 			message: 'Something went wrong while fetching MainSurveyMasterQuestion count',
			// 			error: err
			// 		})
			// 	});

			// totalPages = count / perPage;
			// totalPages = Math.ceil(totalPages);
			// var hasNextPage = page < totalPages;
			// let fieldNames = [];
			// for (let i = 0; i < mainSurveyMasterQuestionData.length; i++) {
			// 	fieldNames.push(mainSurveyMasterQuestionData[i].field_name);
			// }
			let response = {
				items: fieldNameData,
				// totalItems: count,
				// hasNextPage,
				message: "Main Survey Master Question Data listed successfully",
				success: 1,
			}
			return res.send(response);
		},


		this.listFacilitySurveyFieldName = async (req, res) => {
			// let params = req.query;
			// let page = params.page || 1;
			// let perPage = Number(params.perPage) || 10;
			// perPage = perPage > 0 ? perPage : 10;
			// var offset = (page - 1) * perPage;
			let whereCondition = {};
			whereCondition.status = 1;
			whereCondition.type = constants.FACILITY_SURVEY_TYPE;
			// if (params.name) {
			// 	whereCondition.name_en = {
			// 		[Op.like]: '%' + params.name + '%'
			// 	};
			// 	// whereCondition.name_ml = {
			// 	//   [Op.like]: '%' + params.name + '%'
			// 	// };
			// }

			var fieldNameData = await FieldName.findAll({
				// raw: true,
				// order: [
				// 	['modified_at', 'DESC']
				// ],
				// offset: offset,
				where: whereCondition,
				// where: {
				//   status: 1
				// },
				// limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching field name data',
						error: err
					})
				});

			// var count = await MainSurveyMasterQuestion.count({
			// 		where: whereCondition,

			// 	})
			// 	.catch(err => {
			// 		return res.send({
			// 			success: 0,
			// 			message: 'Something went wrong while fetching MainSurveyMasterQuestion count',
			// 			error: err
			// 		})
			// 	});

			// totalPages = count / perPage;
			// totalPages = Math.ceil(totalPages);
			// var hasNextPage = page < totalPages;
		
			let response = {
				items: fieldNameData,
				// totalItems: count,
				// hasNextPage,
				message: "Field name listed successfully",
				success: 1,
			}
			return res.send(response);
		},

		this.updateVersion = async (req, res) => {
			let newVersion = 1;
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

			if (versionData) {
				let version = versionData.version;
				newVersion = version + 1;
			}
			let newVersionData = {
				version: newVersion,
				status: 1
			}
			versionData = await Version.create(newVersionData)
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while updating version',
						error: err
					})
				});

			let response = {
				id: versionData.dataValues.id,
				// totalItems: count,
				// hasNextPage,
				message: "Version updated successfully",
				success: 1,
			}
			return res.send(response);
		},


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
		},






		this.createAuthController = async (req, res) => {
			let params = req.body;

			if (!params.name) {
				var errors = [];

				if (!params.name) {
					errors.push({
						field: "name",
						message: 'Require name'

					});
				}

				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};


			let authControllerObj = {
				name: params.name.trim(),
				status: 1
			}
			let nameCheck = await AuthController.findOne({
				where: {
					name: params.name.trim(),
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking auth controller name exists or not',
						error: err
					})
				})
			if (nameCheck) {
				return res.send({
					success: 0,
					message: 'AuthController name already exists..'
				})
			}


			try {
				let data = await AuthController.create(authControllerObj);

				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "AuthController created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a AuthController'
				})
			}
		},
		this.updateAuthController = async (req, res) => {
			let authControllerId = req.params.id;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!req.body.name) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (req.body.name) {
				update.name = req.body.name.trim();
			}

			let idData = await AuthController.findOne({
				where: {
					id: authControllerId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking authcontroller id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid Authcontroller Id'
				})
			} else {
				if (req.body.name) {
					let authControllerData = await AuthController.findOne({
						where: {
							name: req.body.name.trim(),
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking Authcontroller name already exists or not',
								error: err
							})
						})
					if (authControllerData && (authControllerData.id !== authControllerId)) {
						return res.send({
							success: 0,
							message: 'AuthControllerData name already exists '
						})
					}
				}



				await AuthController.update(update, {
					where: {
						id: authControllerId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating authcontroller name',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Authcontroller name updated successfully."
				});
			}


		},
		this.listAuthController = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			if (params.name) {
				whereCondition.name = {
					[Op.like]: '%' + params.name + '%',
				};

			}
			whereCondition.status = 1;

			var authControllers = await AuthController.findAll({
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,

				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching authController data',
						error: err
					})
				});

			var count = await AuthController.count({
				where: whereCondition,

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching auth controller count data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: authControllers,
				totalItems: count,
				hasNextPage,
				message: "AuthController listed successfully",
				success: 1,
			}
			return res.send(response);
		},


		this.getAuthController = async (req, res) => {
			let authControllerId = req.params.id;
			let authControllerData = await AuthController.findOne({
				where: {
					id: authControllerId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting authcontroller data',
						error: err
					})
				})
			let response = {
				authController: authControllerData,
				success: 1,
			}
			return res.send(response);
		},
		this.deleteAuthController = async (req, res) => {
			let authControllerId = req.params.id;
			let authControllerData = await AuthController.findOne({
				where: {
					id: authControllerId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting authcontroller data',
						error: err
					})
				})
			if (authControllerData) {
				let update = {
					status: 0
				}
				await AuthController.update(update, {
					where: {
						id: authControllerId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting authcotroller',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Authcontroller deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "Authcontroller not exists."
				});
			}


		},


		this.listMainSurvey = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			if (params.name) {
				let name_en = {
					[Op.like]: '%' + params.name + '%',
				};
				let name_ml = {
					[Op.like]: '%' + params.name + '%'
				};
				whereCondition = Sequelize.or({ name_en }, { name_ml })
			}
			whereCondition.status = 1;

			var surveyData = await Survey.findAll({
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,

				limit: perPage,
			})
			// .catch(err => {
			// 	return res.send({
			// 		success: 0,
			// 		message: 'Something went wrong while fetching Survey data',
			// 		error: err
			// 	})
			// });

			var count = await Survey.count({
				where: whereCondition,

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching survey count data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: surveyData,
				totalItems: count,
				hasNextPage,
				message: "Surveys listed successfully",
				success: 1,
			}
			return res.send(response);
		}


	this.getMainSurvey = async (req, res) => {
		let surveyId = req.params.id;
		let surveyData = await Survey.findOne({
			where: {
				id: surveyId,
				status: 1
			},
			include: [{
				model: SurveyAnswer,
				include: [{
					model: Question
				}]
			}]
		})
			.catch(err => {
				return res.send({
					success: 0,
					message: 'Something went wrong while getting survey data',
					error: err
				})
			})
		let response = {
			survey: surveyData,
			success: 1,
		}
		return res.send(response);
	},

		this.deleteMainSurvey = async (req, res) => {
			let surveyId = req.params.id;
			let surveyData = await Survey.findOne({
				where: {
					id: surveyId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting survey data',
						error: err
					})
				})
			if (surveyData) {
				let update = {
					status: 0
				}
				await Survey.update(update, {
					where: {
						id: surveyData.id

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting survey',
							error: err
						})
					})
				await SurveyAnswer.update(update, {
					where: {
						survey_id: surveyData.id

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting survey',
							error: err
						})
					})

				res.status(200).send({
					success: 1,
					message: "Survey deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "Survey not exists."
				});
			}


		},

		this.updateMainSurvey = async (req, res) => {
			const Op = require('sequelize').Op;
			var errors = [];
			let surveyArray = [];
			let item = req.body;
			let userData = req.identity;
			let surveyorAccountId = userData.data.id;
			let reqParam = req.params;
			let surveyObj = {};
			let officePlaceName = "";
			let officePostOfficeName = "";
			let officePinCode = "";
			console.log("item")
			console.log(item)
			console.log("item")
			surveyObj.id = reqParam.id;

			surveyObj.district_id = item.district_id;
			surveyObj.lsgi_type_id = item.lsgi_type_id;
			surveyObj.lat = item.lat;
			surveyObj.lng = item.lng;
			if (item.lsgi_block_id) {
				surveyObj.lsgi_block_id = item.lsgi_block_id;
			}
			surveyObj.lsgi_id = item.lsgi_id;
			surveyObj.office_name = item.office_name;
			surveyObj.office_type_id = item.office_type_id;

			surveyObj.phone = item.phone;
			surveyObj.email = item.email;
			surveyObj.lead_person_name = item.lead_person_name;
			surveyObj.lead_person_designation = item.lead_person_designation;
			surveyObj.informer_name = item.informer_name;
			surveyObj.informer_designation = item.informer_designation;
			surveyObj.informer_phone = item.informer_phone;
			officePlaceName = item.office_place_name;
			officePostOfficeName = item.office_post_office_name;
			officePinCode = item.office_pin_ode;
			// surveyObj.address = officePlaceName + "," + officePostOfficeName + "," + officePinCode;
			surveyObj.answers = item.answers
			surveyObj.survey_date = item.survey_date;
			surveyObj.surveyor_account_id = surveyorAccountId
			surveyObj.status = 1
			//   surveyArray.push(surveyObj);
			let whereCondition = {
				id: surveyObj.id,
				status: 1
			}
			// try{
			let surveyData = await Survey.findAll({
				where: whereCondition
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching survey data',
						error: err
					})
				});
			// if (surveyData.length > 0) {


			let points = 0;
			let surveyId = surveyObj.id;
			answersArray = surveyObj.answers;
			surveyObj.id = surveyId;
			await Promise.all(answersArray.map(async (item1) => {
				let obj = {};
				let mark = [];
				obj.survey_id = surveyId;
				obj.question_id = item1.id;

				if (item1.answer) {
					obj.answer = item1.answer;
				}

				if (item1.type.toString() === constants.ANSWER_TYPE_OPTION) {

					let optionObj = await item1.options.find(o => o.is_selected === constants.IS_SELECTED_TRUE);
					obj.question_option_id = optionObj.id;
					obj.answer = optionObj.value;

					mark = await QuestionOption.findAll({
						raw: true,
						limit: 1,
						attributes: ['id', 'question_id', 'point'],

						where: {
							question_id: obj.question_id,
							id: obj.question_option_id,
							name: obj.answer,
							status: 1
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while fetching questions data',
								error: err
							})
						})
					if (mark.length > 0) {
						obj.point = parseInt(mark[0].points);
						points = points + mark[0].points;
					}
				} else if (item1.type.toString() === constants.ANSWER_TYPE_ADDRESS) {
					obj.point = 0;
					obj.question_option_id = null;
				} else if (item1.type.toString() === constants.ANSWER_TYPE_DIGIT) {

					let percentageQuestion = await Question.findAll({
						raw: true,
						where: {
							id: obj.question_id,
							is_dependent: 1,
							is_percentage_calculation: 1,
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while fetching Question data',
								error: err
							})
						});
					if (percentageQuestion.length > 0) {

						let dependedObj = await answersArray.find(o => o.id === percentageQuestion[0].dependent_question_id);

						let totalCount = dependedObj.answer;
						let count = item1.answer;
						let percentage = (count / totalCount) * 100;

						let gradeObj = await percentageConfiguarationSlab.findAll({
							where: {
								start_value: {
									[Op.lte]: percentage
								},
								end_value: {
									[Op.gte]: percentage
								},
							}
						})
							.catch(err => {
								return res.send({
									success: 0,
									message: 'Something went wrong while fetching PercentageConfiguaration data',
									error: err
								})
							});

						obj.point = parseInt(gradeObj[0].point);
						points = points + obj.point;

					} else {
						obj.point = 0;
					}

				} else if (item1.type.toString() === constants.ANSWER_TYPE_TEXT) {
					obj.point = 0;
					obj.question_option_id = null;

				}
				obj.status = 1;

				let answer = await SurveyAnswer.findAll({
					raw: true,
					where: {
						survey_id: surveyObj.id,
						question_id: item1.id
					}

				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while fetching SurveyAnswer data',
							error: err
						})
					});

				let answerUpdate = await SurveyAnswer.update(obj, {
					where: {
						id: answer[0].id
					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating SurveyAnswer data',
							error: err
						})
					});
			}));

			surveyObj.points = points;

			let surveyUpdate = await Survey.update(surveyObj, {
				where: {
					id: surveyId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while updating survey data',
						error: err
					})
				});


			res.status(200).send({
				success: 1,
				message: "Survey Updated successfully",
			});


		},


		this.createAuthPermission = async (req, res) => {
			let params = req.body;

			if (!params.permission || !params.auth_controller_id) {
				var errors = [];

				if (!params.permission) {
					errors.push({
						field: "permission",
						message: 'Require permission name'

					});
				}
				if (!params.auth_controller_id) {
					errors.push({
						field: "auth_controller_id",
						message: 'Require auth controller id'
					});
				}

				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};


			let authPermissionObj = {
				permission: params.permission.trim(),
				auth_controller_id: params.auth_controller_id,
				status: 1
			}
			let authControllerCheck = await AuthController.findOne({
				where: {
					id: params.auth_controller_id,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking auth cotroller id exists or not',
						error: err
					})
				})

			if (!authControllerCheck) {
				return res.send({
					success: 0,
					message: 'Invalid auth controller id..'
				})
			}

			let permissionCheck = await AuthPermission.findOne({
				where: {
					auth_controller_id: params.auth_controller_id,
					permission: params.permission,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking malayalam permission name already exists or not',
						error: err
					})
				})
			if (permissionCheck) {
				return res.send({
					success: 0,
					message: 'Permission name already exists in controller..'
				})
			}


			try {
				let data = await AuthPermission.create(authPermissionObj);

				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "Auth permission created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a Auth permission'
				})
			}
		},
		this.updateAuthPermission = async (req, res) => {
			let permissionId = req.params.id;
			let update = {};
			let whereCondition = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!req.body.permission && !req.body.auth_controller_id) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}

			let idData = await AuthPermission.findOne({
				where: {
					id: permissionId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking auth permission id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid auth permission '
				})
			} else {
				let whereCondition = {};
				if (req.body.permission) {
					update.permission = req.body.permission.trim();
					whereCondition.permission = req.body.permission.trim();
				} else {
					whereCondition.permission = idData.permission.trim();
				}
				if (req.body.auth_controller_id) {
					let controllerData = await AuthController.findOne({
						where: {
							id: req.body.auth_controller_id,
							status: 1
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking auth controller exists or not',
								error: err
							})
						})
					if (!controllerData) {
						return res.send({
							success: 0,
							message: 'Invalid auth controller id'
						})
					} else {
						update.auth_controller_id = req.body.auth_controller_id;
						whereCondition.auth_controller_id = req.body.auth_controller_id;
					}


				} else {
					whereCondition.auth_controller_id = idData.auth_controller_id;
				}
				whereCondition.status = 1;
				if (req.body.permission) {
					let permissionData = await AuthPermission.findOne({
						where: whereCondition
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking permission already exists or not',
								error: err
							})
						})
					if (permissionData && (permissionData.id !== permissionId)) {
						return res.send({
							success: 0,
							message: 'Permission already exists '
						})
					}
				}


				await AuthPermission.update(update, {
					where: {
						id: permissionId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating permission',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Permission updated successfully."
				});
			}


		},
		this.listAuthPermission = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			// if (params.auth_controller_id) {
			// 	let name_en = {
			// 		[Op.like]: '%' + params.name + '%',
			// 	};
			// 	let name_ml = {
			// 	  [Op.like]: '%' + params.name + '%'
			// 	};
			// 	whereCondition = Sequelize.or({name_en},{name_ml})
			// }
			whereCondition.status = 1;

			var authPermissionData = await AuthPermission.findAll({
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				include: [{
					model: AuthController
				}],

				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching auth permission data',
						error: err
					})
				});

			var count = await AuthController.count({
				where: whereCondition,

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching auth permission count data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: authPermissionData,
				totalItems: count,
				hasNextPage,
				message: "Auth Permission listed successfully",
				success: 1,
			}
			return res.send(response);
		},


		this.getAuthPermission = async (req, res) => {
			let authPermissionId = req.params.id;
			let authPermissionData = await AuthPermission.findOne({
				where: {
					id: authPermissionId,
					status: 1
				},
				include: [{
					model: AuthController
				}],
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting auth permission data',
						error: err
					})
				})
			let response = {
				district: authPermissionData,
				success: 1,
			}
			return res.send(response);
		},
		this.deleteAuthPermission = async (req, res) => {
			let authPermissionId = req.params.id;
			let authPermissionData = await AuthPermission.findOne({
				where: {
					id: authPermissionId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting auth permission data',
						error: err
					})
				})
			if (authPermissionData) {
				let update = {
					status: 0
				}
				await AuthPermission.update(update, {
					where: {
						id: authPermissionId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting auth permission',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "Auth permission deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "Auth permission not exists."
				});
			}


		},


		this.createAuthRole = async (req, res) => {
			let params = req.body;

			if (!params.name) {
				var errors = [];

				if (!params.name) {
					errors.push({
						field: "name",
						message: 'Require name'

					});
				}

				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};


			let authRoleObj = {
				name: params.name.trim(),
				status: 1
			}
			let nameCheck = await AuthRole.findOne({
				where: {
					name: params.name.trim(),
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking auth role name exists or not',
						error: err
					})
				})
			if (nameCheck) {
				return res.send({
					success: 0,
					message: 'AuthRole name already exists..'
				})
			}


			try {
				let data = await AuthRole.create(authRoleObj);

				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "Auth role created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a Auth role'
				})
			}
		},
		this.updateAuthRole = async (req, res) => {
			let authRoleId = req.params.id;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!req.body.name) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (req.body.name) {
				update.name = req.body.name.trim();
			}

			let idData = await AuthRole.findOne({
				where: {
					id: authRoleId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking auth role id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid AuthRole Id'
				})
			} else {
				if (req.body.name) {
					let authRoleData = await AuthRole.findOne({
						where: {
							name: req.body.name.trim(),
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking AuthRole name already exists or not',
								error: err
							})
						})
					if (authRoleData && (authRoleData.id !== authRoleId)) {
						return res.send({
							success: 0,
							message: 'AuthRole name already exists '
						})
					}
				}



				await AuthRole.update(update, {
					where: {
						id: authRoleId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating auth role name',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "AuthRole name updated successfully."
				});
			}


		},
		this.listAuthRole = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			if (params.name) {
				whereCondition.name = {
					[Op.like]: '%' + params.name + '%',
				};

			}
			whereCondition.status = 1;

			var authRoles = await AuthRole.findAll({
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,

				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching authController data',
						error: err
					})
				});

			var count = await AuthRole.count({
				where: whereCondition,

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching auth role count data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: authRoles,
				totalItems: count,
				hasNextPage,
				message: "AuthRole listed successfully",
				success: 1,
			}
			return res.send(response);
		},


		this.getAuthRole = async (req, res) => {
			let authRoleId = req.params.id;
			let authRoleData = await AuthRole.findOne({
				where: {
					id: authRoleId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting auth role data',
						error: err
					})
				})
			let response = {
				authRole: authRoleData,
				success: 1,
			}
			return res.send(response);
		},
		this.deleteAuthRole = async (req, res) => {
			let authRoleId = req.params.id;
			let authRoleData = await AuthRole.findOne({
				where: {
					id: authRoleId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting authRole data',
						error: err
					})
				})
			if (authRoleData) {
				let update = {
					status: 0
				}
				await AuthRole.update(update, {
					where: {
						id: authRoleId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting authRole',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "AuthRole deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "AuthRole not exists."
				});
			}


		},

		this.createAuthRolePermission = async (req, res) => {
			let params = req.body;

			if (!params.role_id || !params.auth_permission_id) {
				var errors = [];

				if (!params.role_id) {
					errors.push({
						field: "role_id",
						message: 'Require role id'

					});
				}

				if (!params.auth_permission_id) {
					errors.push({
						field: "auth_permission_id",
						message: 'Require auth permission id'

					});
				}

				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};


			let authRolePermissionObj = {
				auth_permission_id: params.auth_permission_id,
				role_id: params.role_id,
				status: 1
			}
			let namePermissionCheck = await AuthRolePermission.findOne({
				where: {
					auth_permission_id: params.auth_permission_id,
					role_id: params.role_id,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking auth role permission exists or not',
						error: err
					})
				})
			if (namePermissionCheck) {
				return res.send({
					success: 0,
					message: 'AuthRolePermission already exists..'
				})
			}
			let roleCheck = await AuthRole.findOne({
				where: {
					id: params.role_id,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking auth role exists or not',
						error: err
					})
				})
			if (!roleCheck) {
				return res.send({
					success: 0,
					message: 'Invalid Role..'
				})
			}

			let permissionCheck = await AuthPermission.findOne({
				where: {
					id: params.auth_permission_id,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking auth permission exists or not',
						error: err
					})
				})
			if (!permissionCheck) {
				return res.send({
					success: 0,
					message: 'Invalid Permission..'
				})
			}

			try {
				let data = await AuthRolePermission.create(authRolePermissionObj);

				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "AuthRolePermission created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a Auth role permission'
				})
			}
		},
		this.updateAuthRolePermission = async (req, res) => {
			let params = req.body;
			let authRolePermissionId = req.params.id;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!params.role_id && !params.auth_permission_id) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			let rolePermissionData = await AuthRolePermission.findOne({
				where: {
					id: authRolePermissionId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking auth role permission exists or not',
						error: err
					})
				})

			if (!rolePermissionData) {
				return res.send({
					success: 0,
					message: 'Invalid role permission..'
				})
			}
			let whereCondition = {};
			whereCondition.status = 1;
			if (params.role_id) {


				let roleCheck = await AuthRole.findOne({
					where: {
						id: params.role_id,
						status: 1
					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while checking auth role exists or not',
							error: err
						})
					})
				if (!roleCheck) {
					return res.send({
						success: 0,
						message: 'Invalid Role..'
					})
				} else {
					update.role_id = params.role_id;
					whereCondition.role_id = params.role_id;
				}

			} else {
				whereCondition.role_id = rolePermissionData.role_id;
			}
			if (params.auth_permission_id) {

				let permissionCheck = await AuthPermission.findOne({
					where: {
						id: params.auth_permission_id,
						status: 1
					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while checking auth permission exists or not',
							error: err
						})
					})
				if (!permissionCheck) {
					return res.send({
						success: 0,
						message: 'Invalid Permission..'
					})
				} else {
					update.auth_permission_id = params.auth_permission_id;
					whereCondition.auth_permission_id = params.auth_permission_id;

				}

			} else {
				whereCondition.auth_permission_id = rolePermissionData.auth_permission_id;
			}

			let idData = await AuthRolePermission.findOne({
				where: whereCondition
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking auth role permission exists or not',
						error: err
					})
				})
			if (idData) {
				return res.send({
					success: 0,
					message: 'Auth role permission already exists'
				})
			} else {

				await AuthRolePermission.update(update, {
					where: {
						id: authRolePermissionId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating auth role permission',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "AuthRolePermission updated successfully."
				});
			}


		},
		this.updateAuthRolePermissionWithRole = async (req, res) => {
			let params = req.body;
			let authRoleId = req.params.id;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!params.auth_permission_id) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			let whereCondition = {};
			// whereCondition.status = 1;
			if (authRoleId) {


				let roleCheck = await AuthRole.findOne({
					where: {
						id: authRoleId,
						status: 1
					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while checking auth role exists or not',
							error: err
						})
					})
				if (!roleCheck) {
					return res.send({
						success: 0,
						message: 'Invalid Role..'
					})
				} else {
					whereCondition.role_id = authRoleId;
				}

			} else {
				return res.send({
					success: 0,
					message: 'Role ID required..'
				})
			}
			// let rolePermissionData = await AuthRolePermission.findOne({
			// 	where: {
			// 		role_id: authRoleId,
			// 		// status: 1
			// 	}
			// })
			// 	.catch(err => {
			// 		return res.send({
			// 			success: 0,
			// 			message: 'Something went wrong while checking auth role permission exists or not',
			// 			error: err
			// 		})
			// 	})

			// if (!rolePermissionData) {
			// 	return res.send({
			// 		success: 0,
			// 		message: 'Invalid role permission..'
			// 	})
			// }


			let permissionCheck = await AuthPermission.findOne({
				where: {
					id: params.auth_permission_id,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking auth permission exists or not',
						error: err
					})
				})
			if (!permissionCheck) {
				return res.send({
					success: 0,
					message: 'Invalid Permission..'
				})
			} else {
				update.auth_permission_id = params.auth_permission_id;
				whereCondition.auth_permission_id = params.auth_permission_id;

			}

		
			let idData = await AuthRolePermission.findOne({
				where: whereCondition
			})
			// .catch(err => {
			// 	return res.send({
			// 		success: 0,
			// 		message: 'Something went wrong while checking auth role permission exists or not',
			// 		error: err
			// 	})
			// })
			if (idData) {
				console.log("status : " + idData.status)
				if (idData.status === 1) {
					return res.send({
						success: 0,
						message: 'Auth role permission already exists'
					})
				} else {

					await AuthRolePermission.update(update, {
						where: {
							role_id: authRoleId,
							auth_permission_id: params.auth_permission_id

						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while updating auth role permission',
								error: err
							})
						})
					res.status(200).send({
						success: 1,
						message: "AuthRolePermission updated successfully."
					});
				}
			} else {
				update.role_id = authRoleId;

				try {
					let data = await AuthRolePermission.create(update);

					res.status(200).send({
						success: 1,
						message: "AuthRolePermission updated successfully."
					});
				} catch (err) {
					console.log(err);
					return res.send({
						success: 0,
						message: 'Error while create a Auth role permission'
					})
				}

			}


		},
		this.listAuthPermission = async (req, res) => {
			let params = req.query;
			// let authRoleId = req.params.id;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			if (params.name) {
				whereCondition.name = {
					[Op.like]: '%' + params.name + '%',
				};

			}
			whereCondition.status = 1;


			var authPermissions = await AuthController.findAll({
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				include: [{
					model: AuthPermission
				}],

				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching authController data',
						error: err
					})
				});

			// var count = await AuthRole.count({
			// 	where: whereCondition,

			// })
			// 	.catch(err => {
			// 		return res.send({
			// 			success: 0,
			// 			message: 'Something went wrong while fetching auth role count data',
			// 			error: err
			// 		})
			// 	});

			// totalPages = count / perPage;
			// totalPages = Math.ceil(totalPages);
			// var hasNextPage = page < totalPages;
			let response = {
				items: authPermissions,
				// totalItems: count,
				// hasNextPage,
				message: "AuthRole listed successfully",
				success: 1,
			}
			return res.send(response);
		},

		this.listAuthRolePermission = async (req, res) => {
			let params = req.query;
			let authRoleId = req.params.id;
			let userData = req.identity.data;
			let user_type = userData.user_type;
			let userId = userData.id;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			if (params.name) {
				whereCondition.name = {
					[Op.like]: '%' + params.name + '%',
				};

			}
			whereCondition.status = 1;
			let authRolePermissionCondition = {};
			authRolePermissionCondition.status = 1;
			authRolePermissionCondition.role_id = authRoleId;
			var authRolePermissions = await AuthRolePermission.findAll({
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: authRolePermissionCondition,
				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching authController data',
						error: err
					})
				});

			var authControllerPermissions = await AuthController.findAll({
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,
				include: [{
					model: AuthPermission
				}],

				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching authController data',
						error: err
					})
				});
			let authPermissionIdArray = [];
			for (let i = 0; i < authRolePermissions.length; i++) {
				authPermissionIdArray.push(authRolePermissions[i].auth_permission_id);
			}
			var j = 0;
			// let responseArray = authControllerPermissions.map(function(item){ return item.toJSON() });
			
			let responseArray = authControllerPermissions.map(function (item) { return item.toJSON() });

			for (let j = 0; j < responseArray.length; j++) {
				let controller = responseArray[j];
				let k = 0;
				for (let k = 0; k < controller.authPermissions.length; k++) {
					let obj = controller.authPermissions[k];
					if(user_type !== constants.TYPE_ADMIN){
					let optionObj = await authPermissionIdArray.find(id => id === controller.authPermissions[k].id);

					if (optionObj) {

						obj["is_allow"] = true;
					} else {
						obj["is_allow"] = false;

					}
				}else{
					obj["is_allow"] = true;
				}
					responseArray[j].authPermissions[k] = obj;
				}
			}

			// var count = await AuthRole.count({
			// 	where: whereCondition,

			// })
			// 	.catch(err => {
			// 		return res.send({
			// 			success: 0,
			// 			message: 'Something went wrong while fetching auth role count data',
			// 			error: err
			// 		})
			// 	});

			// totalPages = count / perPage;
			// totalPages = Math.ceil(totalPages);
			// var hasNextPage = page < totalPages;
			let response = {
				items: responseArray,
				// totalItems: count,
				// hasNextPage,
				message: "AuthRolePermission listed successfully",
				success: 1,
			}
			return res.send(response);
		},


		this.deleteAuthRolePermission = async (req, res) => {
			let authRolePermissionId = req.params.id;
			let authRolePermissionData = await AuthRolePermission.findOne({
				where: {
					id: authRolePermissionId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting authRole permission data',
						error: err
					})
				})
			if (authRolePermissionData) {
				let update = {
					status: 0
				}
				await AuthRolePermission.update(update, {
					where: {
						id: authRolePermissionId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting authRolePermission',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "AuthRolePermission deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "AuthRolePermission not exists."
				});
			}


		},



		this.createAuthPermissionSidebarMenu = async (req, res) => {
			let params = req.body;

			if (!params.auth_permission_id || !params.auth_sidebar_menu_id) {
				var errors = [];

				if (!params.auth_permission_id) {
					errors.push({
						field: "auth_permission_id",
						message: 'Require auth permission id'

					});
				}

				if (!params.auth_sidebar_menu_id) {
					errors.push({
						field: "auth_sidebar_menu_id",
						message: 'Require auth sidebar menu id'

					});
				}

				return res.send({
					success: 0,
					statusCode: 400,
					errors: errors,
				});
			};


			let authRoleObj = {
				auth_permission_id: params.auth_permission_id,
				auth_sidebar_menu_id: params.auth_sidebar_menu_id,
				status: 1
			}
			let menuCheck = await SidebarMenu.findOne({
				where: {
					name: params.auth_sidebar_menu_id,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking sidebarmenu  exists or not',
						error: err
					})
				})
			if (menuCheck) {
				return res.send({
					success: 0,
					message: 'AuthRole name already exists..'
				})
			}


			try {
				let data = await AuthRole.create(authRoleObj);

				res.status(200).send({
					success: 1,
					id: data.dataValues.id,
					message: "Auth role created successfully."
				});
			} catch (err) {
				console.log(err);
				return res.send({
					success: 0,
					message: 'Error while create a Auth role'
				})
			}
		},
		this.updateAuthRole = async (req, res) => {
			let authRoleId = req.params.id;
			let update = {};
			update.modified_at = new Date();
			update.status = 1;
			if (!req.body.name) {
				return res.send({
					success: 0,
					message: 'Nothing to update'
				})
			}
			if (req.body.name) {
				update.name = req.body.name.trim();
			}

			let idData = await AuthRole.findOne({
				where: {
					id: authRoleId
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while checking auth role id exists or not',
						error: err
					})
				})
			if (!idData) {
				return res.send({
					success: 0,
					message: 'Invalid AuthRole Id'
				})
			} else {
				if (req.body.name) {
					let authRoleData = await AuthRole.findOne({
						where: {
							name: req.body.name.trim(),
							status: 1,
						}
					})
						.catch(err => {
							return res.send({
								success: 0,
								message: 'Something went wrong while checking AuthRole name already exists or not',
								error: err
							})
						})
					if (authRoleData && (authRoleData.id !== authRoleId)) {
						return res.send({
							success: 0,
							message: 'AuthRole name already exists '
						})
					}
				}



				await AuthRole.update(update, {
					where: {
						id: authRoleId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while updating auth role name',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "AuthRole name updated successfully."
				});
			}


		},
		this.listAuthRole = async (req, res) => {
			let params = req.query;
			let page = params.page || 1;
			let perPage = Number(params.perPage) || 10;
			perPage = perPage > 0 ? perPage : 10;
			var offset = (page - 1) * perPage;
			let whereCondition = {};
			if (params.name) {
				whereCondition.name = {
					[Op.like]: '%' + params.name + '%',
				};

			}
			whereCondition.status = 1;

			var authRoles = await AuthRole.findAll({
				order: [
					['modified_at', 'DESC']
				],
				offset: offset,
				where: whereCondition,

				limit: perPage,
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching authController data',
						error: err
					})
				});

			var count = await AuthRole.count({
				where: whereCondition,

			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while fetching auth role count data',
						error: err
					})
				});

			totalPages = count / perPage;
			totalPages = Math.ceil(totalPages);
			var hasNextPage = page < totalPages;
			let response = {
				items: authRoles,
				totalItems: count,
				hasNextPage,
				message: "AuthRole listed successfully",
				success: 1,
			}
			return res.send(response);
		},


		this.getAuthRole = async (req, res) => {
			let authRoleId = req.params.id;
			let authRoleData = await AuthRole.findOne({
				where: {
					id: authRoleId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting auth role data',
						error: err
					})
				})
			let response = {
				authRole: authRoleData,
				success: 1,
			}
			return res.send(response);
		},
		this.deleteAuthRole = async (req, res) => {
			let authRoleId = req.params.id;
			let authRoleData = await AuthRole.findOne({
				where: {
					id: authRoleId,
					status: 1
				}
			})
				.catch(err => {
					return res.send({
						success: 0,
						message: 'Something went wrong while getting authRole data',
						error: err
					})
				})
			if (authRoleData) {
				let update = {
					status: 0
				}
				await AuthRole.update(update, {
					where: {
						id: authRoleId

					}
				})
					.catch(err => {
						return res.send({
							success: 0,
							message: 'Something went wrong while deleting authRole',
							error: err
						})
					})
				res.status(200).send({
					success: 1,
					message: "AuthRole deleted successfully."
				});
			} else {
				res.status(200).send({
					success: 1,
					message: "AuthRole not exists."
				});
			}


		}







}
module.exports = adminController