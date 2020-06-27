module.exports = function AuthPermissionSidebarMenu(sequelize) {
    var Sequelize = sequelize.constructor;
    var ret =
      sequelize.define('authPermissionSidebarMenu', {
        sidebar_menu_id: {
          type: Sequelize.INTEGER
        },
        auth_permission_id: {
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
        tableName: 'auth_permission__sidebar_menu',
        timestamps: false
  
      });
  
    return ret;
  }
  