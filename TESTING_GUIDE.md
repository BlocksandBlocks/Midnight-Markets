# Testing Guide - Midnight Lace Wallet Connection

## 🧪 How to Test the Wallet Integration

### Prerequisites
1. **Install Midnight Lace Wallet**
   - Go to [Chrome Web Store](https://chromewebstore.google.com/search/midnight%20lace)
   - Search for "Midnight Lace" and install the browser extension
   - Set up your wallet account

2. **Start the Development Server**
   ```bash
   npm run dev
   ```
   - Open [http://localhost:3000](http://localhost:3000)

### Test Scenarios

#### ✅ Scenario 1: Wallet Installed & Working
**Expected Behavior:**
- App auto-detects Midnight Lace wallet
- Shows "Connect Wallet" button with midnight theme
- Clicking connects successfully
- Displays wallet address and network status
- Connection persists on page refresh

**How to Test:**
1. Install Midnight Lace wallet extension
2. Create/unlock wallet account
3. Refresh the app page
4. Click "Connect Wallet"
5. Approve connection in wallet popup
6. Verify connection success

#### ⚠️ Scenario 2: Wallet Not Installed
**Expected Behavior:**
- Shows "Midnight Lace Wallet Required" message
- Displays install button
- Clicking install opens Chrome Web Store search for Midnight Lace
- Auto-detection polls every 3 seconds

**How to Test:**
1. Disable or uninstall Midnight Lace extension
2. Refresh the app page
3. Verify warning message appears
4. Click "Install" button
5. Install wallet and return to app
6. Watch auto-detection pick up the wallet

#### ❌ Scenario 3: Connection Errors
**Expected Behavior:**
- Shows connection error with retry button
- Error message explains the issue
- Retry button attempts reconnection

**How to Test:**
1. Connect wallet successfully
2. Disconnect/lock wallet from extension
3. Try to interact with the app
4. Verify error handling displays
5. Unlock wallet and click "Retry"

#### 🔄 Scenario 4: Wallet State Updates
**Expected Behavior:**
- Network status updates correctly
- Address changes reflect immediately
- Disconnection clears all state

**How to Test:**
1. Connect wallet
2. Change accounts in wallet extension
3. Verify address updates in app
4. Disconnect from wallet extension
5. Verify app shows disconnected state

### Debug Information

#### Check Browser Console
The wallet integration logs detailed information:

```javascript
// Look for these console messages:
"Midnight Lace wallet detected, API version: X.X.X"
"Connecting to Midnight Lace wallet..."
"Service configuration: {...}"
"Wallet state: {...}"
"Successfully connected to Midnight Lace wallet"
```

#### Wallet Detection
Check if wallet is properly detected:
```javascript
// Open browser console and run:
console.log(window.midnight?.mnLace)
// Should return the wallet API object if installed
```

#### Network Information
The app connects to:
- **Network:** midnight-testnet
- **Service Config:** Retrieved from wallet API
- **API Version:** Logged in console

### Common Issues & Solutions

#### Issue: "Midnight Lace wallet not detected"
**Solution:**
- Ensure wallet extension is installed and enabled
- Refresh the page after installation
- Check browser extension permissions

#### Issue: "Failed to connect to Midnight Lace wallet"
**Solution:** 
- Unlock the wallet extension
- Try connecting from a fresh incognito window
- Check wallet extension is up to date

#### Issue: Connection works but state not updating
**Solution:**
- Check browser console for errors
- Verify wallet permissions in extension
- Try disconnecting and reconnecting

#### Issue: "API version incompatible"
**Solution:**
- Update Midnight Lace wallet extension
- Check if wallet API has breaking changes
- Review API version requirements in code

### Development Testing

For development without the actual wallet:

1. **Mock Wallet Detection**
   ```javascript
   // Add to browser console to simulate wallet presence:
   window.midnight = {
     mnLace: {
       apiVersion: "1.0.0",
       enable: () => Promise.resolve(mockAPI),
       isEnabled: () => Promise.resolve(false),
       serviceUriConfig: () => Promise.resolve(mockConfig)
     }
   }
   ```

2. **Error Testing**
   - Comment out wallet detection code temporarily
   - Test error states and recovery flows
   - Verify user experience without wallet

### Performance Notes

- Auto-detection polls every 3 seconds (configurable)
- Connection state persists in browser storage
- Service config cached after first connection
- Wallet state updates in real-time

### Hydration & SSR

The scaffold now includes proper hydration handling:

- **Loading States:** Components show "Loading..." during hydration
- **Client-Only Detection:** Wallet detection only runs on client-side
- **Consistent Rendering:** Server and client render identical initial HTML
- **No Hydration Errors:** Proper Next.js SSR compatibility

#### Testing Hydration
1. Disable JavaScript in browser
2. Load the page - should show static content
3. Re-enable JavaScript 
4. Page should hydrate smoothly without errors
5. Check browser console for hydration warnings

### Performance & UX Notes

- **Initial Load:** Shows "Loading..." for ~100ms during hydration
- **Wallet Detection:** Polls every 3 seconds for wallet installation
- **Auto-Connect:** Attempts to reconnect if previously connected
- **Error Recovery:** Retry buttons for failed connections
- **Network Awareness:** Displays current network (midnight-testnet)

### Bridge-DApp Implementation

**✅ FIXED WITH BRIDGE-DAPP PATTERNS:** The scaffold now uses the exact same architecture as the midnight-bridge/bridge-dapp:

**Service Layer:**
- ✅ `WalletService` class with proper polling and listeners
- ✅ Separate connection and state management
- ✅ Event-driven architecture with onConnectionChange/onStateChange
- ✅ Auto-detection with polling fallback

**Store Pattern:**
- ✅ `useWalletStore` with service integration
- ✅ `useWalletConnection()` helper hook (same as bridge-dapp)
- ✅ Proper error handling with ErrorState interface
- ✅ No hydration issues with client-side detection

**Console Output (Working):**
```
Midnight Lace wallet detected during polling, API version: 1.0.0
Attempting to connect to wallet...
API Version: 1.0.0
Wallet enabled: true
Wallet enabled successfully
Service URIs: {...}
Wallet state: {...}
Successfully connected to wallet: {...}
```

### Testing the Working Implementation

1. **Open Developer Console** - You should see proper detection logs
2. **No Hydration Errors** - Console should be clean of React hydration warnings
3. **Wallet Detection** - "Connect Wallet" button appears for detected wallets
4. **Connection Flow** - Clicking shows wallet popup, then connected state
5. **State Updates** - Address and network display immediately
6. **Polling Works** - Wallet detection updates every 2 seconds

### Success Criteria

✅ **No hydration errors in console**  
✅ **Wallet is properly detected with service layer**  
✅ **Connection flow works smoothly**  
✅ **Error states are handled gracefully**  
✅ **UI updates reflect wallet state**  
✅ **Network status displays correctly**  
✅ **Service configuration is retrieved**  
✅ **SSR compatibility maintained**  
✅ **Bridge-dapp patterns implemented**  
✅ **Event-driven architecture working**  

---

**Need Help?** Check the browser console for wallet detection logs. You should see "Midnight Lace wallet detected" if your wallet is installed. The implementation now follows the exact same patterns as the bridge-dapp example.