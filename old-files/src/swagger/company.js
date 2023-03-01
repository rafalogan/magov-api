

/* MODEL Person */
function addCompany(param) {
    return true
}

function getCompany(param) {
    const company = {
        person: 2,
        cnpj: "000.000.000.00",
    }
    return company;
}


module.exports = {
    addCompany,
    getCompany
}
