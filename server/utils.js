import * as crypto from "crypto";

const generateCodes = () => {
  const base64URLEncode = (str) => {
    return str
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  };
  const verifier = base64URLEncode(crypto.randomBytes(32));

  const sha256 = (buffer) => {
    return crypto.createHash("sha256").update(buffer).digest();
  };
  const challenge = base64URLEncode(sha256(verifier));

  return {
    codeVerifier: verifier,
    codeChallenge: challenge
  };
};

const getBasicAuthorizationHeader = (clientId, clientSecret) => {
  return (
    "Basic " +
    Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
  );
};

const formatHistoricalSyncEvents = (item, userKlaviyoId) => {
  return {
    data: {
      type: "event",
      attributes: {
        properties: {
          ...item.attributes.event_properties
        },
        time: item.attributes.datetime,
        metric: {
          data: {
            type: "metric",
            attributes: {
              name: "Fired Kiln"
            }
          }
        },
        profile: {
          data: {
            type: "profile",
            id: userKlaviyoId,
            attributes: {
              properties: {
                historicalBackfill: true
              }
            }
          }
        }
      }
    }
  };
};

const formatNewFiringEvent = (formattedProperties, email) => {
  return {
    data: {
      type: "event",
      attributes: {
        time: formattedProperties.firing_schedule.date_start,
        properties: formattedProperties,
        metric: {
          data: {
            type: "metric",
            attributes: {
              name: "Fired Kiln"
            }
          }
        },
        profile: {
          data: {
            type: "profile",
            attributes: {
              email
            }
          }
        }
      }
    }
  };
};

export {
  generateCodes,
  getBasicAuthorizationHeader,
  formatHistoricalSyncEvents,
  formatNewFiringEvent
};
