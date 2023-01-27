const company = require('./company')
const person = require('./person')
const address = require('./address')
const users = require('./users')
let expression = true


module.exports = function (app) {
    app.get('/users', (req, res) => {
        /*  #swagger.tags = ['User']
        #swagger.description = 'Endpoint to get the specific user.' */
        // #swagger.parameters['id'] = { description: 'ID  User.' }
        res.setHeader('Content-Type', 'application/json')
        const dataId = users.getUser(req.params.id)
        const dataObj = users.getUser(req.query.obj)


        if (expression)
            return res.status(200).send(true)
        return res.status(404).send(false)
    });
    app.get('/users/:id', (req, res) => {
        /*  #swagger.tags = ['User']
        #swagger.description = 'Endpoint to get the specific user.' */
        // #swagger.parameters['id'] = { description: 'ID  User.' }
        res.setHeader('Content-Type', 'application/json')
        const dataId = users.getUser(req.params.id)
        const dataObj = users.getUser(req.query.obj)


        if (expression)
            return res.status(200).send(true)
        return res.status(404).send(false)
    });

    app.post('/users', (req, res) => {
        res.setHeader('Content-Type', 'application/xml')
        /*  #swagger.tags = ['User']
          #swagger.description = 'Endpoint to add a user.' */

        /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'User information.',
                required: true,
                schema: { $ref: "#/definitions/AddUser" }
        } */
        const data = users.addUser(req.query.obj)

        if (expression)
            return res.status(201).send(data)
        return res.status(500)
    });

    /* NOTE: Completing informations automaticaly obtaineds */
    app.put('/users/:id', (req, res) => {
        res.setHeader('Content-Type', 'application/xml')
        /*  #swagger.tags = ['User']
            #swagger.description = 'Endpoint to updated user.' */

        /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Changing User information.',
                required: true,
                schema: { $ref: "#/definitions/UpdatedUser" }
        } */
        const data = users.addUser(req.body)

        if (expression) {
            // #swagger.responses[201] = { description: 'User changed successfully.' }
            return res.status(201).send(data)
        }
        return res.status(500)
    });

    /* NOTE: Function with callback referencied */
    app.delete('/users/:id', (req, res) => {
        /*  #swagger.tags = ['User']
            #swagger.description = 'User successfully deleted.' */
        // #swagger.parameters['id'] = { description: 'ID  User.' }
    });

    app.get('/addresses', (req, res) => {
        /*  #swagger.tags = ['Address']
        #swagger.description = 'Endpoint to get the specific address.' */
        // #swagger.parameters['id'] = { description: 'ID  Address.' }
        res.setHeader('Content-Type', 'application/json')
        const dataId = address.getAddress(req.params.id)
        const dataObj = address.getAddress(req.query.obj)


        if (expression)
            return res.status(200).send(true)
        return res.status(404).send(false)
    });
    app.get('/addresses/:id', (req, res) => {
        /*  #swagger.tags = ['Address']
        #swagger.description = 'Endpoint to get the specific address.' */
        // #swagger.parameters['id'] = { description: 'ID  Address.' }
        res.setHeader('Content-Type', 'application/json')
        const dataId = address.getAddress(req.params.id)
        const dataObj = address.getAddress(req.query.obj)


        if (expression)
            return res.status(200).send(true)
        return res.status(404).send(false)
    });

    app.post('/addresses', (req, res) => {
        res.setHeader('Content-Type', 'application/xml')
        /*  #swagger.tags = ['Address']
          #swagger.description = 'Endpoint to add a address.' */

        /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Address information.',
                required: true,
                schema: { $ref: "#/definitions/Address" }
        } */
        const data = address.addAdress(req.query.obj)

        if (expression)
            return res.status(201).send(data)
        return res.status(500)
    });

    /* NOTE: Completing informations automaticaly obtaineds */
    app.put('/addresses/:id', (req, res) => {
        res.setHeader('Content-Type', 'application/xml')
        /*  #swagger.tags = ['Address']
            #swagger.description = 'Endpoint to updated address.' */

        /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Changing Address information.',
                required: true,
                schema: { $ref: "#/definitions/UpdatedAddress" }
        } */
        const data = address.addAdress(req.body)

        if (expression) {
            // #swagger.responses[201] = { description: 'Address changed successfully.' }
            return res.status(201).send(data)
        }
        return res.status(500)
    });

    /* NOTE: Function with callback referencied */
    app.delete('/addresses/:id', (req, res) => {
        /*  #swagger.tags = ['Address']
            #swagger.description = 'Address successfully deleted.' */
        // #swagger.parameters['id'] = { description: 'ID  Address.' }
    });

    app.get('/people', (req, res) => {
        /*#swagger.tags = ['Person'] */
        res.setHeader('Content-Type', 'application/json')
        const dataId = person.getPerson(req.params.id)
        const dataObj = person.getPerson(req.query.obj)

        if (expression)
            return res.status(200).send(true)
        return res.status(404).send(false)
    });

    app.get('/people/:id', (req, res) => {
        /*  #swagger.tags = ['Person']
            #swagger.description = 'Endpoint to get the specific person.' */
        // #swagger.parameters['id'] = { description: 'ID  Person.' }
        res.setHeader('Content-Type', 'application/json')
        const data = person.getPerson(req.params.id)

        if (expression) {
            /* #swagger.responses[200] = {
                schema: { "$ref": "#/definitions/Person" },
                description: "Person registered successfully." } */
            return res.status(200).send(data)
        }
        return res.status(404).send(false)    // #swagger.responses[404]
    });


    app.post('/people', (req, res) => {
        res.setHeader('Content-Type', 'application/xml')
        /*  #swagger.tags = ['Person']
            #swagger.description = 'Endpoint to add a person.' */

        /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Person information.',
                required: true,
                schema: { $ref: "#/definitions/AddPerson" }
        } */
        const data = person.addPerson(req.body)

        if (expression) {
            // #swagger.responses[201] = { description: 'Person registered successfully.' }
            return res.status(201).send(data)
        }
        return res.status(500)
    });
    /* NOTE: Completing informations automaticaly obtaineds */
    app.put('/people/:id', (req, res) => {
        res.setHeader('Content-Type', 'application/xml')
        /*  #swagger.tags = ['Person']
            #swagger.description = 'Endpoint to updated person.' */

        /*  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Changing Person information.',
                required: true,
                schema: { $ref: "#/definitions/UpdatedPerson" }
        } */
        const data = person.addPerson(req.body)

        if (expression) {
            // #swagger.responses[201] = { description: 'Person registered successfully.' }
            return res.status(201).send(data)
        }
        return res.status(500)
    });

    /* NOTE: Function with callback referencied */
    app.delete('/people/:id', (req, res) => {
        /*  #swagger.tags = ['Person']
            #swagger.description = 'Person successfully deleted.' */
        // #swagger.parameters['id'] = { description: 'ID  Person.' }
    });


    app.get('/companies', (req, res) => {
        /*  #swagger.tags = ['Company']
            #swagger.description = 'Endpoint to get the specific company.' */
        // #swagger.parameters['id'] = { description: 'ID  Person.' }
        res.setHeader('Content-Type', 'application/json')
        const data = company.getCompany(req.params.id)

        if (expression) {
            /* #swagger.responses[200] = {
                schema: { "$ref": "#/definitions/Company" },
                description: "Company registered successfully." } */
            return res.status(200).send(data)
        }
        return res.status(404).send(false)    // #swagger.responses[404]
    });
    app.get('/companies/:id', (req, res) => {
        /*  #swagger.tags = ['Company']
            #swagger.description = 'Endpoint to get the specific company.' */
        // #swagger.parameters['id'] = { description: 'ID  Person.' }
        res.setHeader('Content-Type', 'application/json')
        const data = company.getCompany(req.params.id)

        if (expression) {
            /* #swagger.responses[200] = {
                schema: { "$ref": "#/definitions/Company" },
                description: "Company registered successfully." } */
            return res.status(200).send(data)
        }
        return res.status(404).send(false)    // #swagger.responses[404]
    });

    /* NOTE: Completing informations automaticaly obtaineds */
    app.post('/companies', (req, res) => {
        res.setHeader('Content-Type', 'application/xml')
        /*  #swagger.tags = ['Company']
            #swagger.description = 'Endpoint to add a company.' */

        /*  #swagger.parameters['obj'] = {



        } */
        const data = company.addCompany(req.body)

        if (expression) {
            // #swagger.responses[201] = { description: 'Company registered successfully.' }
            return res.status(201).send(data)
        }
        return res.status(500)
    });
    /* NOTE: Completing informations automaticaly obtaineds */
    app.put('/companies/:id', (req, res) => {
        res.setHeader('Content-Type', 'application/xml')
        /*  #swagger.tags = ['Company']
            #swagger.description = 'Endpoint to updated company.' */

        /*  #swagger.parameters['obj'] = {


        } */
        const data = company.addCompany(req.body)

        if (expression) {
            // #swagger.responses[201] = { description: 'Company registered successfully.' }
            return res.status(201).send(data)
        }
        return res.status(500)
    });

    /* NOTE: Function with callback referencied */
    app.delete('/companies/:id', (req, res) => {
        /*  #swagger.tags = ['Company']
            #swagger.description = 'Company successfully deleted.' */
        // #swagger.parameters['id'] = { description: 'ID  Company.' }
    });

}

function myFunction(req, res) {

    const dataId = person.getPerson(req.params.id)

    if (expression)
        return res.status(200).send(true)
    return res.status(404).send(false)
}
