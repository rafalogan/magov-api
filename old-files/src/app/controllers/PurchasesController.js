import PaymentStatus from '../models/PaymentStatus.js';
import PaymentMethods from '../models/PaymentMethods.js';
import Product from '../models/Product.js';
import Purchases from '../models/Purchases.js';
import Seller from '../models/Seller.js';
import content from './content.js';
import Client from '../models/Clients.js';
import CommissionStatus from '../models/CommissionStatus.js';
import database from '../../database/index.js';
const sequelize = database.connection;
import Address from '../models/Address.js';
import Contact from '../models/Contact.js';
import Unit from '../models/Unit.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import UserMenu from '../models/UserMenu.js';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import path from 'path';
import CryptoJS from 'crypto-js';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    service: 'gmail'
});

async function sendEmailClient(email, id, res) {
    let authSecret = 'redefinicaoSenha';

    const __dirname = path.resolve();
    let token = jwt.sign(
        {
            id
        },
        authSecret,
        {
            expiresIn: 86400 // expires 24 horas
        }
    );

    let linkTag = `<a href="https://dev.magovernance.cleandev.com.br/update?token=${token}">Redefinir senha</a>`;
    let msg = `Sua senha padrão é 123456. Por favor, clique no link a seguir para redefinir sua senha <br><br>${linkTag}`;

    try {
        let filePath = path.join(__dirname, 'src/app/controllers/email.html');
        fs.readFile(filePath, 'utf8', function(err, contents) {
            if (err) throw err;

            let msgContent = contents.replace('[CONTENT VALUE]', msg);

            const mailOptions = {
                from: 'cleandev.contato@gmail.com',
                to: email,
                subject: 'Cadastro de nova senha',
                html: msgContent
            };
            transporter.sendMail(mailOptions, function(err, info) {
                if (err) {
                    console.log(err);
                } else {
                    return res.json(
                        content('Email enviado com sucesso para ', email)
                    );
                }
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error:
                'Erro ao enviar email para definição de senha, entre em contato com nosso suporte!'
        });
    }
}

class PurchasesController {
    async store(req, res) {
        const { product } = req.body;

        if (product.length > 1) {
            const newPurchasesObj = product.map(item => {
                const newPurchasesCreate = {
                    ...req.body,
                    product: item.id
                };
                return newPurchasesCreate;
            });
            return res.json(await Purchases.bulkCreate(newPurchasesObj));
        }

        return res.json(await Purchases.create(req.body));
    }

    async index(req, res) {
        const purchase = await Purchases.findAll({
            order: ['id'],
            where: { active: true },
            include: [
                { model: Product, as: 'products', where: { active: true } },
                {
                    model: PaymentStatus,
                    as: 'paymentStatus',
                    where: { active: true }
                },
                { model: Seller, as: 'sellers', where: { active: true } },
                {
                    model: PaymentMethods,
                    as: 'paymentMethod',
                    where: { active: true }
                },
                {
                    model: Client,
                    as: 'buyerCustomer',
                    where: { active: true },
                    include: [
                        {
                            model: Unit,
                            where: { active: true },
                            include: [
                                { model: Address, where: { active: true } },
                                { model: Contact, where: { active: true } }
                            ]
                        }
                    ]
                },
                {
                    model: CommissionStatus,
                    as: 'statusCommission',
                    where: { active: true }
                }
            ]
        });
        return res.json(content(purchase));
    }

    async getById(req, res) {
        const purchaseID = await Purchases.findByPk(req.params.id);

        if (!purchaseID) {
            return res.status(404).json({ error: 'Purchase not found!' });
        }

        const purchase = await Purchases.findOne({
            where: { id: req.params.id, active: true },
            include: [
                { model: Product, as: 'products', where: { active: true } },
                {
                    model: PaymentStatus,
                    as: 'paymentStatus',
                    where: { active: true }
                },
                { model: Seller, as: 'sellers', where: { active: true } },
                {
                    model: PaymentMethods,
                    as: 'paymentMethod',
                    where: { active: true }
                },
                {
                    model: Client,
                    as: 'buyerCustomer',
                    where: { active: true }
                },
                {
                    model: CommissionStatus,
                    as: 'statusCommission',
                    where: { active: true }
                }
            ]
        });

        return res.status(200).json(content(purchase));
    }

    async getPurchaseByClient(req, res) {
        const clientID = await Purchases.findAll({
            where: { client: req.params.id },
            include: [
                { model: Product, as: 'products', where: { active: true } },
                {
                    model: PaymentStatus,
                    as: 'paymentStatus',
                    where: { active: true }
                },
                { model: Seller, as: 'sellers', where: { active: true } },
                {
                    model: PaymentMethods,
                    as: 'paymentMethod',
                    where: { active: true }
                },
                {
                    model: Client,
                    as: 'buyerCustomer',
                    where: { active: true }
                },
                {
                    model: CommissionStatus,
                    as: 'statusCommission',
                    where: { active: true }
                }
            ]
        });

        if (!clientID) {
            return res
                .status(404)
                .json({ error: 'No purchases by this customer were found!' });
        }

        return res.status(200).json(content(clientID));
    }

    async update(req, res) {
        const purchase = await Purchases.findByPk(req.params.id);

        if (!purchase) {
            return res.status(404).json({ error: 'Purchase not found!' });
        }

        const { product, status_payment, seller } = req.body;

        const productID = await Product.findOne({
            where: { id: product, active: true }
        });

        if (!productID) {
            return res.status(400).json({ error: 'Product does not exists!' });
        }

        const statusPaymentID = await PaymentStatus.findOne({
            where: { id: status_payment, active: true }
        });

        if (!statusPaymentID) {
            return res
                .status(400)
                .json({ error: 'Payment status does not exists!' });
        }

        const sellerID = await Seller.findOne({
            where: { id: seller, active: true }
        });

        if (!sellerID) {
            return res.status(400).json({ error: 'Seller does not exists!' });
        }

        return res.json(await purchase.update(req.body));
    }

    async delete(req, res) {
        const purchase = await Purchases.findOne({
            where: { id: req.params.id, active: true }
        });

        if (!purchase)
            return res
                .status(400)
                .json({ error: 'This purchase does not exists!' });

        await purchase.update({ active: false });

        return res
            .status(200)
            .json({ message: 'Purchase successfully deleted!' });
    }

    async insertDataPurchases(req, res) {
        try {
            const data = req.body;

            let transaction = await sequelize.transaction();

            if (data.status_commissionVendedor === 'PAGO') {
                data.status_commissionVendedor = 1;
            }
            if (data.status_commissionVendedor === 'ATRASADO') {
                data.status_commissionVendedor = 2;
            }
            if (data.status_commissionVendedor === 'PENDENTE') {
                data.status_commissionVendedor = 3;
            }
            if (data.status_commissionVendedor === 'DESISTENTE') {
                data.status_commissionVendedor = 4;
            }

            if (data.payment_status === 'PAGO') {
                data.payment_status = 1;
            }
            if (data.payment_status === 'ATRASADO') {
                data.payment_status = 2;
            }
            if (data.payment_status === 'PENDENTE') {
                data.payment_status = 3;
            }
            if (data.payment_status === 'DESISTENTE') {
                data.payment_status = 4;
            }

            let addressClient;
            if (data.address) {
                data.address.cep = data.address.cep.toString().replace('.', '');
                data.address.cep = data.address.cep.toString().replace('-', '');

                const objAddressClient = {
                    name: data.address.street,
                    number: Number(data.address.number),
                    district: data.address.clienteBairro,
                    cep: data.address.cep,
                    uf: data.address.uf,
                    city: data.address.city
                };

                addressClient = await Address.create(objAddressClient, {
                    transaction
                });
            }

            let contactClient;
            if (data.contact) {
                const objContactClient = {
                    email: data.contact.email,
                    phone: data.contact.phone
                };

                contactClient = await Contact.create(objContactClient, {
                    transaction
                });
            }

            const objNewUnitClient = {
                federative_level: data.federative,
                address: addressClient.id,
                contact: contactClient.id,
                company: 1
            };

            const newUnitClient = await Unit.create(objNewUnitClient, {
                transaction
            });

            let idCliente;
            let objResponsibleClient = {
                name_cabinet: data.name_cabinet,
                cnpj: data.cnpj,
                email: data.email,
                unit: newUnitClient.id
            };

            idCliente = await Client.create(objResponsibleClient, {
                transaction
            });

            let passwordEncrypted;
            if (idCliente.id) {
                passwordEncrypted = await bcrypt.hash('123456', 8);
            }

            const newUser = {
                email: objResponsibleClient.email,
                password_hash: passwordEncrypted,
                physical_person: null,
                company: 1,
                unit: idCliente.unit,
                role: 1
            };

            let idUserCreated = await User.create(newUser, {
                transaction
            });

            if (data.menus) {
                await Promise.all(
                    data.menus.map(async element => {
                        if (
                            element.children.permission_read ||
                            element.children.permission_write ||
                            element.children.permission_delete
                        ) {
                            let user_menu = {
                                menu: element.id,
                                user: idUserCreated.id,
                                permission_read:
                                    element.children.permission_read,
                                permission_write:
                                    element.children.permission_write,
                                permission_delete:
                                    element.children.permission_delete
                            };
                            await UserMenu.create(user_menu, { transaction });
                        }
                    })
                );
            }

            let objResponsibleSeller = {
                name: data.name,
                cpf_vendedor: data.cpf_vendedor,
                commission: data.comission
            };

            let idSeller = await Seller.create(objResponsibleSeller, {
                transaction
            });

            let objResponsiblePurchases = {
                product: data.product,
                status_payment: data.payment_status,
                seller: idSeller.id,
                payment_method: data.type.id,
                client: idCliente.id,
                status_commission: data.status_commissionVendedor
            };

            const idPurchases = await Purchases.create(
                objResponsiblePurchases,
                {
                    transaction
                }
            );

            sendEmailClient(data.email, idUserCreated.id, res);

            await transaction.commit();
            return res.status(200).json(content(idPurchases));
        } catch (error) {
            await transaction.rollback();
        }
    }

    async purchasesUpdate(req, res) {
        const client = await Client.findOne({ where: { id: req.params.id } });

        if (!client) {
            return res.status(404).json({ error: 'Client not found!' });
        }

        const unitToUpdate = await Unit.findOne({ where: { id: client.unit } });

        try {
            const data = req.body;

            let transaction = await sequelize.transaction();

            if (data.status_commissionVendedor === 'PAGO') {
                data.status_commissionVendedor = 1;
            }
            if (data.status_commissionVendedor === 'ATRASADO') {
                data.status_commissionVendedor = 2;
            }
            if (data.status_commissionVendedor === 'PENDENTE') {
                data.status_commissionVendedor = 3;
            }
            if (data.status_commissionVendedor === 'DESISTENTE') {
                data.status_commissionVendedor = 4;
            }

            if (data.payment_status === 'PAGO') {
                data.payment_status = 1;
            }
            if (data.payment_status === 'ATRASADO') {
                data.payment_status = 2;
            }
            if (data.payment_status === 'PENDENTE') {
                data.payment_status = 3;
            }
            if (data.payment_status === 'DESISTENTE') {
                data.payment_status = 4;
            }

            if (data.address) {
                data.address.cep = data.address.cep.toString().replace('.', '');
                data.address.cep = data.address.cep.toString().replace('-', '');

                const objAddressClient = {
                    name: data.address.street,
                    number: Number(data.address.number),
                    district: data.address.clienteBairro,
                    cep: data.address.cep,
                    uf: data.address.uf,
                    city: data.address.city
                };

                await Address.update(
                    objAddressClient,
                    {
                        where: {
                            id: unitToUpdate.address
                        }
                    },
                    {
                        transaction
                    }
                );
            }

            if (data.contact) {
                const objContactClient = {
                    email: data.contact.email,
                    phone: data.contact.phone
                };

                await Contact.update(
                    objContactClient,
                    { where: { id: unitToUpdate.contact } },
                    {
                        transaction
                    }
                );
            }

            const objUnitClientToUpdate = {
                federative_level: data.federative,
                address: unitToUpdate.address,
                contact: unitToUpdate.contact,
                company: 1
            };

            await Unit.update(
                objUnitClientToUpdate,
                {
                    where: {
                        id: client.unit
                    }
                },
                {
                    transaction
                }
            );

            let objResponsibleClientToUpdate = {
                name_cabinet: data.name_cabinet,
                cnpj: data.cnpj,
                email: data.email,
                unit: unitToUpdate.id,
                description: data.description
            };

            await Client.update(
                objResponsibleClientToUpdate,
                {
                    where: {
                        id: client.id
                    }
                },
                {
                    transaction
                }
            );

            const userToUpdate = await User.findOne({
                where: { unit: unitToUpdate.id }
            });

            const objUserToUpdate = {
                email: objResponsibleClientToUpdate.email
            };

            await User.update(
                objUserToUpdate,
                {
                    where: {
                        id: userToUpdate.id
                    }
                },
                {
                    transaction
                }
            );

            const purchaseToUpdate = await Purchases.findOne({
                where: { client: req.params.id }
            });

            let objResponsibleSellerToUpdate = {
                name: data.name,
                cpf_vendedor: data.cpf_vendedor,
                commission: data.comission
            };

            await Seller.update(
                objResponsibleSellerToUpdate,
                { where: { id: purchaseToUpdate.seller } },
                {
                    transaction
                }
            );

            const product = await Product.findOne({
                where: { id: purchaseToUpdate.product }
            });

            if (data.product.due_date) {
                let productToUpdate = {
                    due_date: data.product.due_date
                };

                await Product.update(
                    productToUpdate,
                    { where: { id: product.id } },
                    {
                        transaction
                    }
                );
            }

            let objResponsiblePurchasesToUpdate = {
                product: data.product.id,
                status_payment: data.payment_status,
                seller: purchaseToUpdate.seller,
                payment_method: data.type.id,
                client: req.params.id,
                status_commission: data.status_commissionVendedor
            };

            let idPurchases = await Purchases.update(
                objResponsiblePurchasesToUpdate,
                {
                    where: {
                        id: purchaseToUpdate.id
                    }
                },

                {
                    transaction
                }
            );

            await transaction.commit();
            return res.status(200).json(content(idPurchases));
        } catch (error) {
            await transaction.rollback();
        }
    }

    async updatePasswordClient(req, res) {
        let authSecret = 'redefinicaoSenha';
        let { token, currentPassword, newPassword } = req.body;

        const currentPasswordToDecrypt = CryptoJS.AES.decrypt(
            currentPassword,
            'password'
        );
        const currentPasswordDecrypted = currentPasswordToDecrypt.toString(
            CryptoJS.enc.Utf8
        );

        const newPasswordToDecrypt = CryptoJS.AES.decrypt(
            newPassword,
            'password'
        );
        const newPasswordDecrypted = newPasswordToDecrypt.toString(
            CryptoJS.enc.Utf8
        );

        try {
            let transaction = await sequelize.transaction();
            let tokenOppened = jwt.verify(token, authSecret);

            if (!tokenOppened) {
                return res.status(404).json({ error: 'Token is invalid!' });
            }

            let user = await User.findOne({
                where: {
                    id: tokenOppened.id
                }
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found!' });
            }

            if (!(await user.checkPassword(currentPasswordDecrypted)))
                return res
                    .status(401)
                    .json({ error: 'Password does not match' });

            const newPasswordHash = await bcrypt.hash(newPasswordDecrypted, 8);

            let obj = {
                password_hash: newPasswordHash
            };

            let passwordUpdated = await User.update(obj, {
                where: {
                    id: tokenOppened.id
                },
                transaction
            });
            transaction.commit();

            return res.json(
                content('Senha atualizada com sucesso', passwordUpdated)
            );
        } catch (err) {
            transaction.rollback();
        }
    }
}

export default new PurchasesController();
