

function addAdress(param) {
    return true
}

function getAddress(param) {
    const address = {
        name: "Rua 05",
        number: 05,
        district: 'Cond. privê',
        complement: 'Casa 10 a',
        cep: 72280.266,
        uf: 'df',
        city: 'Ceilândia'
    }
    return address
}

module.exports = {
    addAdress,
    getAddress,
}
