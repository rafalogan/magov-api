import { Router } from 'express';
import authMiddleware from './app/middlewares/authMiddleware.js';
import ApiPing from './app/controllers/ApiPing.js';
import Person from './app/controllers/Person.js';
import Company from './app/controllers/Company.js';
import Session from './app/controllers/Session.js';
import User from './app/controllers/User.js';
import Menu from './app/controllers/Menu.js';
import PhysicalPerson from './app/controllers/PhysicalPerson.js';
import Address from './app/controllers/Address.js';
import PropositionType from './app/controllers/PropositionType.js';
import InstituteType from './app/controllers/InstituteType.js';
import Task from './app/controllers/Task.js';
import Goal from './app/controllers/Goal.js';
import Theme from './app/controllers/Theme.js';
import DemandType from './app/controllers/DemandType.js';
import Proposition from './app/controllers/Proposition.js';
import CommittedWarning from './app/controllers/CommentWarning.js';
import Plaintiff from './app/controllers/Plaintiff.js';
import Demand from './app/controllers/Demand.js';
import RevenueType from './app/controllers/RevenueType.js';
import PropositionDocument from './app/controllers/PropositionDocument.js';
import Revenue from './app/controllers/Revenue.js';
import Expense from './app/controllers/Expense.js';
import ExpenseType from './app/controllers/ExpenseType.js';
import ReceiptForm from './app/controllers/ReceiptForm.js';
import PaymentForm from './app/controllers/PaymentForm.js';
import Squad from './app/controllers/Squad.js';
import Profile from './app/controllers/Profile.js';
import Origin from './app/controllers/Origin.js';
import Unit from './app/controllers/Unit.js';
import Contact from './app/controllers/Contact.js';
import Role from './app/controllers/Role.js';
import TaskResponsibles from './app/controllers/TaskResponsibles.js';
import DemandKeyword from './app/controllers/DemandKeyword.js';
import PropositionRevenue from './app/controllers/PropositionRevenue.js';
import PropositionTask from './app/controllers/PropositionTask.js';
import MandateData from './app/controllers/MandateData.js';
import DocModelController from './app/controllers/DocModelController.js';
import PaymentStatusController from './app/controllers/PaymentStatusController.js';
import CommissionStatusController from './app/controllers/CommissionStatusController.js';
import PaymentMethodsController from './app/controllers/PaymentMethodsController.js';
import SellerController from './app/controllers/SellerController.js';
import ProductController from './app/controllers/ProductController.js';
import PurchasesController from './app/controllers/PurchasesController.js';
import ClientController from './app/controllers/ClientController.js';
//import ExpensePayment from './app/controllers/ExpensePayment'

const routes = new Router();

routes.use(authMiddleware);
//Ping
routes.get('/ping', ApiPing.index);

routes.post('/recuperacao/senha', User.reenviarSenha);
routes.post('/updated/password', User.atualizarSenha);

routes.put('/update', PurchasesController.updatePasswordClient);

//Address
routes.get('/addresses/:id', Address.getById);
routes.get('/addresses', Address.index);
routes.post('/addresses', Address.store);
routes.put('/addresses/:id', Address.update);

// Company
routes.post('/companies', Company.store);
routes.put('/companies/:id', Company.update);
routes.get('/companies', Company.index);
routes.get('/companies/:id', Company.getById);
routes.delete('/companies/:id', Company.delete);

// Menus
routes.get('/menus', Menu.index);

// Person
routes.post('/people', Person.store);
routes.put('/people/:id', Person.update);
routes.get('/people', Person.index);
routes.get('/people/:id', Person.getById);
routes.delete('/people/:id', Person.delete);

// Physical Person
routes.get('/physical-persons', PhysicalPerson.index);
// Task Responsibles
routes.get('/task-responsibles', TaskResponsibles.index);

// Session
routes.post('/sessions', Session.store);

// Users
routes.post('/users', User.store);
routes.put('/users/:id', User.update);
routes.post('/associese', User.store);
routes.put('/associese/:id', User.update);
routes.get('/users', User.index);
routes.get('/users/:id', User.getById);
routes.delete('/users/:id', User.delete);

// PropositionType
routes.post('/proposition-types', PropositionType.store);
routes.put('/proposition-types/:id', PropositionType.update);
routes.get('/proposition-types', PropositionType.index);
routes.get('/proposition-types/:id', PropositionType.getById);
routes.delete('/proposition-types/:id', PropositionType.delete);

// Institute Type
routes.post('/institute-types', InstituteType.store);
routes.put('/institute-types/:id', InstituteType.update);
routes.get('/institute-types', InstituteType.index);
routes.get('/institute-types/:id', InstituteType.getById);
routes.delete('/institute-types/:id', InstituteType.delete);

