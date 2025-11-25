import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  group_type: 'community' | 'mosque_official' | 'study_circle' | 'private';
  unread_count?: number;
  last_message?: string;
  last_message_at?: string;
}

export const useUserGroups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }

    loadUserGroups();

    // Subscribe to group changes
    const groupsChannel = supabase
      .channel('user-groups-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_groups'
        },
        () => {
          loadUserGroups();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_members',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadUserGroups();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(groupsChannel);
    };
  }, [user]);

  const loadUserGroups = async () => {
    if (!user) return;

    try {
      // Get groups user is a member of
      const { data: memberships, error: membershipsError } = await supabase
        .from('group_members')
        .select('group_id, last_read_at')
        .eq('user_id', user.id);

      if (membershipsError) throw membershipsError;

      if (!memberships || memberships.length === 0) {
        setGroups([]);
        setLoading(false);
        return;
      }

      const groupIds = memberships.map(m => m.group_id);

      // Get group details
      const { data: groupsData, error: groupsError } = await supabase
        .from('chat_groups')
        .select('*')
        .in('id', groupIds)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (groupsError) throw groupsError;

      // Get last messages and unread counts
      const groupsWithMetadata = await Promise.all(
        (groupsData || []).map(async (group) => {
          const membership = memberships.find(m => m.group_id === group.id);
          const lastReadAt = membership?.last_read_at;

          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content, created_at')
            .eq('group_id', group.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get unread count
          let unreadCount = 0;
          if (lastReadAt) {
            const { count } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('group_id', group.id)
              .gt('created_at', lastReadAt);
            unreadCount = count || 0;
          } else {
            const { count } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('group_id', group.id);
            unreadCount = count || 0;
          }

          return {
            ...group,
            last_message: lastMessage?.content,
            last_message_at: lastMessage?.created_at,
            unread_count: unreadCount
          };
        })
      );

      setGroups(groupsWithMetadata);
    } catch (error: any) {
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  return { groups, loading, refetch: loadUserGroups };
};
