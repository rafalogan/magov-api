import Sequelize, { Model } from 'sequelize';

class Role extends Model {

    static init(sequelize) {
        super.init({
            role: Sequelize.STRING,
            active: Sequelize.INTEGER
        }, {
            sequelize,
            freezeTableName: true,
            tableName: 'role',
        });

        return this;
    }
    static associate(models) {
        this.hasOne(models.User, { foreignKey: 'role' })
        }

}

export default Role;
