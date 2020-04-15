module.exports = function Question(sequelize) {
    var Sequelize = sequelize.constructor;

    var ret =
      sequelize.define('question', {
        question_en: {
          type: Sequelize.STRING
        },
        question_ml: {
          type: Sequelize.STRING
        },
        point: {
          type: Sequelize.INTEGER
        },
        type: {
          type: Sequelize.STRING
        },
        is_percentage_calculation: {
          type: Sequelize.INTEGER
        },
        is_mandatory: {
          type: Sequelize.INTEGER
        },
        max: {
          type: Sequelize.INTEGER
        },
        min: {
          type: Sequelize.INTEGER
        },
        error_message: {
          type: Sequelize.STRING
        },
        percentage_configuaration_id: {
          type: Sequelize.INTEGER
        },
        sort_order: {
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
        tableName: 'question',
        timestamps: false
  
      });
  
    return ret;
  }
  