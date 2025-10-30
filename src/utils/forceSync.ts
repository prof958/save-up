/**
 * Force sync utility - Use this to sync existing AsyncStorage data to Supabase
 * This is useful after database updates or when stats are out of sync
 */

import { loadDecisions, syncStatsToSupabase } from './decisionStorage';

/**
 * Force sync all local decisions to Supabase
 * Call this function once to populate the database with existing stats
 */
export const forceSyncToSupabase = async (): Promise<{
  success: boolean;
  decisionsCount: number;
  error?: string;
}> => {
  try {
    console.log('Starting force sync to Supabase...');
    
    // Load all decisions from AsyncStorage
    const decisions = await loadDecisions();
    console.log(`Found ${decisions.length} decisions in AsyncStorage`);
    
    if (decisions.length === 0) {
      console.log('No decisions to sync');
      return {
        success: true,
        decisionsCount: 0,
      };
    }
    
    // Force sync to Supabase
    await syncStatsToSupabase(decisions);
    console.log('Successfully synced stats to Supabase');
    
    return {
      success: true,
      decisionsCount: decisions.length,
    };
  } catch (error) {
    console.error('Error in force sync:', error);
    return {
      success: false,
      decisionsCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Debug: Print current local and remote stats
 */
export const debugStats = async () => {
  try {
    const { loadDecisions, calculateStats } = await import('./decisionStorage');
    const { supabase } = await import('../config/supabase');
    
    // Get local stats
    const decisions = await loadDecisions();
    const localStats = calculateStats(decisions);
    
    console.log('=== LOCAL STATS (AsyncStorage) ===');
    console.log('Total Decisions:', localStats.totalDecisions);
    console.log('Money Saved:', localStats.totalMoneySaved);
    console.log('Hours Saved:', localStats.totalHoursSaved);
    console.log('Buy:', localStats.buyCount);
    console.log('Don\'t Buy:', localStats.dontBuyCount);
    console.log('Save:', localStats.saveCount);
    console.log('Let Me Think:', localStats.letMeThinkCount);
    
    // Get remote stats
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('total_money_saved, total_hours_saved, total_decisions, buy_count, dont_buy_count, save_count, let_me_think_count')
        .eq('user_id', user.id)
        .single();
      
      console.log('\n=== REMOTE STATS (Supabase) ===');
      if (profile) {
        console.log('Total Decisions:', profile.total_decisions);
        console.log('Money Saved:', profile.total_money_saved);
        console.log('Hours Saved:', profile.total_hours_saved);
        console.log('Buy:', profile.buy_count);
        console.log('Don\'t Buy:', profile.dont_buy_count);
        console.log('Save:', profile.save_count);
        console.log('Let Me Think:', profile.let_me_think_count);
      } else {
        console.log('No profile found');
      }
    }
  } catch (error) {
    console.error('Error in debugStats:', error);
  }
};
