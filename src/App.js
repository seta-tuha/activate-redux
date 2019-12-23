import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { incrementAsync, activateStart, activateStop } from './ducks';

function App() {
  const value = useSelector(state => state);
  const [x, setX] = React.useState(0);
  const dispatch = useDispatch()
  const incrementCounter = React.useCallback(
    () => dispatch(incrementAsync()),
    [dispatch]
  );
  const startActivate = React.useCallback(
    () => dispatch(activateStart()),
    [dispatch]
  );
  const stopActivate = React.useCallback(
    () => dispatch(activateStop()),
    [dispatch]
  );

  React.useEffect(() => {
    let af;
    function animation() {
      setX(x => (x + 1) % 200);
      af = requestAnimationFrame(animation);
    };
    af = requestAnimationFrame(animation)
    return () => cancelAnimationFrame(af);
  }, []);

  return (
    <div className="App">
      <div style={{ background: 'tomato', width: x, height: 10 }}></div>
      <span>counter: {value}</span>
      <button onClick={incrementCounter}>count</button>
      <button onClick={startActivate}>Start</button>
      <button onClick={stopActivate}>Stop</button>
    </div>
  );
}

export default App;
