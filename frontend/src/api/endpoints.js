export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  vehicles: {
    list: '/vehicles',
    search: '/vehicles/search',
    create: '/vehicles',
    update: (id) => `/vehicles/${id}`,
    delete: (id) => `/vehicles/${id}`,
    restock: (id) => `/vehicles/${id}/restock`,
    purchase: (id) => `/vehicles/${id}/purchase`,
  },
};
