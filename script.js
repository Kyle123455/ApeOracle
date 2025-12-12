// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Chart.js
    initTokenomicsChart();
    
    // Generate random prophecy
    generateProphecy();
    
    // Update stats with random numbers
    updateStats();
    
    // Add event listeners
    document.getElementById('generate-prophecy').addEventListener('click', generateProphecy);
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            }
        });
    });
    
    // Animate roadmap phases on scroll
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.roadmap-phase').forEach(phase => {
        observer.observe(phase);
    });
});

// Tokenomics Chart
function initTokenomicsChart() {
    const ctx = document.getElementById('tokenomicsChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Community Airdrop', 'Liquidity Pool', 'Staking Rewards', 'NFT Development', 'Team & Marketing'],
            datasets: [{
                data: [40, 30, 15, 10, 5],
                backgroundColor: [
                    '#FF6B6B',
                    '#4ECDC4',
                    '#FFD166',
                    '#06D6A0',
                    '#118AB2'
                ],
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 2000
            }
        }
    });
}

// Generate random prophecy
function generateProphecy() {
    const prophecies = [
        "When three moons align, $APOR shall 100x. Trust the Oracle.",
        "The apes who hold through the dip shall be rewarded with unimaginable gains.",
        "A whale approaches. Do not fear, for the Oracle foresees a green candle.",
        "The prophecy speaks of a legendary partnership. An ape-shaped NFT is coming.",
        "When Twitter FUD peaks, that is when you must buy more. The Oracle knows.",
        "A cross-chain bridge shall be built, connecting all degenerate apes.",
        "The memes shall become reality. Elon will tweet about us. It is written.",
        "Stake your tokens, close your charts, and return in one moon cycle.",
        "The NFT collection will sell out in 3.14 minutes. Prepare your wallets.",
        "A new ATH approaches. The charts show a pattern of pure hopium."
    ];
    
    const randomProphecy = prophecies[Math.floor(Math.random() * prophecies.length)];
    document.getElementById('prophecy-text').textContent = `"${randomProphecy}"`;
    
    // Add animation
    const prophecyElement = document.getElementById('prophecy-text');
    prophecyElement.style.animation = 'none';
    setTimeout(() => {
        prophecyElement.style.animation = 'pulse 1s';
    }, 10);
}

// Update stats with random data
function updateStats() {
    // Generate random market cap between 1M and 50M
    const marketCap = (Math.random() * 49 + 1).toFixed(2);
    document.getElementById('market-cap').textContent = `$${marketCap}M`;
    
    // Generate random holder count between 5000 and 25000
    const holders = Math.floor(Math.random() * 20000 + 5000).toLocaleString();
    document.getElementById('holders').textContent = holders;
    
    // Generate random price
    const price = (Math.random() * 0.00009 + 0.00001).toFixed(7);
    document.getElementById('price').innerHTML = `$${price}`;
    
    // Update every 30 seconds
    setTimeout(updateStats, 30000);
}

// Copy contract address
function copyContract() {
    const contractAddress = "0xAP3ORAC1E000000000000000000000000000000";
    navigator.clipboard.writeText(contractAddress).then(function() {
        const btn = document.querySelector('.btn-copy');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.style.backgroundColor = '#06D6A0';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '';
        }, 2000);
    });
}

// Add parallax effect on scroll
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        hero.style.backgroundPosition = `center ${scrolled * 0.5}px`;
    }
});

// Add animation to features on scroll
function animateOnScroll() {
    const features = document.querySelectorAll('.feature-card');
    
    features.forEach((feature, index) => {
        const featurePosition = feature.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (featurePosition < screenPosition) {
            setTimeout(() => {
                feature.style.opacity = '1';
                feature.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}

// Initialize feature animations
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s, transform 0.5s';
});

window.addEventListener('scroll', animateOnScroll);
animateOnScroll(); // Run once on load
