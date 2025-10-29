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
1. User sees something they want to buy
2. Opens app → navigates to Spending tab
3. Enters the item's cost
4. Taps "Calculate"
5. Sees popup showing:
   - Work hours equivalent
   - Investment opportunity cost
   - Three clear action buttons
6. Makes decision:
   - **Buy**: Acknowledges the cost, proceeds with purchase
   - **Don't Buy**: Decides against it, feels good about saving
   - **Let Me Think**: Closes popup, gives time to consider

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
├─ Home Tab (Default)
├─ Spending Tab (Calculator)
└─ Profile Tab (Settings/Salary)
```

### Calculator Flow
```
Spending Tab → Enter Price → Calculate →
Popup Display:
  - Work Hours: "X hours of work"
  - Investment Value: "Worth $Y in Z years"
  - Actions: [Buy] [Don't Buy] [Let Me Think]
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
