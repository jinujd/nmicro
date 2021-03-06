module.exports = function FacilitySurveyQuestion(sequelize) {
    var Sequelize = sequelize.constructor;
    // var district = require('./district.model') (sequelize);
    // var lsgiType = require('./lsgiType.model') (sequelize);
    // var category = require('./category.model') (sequelize);
    var ret =
      sequelize.define('facilitySurveyQuestion', {
        question_en: {
          type: Sequelize.STRING
        },
        question_ml: {
          type: Sequelize.STRING
        },
        field_name: {
          type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        status: {
          type: Sequelize.INTEGER
        },
        created_at: {
          type: 'TIMESTAMP',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false
        },
        modified_at: {
          type: 'TIMESTAMP',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false
        },
  
      }, {
        tableName: 'facility_survey_question',
        timestamps: false
  
      });
      // ret.belongsTo(category, {foreignKey: 'category_id'});
      // ret.belongsTo(district, {foreignKey: 'district_id'});
    //   ret.relations = {
    //     lsgiType:lsgiType,
    //     lsgiBlock:lsgiBlock
    // };
    //   ret.belongsTo(lsgiType, {foreignKey: 'lsgi_type_id'});
    //   // lsgiType.hasMany(ret, {foreignKey: 'lsgi_type_id'});
    //   ret.belongsTo(lsgiBlock, {foreignKey: 'lsgi_block_id'});
  
    return ret;
  }
  