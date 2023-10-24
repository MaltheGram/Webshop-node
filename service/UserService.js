import model from "models.js"

class UserService {


    constructor() {
    }
     static create = (params) => {
        model.User.create(params)
    }

}


export default UserService


