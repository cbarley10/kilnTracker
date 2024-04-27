import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import bodyParser from "body-parser";

import {
  generateCodes,
  getBasicAuthorizationHeader,
  formatHistoricalSyncEvents,
  formatNewFiringEvent
} from "./utils.js";

import {
  makeApiCallWithRefresh,
  revokeAPIAccess,
  klaviyoFetchUserIdFromEmail,
  klaviyoFetchProfileTimeline,
  klaviyoSendEvent
} from "./apis.js";

import {
  KLAVIYO_AUTHORIZATION_URL,
  KLAVIYO_REVOKE_URL,
  KLAVIYO_TOKEN_URL,
  WEB_APP_URL,
  FIRED_KILN_METRIC,
  PORT
} from "./constants.js";

const app = express();

dotenv.config();
app.use(cors());
app.use(bodyParser.json());

const clientId = process.env.KL_CLIENT_ID;
const clientSecret = process.env.KL_CLIENT_SECRET;
const redirectUri = `http://localhost:${PORT}/oauth/klaviyo/callback`;
const scope =
  "accounts:read events:read events:write profiles:read profiles:write metrics:read metrics:write";

const customerId = "1234";
const pkceDataStore = {};
const tokenDataStore = {};

app.get("/oauth/klaviyo/authorize", (req, res) => {
  const { codeVerifier, codeChallenge } = generateCodes();

  pkceDataStore[customerId] = codeVerifier;

  const authUrl =
    `${KLAVIYO_AUTHORIZATION_URL}?response_type=code&client_id=${clientId}` +
    `&redirect_uri=${redirectUri}&scope=${scope}&code_challenge_method=S256` +
    `&code_challenge=${codeChallenge}&state=${customerId}`;

  res.redirect(authUrl);
});

app.get("/oauth/klaviyo/callback", async (req, res) => {
  const authorizationCode = req.query.code;
  const codeVerifier = pkceDataStore[customerId];

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", authorizationCode);
    params.append("code_verifier", codeVerifier);
    params.append("redirect_uri", redirectUri);
    const response = await axios.post(KLAVIYO_TOKEN_URL, params, {
      headers: {
        Authorization: getBasicAuthorizationHeader(clientId, clientSecret)
      }
    });
    tokenDataStore[customerId] = response.data;
    await makeApiCallWithRefresh(
      clientId,
      clientSecret,
      tokenDataStore,
      customerId
    );

    const stringifiedJSON = JSON.stringify(tokenDataStore[customerId]);
    const queryParam = encodeURIComponent(btoa(stringifiedJSON));
    res.redirect(`${WEB_APP_URL}/integrations?kl_token=${queryParam}`);
  } catch (error) {
    console.error(error);
    res.send("Error exchanging code for token.");
  }
});

app.get("/oauth/klaviyo/remove", async (req, res) => {
  try {
    const token = req.query.token;
    const response = await revokeAPIAccess(
      KLAVIYO_REVOKE_URL,
      token,
      clientId,
      clientSecret
    );
    if (response.data.success) {
      res.redirect(`${WEB_APP_URL}/integrations?success=true`);
    }
  } catch (e) {
    console.log("error removing integration");
    res.redirect(`${WEB_APP_URL}/integrations?success=false`);
  }
});

app.post("/historical-sync", async (req, res) => {
  try {
    const email = req.body.email;
    const profile = await klaviyoFetchUserIdFromEmail(
      email,
      tokenDataStore,
      customerId,
      clientId,
      clientSecret
    );
    const userKlaviyoId = profile.data[0].id;
    const profileTimeline = await klaviyoFetchProfileTimeline(
      userKlaviyoId,
      tokenDataStore,
      customerId,
      clientId,
      clientSecret
    );

    const firedKilnMetricsOnly = profileTimeline.data.filter(
      (event) => event.relationships.metric.data.id === FIRED_KILN_METRIC
    );
    const formattedEvents = firedKilnMetricsOnly.map((item) =>
      formatHistoricalSyncEvents(item, userKlaviyoId)
    );

    console.log(`Processing ${formattedEvents.length} items`);
    let successes = 0;
    let failures = 0;
    const promises = formattedEvents.map(async (item) => {
      const klResponse = await klaviyoSendEvent(
        item,
        tokenDataStore,
        customerId,
        clientId,
        clientSecret
      );
      if (klResponse.status === 202) {
        successes += 1;
      } else {
        failures += 1;
      }
      return klResponse;
    });
    const klEventsResults = await Promise.all(promises);
    console.log("Results: ", klEventsResults);
    console.log("Failures: ", failures);
    console.log("Successes: ", successes);
    console.log(`Done!`);
    res.status(200).send({ successes, failures });
  } catch (e) {
    console.log(e);
    res.redirect(WEB_APP_URL);
  }
});

app.post("/new-entry", async (req, res) => {
  try {
    const { properties, email } = req.body;
    const formattedProperties = {
      type: properties.type,
      percent_full: properties.percentFull,
      artist_notes: properties.notes,
      title: properties.title,
      firing_schedule: {
        preset: properties.firingSchedulePreset,
        preset_name: properties.firingSchedulePresetName,
        date_start: properties.dateStart,
        date_end: properties.dateStart,
        total_elapsed_time: properties.totalTime,
        cone_level: properties.coneLevel
      }
    };

    const formattedEvent = formatNewFiringEvent(
      formattedProperties,
      email
    );

    const klResponse = await klaviyoSendEvent(
      formattedEvent,
      tokenDataStore,
      customerId,
      clientId,
      clientSecret
    );

    res.status(200).send(klResponse);
  } catch (e) {
    console.log(e);
    res.redirect(WEB_APP_URL);
  }
});

app.get("/recent-firings", async (req, res) => {
  try {
    const email = req.query.e;
    const profile = await klaviyoFetchUserIdFromEmail(
      email,
      tokenDataStore,
      customerId,
      clientId,
      clientSecret
    );
    const userKlaviyoId = profile.data[0].id;
    const profileTimeline = await klaviyoFetchProfileTimeline(
      userKlaviyoId,
      tokenDataStore,
      customerId,
      clientId,
      clientSecret
    );

    const formattedFiringEvents = profileTimeline.data.map((firing) => {
      const { type, percent_full, artist_notes, title, firing_schedule } =
        firing.attributes.event_properties;
      return {
        coneLevel: firing_schedule.cone_level,
        dateStart: firing_schedule.date_start,
        firingSchedulePreset: firing_schedule.preset,
        firingSchedulePresetName: firing_schedule.preset_name,
        notes: artist_notes,
        percentFull: percent_full,
        title: title,
        totalTime: firing_schedule.total_elapsed_time,
        type: type
      };
    });

    res.status(200).send(formattedFiringEvents);
  } catch (e) {
    console.log(e);
    res.send([]);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
