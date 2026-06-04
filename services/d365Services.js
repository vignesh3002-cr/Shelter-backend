import axios from "axios";
console.log("TOKEN URL:",
process.env.D365_TOKEN_URL);

console.log("CLIENT ID:",
process.env.D365_CLIENT_ID);

console.log("SECRET:",
process.env.D365_CLIENT_SECRET);

console.log("SCOPE:",
process.env.D365_SCOPE);
export {

  getProjects,
  getLoginUser,
  getProjectDetails,
  getImageToD365,
  getAccessToken
};
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
     console.log(
    "FIRST PROJECT:",
    response.data.value[0]
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
    

      console.log(
  "LOGIN RESPONSE:",
  response.data
);
    return response.data;
}
async function getProjectDetails(projectId) {

    const token = await getAccessToken();
    const response = await axios.get(
        `${process.env.PROJECT_DETAILS_API_URL}?(dataAreaId='shlt',ProjId='${projectId}') `,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json"
            }
        }
    );
    return response.data.value;
}


export const getProjectReport =

async (projectId, date) => {

  try {

    const token =
      await getAccessToken();

    // ONLY FILTER PROJECT ID IN D365

    const url =
      `https://shlt-dev01185046dcf29ca8dcdevaos.axcloud.dynamics.com/data/ProjectPhysicalCompletionPercentages?$filter=ProjId eq '${projectId}'`;

    console.log("D365 URL:", url);

    const response =
      await axios.get(
        url,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            Accept:
              "application/json"
          }
        }
      );

    // FETCH ALL RECORDS

    let records =
      response.data.value || [];

    console.log(
      "ALL RECORDS:",
      records
    );

    // FILTER DATE IN NODE.JS

    if (date) {

      records = records.filter(
        (item) => {

          if (!item.ProjDate)
            return false;

          // EXAMPLE:
          // 2026-05-22T12:00:00Z

          const itemDate =
            item.ProjDate
              .split("T")[0];

          return itemDate === date;
        }
      );
    }

    console.log(
      "FILTERED RECORDS:",
      records
    );

    return {
      value: records
    };

  } catch (error) {

    console.log(
      "D365 ERROR:",
      error.response?.data ||
      error.message
    );

    throw error;
  }
};
export const createProjectReport =
async (body) => {

  try {

    const token =
      await getAccessToken();

    // REMOVE AUTO GENERATED FIELDS

    delete body["@odata.etag"];

    // D365 REQUIRED VALUES

    const payload = {

      ...body,

      dataAreaId: "shlt"
    };

    console.log(
      "CREATE PAYLOAD:",
      payload
    );

    const response =
      await axios.post(

        "https://shlt-dev01185046dcf29ca8dcdevaos.axcloud.dynamics.com/data/ProjectPhysicalCompletionPercentages",

        payload,

        {
          headers: {

            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json"
          }
        }
      );

    return response.data;

  } catch (error) {

    console.log(
      "CREATE ERROR:",
      error.response?.data ||
      error.message
    );

    throw error;
  }
};
export const getViewTime = async (projectId) => {

  try {

    const token =
      await getAccessToken();

    const response =
      await axios.post(
        process.env.VIEW_TIME_API_URL,
        {
          _request: {
           ProjId: projectId,
        },
        },
        {
          headers: {

            Authorization:
              `Bearer ${token}`,

            Accept:
              "application/json"
          }
        }
      );
      console.log(
        "VIEW TIME RESPONSE:",
        response.data
      );

    return response.data;

  } catch (error) {

    console.log(
      "VIEW TIME ERROR:",
      error.response?.data ||
      error.message
    );

    throw error;
  }
};
export const updateTaskEndDate = async (projectId, wbsId, taskEndDate) => {
  try {

    const token =
      await getAccessToken();
    const response =
      await axios.post(
        process.env.UPDATE_TIME_API_URL,
        {
          _request: {
            ProjId: projectId,
            WBSId: wbsId,
            TaskFinishDate: taskEndDate
          },
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      console.log(
        "UPDATE TIME RESPONSE:",
        response.data
      );

    return response.data;

  } catch (error) {

    console.log(
      "UPDATE TIME ERROR:",
      error.response?.data ||
      error.message
    );

    throw error;
  }
};

async function getImageToD365() {

  const token =
    await getAccessToken();

  const response =
    await axios.get(

      process.env.GET_Image_API_URL,

      {
        headers: {

          Authorization:
            `Bearer ${token}`,

          Accept:
            "application/json"
        }
      }
    );

  return response.data.value;
}
