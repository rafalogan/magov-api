import Sequelize from 'sequelize';
import databaseConfig from '../config/database.js';
import Address from '../app/models/Address.js';
import Company from '../app/models/Company.js';
import Person from '../app/models/Person.js';
import User from '../app/models/User.js';
import UserMenu from '../app/models/UserMenu.js';
import PhysicalPerson from '../app/models/PhysicalPerson.js';
import Menu from '../app/models/Menu.js';
import PropositionType from '../app/models/PropositionType.js';
import PropositionGoal from '../app/models/PropositionGoal.js';
import InstituteType from '../app/models/InstituteType.js';
import Task from '../app/models/Task.js';
import Goal from '../app/models/Goal.js';
import DemandTask from '../app/models/DemandTask.js';
import DemandDocument from '../app/models/DemandDocument.js';
import Theme from '../app/models/Theme.js';
import PropositionTheme from '../app/models/PropositionTheme.js';
import DemandType from '../app/models/DemandType.js';
import Proposition from '../app/models/Proposition.js';
import PropositionRelated from '../app/models/PropositionRelated.js';
import Plaintiff from '../app/models/Plaintiff.js';
import Demand from '../app/models/Demand.js';
import DemandGoal from '../app/models/DemandGoal.js';
import PropositionDocument from '../app/models/PropositionDocument.js';
import Revenue from '../app/models/Revenue.js';
import Squad from '../app/models/Squad.js';
import PropositionDemand from '../app/models/PropositionDemand.js';
import DemandTypeDemand from '../app/models/DemandTypeDemand.js';
import DemandKeyword from '../app/models/DemandKeyword.js';
import Profile from '../app/models/Profile.js';
import EngageDocument from '../app/models/EngageDocument.js';
import ExpenseTypeExpense from '../app/models/ExpenseTypeExpense.js';
import ExpenseCompany from '../app/models/ExpenseCompany.js';
import Expense from '../app/models/Expense.js';
import ExpenseType from '../app/models/ExpenseType.js';
import ReceiptForm from '../app/models/ReceiptForm.js';
import PaymentForm from '../app/models/PaymentForm.js';
import PropositionTask from '../app/models/PropositionTask.js';
import RevenueTypeRevenue from '../app/models/RevenueTypeRevenue.js';
import ExpensePayment from '../app/models/ExpensePayment.js';
import Origin from '../app/models/Origin.js';
import SquadUser from '../app/models/SquadUser.js';
import Propositionkeyword from '../app/models/PropositionKeyword.js';
import RevenueOrigin from '../app/models/RevenueOrigin.js';
import RevenueReceiptForm from '../app/models/RevenueReceiptForm.js';
import PropositionTypeProposition from '../app/models/PropositionTypeProposition.js';
import Unit from '../app/models/Unit.js';
import Contact from '../app/models/Contact.js';
import Role from '../app/models/Role.js';
import TaskResponsible from '../app/models/TaskResponsible.js';
import TaskPlaintiff from '../app/models/TaskPlaintiff.js';
import RevenueType from '../app/models/RevenueType.js';
import PropositionRevenue from '../app/models/PropositionRevenue.js';
import CommentWarning from '../app/models/CommentWarning.js';
import CapagCity from '../app/models/CapagCity.js';
import CapagState from '../app/models/CapagState.js';
import DocModel from '../app/models/DocModel.js';
import PaymentStatus from '../app/models/PaymentStatus.js';
import CommissionStatus from '../app/models/CommissionStatus.js';
import PaymentMethods from '../app/models/PaymentMethods.js';
import Seller from '../app/models/Seller.js';
import Product from '../app/models/Product.js';
import Purchases from '../app/models/Purchases.js';
import Clients from '../app/models/Clients.js';

const models = [
    Address,
    Company,
    Menu,
    Person,
    PhysicalPerson,
    User,
    UserMenu,
    PropositionType,
    PropositionGoal,
    InstituteType,
    Task,
    CommentWarning,
    Goal,
    DemandTask,
    DemandDocument,
    Theme,
    PropositionTheme,
    DemandType,
    Proposition,
    PropositionDemand,
    PropositionRelated,
    Plaintiff,
    Demand,
    DemandGoal,
    PropositionDocument,
    Revenue,
    Squad,
    DemandTypeDemand,
    DemandKeyword,
    Profile,
    Proposition,
    Propositionkeyword,
    SquadUser,
    ExpenseTypeExpense,
    ExpenseCompany,
    Expense,
    ExpenseType,
    ReceiptForm,
    PaymentForm,
    PropositionTask,
    RevenueTypeRevenue,
    RevenueType,
    ExpensePayment,
    Origin,
    RevenueOrigin,
    RevenueReceiptForm,
    EngageDocument,
    PropositionTypeProposition,
    Unit,
    Contact,
    Role,
    TaskResponsible,
    TaskPlaintiff,
    PropositionRevenue,
    CommentWarning,
    CapagCity,
    CapagState,
    DocModel,
    PaymentStatus,
    CommissionStatus,
    PaymentMethods,
    Seller,
    Product,
    Purchases,
    Clients
];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        models
            .map(model => model.init(this.connection))
            .map(
                model =>
                    model.associate && model.associate(this.connection.models)
            );
    }
}

export default new Database();
