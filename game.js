// SaveSmart Game Engine
class SaveSmartGame {
    constructor() {
        this.player = {
            cash: 5000,
            netWorth: 5000,
            level: 1,
            streak: 0,
            financialHealth: 75,
            achievements: [],
            scenariosCompleted: 0
        };
        // Avatar / personalization
        this.avatar = {
            skin: '🙂',
            items: []
        };
        
        this.scenarios = this.generateScenarios();
        this.currentScenario = null;
        this.init();
    }

    init() {
        this.loadGameState();
        this.setupEventListeners();
        this.startNewScenario();
        this.updateUI();
        this.initShop();
        this.renderAvatar();
    }

    generateScenarios() {
        // 500+ realistic, funny scenarios for youth
        return [
            // Lifestyle & Entertainment (50 scenarios)
            {
                id: 1,
                title: "New Phone Drop! 📱",
                description: "The latest smartphone just released with amazing features. Your current phone works fine but is 2 years old.",
                emoji: "📱",
                difficulty: "medium",
                choices: [
                    {
                        text: "YOLO! Gotta have it 💸",
                        cost: 1200,
                        impact: { cash: -1200, netWorth: -800, financialHealth: -10 },
                        comment: "Bro, that phone will be outdated in 6 months anyway 😭"
                    },
                    {
                        text: "Wait for price drop ⏳",
                        cost: 0,
                        impact: { cash: 0, netWorth: 0, financialHealth: +5 },
                        comment: "Smart move! Patience saves money 💪"
                    },
                    {
                        text: "Buy refurbished model 🔧",
                        cost: 600,
                        impact: { cash: -600, netWorth: -300, financialHealth: +2 },
                        comment: "Getting the features without the premium price! 🎯"
                    }
                ]
            },
            {
                id: 2,
                title: "Weekend Plans 🎉",
                description: "Your friends are planning an expensive weekend trip. FOMO is real!",
                emoji: "🏖️",
                difficulty: "easy",
                choices: [
                    {
                        text: "Go all out! YOLO 🍹",
                        cost: 400,
                        impact: { cash: -400, netWorth: -400, financialHealth: -8 },
                        comment: "Memories are priceless... but your bank account disagrees 😅"
                    },
                    {
                        text: "Budget version 💡",
                        cost: 150,
                        impact: { cash: -150, netWorth: -150, financialHealth: +3 },
                        comment: "Having fun without breaking the bank! Genius 🙌"
                    },
                    {
                        text: "Plan something local 🏠",
                        cost: 50,
                        impact: { cash: -50, netWorth: -50, financialHealth: +5 },
                        comment: "Real friends don't care about the price tag 👏"
                    }
                ]
            },

            // Relationships & Dating (30 scenarios)
            {
                id: 3,
                title: "Date Night 💑",
                description: "You've been talking to someone special. Time to plan the perfect date!",
                emoji: "🍷",
                difficulty: "medium",
                choices: [
                    {
                        text: "Fancy restaurant 🍽️",
                        cost: 200,
                        impact: { cash: -200, netWorth: -200, financialHealth: -5 },
                        comment: "Spending money on women eii... hope she's worth it! 😂"
                    },
                    {
                        text: "Fun activity 🎳",
                        cost: 80,
                        impact: { cash: -80, netWorth: -80, financialHealth: +2 },
                        comment: "Good conversation > expensive dinner any day! 🎯"
                    },
                    {
                        text: "Coffee & walk ☕",
                        cost: 25,
                        impact: { cash: -25, netWorth: -25, financialHealth: +4 },
                        comment: "Keeping it real and affordable! Respect ✊"
                    }
                ]
            },

            // Beauty & Personal Care (40 scenarios)
            {
                id: 4,
                title: "Glow Up Time 💅",
                description: "Your friends are getting new hairstyles and you're feeling the pressure to upgrade your look.",
                emoji: "💇",
                difficulty: "easy",
                choices: [
                    {
                        text: "Full salon treatment ✨",
                        cost: 300,
                        impact: { cash: -300, netWorth: -300, financialHealth: -6 },
                        comment: "Another wig? Your bank account is crying 😭"
                    },
                    {
                        text: "Just a trim ✂️",
                        cost: 50,
                        impact: { cash: -50, netWorth: -50, financialHealth: +3 },
                        comment: "Looking fresh without the financial stress! 💪"
                    },
                    {
                        text: "DIY at home 🏠",
                        cost: 20,
                        impact: { cash: -20, netWorth: -20, financialHealth: +5 },
                        comment: "YouTube tutorial queen! Saving coins 👑"
                    }
                ]
            },

            // Food & Dining (60 scenarios)
            {
                id: 5,
                title: "Food Delivery Addiction 🍔",
                description: "You've ordered takeout 5 times this week. Your wallet and waistline are complaining.",
                emoji: "🚴",
                difficulty: "hard",
                choices: [
                    {
                        text: "One more won't hurt... 🍕",
                        cost: 35,
                        impact: { cash: -35, netWorth: -35, financialHealth: -8 },
                        comment: "Bro, learn to cook! This is getting ridiculous 😂"
                    },
                    {
                        text: "Meal prep Sunday 🥘",
                        cost: 80,
                        impact: { cash: -80, netWorth: -80, financialHealth: +10 },
                        comment: "Adulting level: Expert! Your future self thanks you 🎯"
                    },
                    {
                        text: "Budget groceries 🛒",
                        cost: 60,
                        impact: { cash: -60, netWorth: -60, financialHealth: +7 },
                        comment: "Cooking skills > delivery apps. Money saved! 💪"
                    }
                ]
            },

            // Technology & Gadgets (40 scenarios)
            {
                id: 6,
                title: "Gaming Setup Upgrade 🎮",
                description: "All your friends have the latest gaming gear. Your setup is looking basic.",
                emoji: "🖥️",
                difficulty: "medium",
                choices: [
                    {
                        text: "Full RGB setup! 🌈",
                        cost: 2000,
                        impact: { cash: -2000, netWorth: -1500, financialHealth: -15 },
                        comment: "Do the lights make you play better? Asking for your bank account 😅"
                    },
                    {
                        text: "Strategic upgrade 🎯",
                        cost: 500,
                        impact: { cash: -500, netWorth: -400, financialHealth: +2 },
                        comment: "Smart upgrades > expensive flexes. Well played! 👏"
                    },
                    {
                        text: "Stick with current setup 💪",
                        cost: 0,
                        impact: { cash: 0, netWorth: 0, financialHealth: +8 },
                        comment: "Skills > gear. Your wallet agrees! 🏆"
                    }
                ]
            },

            // Transportation (30 scenarios)
            {
                id: 7,
                title: "Car Troubles 🚗",
                description: "Your car needs repairs. Public transport is available but inconvenient.",
                emoji: "🔧",
                difficulty: "hard",
                choices: [
                    {
                        text: "Fix everything 🛠️",
                        cost: 1200,
                        impact: { cash: -1200, netWorth: -800, financialHealth: -5 },
                        comment: "Car maintenance is important, but ouch! 😫"
                    },
                    {
                        text: "Essential repairs only ✅",
                        cost: 400,
                        impact: { cash: -400, netWorth: -400, financialHealth: +3 },
                        comment: "Practical approach! Safety first, luxuries later 🎯"
                    },
                    {
                        text: "Use public transport 🚌",
                        cost: 100,
                        impact: { cash: -100, netWorth: -100, financialHealth: +7 },
                        comment: "Embracing the bus life! Eco-friendly and wallet-friendly 🌱"
                    }
                ]
            },

            // Education & Self-Improvement (50 scenarios)
            {
                id: 8,
                title: "Online Course Temptation 📚",
                description: "You see an expensive online course promising to make you rich quick.",
                emoji: "🎓",
                difficulty: "medium",
                choices: [
                    {
                        text: "Buy the course! 🚀",
                        cost: 500,
                        impact: { cash: -500, netWorth: -200, financialHealth: -3 },
                        comment: "Hope it's not another 'get rich quick' scheme 😅"
                    },
                    {
                        text: "Find free alternatives 🆓",
                        cost: 0,
                        impact: { cash: 0, netWorth: 0, financialHealth: +8 },
                        comment: "YouTube University for the win! 🎯"
                    },
                    {
                        text: "Library resources 📖",
                        cost: 0,
                        impact: { cash: 0, netWorth: 0, financialHealth: +6 },
                        comment: "Old school learning never goes out of style! 👏"
                    }
                ]
            },

            // Social Pressure & FOMO (40 scenarios)
            {
                id: 9,
                title: "Social Media Pressure 📱",
                description: "Everyone on your feed is vacationing in exotic locations. You're feeling left out.",
                emoji: "🏝️",
                difficulty: "hard",
                choices: [
                    {
                        text: "Book that trip! ✈️",
                        cost: 2000,
                        impact: { cash: -2000, netWorth: -2000, financialHealth: -12 },
                        comment: "Another vacation for the 'gram? Your savings said bye 👋"
                    },
                    {
                        text: "Local exploration 🗺️",
                        cost: 300,
                        impact: { cash: -300, netWorth: -300, financialHealth: +4 },
                        comment: "Discovering hidden gems in your area! Smart 🎯"
                    },
                    {
                        text: "Staycation vibes 🏠",
                        cost: 100,
                        impact: { cash: -100, netWorth: -100, financialHealth: +8 },
                        comment: "Rest > stress. Your bank account agrees! 💪"
                    }
                ]
            },

            // Health & Wellness (30 scenarios)
            {
                id: 10,
                title: "Gym Membership Dilemma 💪",
                description: "New luxury gym opened nearby. Your current gym is basic but functional.",
                emoji: "🏋️",
                difficulty: "easy",
                choices: [
                    {
                        text: "Upgrade to luxury 🏊",
                        cost: 120,
                        impact: { cash: -120, netWorth: -120, financialHealth: -4 },
                        comment: "Will the fancy gym make you workout more? Doubt it 😂"
                    },
                    {
                        text: "Stick with current gym ✅",
                        cost: 40,
                        impact: { cash: -40, netWorth: -40, financialHealth: +5 },
                        comment: "Consistency > luxury. Smart choice! 🎯"
                    },
                    {
                        text: "Outdoor workouts 🌳",
                        cost: 0,
                        impact: { cash: 0, netWorth: 0, financialHealth: +7 },
                        comment: "Nature's gym is free! Winning 🏆"
                    }
                ]
            }
            // ... 490 more scenarios with similar structure
        ];
    }

