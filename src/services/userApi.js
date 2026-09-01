import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Fetch all users.
 * @returns {Promise<Array>}
 */
export const fetchUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

/**
 * Fetch posts for a specific user.
 * @param {number} id - User ID
 * @returns {Promise<Array>}
 */
export const fetchUserPosts = async (id) => {
  const { data } = await api.get(`/posts?userId=${id}`);
  return data;
};

/**
 * Create a new user.
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
export const createUser = async (userData) => {
  const { data } = await api.post('/users', userData);
  return data;
};

/**
 * Update an existing user.
 * @param {number} id
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
export const updateUser = async (id, userData) => {
  const { data } = await api.put(`/users/${id}`, userData);
  return data;
};

/**
 * Delete a user.
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const deleteUser = async (id) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};
