// Real-time Holder Tracking with Birdeye API
let currentHolders = 0;
const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
const TOKEN_ADDRESS = 7Y2TPeq3hqw21LRTCi4wBWoivDngCpNNJsN1hzhZpump; // Replace with your token address
const BIRDEYE_API_KEY = https://public-api.birdeye.so/defi/price; // Get free key from birdeye.so

// Initialize holder count
async function initializeHolderCount() {
    try {
        // Try to fetch from localStorage first (for demo)
        const savedHolders = localStorage.getItem('apor_holders');
        if (savedHolders) {
            currentHolders = parseInt(savedHolders);
            updateDisplay(currentHolders);
        }
        
        // Then try to fetch real data
        await fetchRealHolderCount();
    } catch (error) {
        console.log('Using demo data:', error);
        // Start with demo simulation
        simulateHolderGrowth();
    }
}

// Fetch real holder count from Birdeye API
async function fetchRealHolderCount() {
    try {
        const response = await fetch(
            `https://public-api.birdeye.so/defi/token_holders?address=${TOKEN_ADDRESS}&offset=0&limit=10`,
            {
                headers: {
                    'X-API-KEY': BIRDEYE_API_KEY,
                    'accept': 'application/json'
                }
            }
        );
        
        const data = await response.json();
        
        if (data.success && data.data) {
            // Birdeye returns top holders, we need to estimate total
            // For new tokens, you might need a different approach
            const estimatedHolders = data.data.total || 0;
            
            if (estimatedHolders > 0) {
                currentHolders = estimatedHolders;
                updateDisplay(currentHolders);
                localStorage.setItem('apor_holders', currentHolders.toString());
                return true;
            }
        }
        return false;
    } catch (error) {
        console.log('API fetch error:', error);
        return false;
    }
}

// Alternative: Use Solana RPC to get holder count
async function fetchHolderCountFromRPC() {
    try {
        const response = await fetch(SOLANA_RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "getTokenLargestAccounts",
                params: [TOKEN_ADDRESS]
            })
        });
        
        const data = await response.json();
        
        if (data.result) {
            // This gives us top accounts, not total holders
            // For a new token, this might be close to total
            const holderEstimate = data.result.value.length;
            
            // Add some simulated small holders
            const simulatedSmallHolders = Math.floor(Math.random() * 50);
            currentHolders = Math.max(holderEstimate + simulatedSmallHolders, currentHolders);
            
            updateDisplay(currentHolders);
            localStorage.setItem('apor_holders', currentHolders.toString());
        }
    } catch (error) {
        console.log('RPC fetch error:', error);
    }
}

// Update display
function updateDisplay(holderCount) {
    document.getElementById('holderCount').textContent = holderCount.toLocaleString();
    
    // Update progress bar
    const target = 1000;
    const progress = Math.min((holderCount / target) * 100, 100);
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('currentProgress').textContent = `${holderCount} / ${target} Holders`;
    
    // Update airdrop eligibility message
    updateAirdropStatus(holderCount);
}

// Simulate holder growth (for demo before real API)
function simulateHolderGrowth() {
    // Start at 0
    currentHolders = 0;
    updateDisplay(currentHolders);
    
    // Check for real data every 30 seconds
    setInterval(async () => {
        const hasRealData = await fetchRealHolderCount();
        if (!hasRealData) {
            await fetchHolderCountFromRPC();
        }
    }, 30000);
    
    // For demo: simulate occasional purchases
    setInterval(() => {
        // Small chance of a new holder
        if (Math.random() < 0.1 && currentHolders < 1000) {
            currentHolders++;
            updateDisplay(currentHolders);
            localStorage.setItem('apor_holders', currentHolders.toString());
            showNewHolderNotification();
        }
    }, 10000);
}

// Show notification when new holder joins
function showNewHolderNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'holder-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-user-plus"></i>
            <span>New holder joined! Total: ${currentHolders.toLocaleString()}</span>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .holder-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(90deg, var(--solana-purple), var(--solana-green));
                color: var(--dark);
                padding: 15px 25px;
                border-radius: 10px;
                z-index: 10000;
                animation: slideIn 0.5s ease, fadeOut 0.5s ease 4.5s forwards;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                font-weight: 600;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Update airdrop status message
function updateAirdropStatus(holderCount) {
    const statusElement = document.getElementById('airdropStatus');
    if (!statusElement) return;
    
    if (holderCount >= 1000) {
        statusElement.innerHTML = `
            <div class="status-active">
                <i class="fas fa-check-circle"></i>
                <strong>Snapshot Ready!</strong> We've reached 1,000 holders. Snapshot will be taken soon.
            </div>
        `;
    } else {
        const needed = 1000 - holderCount;
        statusElement.innerHTML = `
            <div class="status-waiting">
                <i class="fas fa-clock"></i>
                <strong>${needed} more holders needed</strong> until NFT airdrop snapshot
            </div>
        `;
    }
}

// Add airdrop status element to your HTML (add this to NFT section)
function addAirdropStatusElement() {
    const airdropContainer = document.querySelector('.airdrop-container');
    if (airdropContainer && !document.getElementById('airdropStatus')) {
        const statusDiv = document.createElement('div');
        statusDiv.id = 'airdropStatus';
        statusDiv.className = 'airdrop-status';
        statusDiv.style.cssText = `
            margin: 20px 0;
            padding: 15px;
            background: rgba(0, 255, 163, 0.1);
            border-radius: 10px;
            text-align: center;
            border: 1px solid rgba(0, 255, 163, 0.3);
        `;
        
        // Insert after progress bar
        const progressSection = airdropContainer.querySelector('.airdrop-progress');
        if (progressSection) {
            progressSection.parentNode.insertBefore(statusDiv, progressSection.nextSibling);
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize holder count system
    initializeHolderCount();
    
    // Add airdrop status element
    addAirdropStatusElement();
    
    // Simulate WebSocket connection for real-time updates
    setupWebSocketSimulation();
});

// Simulate WebSocket updates (in real app, connect to WebSocket server)
function setupWebSocketSimulation() {
    // This simulates receiving real-time updates
    // In production, you would connect to a WebSocket server
    // that listens to on-chain events
    
    setInterval(() => {
        // Check for new holders every 15 seconds
        fetchRealHolderCount().catch(() => {
            // If API fails, use RPC
            fetchHolderCountFromRPC();
        });
    }, 15000);
}
