import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../Store/userSlice';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import Dashboard from '../Pages/Dashboard';

// Mock heavy children to keep the test focused on routing logic
jest.mock('../components/Todo/TodoList', () => () => <div>TodoList</div>);
jest.mock('../components/User/Avatar', () => () => <div>Avatar</div>);
jest.mock('../Services/api', () => ({
  logoutUser: jest.fn(),
}));

const renderWithProviders = (preloadedUserState) => {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState: { user: preloadedUserState },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('Dashboard', () => {
  it('redirects to /login when no user is in store', async () => {
    renderWithProviders({ user: null, token: null, userId: null, picture: null });
    // After effect runs, we should be on the login route
    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });

  it('stays on dashboard when user exists', async () => {
    renderWithProviders({ user: 'john@example.com', token: 't', userId: 'u', picture: null });
    // The mocked children should render on dashboard
    expect(screen.getByText('Avatar')).toBeInTheDocument();
    expect(screen.getByText('TodoList')).toBeInTheDocument();
  });
});