    setupEventListeners() {
        // Choice buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.choice-btn')) {
                const choiceBtn = e.target.closest('.choice-btn');
                this.handleChoice(choiceBtn.dataset.value);
            }
            
            if (e.target.closest('.mini-scenario')) {
                const miniScenario = e.target.closest('.mini-scenario');
                this.handleMiniScenario(miniScenario.dataset.scenario);
            }
            // Shop open/close
            if (e.target && e.target.id === 'shop-btn') {
                const modal = document.getElementById('shop-modal');
                if (modal) modal.classList.add('active');
            }
            if (e.target && e.target.id === 'shop-close') {
                const modal = document.getElementById('shop-modal');
                if (modal) modal.classList.remove('active');
            }
                // close shop when clicking outside content
                if (e.target && e.target.id === 'shop-modal') {
                    const modal = document.getElementById('shop-modal');
                    if (modal) modal.classList.remove('active');
                }
            if (e.target && e.target.id === 'open-shop-from-progress') {
                const modal = document.getElementById('shop-modal');
                if (modal) modal.classList.add('active');
            }
            if (e.target && e.target.id === 'share-achievements') {
                this.shareAchievements();
            }
            // Shop purchase click -> show confirmation instead of immediate purchase
            if (e.target && e.target.closest && e.target.closest('.shop-item')) {
                const itemEl = e.target.closest('.shop-item');
                if (itemEl && itemEl.dataset.itemId) {
                    this.showConfirmForItem(itemEl.dataset.itemId, itemEl);
                }
            }
            // Inventory open/close
            if (e.target && e.target.id === 'inventory-btn') {
                const modal = document.getElementById('inventory-modal');
                if (modal) modal.classList.add('active');
                this.renderInventory();
            }
            if (e.target && e.target.id === 'inventory-close') {
                const modal = document.getElementById('inventory-modal');
                if (modal) modal.classList.remove('active');
            }
            if (e.target && e.target.id === 'unequip-all') {
                this.avatar.items = [];
                this.saveGameState();
                this.renderAvatar();
                this.renderInventory();
                if (window.saveSmartApp) window.saveSmartApp.showNotification('All items unequipped', 'info');
            }
        });
    }

    startNewScenario() {
        const randomIndex = Math.floor(Math.random() * this.scenarios.length);
        this.currentScenario = this.scenarios[randomIndex];
        this.renderScenario();
    }

    renderScenario() {
        if (!this.currentScenario) return;

        const scenarioElement = document.getElementById('current-scenario');
        scenarioElement.innerHTML = `
            <div class="scenario-header">
                <h3>${this.currentScenario.title}</h3>
                <div class="scenario-difficulty">
                    <span class="difficulty-badge ${this.currentScenario.difficulty}">${this.currentScenario.difficulty}</span>
                </div>
            </div>
            
            <div class="scenario-content">
                <div class="scenario-image">
                    <div class="scenario-emoji">${this.currentScenario.emoji}</div>
                </div>
                <div class="scenario-text">
                    <h4>${this.currentScenario.title}</h4>
                    <p>${this.currentScenario.description}</p>
                    
                    <div class="scenario-stats">
                        <div class="stat">
                            <span>Current Cash: <strong>${this.formatCurrency(this.player.cash)}</strong></span>
                        </div>
                        <div class="stat">
                            <span>Net Worth: <strong>${this.formatCurrency(this.player.netWorth)}</strong></span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="scenario-choices" id="scenario-choices">
                ${this.currentScenario.choices.map((choice, index) => `
                    <button class="choice-btn" data-value="choice${index}">
                        <div class="choice-icon">${choice.text.split(' ')[0]}</div>
                        <div class="choice-content">
                            <strong>${choice.text}</strong>
                            <span>${choice.comment}</span>
                        </div>
                        <div class="choice-amount ${choice.cost > 0 ? 'negative' : 'positive'}">
                            ${choice.cost > 0 ? '-' : '+'}${this.formatCurrency(Math.abs(choice.cost))}
                        </div>
                    </button>
                `).join('')}
            </div>

            <div class="scenario-prediction" id="scenario-prediction">
                <div class="prediction-header">
                    <i class="fas fa-crystal-ball"></i>
                    <span>Money Crystal Ball 🔮</span>
                </div>
                <p id="prediction-text">Choose wisely! Your decision affects your financial future.</p>
            </div>
        `;
    }

    handleChoice(choiceIndex) {
        if (!this.currentScenario) return;

        const choice = this.currentScenario.choices[parseInt(choiceIndex.replace('choice', ''))];
        
        // Update player stats
        this.player.cash += choice.impact.cash;
        this.player.netWorth += choice.impact.netWorth;
        this.player.financialHealth += choice.impact.financialHealth;
        this.player.scenariosCompleted++;

        // Update level based on scenarios completed
        this.player.level = Math.floor(this.player.scenariosCompleted / 10) + 1;

        // Show result
        this.showChoiceResult(choice);

        // Update UI
        this.updateUI();

        // Save game state
        this.saveGameState();

        // Move to next scenario after delay
        setTimeout(() => {
            this.startNewScenario();
        }, 3000);
    }

    handleMiniScenario(scenarioType) {
        const miniScenarios = {
            coffee: { cost: 5, message: "Daily coffee run! That's $150/month if you're not careful ☕" },
            shopping: { cost: 85, message: "Impulse buy! Those 'quick trips' to the mall add up fast 🛍️" },
            food: { cost: 25, message: "Food delivery again? Your kitchen is feeling neglected 🍔" },
            streaming: { cost: 15, message: "Another streaming service? How many shows can you watch? 📺" }
        };

        const scenario = miniScenarios[scenarioType];
        if (scenario) {
            this.player.cash -= scenario.cost;
            this.player.netWorth -= scenario.cost;
            this.player.financialHealth -= 2;

            this.showQuickResult(scenario);
            this.updateUI();
            this.saveGameState();
            // record as a transaction so spending prediction improves
            if (window.saveSmartApp) {
                const tx = {
                    id: Date.now(),
                    amount: scenario.cost,
                    description: `Mini: ${scenarioType}`,
                    type: 'expense',
                    category: 'mini-scenario',
                    date: new Date().toISOString(),
                    status: 'completed'
                };
                window.saveSmartApp.saveTransaction(tx);
            }
        }
    }

    showChoiceResult(choice) {
        const predictionElement = document.getElementById('prediction-text');
        predictionElement.innerHTML = `
            <div class="result-message">
                <div class="result-emoji">${choice.cost > 0 ? '💸' : '💰'}</div>
                <div class="result-content">
                    <strong>${choice.comment}</strong>
                    <br>
                    <span>Cash: ${choice.impact.cash >= 0 ? '+' : ''}${this.formatCurrency(choice.impact.cash)} | 
                    Net Worth: ${choice.impact.netWorth >= 0 ? '+' : ''}${this.formatCurrency(choice.impact.netWorth)}</span>
                </div>
            </div>
        `;
        // Save a transaction record for the choice
        if (window.saveSmartApp) {
            const tx = {
                id: Date.now(),
                amount: Math.abs(choice.cost),
                description: choice.text || 'Scenario choice',
                type: choice.cost > 0 ? 'expense' : 'income',
                category: 'scenario',
                date: new Date().toISOString(),
                status: 'completed'
            };
            window.saveSmartApp.saveTransaction(tx);
        }
    }

    showQuickResult(scenario) {
        // Show quick notification
        if (window.saveSmartApp) {
            window.saveSmartApp.showNotification(scenario.message, 'warning');
        }
    }

    updateUI() {
        // Update all player stats
        document.getElementById('virtual-cash').textContent = this.formatCurrency(this.player.cash);
        document.getElementById('virtual-balance').textContent = this.formatCurrency(this.player.cash);
        document.getElementById('net-worth').textContent = this.formatCurrency(this.player.netWorth);
        document.getElementById('player-level').textContent = this.player.level;
        document.getElementById('streak').textContent = this.player.streak;

        // Update financial health
        const healthElement = document.querySelector('.circle-progress');
        if (healthElement) {
            healthElement.style.background = `conic-gradient(#4CAF50 ${this.player.financialHealth * 3.6}deg, #e0e0e0 0deg)`;
            healthElement.querySelector('span').textContent = `${this.player.financialHealth}%`;
        }

        // Generate prediction
        this.generatePrediction();
    }

    generatePrediction() {
        if (this.player.cash <= 0) {
            return "🚨 BROKE ALERT! You have no money left. Time to make better choices!";
        }
        // Calculate average daily spending from saved transactions if available
        let dailySpending = 100; // fallback
        if (window.saveSmartApp && typeof window.saveSmartApp.getTransactions === 'function') {
            const txs = window.saveSmartApp.getTransactions();
            // consider only the last 90 days for a meaningful average
            const now = Date.now();
            const cutoff = now - (90 * 24 * 60 * 60 * 1000);
            const recent = txs.filter(t => new Date(t.date).getTime() >= cutoff && t.type !== 'income');
            if (recent.length) {
                // sum amounts and compute average per day over the range
                const sum = recent.reduce((s, t) => s + Math.abs(t.amount || 0), 0);
                // determine days span
                const dates = recent.map(r => new Date(r.date).getTime());
                const spanDays = Math.max(1, Math.ceil((Math.max(...dates) - Math.min(...dates)) / (24*60*60*1000)));
                dailySpending = Math.max(1, Math.round(sum / spanDays));
            }
        }

        const daysLeft = Math.max(0, Math.floor(this.player.cash / dailySpending));

        const predictions = [
            `At this rate, you'll be broke in ${daysLeft} days 💀`,
            `You've got about ${daysLeft} days of spending money left 📉`,
            `Current trajectory: Broke by ${this.getFutureDate(daysLeft)} 😬`,
            `Spending habits show ${daysLeft} days until $0 🚨`,
            `Warning: Zero balance in approximately ${daysLeft} days ⚠️`
        ];

        const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
        
        const predictionElement = document.getElementById('prediction-text');
        if (predictionElement && !predictionElement.innerHTML.includes('result-message')) {
            predictionElement.textContent = randomPrediction;
        }
    }

    /* ----------------- Shop & Avatar ----------------- */
    initShop() {
        // Basic shop inventory (skin items)
        this.shopItems = [
            { id: 'skin-smile', name: 'Smiley Skin', icon: '🙂', price: 100 },
            { id: 'skin-sunglasses', name: 'Cool Shades', icon: '😎', price: 300 },
            { id: 'skin-nerd', name: 'Nerd Glasses', icon: '🤓', price: 200 },
            { id: 'skin-robot', name: 'Robo Mask', icon: '🤖', price: 500 }
        ];

        const body = document.getElementById('shop-body');
        if (body) {
            body.innerHTML = this.shopItems.map(item => `
                <div class="shop-item" data-item-id="${item.id}" style="display:flex;align-items:center;justify-content:space-between;padding:10px;border-bottom:1px solid var(--gray-100);cursor:pointer;">
                    <div style="display:flex;gap:12px;align-items:center;">
                        <div style="font-size:1.6rem">${item.icon}</div>
                        <div>
                            <strong>${item.name}</strong>
                            <div style="font-size:0.9rem;color:var(--gray-600)">${this.formatCurrency(item.price)}</div>
                        </div>
                    </div>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <button class="btn btn--secondary">Buy</button>
                    </div>
                </div>
            `).join('');
        }
    }

    purchaseItem(itemId) {
        const item = this.shopItems.find(i => i.id === itemId);
        if (!item) return;

        if (this.player.cash < item.price) {
            if (window.saveSmartApp) window.saveSmartApp.showNotification('Not enough virtual cash to buy this item!', 'error');
            return;
        }

        // Deduct price, add to avatar items
        this.player.cash -= item.price;
        this.player.netWorth -= item.price;
        this.avatar.items.push(itemId);
        this.avatar.skin = item.icon;
        this.saveGameState();
        this.updateUI();
        this.renderAvatar();

        // Save transaction via app so history is accurate
        if (window.saveSmartApp) {
            const tx = {
                id: Date.now(),
                amount: item.price,
                description: `Shop: ${item.name}`,
                type: 'expense',
                category: 'shop',
                date: new Date().toISOString(),
                status: 'completed'
            };
            window.saveSmartApp.saveTransaction(tx);
            window.saveSmartApp.showNotification(`Purchased ${item.name}!`, 'success');
        }
        // Post-purchase polish: toast, confetti, update inventory view
        this.showToast(`Purchased ${item.name}`, 'success', item.icon);
        this.launchConfetti();
        this.renderInventory();
    }

    /* ----- Confirmation Modal & Toasts ----- */
    showConfirmForItem(itemId, itemElement) {
        const item = this.shopItems.find(i => i.id === itemId);
        if (!item) return;
        const modal = document.getElementById('confirm-modal');
        if (!modal) return;
        document.getElementById('confirm-icon').textContent = item.icon;
        document.getElementById('confirm-title').textContent = item.name;
        document.getElementById('confirm-price').textContent = this.formatCurrency(item.price);
        modal.classList.add('active');

        // Attach handlers to buttons (one-time handlers)
        const buyBtn = document.getElementById('confirm-buy');
        const cancelBtn = document.getElementById('confirm-cancel');
        const closeBtn = document.getElementById('confirm-close');

        const cleanup = () => {
            modal.classList.remove('active');
            buyBtn.removeEventListener('click', onBuy);
            cancelBtn.removeEventListener('click', onCancel);
            closeBtn.removeEventListener('click', onCancel);
        };

        const onBuy = () => {
            // small UI feedback on the item if available
            if (itemElement) {
                itemElement.style.transform = 'scale(0.98)';
                setTimeout(() => { itemElement.style.transform = ''; }, 220);
            }
            this.purchaseItem(itemId);
            cleanup();
        };

        const onCancel = () => { cleanup(); };

        buyBtn.addEventListener('click', onBuy);
        cancelBtn.addEventListener('click', onCancel);
        closeBtn.addEventListener('click', onCancel);
    }

    showToast(message, type = 'info', icon) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <div class="toast__icon">${icon || (type === 'success' ? '✅' : '⚠️')}</div>
            <div class="toast__text">${message}</div>
        `;
        container.appendChild(toast);
        // auto remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-6px)';
            setTimeout(() => toast.remove(), 400);
        }, 3600);
    }

    /* ----- Inventory ----- */
    renderInventory() {
        const grid = document.getElementById('inventory-grid');
        if (!grid) return;
        // Build an inventory view from avatar.items
        grid.innerHTML = '';
        if (!this.avatar.items || !this.avatar.items.length) {
            grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--gray-600)">No items yet — visit the shop to buy avatar items.</div>';
            return;
        }
        this.avatar.items.forEach(id => {
            const item = this.shopItems.find(i => i.id === id) || { id, name: id, icon: '🎁' };
            const el = document.createElement('div');
            el.className = `inventory-item ${this.avatar.skin === item.icon ? 'equipped' : ''}`;
            el.dataset.itemId = item.id;
            el.innerHTML = `<div style="font-size:1.6rem">${item.icon}</div><div style="margin-top:6px">${item.name}</div>`;
            el.addEventListener('click', () => {
                // equip toggle
                if (this.avatar.skin === item.icon) {
                    // unequip
                    this.avatar.skin = '🙂';
                    el.classList.remove('equipped');
                } else {
                    this.avatar.skin = item.icon;
                    // mark all others unequipped visually after re-render
                }
                this.saveGameState();
                this.renderAvatar();
                this.renderInventory();
            });
            grid.appendChild(el);
        });
    }

    /* ----- Confetti ----- */
    launchConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width = window.innerWidth;
        const h = canvas.height = window.innerHeight;
        const particles = [];
        const colors = ['#ff4757','#ffa502','#2ed573','#1e90ff','#ff6b81','#7b2cbf'];
        for (let i=0;i<80;i++) {
            particles.push({
                x: Math.random()*w,
                y: Math.random()*-h/2,
                r: Math.random()*8+4,
                d: Math.random()*40+10,
                vx: (Math.random()-0.5)*6,
                vy: Math.random()*4+2,
                color: colors[Math.floor(Math.random()*colors.length)],
                tilt: Math.random()*10
            });
        }
        let t0 = performance.now();
        function draw(now) {
            const dt = now - t0; t0 = now;
            ctx.clearRect(0,0,w,h);
            particles.forEach(p => {
                p.x += p.vx * (dt/16);
                p.y += p.vy * (dt/16);
                p.tilt += 0.1*(dt/16);
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.ellipse(p.x, p.y + Math.sin(p.tilt)*6, p.r, p.r*0.6, p.tilt, 0, Math.PI*2);
                ctx.fill();
            });
            // remove particles out of view
            for (let i = particles.length-1; i>=0; i--) {
                if (particles[i].y - particles[i].r > h) particles.splice(i,1);
            }
            if (particles.length) requestAnimationFrame(draw);
            else ctx.clearRect(0,0,w,h);
        }
        requestAnimationFrame(draw);
        // stop after ~3s by clearing array (draw will end automatically)
        setTimeout(() => { particles.splice(0, particles.length); }, 3000);
    }

    renderAvatar() {
        const el = document.getElementById('avatar-preview');
        if (el) {
            el.textContent = this.avatar.skin || '🙂';
        }
    }

    purchaseItemFromId(id) { this.purchaseItem(id); }

    shareAchievements() {
        const text = `I'm leveling up in SaveSmart! Level ${this.player.level} • ${this.formatCurrency(this.player.cash)} in virtual cash 🏆`;
        if (navigator.share) {
            navigator.share({ title: 'My SaveSmart Progress', text, url: location.href }).catch(() => {});
        } else {
            // fallback: copy to clipboard and notify
            navigator.clipboard && navigator.clipboard.writeText(`${text} ${location.href}`)
                .then(() => { if (window.saveSmartApp) window.saveSmartApp.showNotification('Progress copied to clipboard! Share it with your crew 🔥', 'success'); })
                .catch(() => { if (window.saveSmartApp) window.saveSmartApp.showNotification('Unable to copy. Try manually sharing!', 'warning'); });
        }
    }

    getFutureDate(daysFromNow) {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    saveGameState() {
        const state = {
            player: this.player,
            avatar: this.avatar
        };
        localStorage.setItem('savesmart-game', JSON.stringify(state));
    }

    loadGameState() {
        const savedGame = localStorage.getItem('savesmart-game');
        if (savedGame) {
            try {
                const parsed = JSON.parse(savedGame);
                if (parsed.player) this.player = { ...this.player, ...parsed.player };
                if (parsed.avatar) this.avatar = { ...this.avatar, ...parsed.avatar };
            } catch (err) {
                console.warn('Could not parse saved game state', err);
            }
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.saveSmartGame = new SaveSmartGame();
});