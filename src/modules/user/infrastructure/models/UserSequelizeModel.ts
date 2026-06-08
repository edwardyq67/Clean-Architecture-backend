import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/database';

class UserSequelizeModel extends Model {
    public id!: string;
    public name!: string;
    public email!: string;
    public password_hash!: string;
    public is_active!: boolean;
    public created_at!: Date;
    public updated_at!: Date;
    public last_login_at!: Date | null;
}

UserSequelizeModel.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    last_login_at: { type: DataTypes.DATE, allowNull: true },
}, {
    sequelize,
    tableName: 'users',
    timestamps: false,
});

export default UserSequelizeModel;