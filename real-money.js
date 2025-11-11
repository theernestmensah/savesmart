// Real Money Tracking System
class RealMoneyTracker {
    constructor() {
        this.user = {
            currency: 'USD',
            monthlyIncome: 0,
            currentBalance: 0,
            monthlyBudget: 0,
            accounts: [],
            transactions: [],
            savingsGoal: 0
        };
        
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.updateUI();
        this.setupCurrencySelector();
    }

    setupEventListeners() {
        // Currency selector
        document.getElementById('currency-select')?.addEventListener('change', (e) => {
            this.user.currency = e.target.value;
            this.saveUserData();
            this.updateUI();
        });

        // Setup form
        document.getElementById('real-money-setup')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSetup();
        });

        // Manual tracking button
        document.querySelector('[data-type="manual"] button')?.addEventListener('click', () => {
            this.openSetupModal();
        });

        // Bank connection button
        document.querySelector('[data-type="bank"] button')?.addEventListener('click', () => {
            this.showBankConnectionInfo();
        });

        // Setup modal close
        document.getElementById('setup-modal-close')?.addEventListener('click', () => {
            document.getElementById('setup-modal').classList.remove('active');
        });
    }

    setupCurrencySelector() {
        const selector = document.getElementById('currency-select');
        if (selector && this.user.currency) {
            selector.value = this.user.currency;
        }
    }

    handleSetup() {
        const monthlyIncome = parseFloat(document.getElementById('monthly-income').value);
        const savingsGoal = parseFloat(document.getElementById('savings-goal').value) || 0;
        const currentBalance = parseFloat(document.getElementById('current-balance').value);

        if (!monthlyIncome || !currentBalance) {
            window.saveSmartApp.showNotification('Please fill in all required fields', 'error');
            return;
        }

        this.user.monthlyIncome = monthlyIncome;
        this.user.savingsGoal = savingsGoal;
        this.user.currentBalance = currentBalance;
        this.user.monthlyBudget = monthlyIncome * 0.7; // 70% of income as default budget

        this.saveUserData();
        this.updateUI();
        
        document.getElementById('setup-modal').classList.remove('active');
        window.saveSmartApp.showNotification('Real money tracking started! 🚀', 'success');

        // Generate initial prediction
        this.generateFinancialPrediction();
    }

    openSetupModal() {
        document.getElementById('setup-modal').classList.add('active');
    }

    showBankConnectionInfo() {
        window.saveSmartApp.showNotification('Bank connection coming soon! Using manual tracking for now.', 'info');
        this.openSetupModal();
    }

    updateUI() {
        // Update balance display
        document.getElementById('real-balance').textContent = this.formatCurrency(this.user.currentBalance);
        
        // Update budget progress
        const budgetUsed = 0; // This would be calculated from transactions
        const budgetPercentage = this.user.monthlyBudget > 0 ? (budgetUsed / this.user.monthlyBudget) * 100 : 0;
        
        const progressFill = document.querySelector('.budget-progress .progress-fill');
        const budgetText = document.querySelector('.budget-text');
        
        if (progressFill) {
            progressFill.style.width = `${Math.min(budgetPercentage, 100)}%`;
        }
        
        if (budgetText) {
            budgetText.innerHTML = `<span>${this.formatCurrency(budgetUsed)}</span><span>${this.formatCurrency(this.user.monthlyBudget)}</span>`;
        }

        // Update savings rate
        const savingsRate = this.user.monthlyIncome > 0 ? 
            ((this.user.savingsGoal || 0) / this.user.monthlyIncome) * 100 : 0;
        
        document.querySelector('.savings-rate').textContent = `${Math.round(savingsRate)}%`;

        // Update prediction
        this.generateFinancialPrediction();
    }

    generateFinancialPrediction() {
        if (this.user.monthlyIncome === 0) {
            return; // No data yet
        }

        const predictionElement = document.querySelector('.prediction-result');
        if (!predictionElement) return;

        const monthlySpending = this.user.monthlyIncome - this.user.savingsGoal;
        const emergencyFund = this.user.currentBalance;
        const monthsUntilBroke = emergencyFund / monthlySpending;

        let predictionMessage = '';
        let predictionEmoji = '';

        if (monthsUntilBroke <= 1) {
            predictionMessage = `🚨 CRISIS MODE! At this spending rate, you'll be broke in ${Math.ceil(monthsUntilBroke * 30)} days. Time for a financial intervention!`;
            predictionEmoji = '💀';
        } else if (monthsUntilBroke <= 3) {
            predictionMessage = `⚠️ WARNING! Current habits show you'll run out of money in ${Math.ceil(monthsUntilBroke)} months. Let's fix this!`;
            predictionEmoji = '😬';
        } else if (monthsUntilBroke <= 6) {
            predictionMessage = `📊 You've got ${Math.ceil(monthsUntilBroke)} months of runway. Not bad, but we can do better!`;
            predictionEmoji = '🤔';
        } else {
            predictionMessage = `🎉 SOLID! You're financially stable for ${Math.ceil(monthsUntilBroke)} months. Keep up the good work!`;
            predictionEmoji = '💰';
        }

        predictionElement.innerHTML = `
            <div class="prediction-emoji">${predictionEmoji}</div>
            <div class="prediction-text">
                <h4>Financial Forecast</h4>
                <p>${predictionMessage}</p>
                <div class="prediction-stats">
                    <div class="stat">
                        <span>Emergency Fund:</span>
                        <strong>${this.formatCurrency(this.user.currentBalance)}</strong>
                    </div>
                    <div class="stat">
                        <span>Monthly Safety Net:</span>
                        <strong>${Math.ceil(monthsUntilBroke)} months</strong>
                    </div>
                </div>
            </div>
        `;

        // Add funny commentary based on spending habits
        this.addFunnyCommentary();
    }

    addFunnyCommentary() {
        const savingsRate = (this.user.savingsGoal / this.user.monthlyIncome) * 100;
        
        const commentaries = [
            savingsRate < 10 ? "Bro, you're saving less than your phone's battery percentage 😅" : "",
            savingsRate < 20 ? "Your savings account is looking lonelier than my dating life 💀" : "",
            savingsRate > 50 ? "Wow! You save more than you spend? Are you even human? 🤖" : "",
            this.user.savingsGoal === 0 ? "Zero savings goal? Living on the edge, I see 😎" : "",
            savingsRate > 30 ? "Financial guru in the making! Your future self is throwing a party 🎉" : ""
        ].filter(comment => comment !== "");

        if (commentaries.length > 0) {
            const randomComment = commentaries[Math.floor(Math.random() * commentaries.length)];
            const predictionElement = document.querySelector('.prediction-text p');
            if (predictionElement) {
                predictionElement.innerHTML += `<br><br><em>"${randomComment}"</em>`;
            }
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: this.user.currency
        }).format(amount);
    }

    saveUserData() {
        localStorage.setItem('savesmart-real-money', JSON.stringify(this.user));
    }

    loadUserData() {
        const savedData = localStorage.getItem('savesmart-real-money');
        if (savedData) {
            this.user = { ...this.user, ...JSON.parse(savedData) };
        }
    }
}

// Initialize real money tracker
document.addEventListener('DOMContentLoaded', () => {
    window.realMoneyTracker = new RealMoneyTracker();
});