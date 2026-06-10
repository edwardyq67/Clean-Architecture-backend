import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/database';

class CategorySequelizeModel extends Model {
    public id!: string;
    public name!: string;
    public is_active!: boolean;
    public created_at!: Date;
    public updated_at!: Date;
}

CategorySequelizeModel.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    sequelize,
    tableName: 'categories',
    timestamps: false,
});

export default CategorySequelizeModel;
