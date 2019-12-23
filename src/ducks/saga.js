import { put, takeEvery, all, take, call, fork, cancelled, takeLatest, select, race, delay } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga';

import { Activate, ANY } from "@veritone/activate";
import { Camera } from "@veritone/activate-camera";
import { Faceapi } from "@veritone/activate-face-api.js";
import {
  WebkitSpeechRecognition,
  Modes as SpeechModes
} from "@veritone/activate-webkit-speech-recognition";

import {
  INCREMENT,
  INCREMENT_ASYNC,
  ACTIVATE_STOP,
  ACTIVATE_START,
  START_RECORDING,
  STOP_RECORDING,
  SET_EMAIL,
  CHANGE_EMAIL,
  faceData,
  speechData,
  FACE_DATA,
  SPEECH_DATA,
  startRecording,
  stopRecording,
  VERIFYING,
  startVerifying,
  finishVerifying
} from './action';

const counterSelector = state => state;

function getImageBlob(image) {
  return new Promise(resolve => {
    image.toBlob(blob => resolve(blob));
  })
}

function validateFace(landmarks) {
  return true
}

// Our worker Saga: will perform the async increment task
export function* incrementAsync() {
  yield delay(1000)
  yield put({ type: INCREMENT })
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export function* watchIncrementAsync() {
  yield takeEvery(INCREMENT_ASYNC, incrementAsync)
}

function createActivateChannel(activate) {
  activate.addModule(Camera, {
    fps: 5
  });

  activate.addModule(Faceapi);
  activate.addModule(WebkitSpeechRecognition, {
    mode: SpeechModes.CONTINUOUS
  });

  return eventChannel(emitter => {
    activate.addRule({
      on: "speech",
      do: speechInsight => {
        emitter({ type: "speech", data: speechInsight.getData() });
      }
    });
    activate.addRule({
      on: "face",
      do: res => {
        emitter({
          type: "face",
          data: res.getData().object,
        })
      }
    });
    return () => {
      activate.stop();
    }
  });
}

export function* activateFlow() {
  while (true) {
    yield take(ACTIVATE_START);
    const activate = new Activate();
    const activateChannel = createActivateChannel(activate);
    yield call(activate.start);
    yield fork(activateEvent, activateChannel);
    yield take(ACTIVATE_STOP);
    activate.stop()
  }
}

export function* activateEvent(chan) {
  try {
    while (true) {
      const { type, data } = yield take(chan);
      if (type === 'speech') {
        yield put(speechData(data));
        yield put(stopRecording());
        yield put(startRecording());
      }
      if (type === 'face') {
        yield put(faceData(data));
      }
    }
  } finally {
    if (yield cancelled()) {
      chan.close()
    }
  }
}

export function* verifyFlow() {
  yield takeLatest(VERIFYING, function* verify() {
    const email = yield select(state => state.email);
    yield put(startRecording());
    if (email) {
      yield put(startVerifying());
      const { verifyResults, timeout } = yield race({
        verifyResults: yield call(bulkVerify),
        timeout: delay(15000)
      });
      yield put(finishVerifying(verifyResults));
    }
  })
}

export function* bulkVerify(email) {
  const verifyResults = yield all([
    call(verifyFace, email),
    call(verifyAudio, email),
  ])
  return verifyResults;
}

export function* verifyFace(email) {
  let faceValid, faceBlob;
  while (!faceValid) {
    const { faceLandmarks, snapshot } = yield take(FACE_DATA);
    faceValid = validateFace(faceLandmarks);
    faceBlob = yield call(getImageBlob, snapshot);
  }
  const faceResults = yield call();
  return faceResults;
}

export function* verifyAudio(email) {
  let speechValid;
  while (!speechValid) {
    speechValid = yield take(SPEECH_DATA);
  }
  const speechResults = yield call();
  return speechResults;
}

export function* recorder() {
  const mediaStream = yield call(navigator.mediaDevices.getUserMedia, { audio: true });
  const audioRecorder = new window.MediaRecorder(mediaStream);
  // const audioChannel =
  let chunks = [];
  let blob = null;
  audioRecorder.onstart = () => {
  };

  audioRecorder.onstop = () => {
    blob = new Blob(chunks, { type: "audio/webm; codecs=opus" });
    chunks = [];
  };

  audioRecorder.ondataavailable = e => {
    chunks.push(e.data);
  };
  while (true) {
    yield take(START_RECORDING);
    audioRecorder.start();
    yield take(STOP_RECORDING);
    audioRecorder.stop();
  }
}

export default function* rootSaga() {
  yield all([
    watchIncrementAsync(),
    activateFlow(),
    verifyFlow(),
  ])
}
