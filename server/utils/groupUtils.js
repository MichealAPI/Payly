import User from "../models/User.js";

function fetchMemberNames(memberIds) {
    return User.find({ _id: { $in: memberIds } }).then(users => {
        console.log('Fetched member names:', users);
        return users.map(user => user.email);
    });
}

export default fetchMemberNames;