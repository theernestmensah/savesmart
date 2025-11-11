// Goals Management JavaScript
class GoalsManager {
    constructor() {
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderGoals();
        this.updateSummary();
    }

    setupEventListeners() {
        // Create goal form
        document.getElementById('create-goal-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateGoal();
        });

        // Filter buttons
        document.querySelectorAll('.view-options button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleFilterChange(e.target.dataset.filter);
            });
        });

        // Add funds modal
        document.getElementById('add-funds-close')?.addEventListener('click', () => {
            document.getElementById('add-funds-modal').classList.remove('active');
        });

        document.getElementById('add-funds-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddFunds();
        });

        // Goal details modal
        document.getElementById('goal-details-close')?.addEventListener('click', () => {
            document.getElementById('goal-details-modal').classList.remove('active');
        });
    }

    getGoals() {
        return JSON.parse(localStorage.getItem('savesmart-goals') || '[]');
    }

    saveGoals(goals) {
        localStorage.setItem('savesmart-goals', JSON.stringify(goals));
    }

    handleCreateGoal() {
        const name = document.getElementById('goal-name').value;
        const target = parseFloat(document.getElementById('goal-target').value);
        const deadline = document.getElementById('goal-deadline').value;
        const category = document.getElementById('goal-category').value;
        const description = document.getElementById('goal-description').value;

        if (!name || !target) {
            window.saveSmartApp.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const goal = {
            id: Date.now(),
            name,
            target,
            current: 0,
            deadline: deadline || null,
            category,
            description: description || '',
            created: new Date().toISOString(),
            completed: false
        };

        const goals = this.getGoals();
        goals.push(goal);
        this.saveGoals(goals);

        // Reset form
        document.getElementById('create-goal-form').reset();

        // Refresh display
        this.renderGoals();
        this.updateSummary();
        window.saveSmartApp.showNotification('Goal created successfully!', 'success');
    }

    handleFilterChange(filter) {
        this.currentFilter = filter;
        
        // Update active button
        document.querySelectorAll('.view-options button').forEach(button => {
            button.classList.toggle('active', button.dataset.filter === filter);
        });

        this.renderGoals();
    }

    renderGoals() {
        const container = document.getElementById('goals-grid');
        const emptyState = document.getElementById('empty-goals');

        if (!container) return;

        const goals = this.getGoals();
        let filteredGoals = goals;

        // Apply filter
        if (this.currentFilter === 'active') {
            filteredGoals = goals.filter(goal => !goal.completed);
        } else if (this.currentFilter === 'completed') {
            filteredGoals = goals.filter(goal => goal.completed);
        }

        // Show empty state if no goals
        if (filteredGoals.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        container.style.display = 'grid';
        emptyState.style.display = 'none';

        // Render goals
        container.innerHTML = filteredGoals.map(goal => {
            const progress = (goal.current / goal.target) * 100;
            const isCompleted = goal.completed || progress >= 100;
            const daysLeft = goal.deadline ? this.calculateDaysLeft(goal.deadline) : null;

            return `
                <div class="goal-card ${isCompleted ? 'completed' : ''}" data-id="${goal.id}">
                    <div class="goal-card__header">
                        <div class="goal-card__icon">
                            <i class="fas fa-${this.getGoalIcon(goal.category)}"></i>
                        </div>
                        <div class="goal-card__title">
                            <h4>${goal.name}</h4>
                            <span class="goal-card__category">${this.formatCategory(goal.category)}</span>
                        </div>
                        <div class="goal-card__actions">
                            <button class="btn-icon view-goal" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-icon add-funds" title="Add Funds">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="goal-card__progress">
                        <div class="progress-info">
                            <span class="progress-amount">${window.saveSmartApp.formatCurrency(goal.current)}</span>
                            <span class="progress-target">${window.saveSmartApp.formatCurrency(goal.target)}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                        </div>
                        <div class="progress-percentage">${Math.round(progress)}%</div>
                    </div>

                    <div class="goal-card__footer">
                        ${daysLeft !== null ? `
                            <div class="goal-deadline ${daysLeft < 0 ? 'overdue' : daysLeft < 30 ? 'urgent' : ''}">
                                <i class="fas fa-calendar"></i>
                                ${daysLeft >= 0 ? `${daysLeft} days left` : 'Overdue'}
                            </div>
                        ` : ''}
                        ${isCompleted ? `
                            <div class="goal-status completed">
                                <i class="fas fa-check-circle"></i>
                                Completed
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        // Add event listeners
        this.attachGoalEventListeners();
    }

    attachGoalEventListeners() {
        // View goal details
        document.querySelectorAll('.view-goal').forEach(button => {
            button.addEventListener('click', (e) => {
                const goalId = parseInt(e.target.closest('.goal-card').dataset.id);
                this.showGoalDetails(goalId);
            });
        });

        // Add funds
        document.querySelectorAll('.add-funds').forEach(button => {
            button.addEventListener('click', (e) => {
                const goalId = parseInt(e.target.closest('.goal-card').dataset.id);
                this.openAddFundsModal(goalId);
            });
        });
    }

    showGoalDetails(goalId) {
        const goals = this.getGoals();
        const goal = goals.find(g => g.id === goalId);

        if (!goal) return;

        const progress = (goal.current / goal.target) * 100;
        const daysLeft = goal.deadline ? this.calculateDaysLeft(goal.deadline) : null;

        document.getElementById('goal-details-title').textContent = goal.name;
        document.getElementById('goal-details-content').innerHTML = `
            <div class="goal-details">
                <div class="goal-details__section">
                    <h4>Goal Information</h4>
                    <div class="details-grid">
                        <div class="detail-item">
                            <label>Target Amount:</label>
                            <span>${window.saveSmartApp.formatCurrency(goal.target)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Current Amount:</label>
                            <span>${window.saveSmartApp.formatCurrency(goal.current)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Progress:</label>
                            <span>${Math.round(progress)}%</span>
                        </div>
                        <div class="detail-item">
                            <label>Category:</label>
                            <span>${this.formatCategory(goal.category)}</span>
                        </div>
                        ${goal.deadline ? `
                            <div class="detail-item">
                                <label>Target Date:</label>
                                <span>${window.saveSmartApp.formatDate(goal.deadline)}</span>
                            </div>
                            <div class="detail-item">
                                <label>Days Left:</label>
                                <span class="${daysLeft < 0 ? 'text-error' : daysLeft < 30 ? 'text-warning' : ''}">
                                    ${daysLeft >= 0 ? daysLeft : 'Overdue'}
                                </span>
                            </div>
                        ` : ''}
                    </div>
                </div>

                ${goal.description ? `
                    <div class="goal-details__section">
                        <h4>Description</h4>
                        <p>${goal.description}</p>
                    </div>
                ` : ''}

                <div class="goal-details__section">
                    <h4>Progress</h4>
                    <div class="progress-bar large">
                        <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                    </div>
                    <div class="progress-text">
                        ${window.saveSmartApp.formatCurrency(goal.current)} of ${window.saveSmartApp.formatCurrency(goal.target)}
                    </div>
                </div>

                <div class="goal-details__actions">
                    <button class="btn btn--primary" onclick="goalsManager.openAddFundsModal(${goal.id})">
                        <i class="fas fa-plus"></i>
                        Add Funds
                    </button>
                    <button class="btn btn--secondary" onclick="goalsManager.markGoalCompleted(${goal.id})">
                        <i class="fas fa-check"></i>
                        Mark Complete
                    </button>
                </div>
            </div>
        `;

        document.getElementById('goal-details-modal').classList.add('active');
    }

    openAddFundsModal(goalId) {
        const goals = this.getGoals();
        const goal = goals.find(g => g.id === goalId);

        if (!goal) return;

        // Get current balance
        const userData = JSON.parse(localStorage.getItem('savesmart-user'));
        const availableBalance = userData.balance;

        document.getElementById('funds-goal-id').value = goal.id;
        document.getElementById('available-balance').textContent = window.saveSmartApp.formatCurrency(availableBalance);
        document.getElementById('funds-date').value = new Date().toISOString().split('T')[0];

        document.getElementById('add-funds-modal').classList.add('active');
    }

    handleAddFunds() {
        const goalId = parseInt(document.getElementById('funds-goal-id').value);
        const amount = parseFloat(document.getElementById('funds-amount').value);
        const date = document.getElementById('funds-date').value;
        const description = document.getElementById('funds-description').value;

        if (!amount || amount <= 0) {
            window.saveSmartApp.showNotification('Please enter a valid amount', 'error');
            return;
        }

        // Check if user has sufficient balance
        const userData = JSON.parse(localStorage.getItem('savesmart-user'));
        if (amount > userData.balance) {
            window.saveSmartApp.showNotification('Insufficient balance', 'error');
            return;
        }

        const goals = this.getGoals();
        const goalIndex = goals.findIndex(g => g.id === goalId);

        if (goalIndex === -1) {
            window.saveSmartApp.showNotification('Goal not found', 'error');
            return;
        }

        // Update goal
        goals[goalIndex].current += amount;
        
        // Check if goal is completed
        if (goals[goalIndex].current >= goals[goalIndex].target) {
            goals[goalIndex].completed = true;
            goals[goalIndex].completedDate = new Date().toISOString();
        }

        this.saveGoals(goals);

        // Update user balance
        userData.balance -= amount;
        localStorage.setItem('savesmart-user', JSON.stringify(userData));

        // Create transaction record
        const transaction = {
            id: Date.now(),
            amount: amount,
            description: description || `Savings for ${goals[goalIndex].name}`,
            type: 'expense',
            category: 'savings',
            date: date,
            status: 'completed',
            goalId: goalId
        };

        const transactions = window.saveSmartApp.getTransactions();
        transactions.unshift(transaction);
        localStorage.setItem('savesmart-transactions', JSON.stringify(transactions));

        // Close modal and refresh
        document.getElementById('add-funds-modal').classList.remove('active');
        document.getElementById('add-funds-form').reset();
        
        this.renderGoals();
        this.updateSummary();
        window.saveSmartApp.showNotification('Funds added to goal successfully!', 'success');

        // Check for badge achievements
        this.checkGoalBadges();
    }

    markGoalCompleted(goalId) {
        const goals = this.getGoals();
        const goalIndex = goals.findIndex(g => g.id === goalId);

        if (goalIndex === -1) return;

        goals[goalIndex].completed = true;
        goals[goalIndex].completedDate = new Date().toISOString();
        this.saveGoals(goals);

        this.renderGoals();
        this.updateSummary();
        window.saveSmartApp.showNotification('Goal marked as completed!', 'success');

        // Check for badge achievements
        this.checkGoalBadges();
    }

    checkGoalBadges() {
        // This would integrate with the badges system
        // For now, we'll just show a notification for the first completed goal
        const goals = this.getGoals();
        const completedGoals = goals.filter(g => g.completed);

        if (completedGoals.length === 1) {
            window.saveSmartApp.showNotification('🎉 You earned the "First Goal" badge!', 'success');
        }
    }

    updateSummary() {
        const goals = this.getGoals();
        
        const activeGoals = goals.filter(goal => !goal.completed).length;
        const completedGoals = goals.filter(goal => goal.completed).length;
        const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
        const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
        const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

        document.getElementById('active-goals').textContent = activeGoals;
        document.getElementById('completed-goals').textContent = completedGoals;
        document.getElementById('total-saved').textContent = window.saveSmartApp.formatCurrency(totalSaved);
        document.getElementById('overall-progress').textContent = `${overallProgress}%`;
    }

    calculateDaysLeft(deadline) {
        const today = new Date();
        const targetDate = new Date(deadline);
        const diffTime = targetDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    getGoalIcon(category) {
        const icons = {
            emergency: 'first-aid',
            vacation: 'umbrella-beach',
            education: 'graduation-cap',
            home: 'home',
            vehicle: 'car',
            retirement: 'piggy-bank',
            other: 'bullseye'
        };
        return icons[category] || 'bullseye';
    }

    formatCategory(category) {
        const categories = {
            emergency: 'Emergency Fund',
            vacation: 'Vacation',
            education: 'Education',
            home: 'Home',
            vehicle: 'Vehicle',
            retirement: 'Retirement',
            other: 'Other'
        };
        return categories[category] || category;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.goalsManager = new GoalsManager();
});