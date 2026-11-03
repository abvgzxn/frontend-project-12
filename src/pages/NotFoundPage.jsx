import { Link } from 'react-router';

const NotFoundPage = () => {
  return (
    <div>
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link to="/">На главную</Link>
    </div>
  );
};

export default NotFoundPage;