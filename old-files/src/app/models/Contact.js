import Sequelize, {
    Model
} from 'sequelize';

class Contact extends Model {

    static init(sequelize) {
        super.init({
            email: Sequelize.STRING,
            phone: Sequelize.STRING,
            active: Sequelize.INTEGER
        }, {
            sequelize,
            freezeTableName: true,
            tableName: 'contact',
        });

        return this;
    }
    static associate(models) {
        this.hasMany(models.Person, {
            foreignKey: 'contact'
        }),
        this.hasMany(models.Unit, {
            foreignKey: 'contact'
        })
    }

}

export default Contact;
