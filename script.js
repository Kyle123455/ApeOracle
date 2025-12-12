// Simple Holder Tracker (Starts at 0, updates with localStorage)
let holders = 0;

function initHolderTracker() {
    // Start at 0
    holders = 0;
    
    // Try to load from localStorage
    const saved = localStorage.getItem('apor_holders_v2');
    if (saved) {
        holders = parseInt(saved);
    }
    
    // Display initial count
    updateHolderDisplay();
    
    // Check URL for referral (simulating new purchase)
    checkForNewHolder();
    
    // Set up periodic checks
    setInterval(checkForNewHolder, 30000);
    
    // Add click listener to buy button (simulates purchase)
    document.querySelectorAll('.btn-buy, .btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            // When someone clicks buy, increment after delay (simulating purchase)
            setTimeout(() => {
                holders++;
                updateHolderDisplay();
                showPurchaseNotification();
            }, 2000);
        });
    });
}

function checkForNewHolder() {
    // Check URL parameters for new holder
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('newholder')) {
        holders++;
        updateHolderDisplay();
        showNewHolderPopup();
        
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
    }
    
    // Small random chance of new holder (for demo)
    if (Math.random() < 0.05 && holders < 1000) {
        holders++;
        updateHolderDisplay();
    }
}

function updateHolderDisplay() {
    // Save to localStorage
    localStorage.setItem('apor_holders_v2', holders.toString());
    
    // Update display
    const holderElement = document.getElementById('holderCount');
    if (holderElement) {
        holderElement.textContent = holders.toLocaleString();
    }
    
    // Update progress
    const progress = Math.min((holders / 1000) * 100, 100);
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    // Update progress text
    const progressText = document.getElementById('currentProgress');
    if (progressText) {
        progressText.textContent = `${holders} / 1,000 Holders`;
    }
}

function showPurchaseNotification() {
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'purchase-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(90deg, var(--solana-purple), var(--solana-green));
            color: var(--dark);
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 10000;
            animation: slideUp 0.5s ease;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        ">
            <i class="fas fa-shopping-cart"></i>
            <div>
                <div>Purchase detected!</div>
                <small>Holder count updated</small>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function showNewHolderPopup() {
    const popup = document.createElement('div');
    popup.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--dark);
            border: 2px solid var(--solana-green);
            border-radius: 15px;
            padding: 30px;
            z-index: 10001;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            max-width: 400px;
            width: 90%;
        ">
            <div style="font-size: 4rem; margin-bottom: 20px;">🎉</div>
            <h3 style="color: var(--solana-green); margin-bottom: 15px;">New Holder Alert!</h3>
            <p>Welcome to the ApeOracle family! Our community now has <strong>${holders} holders</strong>.</p>
            <p style="font-size: 0.9rem; color: var(--gray); margin-top: 15px;">
                <strong>${1000 - holders} more</strong> needed for NFT airdrop!
            </p>
            <button onclick="this.parentNode.parentNode.remove()" style="
                background: var(--solana-green);
                color: var(--dark);
                border: none;
                padding: 10px 25px;
                border-radius: 50px;
                font-weight: 600;
                margin-top: 20px;
                cursor: pointer;
            ">
                Awesome! 🚀
            </button>
        </div>
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
        "></div>
    `;
    
    document.body.appendChild(popup);
}

// Add to your existing DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing code ...
    
    // Initialize holder tracker
    initHolderTracker();
});
