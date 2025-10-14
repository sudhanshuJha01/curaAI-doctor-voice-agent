"use client";
import { UserProfile, useUser } from '@clerk/nextjs';
import { User, Heart, Activity, FileText, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalConsultations: 0,
    lastConsultation: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await axios.get('/api/session-chat?sessionId=all');
        setStats({
          totalConsultations: result.data.length,
          lastConsultation: result.data[0]?.createdOn || null,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                My Profile
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your account and view consultation statistics
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-pink-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Consultations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalConsultations}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-pink-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user?.publicMetadata?.plan === 'pro' ? 'Pro' : 'Free'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-pink-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Consultation</p>
                <p className="text-lg font-bold text-gray-900">
                  {loading ? '...' : stats.lastConsultation 
                    ? new Date(stats.lastConsultation).toLocaleDateString()
                    : 'None'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden">
          <UserProfile 
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none border-0',
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;