module.exports = function User(sequelize) {
    var Sequelize = sequelize.constructor;
    var lsgi = require('./lsgi.model') (sequelize);

    var ret =
      sequelize.define('user', {
        name: {
          type: Sequelize.STRING
        },
        email: {
          type: Sequelize.STRING
        },
        phone: {
          type: Sequelize.STRING
        },
        password: {
          type: Sequelize.STRING
        },
        user_type: {
          type: Sequelize.STRING
        },
        lsgi_id: {
          type: Sequelize.STRING
        },
        is_approved: {
          type: Sequelize.INTEGER
        },
        role_id:{
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
        tableName: 'user',
        timestamps: false
  
      });
      ret.belongsTo(lsgi, {foreignKey: 'lsgi_id'});
  
    return ret;
  }
  