const axios = require("axios");

class Api {

    static SERVER_URL = "http://85.143.78.60:3000"
    static STATUS_OK = 0
    static STATUS_SUCCESSFUL_REGISTRATION = 11
    static STATUS_SUCCESSFUL_AUTHORIZATION = 12
    static STATUS_QUERY_PARAMS_NOT_GIVEN = 1
    static STATUS_USER_NOT_FOUND = 2
    static STATUS_SERVER_ERROR = 10


    // Authorize method
    static async authorizeUser({chat_id, access_token}) {
        const response = await axios.get(Api.getAuthorizationUrl({chat_id, access_token}))
        console.log("Class: Api\nMethod: 'authorizeUser'\nResponse:", response)
        return response.data
    }


    static getAuthorizationUrl({chat_id, access_token}) {
        return `${Api.SERVER_URL}/users/authorize?chat_id=${chat_id}&access_token=${access_token}`
    }

    static getRegistrationURL({chat_id}) {
        return `https://oauth.tpu.ru/authorize?client_id=23&redirect_uri=${Api.SERVER_URL}/users/register&response_type=code&state=${chat_id}`
    }


}

module.exports = Api