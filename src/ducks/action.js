export const INCREMENT = 'INCREMENT';
export const INCREMENT_ASYNC = 'INCREMENT_ASYNC';
export const ACTIVATE_START = 'ACTIVATE_START';
export const ACTIVATE_STOP = 'ACTIVATE_STOP';
export const SET_FACE_LANDMARKS = 'SET_FACE_LANDMARKS';
export const SET_PASS_PHRASE = 'SET_PASS_PHRASE';
export const START_RECORDING = 'START_RECORDING';
export const STOP_RECORDING = 'STOP_RECORDING';
export const FACE_DATA = 'FACE_DATA';
export const SPEECH_DATA = 'SPEECH_DATA';
export const SET_EMAIL = 'SET_EMAIL';
export const CHANGE_EMAIL = 'CHANGE_EMAIL';
export const VERIFY_FACE = 'VERIFY_FACE';
export const VERIFY_SPEECH = 'VERIFY_SPEECH';
export const VERIFY_FACE_REQUEST = 'VERIFY_FACE_REQUEST';
export const VERIFY_FACE_SUCCESS = 'VERIFY_FACE_SUCCESS';
export const VERIFY_SPEECH_REQUEST = 'VERIFY_SPEECH_REQUEST';
export const VERIFY_SPEECH_SUCCESS = 'VERIFY_SPEECH_SUCCESS';
export const START_VERIFYING = 'START_VERIFYING';
export const VERIFYING = 'VERIFYING_REQUEST';
export const FINISH_VERIFYING = 'FINISH_VERIFYING';

export const increment = () => ({
  type: INCREMENT,
})

export const incrementAsync = () => ({
  type: INCREMENT_ASYNC
})

export const activateStart = () => ({
  type: ACTIVATE_START
})

export const activateStop = () => ({
  type: ACTIVATE_STOP
})

export const setFaceLandmarks = (data) => ({
  type: SET_FACE_LANDMARKS,
  payload: data
})

export const setPassPhrase = (phrase) => ({
  type: SET_PASS_PHRASE,
  payload: phrase
})

export const startRecording = () => ({
  type: START_RECORDING
})

export const stopRecording = () => ({
  type: STOP_RECORDING
})

export const faceData = (data) => ({
  type: FACE_DATA,
  data
})

export const speechData = (data) => ({
  type: SPEECH_DATA,
  data
})

export const startVerifying = () => ({
  type: START_VERIFYING,
})

export const finishVerifying = () => ({
  type: FINISH_VERIFYING,
})
