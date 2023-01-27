import Sequelize, {
    Model
} from 'sequelize';

class EngageDocument extends Model {

    static init(sequelize) {
        super.init({
            data: Sequelize.STRING,
            flg_existe_documento_relacionado_no_d_m: Sequelize.INTEGER,
            fase: Sequelize.STRING,
            documento: Sequelize.STRING,
            documento_resumido: Sequelize.STRING,
            especie: Sequelize.STRING,
            orgao_superior: Sequelize.STRING,
            orgao_vinculado: Sequelize.STRING,
            unidade_gestora: Sequelize.STRING,
            elemento_despesa: Sequelize.STRING,
            favorecido: Sequelize.STRING,
            valor: Sequelize.STRING,
            revenue: Sequelize.INTEGER,
            active: Sequelize.INTEGER
        }, {
            sequelize,
            freezeTableName: true,
            tableName: 'engage_document',
        });
        return this;
    }
    static associate(models) {
        this.belongsTo(models.Revenue, {
            foreignKey: 'revenue'
        })
    }
}

export default EngageDocument;
