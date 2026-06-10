import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/config/database';

class ProductSequelizeModel extends Model {
    public id!: string;
    public name!: string;
    public description!: string;
    public price!: number;
    public stock!: number;
    public image!: string;
    public category_id!: string;
    public is_active!: boolean;
    public created_at!: Date;
    public updated_at!: Date;
}

ProductSequelizeModel.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.STRING(500), allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
    image: { type: DataTypes.TEXT, allowNull: false },
    category_id: { type: DataTypes.UUID, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    sequelize,
    tableName: 'products',
    timestamps: false,
});

export default ProductSequelizeModel;
