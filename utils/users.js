const users = [];

//join user to chat

function userJoin(id, username, room) {


    const user = { id, username, room }

    // pushing the user details into user Array 
    users.push(user)
    return user;
}


//function to get the new user
function getCurrentUser(id) {

    // finding the user with the id if it exists in the user array 
    return users.find(user => user.id === id)
}

// funciton for userleave

function userLeave(id) {

    // if  the user exists then find user return it otherwise it returns -1
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        // splice will remove the user at that index
        return users.splice(index, 1)[0]
    }
}

//Get total user in the room 
function getRoomUsers(room) {
    return users.filter(user => user.room === room)
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers }