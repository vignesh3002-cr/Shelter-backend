import axios from "axios";

async function getAccessToken() {
    try {

        const response = await axios.post(
            process.env.D365_TOKEN_URL,
            new URLSearchParams({
                client_id: process.env.D365_CLIENT_ID,
                client_secret: process.env.D365_CLIENT_SECRET,
                grant_type: "client_credentials",
                scope: process.env.D365_SCOPE
            }),
            {
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                }
            }
        );

        return response.data.access_token;

    } catch (error) {
        console.log(error.response?.data || error.message);
        throw error;
    }
}

async function getProjects() {

    const token = await getAccessToken();

    const response = await axios.get(
        process.env.PROJECT_API_URL,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json"
            }
        }
    );

    return response.data.value;
}
async function getLoginUser(UserID, password) {
    const token = await getAccessToken();
    const response = await axios.post(
        process.env.D365_LOGIN_URL,   
         {
            _request: {
            UserId: UserID,
            Password:password,
            },
        },

        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    );
    return response.data;
}
export { getProjects, getLoginUser };