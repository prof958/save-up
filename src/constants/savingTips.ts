/**
 * Saving Tips - Money management advice for Home screen
 * These tips rotate/display randomly to educate and motivate users
 */

export interface SavingTip {
  id: number;
  title: string;
  tip: string;
  emoji: string;
}

export const SAVING_TIPS: SavingTip[] = [
  {
    id: 1,
    title: "The 24-Hour Rule",
    tip: "Wait 24 hours before buying non-essential items. You'll often forget about them!",
    emoji: "⏰"
  },
  {
    id: 2,
    title: "Track Your Spending",
    tip: "Keep a record of every purchase for a month. You'll be surprised where your money goes.",
    emoji: "📊"
  },
  {
    id: 3,
    title: "Automate Your Savings",
    tip: "Set up automatic transfers to savings right after payday. Pay yourself first!",
    emoji: "🤖"
  },
  {
    id: 4,
    title: "Use the 50/30/20 Rule",
    tip: "Allocate 50% to needs, 30% to wants, and 20% to savings and debt repayment.",
    emoji: "📈"
  },
  {
    id: 5,
    title: "Avoid Impulse Buying",
    tip: "Make a shopping list and stick to it. Don't shop when you're emotional or hungry.",
    emoji: "🛒"
  },
  {
    id: 6,
    title: "Compare Prices",
    tip: "Before buying, check at least 2-3 stores or websites. Small savings add up!",
    emoji: "🔍"
  },
  {
    id: 7,
    title: "Buy Quality, Not Quantity",
    tip: "Sometimes spending more on quality saves money long-term through durability.",
    emoji: "✨"
  },
  {
    id: 8,
    title: "Cook at Home",
    tip: "Eating out costs 3-5x more than cooking. Meal prep on weekends to save time and money.",
    emoji: "🍳"
  },
  {
    id: 9,
    title: "Unsubscribe from Temptation",
    tip: "Unsubscribe from marketing emails and disable shopping app notifications.",
    emoji: "📧"
  },
  {
    id: 10,
    title: "The Work Hours Test",
    tip: "Ask yourself: Is this item worth X hours of my work? That's what this app helps with!",
    emoji: "💼"
  },
  {
    id: 11,
    title: "Set Clear Goals",
    tip: "Having a specific savings goal (vacation, emergency fund) makes it easier to say no.",
    emoji: "🎯"
  },
  {
    id: 12,
    title: "Challenge Yourself",
    tip: "Try a 'no-spend' week where you only buy essentials. Make it a game!",
    emoji: "🏆"
  },
  {
    id: 13,
    title: "Sell What You Don't Use",
    tip: "Turn unused items into cash. If you haven't used it in 6 months, consider selling.",
    emoji: "💰"
  },
  {
    id: 14,
    title: "Beware of Sales",
    tip: "A sale isn't savings if you wouldn't have bought it at full price.",
    emoji: "⚠️"
  },
  {
    id: 15,
    title: "Use Cash for Discretionary Spending",
    tip: "Physical cash makes spending feel more real than swiping a card.",
    emoji: "💵"
  },
  {
    id: 16,
    title: "Review Subscriptions",
    tip: "Cancel subscriptions you rarely use. They quietly drain $10-50+ monthly.",
    emoji: "📱"
  },
  {
    id: 17,
    title: "Wait for Major Purchases",
    tip: "For items over $100, wait at least a week. Research and compare options.",
    emoji: "🤔"
  },
  {
    id: 18,
    title: "Calculate Per-Use Cost",
    tip: "Divide an item's cost by expected uses. $200 for 100 uses = $2 per use.",
    emoji: "🧮"
  },
  {
    id: 19,
    title: "Think in Investments",
    tip: "Every dollar saved and invested grows over time. Your future self will thank you!",
    emoji: "📈"
  },
  {
    id: 20,
    title: "Celebrate Small Wins",
    tip: "Acknowledge every good decision. You're building better financial habits!",
    emoji: "🎉"
  }
];

/**
 * Get a random saving tip
 */
export const getRandomTip = (): SavingTip => {
  const randomIndex = Math.floor(Math.random() * SAVING_TIPS.length);
  return SAVING_TIPS[randomIndex];
};

/**
 * Get tip by ID
 */
export const getTipById = (id: number): SavingTip | undefined => {
  return SAVING_TIPS.find(tip => tip.id === id);
};
