import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/database';

class RoleSequelizeModel extends Model {
    public id!: string;
    public name!: string;
}

RoleSequelizeModel.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true }
}, {
    sequelize,
    tableName: 'roles',
    timestamps: false,
});

export default RoleSequelizeModel;
