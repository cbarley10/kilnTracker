import axios from "axios";

const KLAVIYO_API_URL = "https://a.klaviyo.com/api";
const KLAVIYO_TOKEN_URL = "https://a.klaviyo.com/oauth/token";

const refreshAccessToken = async (
  clientId,
  clientSecret,
  tokenDataStore,
  customerId
) => {
  const tokenData = tokenDataStore[customerId];
  const refreshToken = tokenData.refresh_token;

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refreshToken);
    const response = await axios.post(KLAVIYO_TOKEN_URL, params, {
      headers: {
        Authorization: getBasicAuthorizationHeader(clientId, clientSecret)
      }
    });

    console.log(`<pre>${JSON.stringify(response.data, null, 4)}</pre>`);
    if (response.status === 200) {
      tokenDataStore[customerId] = response.data;
    }
    if (
      response.status === 400 &&
      response.data.error === "invalid_grant"
    ) {
      console.log("error");
    }
  } catch (error) {
    console.error("Error refreshing access token.");
  }
};

const makeApiCallWithRefresh = async (
  clientId,
  clientSecret,
  tokenDataStore,
  customerId
) => {
  const tokenData = tokenDataStore[customerId];
  const accessToken = tokenData.access_token;

  try {
    const response = await axios.get(`${KLAVIYO_API_URL}/profiles`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        revision: "2024-02-15"
      }
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Token is expired, refresh it.
      // Note: You should have a retry mechanism here to prevent an infinite loop

      await refreshAccessToken(
        clientId,
        clientSecret,
        tokenDataStore,
        customerId
      );
      return makeApiCallWithRefresh(
        clientId,
        clientSecret,
        tokenDataStore,
        customerId
      );
    } else {
      console.log(error);
      console.error("Error making API call.");
    }
  }
};

const revokeAPIAccess = async (url, refresh, client_id, client_secret) => {
  try {
    const body = {
      token_type_hint: "refresh_token",
      token: refresh
    };
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`
      }
    });
    return response;
  } catch (e) {
    console.log(e);
  }
};

const klaviyoFetchUserIdFromEmail = async (
  email,
  tokenDataStore,
  customerId,
  clientId,
  clientSecret
) => {
  const tokenData = tokenDataStore[customerId];
  const accessToken = tokenData.access_token;
  const filter = `equals(email,"${email}")`;
  try {
    const url = `${KLAVIYO_API_URL}/profiles?filter=${filter}`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      accept: "application/json",
      revision: "2024-02-15"
    };

    const response = await axios.get(url, {
      headers
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await refreshAccessToken(
        clientId,
        clientSecret,
        tokenDataStore,
        customerId
      );
    }
  }
};

const klaviyoFetchProfileTimeline = async (
  klaviyoProfileId,
  tokenDataStore,
  customerId,
  clientId,
  clientSecret
) => {
  const tokenData = tokenDataStore[customerId];
  const accessToken = tokenData.access_token;
  const filter = `equals(profile_id,"${klaviyoProfileId}")`;
  try {
    const url = `${KLAVIYO_API_URL}/events?filter=${filter}`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      accept: "application/json",
      revision: "2024-02-15"
    };

    const response = await axios.get(url, {
      headers
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await refreshAccessToken(
        clientId,
        clientSecret,
        tokenDataStore,
        customerId
      );
    }
  }
};

const klaviyoSendEvent = async (
  eventData,
  tokenDataStore,
  customerId,
  clientId,
  clientSecret
) => {
  const tokenData = tokenDataStore[customerId];
  const accessToken = tokenData.access_token;
  try {
    const url = `${KLAVIYO_API_URL}/events`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      accept: "application/json",
      revision: "2024-02-15"
    };

    const response = await axios.post(url, eventData, {
      headers
    });

    return {
      data: response.data,
      status: response.status
    };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await refreshAccessToken(
        clientId,
        clientSecret,
        tokenDataStore,
        customerId
      );
    }
  }
};

export {
  refreshAccessToken,
  makeApiCallWithRefresh,
  revokeAPIAccess,
  klaviyoFetchUserIdFromEmail,
  klaviyoFetchProfileTimeline,
  klaviyoSendEvent
};
