import { INCREMENT, RECORDED } from "./action";

export default function mainReducer(state = { counter: 0 }, action) {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        counter: state.counter + 1
      }
    case RECORDED:
      return {
        ...state,
        blob: action.payload.blob,
        recording: action.payload.recording
      }
    default:
      return state;
  }
}
