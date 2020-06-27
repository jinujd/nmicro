module.exports = function FacilitySurvey(sequelize) {
    var Sequelize = sequelize.constructor;
    // var district = require('./district.model') (sequelize);
    var lsgi = require('./lsgi.model') (sequelize);
    var categoryRelationship = require('./categoryRelationship.model') (sequelize);

    var ret =
      sequelize.define('facilitySurvey', {
        lsgi_id: {
          type: Sequelize.INTEGER
        },
        ward_id: {
          type: Sequelize.INTEGER
      },
      facility_name: {
          type: Sequelize.STRING
        },
        facility_type_id: {
          type: Sequelize.INTEGER
      },
      is_operational: {
        type: Sequelize.INTEGER
      },
      date_of_establishment: {
        type: 'TIMESTAMP',
        // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      is_fee_collected_from_customer: {
        type: Sequelize.INTEGER
      },
      controlling_authority_name: {
        type: Sequelize.STRING
    },
    design_life_years :{
      type :Sequelize.DOUBLE
    },
    area_of_land : {
      type :Sequelize.DOUBLE

    },

technology : {
  type : Sequelize.STRING
},

capacity_of_unit_1 : {
  type : Sequelize.DOUBLE
},
capacity_of_unit_2 : {
  type : Sequelize.DOUBLE
},
capacity_of_unit_3 : {
  type : Sequelize.DOUBLE
},

waste_quantity: {
  type : Sequelize.DOUBLE
},
compost_quantity: {
  type : Sequelize.DOUBLE
},
lat: {
  type : Sequelize.DOUBLE
},
lng: {
  type : Sequelize.DOUBLE
},
is_sent_to_server: {
  type : Sequelize.INTEGER
},
reason_for_non_operation: {
  type : Sequelize.STRING
},
category_relationship_id: {
  type : Sequelize.INTEGER
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
        tableName: 'facility_survey',
        timestamps: false
  
      });
      // ret.belongsTo(lsgi, {foreignKey: 'lsgi_id'});
      // ret.belongsTo(district, {foreignKey: 'district_id'});
    //   ret.relations = {
    //     lsgiType:lsgiType,
    //     lsgiBlock:lsgiBlock
    // };
      ret.belongsTo(lsgi, {foreignKey: 'lsgi_id'});
      ret.belongsTo(categoryRelationship, {foreignKey: 'category_relationship_id'});
    //   ret.belongsTo(lsgiBlock, {foreignKey: 'lsgi_block_id'});
  
    return ret;
  }
  