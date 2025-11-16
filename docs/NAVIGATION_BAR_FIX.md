# Navigation Bar Fix for Android

## Problem
The app wasn't respecting the Android navigation bar (the bottom system UI with back/home/recent buttons). Content was being hidden behind the navigation bar because edge-to-edge mode was enabled without proper safe area handling.

## Root Cause
- `app.json` had `"edgeToEdgeEnabled": true` for Android
- App wasn't using `SafeAreaProvider` to handle system UI insets
- Tab bar wasn't accounting for the navigation bar height
- Content could appear behind the system navigation bar

## Solution Implemented

### 1. Wrapped App with SafeAreaProvider
**File**: `App.tsx`

Added `SafeAreaProvider` to wrap the entire app:

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ProfileProvider>
          {/* ... */}
        </ProfileProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
```

### 2. Updated Tab Navigator to Use Safe Area Insets
**File**: `src/navigation/AppNavigator.tsx`

Modified the tab bar to dynamically adjust for the navigation bar:

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          paddingBottom: insets.bottom > 0 ? insets.bottom : 15,
          paddingTop: 10,
          height: (insets.bottom > 0 ? insets.bottom : 15) + 65,
          // ...
        },
      }}
    >
      {/* ... */}
    </Tab.Navigator>
  );
};
```

**Before**: Fixed 15px padding (content hidden behind nav bar)
**After**: Dynamic padding based on actual navigation bar height

### 3. Fixed TypeScript Error
**File**: `src/screens/SpendingScreen.tsx`

Added missing `notification_id` field to decision object:

```tsx
await saveDecision({
  // ... other fields
  notification_id: null,
});
```

## How It Works

1. **SafeAreaProvider**: Measures the actual system UI insets (status bar, navigation bar, notches, etc.)
2. **useSafeAreaInsets()**: Hook that returns the current inset values:
   - `insets.top` - Status bar height
   - `insets.bottom` - Navigation bar height (or home indicator on gesture navigation)
   - `insets.left` - Left safe area
   - `insets.right` - Right safe area
3. **Dynamic Padding**: Tab bar adjusts its height and padding based on actual navigation bar size

## Benefits

✅ Content no longer hidden behind navigation bar
✅ Works with gesture navigation and button navigation
✅ Handles different Android devices (Pixel, Samsung, etc.)
✅ Respects system UI changes (when user switches navigation mode)
✅ Maintains proper spacing on iOS too

## Testing

Test on devices with:
- Three-button navigation (traditional Android nav bar)
- Gesture navigation (swipe from bottom)
- Different screen sizes and aspect ratios
- Tablets with navigation bars

Expected behavior:
- Tab bar buttons should be fully visible and tappable
- No content should be hidden behind system UI
- Proper spacing around all system UI elements

## Additional Notes

- The package `react-native-safe-area-context` was already installed (~5.6.0)
- `edgeToEdgeEnabled: true` remains in app.json (correct for modern Android)
- Individual screens can also use `useSafeAreaInsets()` if needed for custom layouts
- ScrollViews and FlatLists automatically handle content insets within safe area
