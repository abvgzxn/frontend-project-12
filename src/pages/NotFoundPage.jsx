import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>404</h1>
      <p>{t('notFound.title')}</p>
      <Link to="/">{t('notFound.main')}</Link>
    </div>
  );
};

export default NotFoundPage;