'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Movie,{foreignKey:'authorId'})
    }
  }
  User.init({
    email: {
      type : DataTypes.STRING,
      allowNull : false,
      unique : {
        args : true,
        msg : 'Email already exist'
      },
      validate : {
        notNull : {
          msg : 'Email is required'
        },
        notEmpty : {
          msg : 'Email is required'
        },
        isEmail : {
          args : true,
          msg : 'Email format is wrong'
        }
      }
    },
    password: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : 'Password is required'
        },
        notEmpty : {
          msg : 'Password is required'
        },
        len : {
          args : [6],
          msg : 'Password at least 6 characters'
        }
      }
    },
    role: {
      type : DataTypes.STRING,
      defaultValue : 'Staff'
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};