import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../components/auth/AuthProvider';
import { useUser } from '../hooks/useUser';
import { Bell, Lock, Globe, Link, Shield, Loader2 } from 'lucide-react';

const settingsSchema = z.object({
  emailNotifications: z.object({
    marketing: z.boolean(),
    security: z.boolean(),
    updates: z.boolean()
  }),
  pushNotifications: z.object({
    newMessages: z.boolean(),
    reminders: z.boolean(),
    mentions: z.boolean()
  }),
  privacy: z.object({
    profileVisibility: z.enum(['public', 'private', 'contacts']),
    dataSharing: z.boolean()
  }),
  language: z.string(),
  timezone: z.string()
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function Settings() {
  const { user } = useAuth();
  const { profile, isLoading, updateProfile } = useUser(user?.id || '');
  const [activeTab, setActiveTab] = useState('notifications');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting }
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      emailNotifications: {
        marketing: profile?.settings?.emailNotifications?.marketing ?? false,
        security: profile?.settings?.emailNotifications?.security ?? true,
        updates: profile?.settings?.emailNotifications?.updates ?? true
      },
      pushNotifications: {
        newMessages: profile?.settings?.pushNotifications?.newMessages ?? true,
        reminders: profile?.settings?.pushNotifications?.reminders ?? true,
        mentions: profile?.settings?.pushNotifications?.mentions ?? true
      },
      privacy: {
        profileVisibility: profile?.settings?.privacy?.profileVisibility ?? 'public',
        dataSharing: profile?.settings?.privacy?.dataSharing ?? true
      },
      language: profile?.settings?.language ?? 'en',
      timezone: profile?.settings?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  });

  const onSubmit = async (data: SettingsFormData) => {
    try {
      await updateProfile({
        settings: data,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-mono-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-semibold text-mono-900 mb-8">Settings</h1>

          {/* Settings Navigation */}
          <div className="flex space-x-4 border-b border-mono-200 mb-8">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`pb-4 text-sm font-medium ${
                activeTab === 'notifications'
                  ? 'text-mono-900 border-b-2 border-mono-900'
                  : 'text-mono-500 hover:text-mono-700'
              }`}
            >
              <div className="flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </div>
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`pb-4 text-sm font-medium ${
                activeTab === 'privacy'
                  ? 'text-mono-900 border-b-2 border-mono-900'
                  : 'text-mono-500 hover:text-mono-700'
              }`}
            >
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Privacy
              </div>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-4 text-sm font-medium ${
                activeTab === 'security'
                  ? 'text-mono-900 border-b-2 border-mono-900'
                  : 'text-mono-500 hover:text-mono-700'
              }`}
            >
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Security
              </div>
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`pb-4 text-sm font-medium ${
                activeTab === 'preferences'
                  ? 'text-mono-900 border-b-2 border-mono-900'
                  : 'text-mono-500 hover:text-mono-700'
              }`}
            >
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Preferences
              </div>
            </button>
            <button
              onClick={() => setActiveTab('connections')}
              className={`pb-4 text-sm font-medium ${
                activeTab === 'connections'
                  ? 'text-mono-900 border-b-2 border-mono-900'
                  : 'text-mono-500 hover:text-mono-700'
              }`}
            >
              <div className="flex items-center">
                <Link className="w-4 h-4 mr-2" />
                Connected Accounts
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-mono-900 mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-mono-700">Marketing</label>
                        <p className="text-sm text-mono-500">Receive emails about new features and updates</p>
                      </div>
                      <input
                        type="checkbox"
                        {...register('emailNotifications.marketing')}
                        className="h-4 w-4 text-mono-900 focus:ring-mono-500 border-mono-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-mono-700">Security</label>
                        <p className="text-sm text-mono-500">Receive emails about your account security</p>
                      </div>
                      <input
                        type="checkbox"
                        {...register('emailNotifications.security')}
                        className="h-4 w-4 text-mono-900 focus:ring-mono-500 border-mono-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-mono-700">Updates</label>
                        <p className="text-sm text-mono-500">Receive emails about system updates and maintenance</p>
                      </div>
                      <input
                        type="checkbox"
                        {...register('emailNotifications.updates')}
                        className="h-4 w-4 text-mono-900 focus:ring-mono-500 border-mono-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-mono-900 mb-4">Push Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-mono-700">New Messages</label>
                        <p className="text-sm text-mono-500">Get notified when you receive new messages</p>
                      </div>
                      <input
                        type="checkbox"
                        {...register('pushNotifications.newMessages')}
                        className="h-4 w-4 text-mono-900 focus:ring-mono-500 border-mono-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-mono-700">Reminders</label>
                        <p className="text-sm text-mono-500">Get notified about upcoming events and tasks</p>
                      </div>
                      <input
                        type="checkbox"
                        {...register('pushNotifications.reminders')}
                        className="h-4 w-4 text-mono-900 focus:ring-mono-500 border-mono-300 rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-mono-700">Mentions</label>
                        <p className="text-sm text-mono-500">Get notified when you're mentioned in comments</p>
                      </div>
                      <input
                        type="checkbox"
                        {...register('pushNotifications.mentions')}
                        className="h-4 w-4 text-mono-900 focus:ring-mono-500 border-mono-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-mono-900 mb-4">Privacy Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-mono-700 mb-1">
                        Profile Visibility
                      </label>
                      <select
                        {...register('privacy.profileVisibility')}
                        className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="contacts">Contacts Only</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-mono-700">Data Sharing</label>
                        <p className="text-sm text-mono-500">Allow sharing of non-sensitive data for service improvement</p>
                      </div>
                      <input
                        type="checkbox"
                        {...register('privacy.dataSharing')}
                        className="h-4 w-4 text-mono-900 focus:ring-mono-500 border-mono-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Settings */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-mono-900 mb-4">Regional Settings</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-mono-700 mb-1">
                        Language
                      </label>
                      <select
                        {...register('language')}
                        className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-mono-700 mb-1">
                        Timezone
                      </label>
                      <select
                        {...register('timezone')}
                        className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={!isDirty || isSubmitting}
                className="px-6 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}