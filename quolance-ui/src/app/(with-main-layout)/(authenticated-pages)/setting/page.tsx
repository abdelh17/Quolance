import ChangePassword from './components/ChangePassword';
import DeleteAccount from './components/DeleteAccount';
import NotificationSubscription from './components/NotificationSubscription';
import PersonalInfo from './components/PersonalInfo';

export default function SettingPage() {
  return (
    <div className="flex justify-center">
      <div className="divide-y max-w-5xl">
        <div className="px-4 py-4 lg:px-8">
          <h2 className="text-base/7 font-semibold">Account Settings</h2>
          <p className="mt-1 text-sm/6 text-gray-400">
            View and manage your account settings.
          </p>
        </div>
        <PersonalInfo />
        <ChangePassword />
        <NotificationSubscription />
        <DeleteAccount />
      </div>
    </div>
  );
}
