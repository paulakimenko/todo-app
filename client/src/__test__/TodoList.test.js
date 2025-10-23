import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../Store/userSlice';

// Dynamically mock the API module using absolute path before importing the component
const apiResolved = require.resolve('../components/Todo/../../Services/api.js');
beforeAll(() => {
  jest.doMock(apiResolved, () => ({
    getTodos: jest.fn().mockResolvedValue([
      { _id: '1', task: 'Task 1', completed: false },
      { _id: '2', task: 'Task 2', completed: true },
    ]),
    createTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
    deleteAllTodos: jest.fn().mockResolvedValue({ status: 200 }),
  }));
});

const renderWithStore = (preloadedUserState) => {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState: { user: preloadedUserState },
  });
  // Import the component only after mocks are in place
  const TodoList = require('../components/Todo/TodoList').default;
  return render(
    <Provider store={store}>
      <TodoList />
    </Provider>
  );
};

describe('TodoList', () => {
  it('fetches and displays todos for authenticated user', async () => {
    renderWithStore({
      user: 'john@example.com',
      token: 'test-token',
      userId: 'user-123',
      picture: null,
    });

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });
});
