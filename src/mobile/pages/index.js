import Home from './home';
import LEAVE_PAGES from './leave';

const ROUTES = [
  { path: 'Home', component: Home },
]
  .concat(LEAVE_PAGES)

export default ROUTES;
