import { BrowserRouter } from 'react-router-dom';
import Router from './router';
import QueryProvider from '../providers/QueryProvider';

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
