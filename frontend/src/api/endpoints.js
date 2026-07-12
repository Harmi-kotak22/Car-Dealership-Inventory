export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  vehicles: {
    list: '/vehicles',
    search: '/vehicles/search',
    purchase: (id) => `/vehicles/${id}/purchase`,
  },
};
