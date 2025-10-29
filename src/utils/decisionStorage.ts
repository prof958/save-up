import AsyncStorage from '@react-native-async-storage/async-storage';
import { SpendingDecision, DecisionType } from '../config/supabase';
import { supabase } from '../config/supabase';

const DECISIONS_STORAGE_KEY = '@save_up_decisions';

// Stats interface for calculations
export interface DecisionStats {
  totalMoneySaved: number;
  totalHoursSaved: number;
  totalDecisions: number;
  buyCount: number;
  dontBuyCount: number;
  saveCount: number;
  letMeThinkCount: number;
}

/**
 * Generate a unique ID for a decision
 */
const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Load all decisions from AsyncStorage
 */
export const loadDecisions = async (): Promise<SpendingDecision[]> => {
  try {
    const decisionsJson = await AsyncStorage.getItem(DECISIONS_STORAGE_KEY);
    if (!decisionsJson) return [];
    
    const decisions: SpendingDecision[] = JSON.parse(decisionsJson);
    return decisions;
  } catch (error) {
    console.error('Error loading decisions:', error);
    return [];
  }
};

/**
 * Save a new decision to AsyncStorage
 */
export const saveDecision = async (
  decision: Omit<SpendingDecision, 'id' | 'created_at'>
): Promise<SpendingDecision> => {
  try {
    const decisions = await loadDecisions();
    
    const newDecision: SpendingDecision = {
      ...decision,
      id: generateId(),
      created_at: new Date().toISOString(),
    };
    
    decisions.push(newDecision);
    await AsyncStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify(decisions));
    
    // Sync stats to Supabase in background (don't await)
    syncStatsToSupabase(decisions).catch(err => 
      console.error('Error syncing stats:', err)
    );
    
    return newDecision;
  } catch (error) {
    console.error('Error saving decision:', error);
    throw error;
  }
};

/**
 * Update an existing decision (e.g., removing a "Let Me Think" reminder)
 */
export const updateDecision = async (
  decisionId: string,
  updates: Partial<SpendingDecision>
): Promise<void> => {
  try {
    const decisions = await loadDecisions();
    const index = decisions.findIndex(d => d.id === decisionId);
    
    if (index !== -1) {
      decisions[index] = { ...decisions[index], ...updates };
      await AsyncStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify(decisions));
      
      // Sync stats to Supabase in background
      syncStatsToSupabase(decisions).catch(err => 
        console.error('Error syncing stats:', err)
      );
    }
  } catch (error) {
    console.error('Error updating decision:', error);
    throw error;
  }
};

/**
 * Delete a decision
 */
export const deleteDecision = async (decisionId: string): Promise<void> => {
  try {
    const decisions = await loadDecisions();
    const filtered = decisions.filter(d => d.id !== decisionId);
    await AsyncStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify(filtered));
    
    // Sync stats to Supabase in background
    syncStatsToSupabase(filtered).catch(err => 
      console.error('Error syncing stats:', err)
    );
  } catch (error) {
    console.error('Error deleting decision:', error);
    throw error;
  }
};

/**
 * Get active "Let Me Think" items (reminders not expired)
 */
export const getActiveReminders = async (): Promise<SpendingDecision[]> => {
  try {
    const decisions = await loadDecisions();
    const now = new Date();
    
    return decisions.filter(d => 
      d.decision_type === 'let_me_think' && 
      d.remind_at && 
      new Date(d.remind_at) > now
    );
  } catch (error) {
    console.error('Error getting active reminders:', error);
    return [];
  }
};

/**
 * Calculate aggregate stats from decisions
 */
export const calculateStats = (decisions: SpendingDecision[]): DecisionStats => {
  const stats: DecisionStats = {
    totalMoneySaved: 0,
    totalHoursSaved: 0,
    totalDecisions: decisions.length,
    buyCount: 0,
    dontBuyCount: 0,
    saveCount: 0,
    letMeThinkCount: 0,
  };
  
  decisions.forEach(decision => {
    // Count by type
    switch (decision.decision_type) {
      case 'buy':
        stats.buyCount++;
        break;
      case 'dont_buy':
        stats.dontBuyCount++;
        stats.totalMoneySaved += decision.item_price;
        stats.totalHoursSaved += decision.work_hours;
        break;
      case 'save':
        stats.saveCount++;
        stats.totalMoneySaved += decision.item_price;
        stats.totalHoursSaved += decision.work_hours;
        break;
      case 'let_me_think':
        stats.letMeThinkCount++;
        break;
    }
  });
  
  // Round to 2 decimal places
  stats.totalMoneySaved = Math.round(stats.totalMoneySaved * 100) / 100;
  stats.totalHoursSaved = Math.round(stats.totalHoursSaved * 100) / 100;
  
  return stats;
};

/**
 * Get current stats from all decisions
 */
export const getStats = async (): Promise<DecisionStats> => {
  try {
    const decisions = await loadDecisions();
    return calculateStats(decisions);
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      totalMoneySaved: 0,
      totalHoursSaved: 0,
      totalDecisions: 0,
      buyCount: 0,
      dontBuyCount: 0,
      saveCount: 0,
      letMeThinkCount: 0,
    };
  }
};

/**
 * Sync aggregate stats to Supabase user_profiles table
 */
export const syncStatsToSupabase = async (
  decisions?: SpendingDecision[]
): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    // Load decisions if not provided
    const allDecisions = decisions || await loadDecisions();
    const stats = calculateStats(allDecisions);
    
    // Update user_profiles with aggregate stats
    const { error } = await supabase
      .from('user_profiles')
      .update({
        total_money_saved: stats.totalMoneySaved,
        total_hours_saved: stats.totalHoursSaved,
        total_decisions: stats.totalDecisions,
        buy_count: stats.buyCount,
        dont_buy_count: stats.dontBuyCount,
        save_count: stats.saveCount,
        let_me_think_count: stats.letMeThinkCount,
      })
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error syncing stats to Supabase:', error);
    }
  } catch (error) {
    console.error('Error in syncStatsToSupabase:', error);
  }
};

/**
 * Clear all decisions (useful for testing or reset)
 */
export const clearAllDecisions = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(DECISIONS_STORAGE_KEY);
    
    // Sync empty stats to Supabase
    await syncStatsToSupabase([]);
  } catch (error) {
    console.error('Error clearing decisions:', error);
    throw error;
  }
};
