import UserSequelizeModel from "./user/infrastructure/models/UserSequelizeModel";
import RoleSequelizeModel from "./role/infrastructure/models/RoleSequelizeModel";
import ProductSequelizeModel from "./product/infrastructure/models/ProductSequelizeModel";
import CategorySequelizeModel from "./category/infrastructure/models/CategorySequelizeModel";

UserSequelizeModel.belongsToMany(RoleSequelizeModel, {
    through: 'UserRoles',
    foreignKey: 'user_id',
    otherKey: 'role_id'
});
RoleSequelizeModel.belongsToMany(UserSequelizeModel, {
    through: 'UserRoles',
    foreignKey: 'role_id',
    otherKey: 'user_id'
});

ProductSequelizeModel.belongsTo(CategorySequelizeModel, {
    foreignKey: 'category_id',
    as: 'category'
});
CategorySequelizeModel.hasMany(ProductSequelizeModel, {
    foreignKey: 'category_id',
    as: 'products'
});