const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
        version: '1.0.0',
        title: 'API ma-governance',
        description: 'Documentation automatically generated by the <b>swagger-autogen</b> module.'
    },
    host: 'localhost:8000',
    basePath: '/',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            'name': 'Person',
            'name': 'PhysicalPerson',
            'name': 'Company',
            'name': 'Adress',
            'name': 'User',
            'description': 'Endpoints'
        }
    ],
    securityDefinitions: {
        api_key: {
            type: 'apiKey',
            name: 'api_key',
            in: 'header'
        },
        petstore_auth: {
            type: 'oauth2',
            authorizationUrl: 'https://petstore.swagger.io/oauth/authorize',
            flow: 'implicit',
            scopes: {
                read_pets: 'read your pets',
                write_pets: 'modify pets in your account'
            }
        }
    },
    definitions: {
        Person: {
            $name: 'Jonas alves',
            $birth_date: '1990-11-05',
            $address: 1,
        },
        AddPerson: {
            $name: 'Jonas alves',
            $birth_date: '1990-11-05',
            $address: 1,
        },
        UpdatedPerson: {
            $id: 1,
            $name: 'Jonas alves',
            $birth_date: '11/05/90',
            $address: 1,
        },
        PhysicalPerson: {
            $cpf: "000.000.000.00",
            $rg: "0000.200",
            $person: 1,
            company: 2,
        },
        UpdatedPhysicalPerson: {
            $id: 1,
            $cpf: "000.000.000.00",
            $rg: "0000.200",
            $person: 1,
            company: 2,
        },
        Company: {
            person: 2,
            $cpnj: "000.000.000.00",
        },
        UpdatedCompany: {
            $id: 2,
            $person: 2,
            $cpnj: "000.000.000.00",
        },
        Address: {
            name: "Rua 04",
            $number: 04,
            $district: 'Cond. privê',
            $complement: 'Casa 01 c',
            $cep: 72280.266,
            $uf: 'df',
            $city: 'Ceilândia'
        },
        AddAddress: {
            name: "Rua 04",
            $number: 04,
            $district: 'Cond. privê',
            $complement: 'Casa 01 c',
            $cep: 72280.266,
            $uf: 'df',
            $city: 'Ceilândia'
        },
        UpdatedAddress: {
            id: 1,
            $number: 04,
            $district: 'Cond. privê',
            $complement: 'Casa 01 c',
            $cep: 72280.266,
            $uf: 'df',
            $city: 'Ceilândia'
        },
        User: {
            name: 'user',
            $email: 'user@gmail.com',
            $physical_person: 2,
            $password_hash: '0000',
            company: 2,
            active: 1,
        },
        AddUser: {
            name: 'adduser',
            $email: 'adduser@gmail.com',
            $physical_person: 1,
            $password_hash: '78945',
            $company: 2,
            active: 1,
        },
        UpdatedUser: {
            $id: 1,
            name: 'adduser',
            $email: 'adduser@gmail.com',
            $physical_person: 1,
            $password_hash: '78945',
            $company: 2,
            active: 1,
        },
    }
}

const outputFile = './swagger-output.json'
const endpointsFiles = ['./src/swagger/endpoints']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./src/index')           // Your project's root file
})
