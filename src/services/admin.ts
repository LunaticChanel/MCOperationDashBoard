import { createClient } from '@/utils/supabase/client';
import { Profile, UserRole } from '@/context/AuthContext';

const supabase = createClient();

// 1. Fetch pending users (Admin only)
export async function getPendingUsers(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_approved', false)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data as Profile[];
}

// 2. Fetch approved staff members
export async function getApprovedStaff(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_approved', true)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }
  return data as Profile[];
}

// 3. Approve a pending user and assign a role
export async function approveUser(userId: string, role: UserRole): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      is_approved: true,
      role: role,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as Profile;
}

// 4. Update an existing user's role or approval status
export async function updateUserProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as Profile;
}
