import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import TaskList from './components/TaskList';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Provider store={store}>
      <div class = "text-center" >
        <h1>Task Management App</h1>
        <TaskList />
      </div>
    </Provider>
  );
};

export default App;
