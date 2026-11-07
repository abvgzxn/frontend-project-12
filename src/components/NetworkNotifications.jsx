import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';

const NetworkNotifications = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleOffline = () => {
      notifications.show({
        title: t('notifications.errorTitle'),
        message: t('notifications.offline'),
        color: 'red',
      });
    };

    const handleOnline = () => {
      notifications.show({
        title: t('notifications.successTitle'),
        message: t('notifications.online'),
        color: 'green',
      });
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [t]);

  return null;
};

export default NetworkNotifications;