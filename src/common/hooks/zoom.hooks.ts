/* eslint-disable @typescript-eslint/no-var-requires */
const requestPromise = require('request-promise');
const jwt = require('jsonwebtoken');
const KJUR = require('jsrsasign');

const payload = {
  iss: process.env.ZOOM_API_KEY, //your API KEY
  exp: new Date().getTime() + 5000,
};

const token = jwt.sign(payload, process.env.ZOOM_API_SECRET);

export const scheduleZoomMeeting = async () => {
  const options = {
    method: 'POST',
    uri: 'https://api.zoom.us/v2/users/me/meetings',
    body: {
      topic: 'Zoom Meeting Using Node JS', //meeting title
      type: 2,
      start_time: '2022-11-03 06:45:02.044',
      pre_schedule: true,
      duration: 30,
      settings: {
        host_video: 'true',
        participant_video: 'true',
      },
    },
    auth: {
      bearer: token,
    },
    headers: {
      'User-Agent': 'Zoom-api-Jwt-Request',
      'content-type': 'application/json',
    },
    json: true, //Parse the JSON string in the response
  };

  try {
    const req = await requestPromise(options);
    console.log(req);
    return req;
  } catch (error) {
    return error;
  }
};

export const getZoomSignature = async (meetingNumber: string) => {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const oHeader = { alg: 'HS256', typ: 'JWT' };

  const oPayload = {
    sdkKey: process.env.ZOOM_SDK_KEY,
    mn: meetingNumber,
    role: 0,
    iat: iat,
    exp: exp,
    appKey: process.env.ZOOM_SDK_KEY,
    tokenExp: iat + 60 * 60 * 2,
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const signature = KJUR.jws.JWS.sign(
    'HS256',
    sHeader,
    sPayload,
    process.env.ZOOM_SDK_SECRET,
  );
  return signature;
};
