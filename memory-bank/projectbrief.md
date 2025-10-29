# Project Brief: Save Up

## Project Overview
A mobile financial management app designed to help users combat impulse buying by visualizing purchases in terms of work hours and investment opportunity costs.

## Core Requirements

### Technical Stack
- **Frontend**: React Native with Expo + TypeScript (strict mode)
- **Backend**: Supabase
- **Authentication**: 
  - Email/password authentication
  - Google OAuth integration

### User Experience
The app must provide a clear, simple interface that helps users make informed purchasing decisions by translating monetary costs into tangible metrics (work hours and investment returns).

### Core Features

#### 1. Authentication System
- Traditional email/password sign up and login
- Google OAuth integration
- Secure session management via Supabase

#### 2. User Profile Management
- Store user's salary information (monthly/annual)
- Calculate hourly wage automatically
- Manage user preferences and settings

#### 3. Three Main Sections
- **Home Tab**: Dashboard/overview
- **Spending Tab**: Impulse buy calculator and decision tool
- **Profile Tab**: User settings and salary management

#### 4. Impulse Buy Calculator (Core Feature)
**Input**: Item cost (simple number input)

**Calculations**:
- Work hours required to afford the item
- Potential investment returns if money is saved instead

**Decision Actions**:
- "Buy" - User decides to purchase
- "Don't Buy" - User decides against purchase
- "Let Me Think" - User defers decision

## Project Goals
1. Help users develop mindful spending habits
2. Visualize the true cost of purchases beyond just price tags
3. Encourage savings and investment thinking
4. Provide quick, frictionless decision-making tools
5. Create a clean, intuitive mobile experience

## Success Criteria
- Users can easily sign up and configure their salary
- Calculator provides instant, accurate work hour conversions
- Investment calculations are clear and compelling
- Decision tracking helps users see their progress
- App is responsive and works smoothly on iOS and Android

## Target Platform
- iOS and Android via React Native/Expo
- Mobile-first design
- Offline-capable where possible

## Non-Requirements (Out of Scope - For Now)
- Actual bank account integration
- Automatic expense tracking
- Budget categories
- Recurring payment tracking
- Social features or sharing
- Advanced investment portfolio management

## Future Considerations
- Purchase history tracking
- Savings goals
- Statistical insights (purchases avoided, money saved)
- Notifications/reminders for deferred decisions
- Multiple income source support
