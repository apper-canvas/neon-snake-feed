import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Game',
    icon: 'Gamepad2',
    component: Home,
    path: '/'
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    icon: 'AlertCircle',
    component: NotFound,
    path: '*'
  }
};

export const routeArray = Object.values(routes);