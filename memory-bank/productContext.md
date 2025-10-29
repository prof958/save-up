# Product Context: Save Up

## Why This Exists

### The Problem
People struggle with impulse buying. When we see a $100 item, we think about the price tag, not about what that $100 really means to us personally. This disconnect between money and the work required to earn it leads to:
- Regretful purchases
- Difficulty saving money
- Stress over finances
- Lost investment opportunities

### The Solution
Save Up bridges the gap between money and meaning by translating purchases into two powerful perspectives:
1. **Work Hours**: "This costs 8 hours of your work time"
2. **Investment Value**: "If you invest this instead, it could be worth $X in the future"

These translations make the cost visceral and personal, giving users a moment to pause and reflect before making impulse purchases.

## How It Should Work

### User Journey

#### First Time User
1. Opens app → sees welcome/authentication screen
2. Signs up via email or Google OAuth
3. Enters salary information (monthly or annual)
4. App automatically calculates hourly wage
5. Arrives at Home tab ready to use

#### Regular Usage Flow
1. **Home Tab** - User sees their progress
   - Stats cards showing money saved, hours saved
   - Active "Let Me Think" items with countdown timers
   - Money-saving tips and motivation
   
2. **Considering a Purchase** - User sees something they want to buy
   - Opens app → navigates to Spending tab
   - Enters the item's cost (and optional name)
   - Taps "Calculate"
   - Sees modal showing:
     - Work hours equivalent
     - Investment opportunity cost
     - Four clear action buttons
   
3. **Makes decision**:
   - **Buy**: Acknowledges the cost, proceeds with purchase (tracked as "bought")
   - **Don't Buy**: Decides against it, feels good about saving (tracked as "saved")
   - **Save**: Commits to saving this money (tracked as "saved")
   - **Let Me Think**: Sets a reminder timer, gives time to consider (tracked until decision made)

4. **Tracking & Motivation**
   - Decisions tracked in database
   - Home screen shows cumulative savings
   - "Let Me Think" items appear on Home with countdown
   - Tips encourage good habits

### User Experience Goals

#### Simplicity First
- Minimal friction between thought and calculation
- Single input field (price)
- Instant results
- Clear, non-judgmental presentation

#### Empowerment, Not Guilt
- The app doesn't tell users what to do
- It provides perspective, not judgment
- Users stay in control of decisions
- Positive reinforcement for mindful choices

#### Speed Matters
- Calculator must be fast
- No complicated forms
- Mobile-optimized for on-the-go use
- Works in the moment of decision

#### Visual Clarity
- Large, readable numbers
- Clear hierarchy of information
- Obvious action buttons
- Clean, distraction-free interface

## Core User Flows

### Authentication Flow
```
Launch → Login/Signup Screen
         ├─ Email/Password → Account Creation → Salary Setup
         └─ Google OAuth → Account Creation → Salary Setup
```

### Main Navigation
```
App Home
├─ Home Tab (Dashboard - Default)
│   ├─ Stats Cards (Money Saved, Hours Saved)
│   ├─ "Let Me Think" Timers (Active reminders)
│   └─ Saving Tips (Motivation & education)
├─ Spending Tab (Calculator)
│   ├─ Price Input (with optional item name)
│   ├─ Calculate Button
│   └─ Results Modal (Work Hours + Investment + Decisions)
└─ Profile Tab (Settings/Salary)
    ├─ User Info Display
    ├─ Edit Salary/Currency/Region
    └─ Logout
```

### Calculator Flow
```
Spending Tab → Enter Price (+ optional name) → Calculate →
Results Modal:
  - Work Hours: "X hours of work"
  - Investment Value: "Worth $Y in 10 years"
  - Actions: [Buy] [Don't Buy] [Save] [Let Me Think]
  
If "Let Me Think" selected:
  → Set Reminder Time → Save to Database →
  → Appears on Home Tab with countdown timer
```

### Home Dashboard Flow
```
Home Tab (on app open or tab switch):
  → Fetch user decisions from database
  → Calculate totals (saved money, saved hours)
  → Display Stats Cards
  → Query active "Let Me Think" items
  → Display timer cards with countdown
  → Show random/rotating saving tip
```

## Key Product Principles

1. **Instant Clarity**: Users should understand their options within 2 seconds of seeing results
2. **Non-Prescriptive**: We inform, never lecture
3. **Personal Context**: All calculations are based on individual salary
4. **Mobile-First**: Designed for real-world, in-store decisions
5. **Minimal Input**: Ask for as little as possible from users
6. **Respectful**: Honor user autonomy and decision-making

## Emotional Journey
- **Before**: "I want this thing, should I buy it?"
- **During**: "Oh, this costs 6 hours of my work... and if I invested it..."
- **After Decision**: "I made a thoughtful choice based on what matters to me"

## What Success Looks Like
- User opens app when considering a purchase
- Takes 10-15 seconds to get clarity
- Makes a more informed decision
- Feels empowered, not restricted
- Returns to app regularly because it's genuinely helpful