// Task
routes.post('/tasks', Task.store);
routes.put('/tasks/:id', Task.update);
routes.get('/tasks', Task.index);
routes.get('/tasks/:id', Task.getById);
routes.delete('/tasks/:id', Task.delete);
routes.put('/tasks-change/:id', Task.changeStatus);

// Goal
routes.post('/goals', Goal.store);
routes.put('/goals/:id', Goal.update);
routes.get('/goals', Goal.index);
routes.get('/goals/:id', Goal.getById);
routes.delete('/goals/:id', Goal.delete);

// Theme
routes.post('/themes', Theme.store);
routes.put('/themes/:id', Theme.update);
routes.get('/themes', Theme.index);
routes.get('/themes/:id', Theme.getById);
routes.delete('/themes/:id', Theme.delete);

// DemandType
routes.post('/demand-types', DemandType.store);
routes.put('/demand-types/:id', DemandType.update);
routes.get('/demand-types', DemandType.index);
routes.get('/demand-types/:id', DemandType.getById);
routes.delete('/demand-types/:id', DemandType.delete);

// Proposition
routes.get('/propositions', Proposition.index);
routes.post('/propositions', Proposition.store);
routes.put('/propositions/:id', Proposition.update);
routes.get('/propositions/:id', Proposition.getById);
routes.delete('/propositions/:id', Proposition.delete);
routes.put('/propositions-committed/:id', Proposition.changeCommitted);
routes.put('/propositions-favorite/:id', Proposition.addFavorite);
routes.post('/committed-warning', CommittedWarning.store); // teste
routes.get('/propositions-unit/:id', Proposition.getByUnit);

// Plaintiff
routes.post('/plaintiff', Plaintiff.store);
routes.put('/plaintiff/:id', Plaintiff.update);
routes.get('/plaintiff', Plaintiff.index);
routes.get('/plaintiff/:id', Plaintiff.getById);
routes.delete('/plaintiff/:id', Plaintiff.delete);

routes.post('/plaintiff-doc', Plaintiff.getByDoc);
routes.get('/plaintiff-doc', Plaintiff.getByDoc);

// DemandKeyword
routes.get('/demand-keywords', DemandKeyword.index);

// Demand
routes.post('/demands', Demand.store);
routes.put('/demands/:id', Demand.update);
routes.get('/demands', Demand.index);
routes.get('/demands/:id', Demand.getById);
routes.delete('/demands/:id', Demand.delete);
routes.put('/demands-favorite/:id', Demand.addFavorite);
routes.get('/demands-unit/:id', Demand.getByUnit);

routes.post('/demands-doc', Demand.getByDoc);
routes.get('/demands-doc', Demand.getByDoc);

// Revenue Type
routes.post('/revenue-types', RevenueType.store);
routes.put('/revenue-types/:id', RevenueType.update);
routes.get('/revenue-types', RevenueType.index);
routes.get('/revenue-types/:id', RevenueType.getById);
routes.delete('/revenue-types/:id', RevenueType.delete);

//Proposition Document
routes.get('/propositionsdocument', PropositionDocument.index);

// Revenue
routes.post('/revenues', Revenue.store);
routes.put('/revenues/:id', Revenue.update);
routes.get('/revenues', Revenue.index);
routes.get('/revenues/:id', Revenue.getById);
routes.delete('/revenues/:id', Revenue.delete);
routes.get('/revenues-filter', Revenue.filter);

// Expense
routes.post('/expenses', Expense.store);
routes.put('/expenses/:id', Expense.update);
routes.get('/expenses', Expense.index);
routes.get('/expenses/:id', Expense.getById);
routes.delete('/expenses/:id', Expense.delete);

// ExpenseType
routes.post('/expense-types', ExpenseType.store);
routes.put('/expense-types/:id', ExpenseType.update);
routes.get('/expense-types', ExpenseType.index);
routes.get('/expense-types/:id', ExpenseType.getById);
routes.delete('/expense-types/:id', ExpenseType.delete);

// ReceiptForm
routes.post('/receipts-forms', ReceiptForm.store);
routes.put('/receipts-forms/:id', ReceiptForm.update);
routes.get('/receipts-forms', ReceiptForm.index);
routes.get('/receipts-forms/:id', ReceiptForm.getById);
routes.delete('/receipts-forms/:id', ReceiptForm.delete);

// PaymentForm
routes.post('/payment-forms', PaymentForm.store);
routes.put('/payment-forms/:id', PaymentForm.update);
routes.get('/payment-forms', PaymentForm.index);
routes.get('/payment-forms/:id', PaymentForm.getById);
routes.delete('/payment-forms/:id', PaymentForm.delete);

