module.exports = function LsgiBlock(sequelize) {
  var Sequelize = sequelize.constructor;
  var ret =
    sequelize.define('lsgiBlock', {
      name: {
        type: Sequelize.STRING
      },
      district_id: {
        type: Sequelize.INTEGER,
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
      tableName: 'lsgi_block',
      timestamps: false

    });

  

  return ret;
}
