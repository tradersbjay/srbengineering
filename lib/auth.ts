import { supabase } from '../lib/supabase';

// Session storage key
const ADMIN_SESSION_KEY = 'srb_admin_session';

// Admin user type
export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Sign in with email and pw_code from admin_users table
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    // Query admin_users table to verify credentials (case-insensitive email match)
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, pw_code, role')
      .ilike('email', email.trim())
      .single();

    if (error || !data) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Check if password matches pw_code
    if (data.pw_code !== password) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Create session object
    const session: AdminUser = {
      id: data.id,
      email: data.email,
      role: data.role || 'admin',
    };

    // Store session in localStorage
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));

    return { success: true, data: session };
  } catch (err: any) {
    console.error('Sign in error:', err);
    return { success: false, error: err.message || 'Sign in failed' };
  }
};

/**
 * Get current admin user from session
 */
export const getAuthUser = async (): Promise<AdminUser | null> => {
  try {
    const sessionStr = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!sessionStr) return null;
    
    const session = JSON.parse(sessionStr) as AdminUser;
    
    // Verify user still exists in database
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, role')
      .eq('id', session.id)
      .single();
    
    if (error || !data) {
      // User no longer exists, clear session
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
    
    return session;
  } catch (err) {
    console.error('Failed to get auth user:', err);
    return null;
  }
};

/**
 * Sign out the current user
 */
export const signOutUser = async () => {
  try {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return { success: true };
  } catch (err: any) {
    console.error('Failed to sign out:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Update admin password (pw_code)
 */
export const updateAdminPassword = async (email: string, currentPassword: string, newPassword: string) => {
  try {
    // First verify current password (case-insensitive email match)
    const { data: admin, error: fetchError } = await supabase
      .from('admin_users')
      .select('id, pw_code')
      .ilike('email', email.trim())
      .single();

    if (fetchError || !admin) {
      return { success: false, error: 'Admin not found' };
    }

    if (admin.pw_code !== currentPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }

    // Update password
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ pw_code: newPassword })
      .eq('id', admin.id);

    if (updateError) {
      return { success: false, error: 'Failed to update password' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Password update error:', err);
    return { success: false, error: err.message || 'Failed to update password' };
  }
};

/**
 * Check if user is authenticated (synchronous check from localStorage)
 */
export const isAuthenticated = (): boolean => {
  try {
    const sessionStr = localStorage.getItem(ADMIN_SESSION_KEY);
    return !!sessionStr;
  } catch {
    return false;
  }
};

/**
 * Get current session (synchronous)
 */
export const getCurrentSession = (): AdminUser | null => {
  try {
    const sessionStr = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!sessionStr) return null;
    return JSON.parse(sessionStr) as AdminUser;
  } catch {
    return null;
  }
};
