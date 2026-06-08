import { DataTypes } from 'sequelize';
import { sequelize } from '@/config/database';
import UserSequelizeModel from "./user/infrastructure/models/UserSequelizeModel";
import RoleSequelizeModel from "./role/infrastructure/models/RoleSequelizeModel";

const UserRolesModel = sequelize.define('UserRoles', {
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    }
}, {
    tableName: 'UserRoles',
    timestamps: false
});

UserSequelizeModel.belongsToMany(RoleSequelizeModel, {
    through: UserRolesModel,
    foreignKey: 'user_id',
    otherKey: 'role_id'
});
RoleSequelizeModel.belongsToMany(UserSequelizeModel, {
    through: UserRolesModel,
    foreignKey: 'role_id',
    otherKey: 'user_id'
});