// Squad
routes.post('/squads', Squad.store);
routes.put('/squads/:id', Squad.update);
routes.get('/squads', Squad.index);
routes.get('/squads/:id', Squad.getById);
routes.delete('/squads/:id', Squad.delete);

// Profile
routes.post('/profiles', Profile.store);
routes.put('/profiles/:id', Profile.update);
routes.get('/profiles', Profile.index);
routes.get('/profiles/:id', Profile.getById);
routes.delete('/profiles/:id', Profile.delete);

// Origin
routes.post('/origins', Origin.store);
routes.put('/origins/:id', Origin.update);
routes.get('/origins', Origin.index);
routes.get('/origins/:id', Origin.getById);
routes.delete('/origins/:id', Origin.delete);

// Unit
routes.post('/units', Unit.store);
// routes.put('/units/:id', Unit.update)
routes.get('/units', Unit.index);
routes.get('/units/:id', Unit.getById);
// routes.delete('/units/:id', Unit.delete)

// Contact
routes.post('/contacts', Contact.store);
routes.put('/contacts/:id', Contact.update);
routes.get('/contacts', Contact.index);
routes.get('/contacts/:id', Contact.getById);
routes.delete('/contacts/:id', Contact.delete);

// Role
routes.post('/roles', Role.store);
routes.put('/roles/:id', Role.update);
routes.get('/roles', Role.index);
routes.get('/roles/:id', Role.getById);
routes.delete('/roles/:id', Role.delete);

routes.get('/proposition-revenues', PropositionRevenue.index);

routes.get('/proposition-tasks', PropositionTask.index);

routes.get('/cities-capag', MandateData.getCitiesCapag);
routes.get('/states-capag', MandateData.getStateCapag);
routes.post('/store-cities', MandateData.storeCity);

// Doc Model
routes.post('/docmodels', DocModelController.store);
routes.put('/docmodels/:id', DocModelController.update);
routes.get('/docmodels', DocModelController.index);
routes.get('/docmodels/:id', DocModelController.getById);
routes.delete('/docmodels/:id', DocModelController.delete);
routes.get('/docmodels-proposition/:id', DocModelController.getByIdProposition);

// Payment Status
routes.post('/payment-status', PaymentStatusController.store);
routes.put('/payment-status/:id', PaymentStatusController.update);
routes.get('/payment-status', PaymentStatusController.index);
routes.get('/payment-status/:id', PaymentStatusController.getById);
routes.delete('/payment-status/:id', PaymentStatusController.delete);

// Commision Status
routes.post('/commission-status', CommissionStatusController.store);
routes.put('/commission-status/:id', CommissionStatusController.update);
routes.get('/commission-status', CommissionStatusController.index);
routes.get('/commission-status/:id', CommissionStatusController.getById);
routes.delete('/commission-status/:id', CommissionStatusController.delete);

// Payment Methods
routes.post('/payment-methods', PaymentMethodsController.store);
routes.put('/payment-methods/:id', PaymentMethodsController.update);
routes.get('/payment-methods', PaymentMethodsController.index);
routes.get('/payment-methods/:id', PaymentMethodsController.getById);
routes.delete('/payment-methods/:id', PaymentMethodsController.delete);

// Seller
routes.post('/sellers', SellerController.store);
routes.put('/sellers/:id', SellerController.update);
routes.get('/sellers', SellerController.index);
routes.get('/sellers/:id', SellerController.getById);
routes.delete('/sellers/:id', SellerController.delete);

// Product
routes.post('/products', ProductController.store);
routes.put('/products/:id', ProductController.update);
routes.get('/products', ProductController.index);
routes.get('/products/:id', ProductController.getById);
routes.delete('/products/:id', ProductController.delete);

// Purchases
routes.post('/purchases', PurchasesController.store);
routes.post('/purchasesInsert', PurchasesController.insertDataPurchases);
routes.put('/purchasesUpdate/:id', PurchasesController.purchasesUpdate);
routes.put('/purchases/:id', PurchasesController.update);
routes.get('/purchases', PurchasesController.index);
routes.get('/purchases/:id', PurchasesController.getById);
routes.delete('/purchases/:id', PurchasesController.delete);
routes.get('/purchases-client/:id', PurchasesController.getPurchaseByClient);

// Clients
routes.post('/clients', ClientController.store);
routes.put('/clients/:id', ClientController.update);
routes.get('/clients', ClientController.index);
routes.get('/clients/:id', ClientController.getById);
routes.delete('/clients/:id', ClientController.delete);
routes.get('/clients-unit/:id', ClientController.getByUnit);

export default routes;
