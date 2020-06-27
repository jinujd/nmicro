module.exports = function Category(sequelize) {
    var Sequelize = sequelize.constructor;
    var ret =
      sequelize.define('category', {
        name_ml: {
          type: Sequelize.STRING
        },
        name_en: {
          type: Sequelize.STRING
        },
        children_page_layout: {
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
        tableName: 'category',
        timestamps: false
  
      });
  
    return ret;
  }
  