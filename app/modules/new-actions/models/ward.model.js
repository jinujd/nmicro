module.exports = function Ward(sequelize) {
    var Sequelize = sequelize.constructor;
    var lsgi = require('./lsgi.model') (sequelize);
    var district = require('./district.model') (sequelize);
    // var lsgiType = require('./lsgiType.model') (sequelize);
    // var lsgiBlock = require('./lsgiBlock.model') (sequelize);
    var ret =
      sequelize.define('ward', {
        name_en: {
          type: Sequelize.STRING
        },
        name_ml: {
          type: Sequelize.STRING
        },
        lsgi_id: {
            type: Sequelize.INTEGER
        },
        district_id: {
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
        tableName: 'ward',
        timestamps: false
  
      });
      ret.belongsTo(lsgi, {foreignKey: 'lsgi_id'});
      ret.belongsTo(district, {foreignKey: 'district_id'});
    //   ret.relations = {
    //     lsgiType:lsgiType,
    //     lsgiBlock:lsgiBlock
    // };
    //   ret.belongsTo(lsgiType, {foreignKey: 'lsgi_type_id'});
    //   // lsgiType.hasMany(ret, {foreignKey: 'lsgi_type_id'});
    //   ret.belongsTo(lsgiBlock, {foreignKey: 'lsgi_block_id'});
  
    return ret;
  }
  