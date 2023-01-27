

/* MODEL USER */
function addUser(param) {
    return true
}

function getUser(param) {
    const user = {
        email: 'myltiano@gmail.com',
        physical_person: 2,
        password_hash: "12345",
        company: 2,
    }
    return user
}


module.exports = {
    addUser,
    getUser
}