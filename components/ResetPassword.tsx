import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  // Parse access token from URL fragment or query string
  const parseAccessToken = () => {
    // Check URL fragment first (#access_token=...)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    let token = hashParams.get('access_token');
    
    // Fall back to query string (?access_token=... or ?token=...)
    if (!token) {
      const queryParams = new URLSearchParams(window.location.search);
      token = queryParams.get('access_token') || queryParams.get('token');
    }
    
    return token;
  };

  useEffect(() => {
    const token = parseAccessToken();
    
    if (!token) {
      setStatus('❌ No reset token found. Please use the password reset link from your email.');
      return;
    }

    setAccessToken(token);

    // Set the session using the token so Supabase can recognize the user
    const initSession = async () => {
      try {
        // Extract refresh token if present (usually in fragment as refresh_token=...)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const refreshToken = hashParams.get('refresh_token');

        // Set session with access token (and optional refresh token)
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: refreshToken || token,
        });

        setSessionReady(true);
        setStatus('✓ Ready to reset password');
      } catch (err: any) {
        console.error('Failed to set session:', err);
        setStatus('⚠ Session setup issue: ' + (err.message || 'unknown error'));
      }
    };

    initSession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!password || !confirmPassword) {
      setStatus('❌ Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setStatus('❌ Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('❌ Passwords do not match');
      return;
    }

    setLoading(true);
    setStatus('Updating password...');

    try {
      // Update the authenticated user's password
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw error;
      }

      setStatus('✅ Password reset successfully! Redirecting to login...');
      
      // Sign out the current session and redirect to login
      await supabase.auth.signOut();
      
      // Redirect to admin login after 2 seconds
      setTimeout(() => {
        window.location.hash = '#/srb-admin';
      }, 2000);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setStatus('❌ Failed to reset password: ' + (err.message || 'unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => (window.location.hash = '#/srb-admin')}
            className="flex items-center gap-2 text-brand-blue hover:text-blue-700 mb-6"
          >
            <ArrowLeft size={18} />
            Back to Login
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 mt-2">Enter your new password below</p>
        </div>

        {/* Status Message */}
        {status && (
          <div
            className={`p-4 rounded-lg mb-6 text-sm ${
              status.includes('✅')
                ? 'bg-green-50 text-green-800 border border-green-200'
                : status.includes('❌')
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}
          >
            {status}
          </div>
        )}

        {/* Form */}
        {sessionReady && !status.includes('✅') && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password (min 8 characters)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                disabled={loading}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition mt-6"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* No Token State */}
        {!sessionReady && !status.includes('✓') && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
            <p className="mb-4">Invalid or expired reset link.</p>
            <button
              onClick={() => (window.location.hash = '#/srb-admin')}
              className="text-red-600 hover:text-red-700 font-semibold underline"
            >
              Go back to admin login
            </button>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-600 text-center">
          <p>For security, this link is valid for a limited time.</p>
          <p className="mt-2">After resetting your password, you will be redirected to login.</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
