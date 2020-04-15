module.exports = function CategoryRelationship(sequelize) {
    var Sequelize = sequelize.constructor;
    var category = require('./category.model') (sequelize);

    var ret =
      sequelize.define('categoryRelatioship', {
        parent_cat_id: {
          type: Sequelize.INTEGER
        },
        child_cat_id: {
          type: Sequelize.INTEGER
        },
        sort_order: {
          type: Sequelize.INTEGER
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
        tableName: 'category_relationship',
        timestamps: false
  
      });
      category.hasMany(ret, {foreignKey: 'parent_cat_id'});
      category.hasMany(ret, {foreignKey: 'child_cat_id'});
  
    return ret;
  }
  