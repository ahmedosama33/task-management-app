import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import TaskList from './components/TaskList';

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <h1>Task Management App</h1>
        <TaskList />
      </div>
    </Provider>
  );
};

export default App;
