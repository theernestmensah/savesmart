// Badges System JavaScript
class BadgesManager {
    constructor() {
        this.currentCategory = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderBadges();
        this.renderRecentAchievements();
        this.updateSummary();
    }

    setupEventListeners() {
        // Category tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.handleCategoryChange(e.target.dataset.category);
            });
        });

        // Badge details modal
        document.getElementById('badge-details-close')?.addEventListener('click', () => {
            document.getElementById('badge-details-modal').classList.remove('active');
        });
    }

    getBadges() {
        // Default badges data
        const defaultBadges = [
            {
                id: 1,
                name: "First Saver",
                description: "Save your first $100",
                icon: "💰",
                category: "saving",
                earned: false,
                progress: 0,
                target: 100,
                type: "amount"
            },
            {
                id: 2,
                name: "Consistency King",
                description: "Save for 7 days straight",
                icon: "👑",
                category: "consistency",
                earned: false,
                progress: 0,
                target: 7,
                type: "streak"
            },
            {
                id: 3,
                name: "Goal Getter",
                description: "Achieve your first savings goal",
                icon: "🎯",
                category: "goals",
                earned: false,
                progress: 0,
                target: 1,
                type: "count"
            },
            {
                id: 4,
                name: "Budget Master",
                description: "Stay under budget for a month",
                icon: "📊",
                category: "consistency",
                earned: false,
                progress: 0,
                target: 1,
                type: "count"
            },
            {
                id: 5,
                name: "Early Bird",
                description: "Save before noon for 5 days",
                icon: "🐦",
                category: "consistency",
                earned: false,
                progress: 0,
                target: 5,
                type: "count"
            },
            {
                id: 6,
                name: "Financial Guru",
                description: "Reach $10,000 in total savings",
                icon: "🧠",
                category: "milestones",
                earned: false,
                progress: 0,
                target: 10000,
                type: "amount"
            },
            {
                id: 7,
                name: "Transaction Tracker",
                description: "Log 50 transactions",
                icon: "📝",
                category: "milestones",
                earned: false,
                progress: 0,
                target: 50,
                type: "count"
            },
            {
                id: 8,
                name: "Goal Crusher",
                description: "Complete 5 savings goals",
                icon: "💪",
                category: "goals",
                earned: false,
                progress: 0,
                target: 5,
                type: "count"
            }
        ];

        const savedBadges = localStorage.getItem('savesmart-badges');
        if (savedBadges) {
            return JSON.parse(savedBadges);
        } else {
            this.saveBadges(defaultBadges);
            return defaultBadges;
        }
    }

    saveBadges(badges) {
        localStorage.setItem('savesmart-badges', JSON.stringify(badges));
    }

    handleCategoryChange(category) {
        this.currentCategory = category;
        
        // Update active tab
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });

        this.renderBadges();
    }

    renderBadges() {
        const container = document.getElementById('badges-grid');
        if (!container) return;

        const badges = this.getBadges();
        let filteredBadges = badges;

        // Apply category filter
        if (this.currentCategory !== 'all') {
            filteredBadges = badges.filter(badge => badge.category === this.currentCategory);
        }

        container.innerHTML = filteredBadges.map(badge => `
            <div class="badge-card ${badge.earned ? 'earned' : 'locked'}" data-id="${badge.id}">
                <div class="badge-card__icon">
                    ${badge.icon}
                    ${!badge.earned && '<div class="badge-lock"><i class="fas fa-lock"></i></div>'}
                </div>
                <div class="badge-card__content">
                    <h4>${badge.name}</h4>
                    <p>${badge.description}</p>
                    ${!badge.earned && badge.progress > 0 ? `
                        <div class="badge-progress">
                            <div class="progress-bar small">
                                <div class="progress-fill" style="width: ${(badge.progress / badge.target) * 100}%"></div>
                            </div>
                            <span class="progress-text">${badge.progress}/${badge.target}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="badge-card__status">
                    ${badge.earned ? `
                        <span class="status-earned">
                            <i class="fas fa-check"></i>
                            Earned
                        </span>
                    ` : `
                        <span class="status-locked">
                            <i class="fas fa-lock"></i>
                            Locked
                        </span>
                    `}
                </div>
            </div>
        `).join('');

        // Add event listeners
        this.attachBadgeEventListeners();
    }

    attachBadgeEventListeners() {
        document.querySelectorAll('.badge-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const badgeId = parseInt(e.currentTarget.dataset.id);
                this.showBadgeDetails(badgeId);
            });
        });
    }

    showBadgeDetails(badgeId) {
        const badges = this.getBadges();
        const badge = badges.find(b => b.id === badgeId);

        if (!badge) return;

        document.getElementById('badge-details-title').textContent = badge.name;
        document.getElementById('badge-details-content').innerHTML = `
            <div class="badge-details">
                <div class="badge-details__icon">
                    ${badge.icon}
                </div>
                <div class="badge-details__info">
                    <h4>${badge.name}</h4>
                    <p>${badge.description}</p>
                    
                    ${badge.earned ? `
                        <div class="achievement-status earned">
                            <i class="fas fa-trophy"></i>
                            Achievement Unlocked!
                        </div>
                        <div class="achievement-date">
                            Earned on ${this.getAchievementDate(badgeId)}
                        </div>
                    ` : `
                        <div class="achievement-status locked">
                            <i class="fas fa-lock"></i>
                            Achievement Locked
                        </div>
                        <div class="progress-details">
                            <div class="progress-info">
                                <span>Progress: ${badge.progress}/${badge.target}</span>
                                <span>${Math.round((badge.progress / badge.target) * 100)}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(badge.progress / badge.target) * 100}%"></div>
                            </div>
                        </div>
                        <div class="tips">
                            <h5>How to unlock:</h5>
                            <p>${this.getBadgeTips(badge)}</p>
                        </div>
                    `}
                </div>
            </div>
        `;

        document.getElementById('badge-details-modal').classList.add('active');
    }

    getAchievementDate(badgeId) {
        // In a real app, this would come from the badge data
        const achievements = JSON.parse(localStorage.getItem('savesmart-achievements') || '{}');
        const achievementDate = achievements[badgeId];
        
        if (achievementDate) {
            return window.saveSmartApp.formatDate(achievementDate);
        }
        
        return 'Recently'; // Fallback
    }

    getBadgeTips(badge) {
        const tips = {
            1: "Keep adding to your savings. Every little bit counts!",
            2: "Make saving a daily habit. Try to save something every day for a week.",
            3: "Create and achieve your first savings goal in the Goals section.",
            4: "Set a monthly budget and stick to it for a full month.",
            5: "Make your savings transactions in the morning for 5 consecutive days.",
            6: "Continue building your savings. Consider setting up automatic transfers.",
            7: "Keep tracking your income and expenses regularly.",
            8: "Set and achieve multiple savings goals to reach this milestone."
        };
        
        return tips[badge.id] || "Keep using SaveSmart regularly to unlock this achievement!";
    }

    renderRecentAchievements() {
        const container = document.getElementById('achievements-list');
        if (!container) return;

        const badges = this.getBadges();
        const earnedBadges = badges.filter(badge => badge.earned).slice(0, 5);

        if (earnedBadges.length === 0) {
            container.innerHTML = `
                <div class="empty-achievements">
                    <i class="fas fa-trophy"></i>
                    <p>No achievements yet</p>
                    <small>Start saving to earn your first badge!</small>
                </div>
            `;
            return;
        }

        container.innerHTML = earnedBadges.map(badge => `
            <div class="achievement-item">
                <div class="achievement-icon">
                    ${badge.icon}
                </div>
                <div class="achievement-details">
                    <div class="achievement-name">${badge.name}</div>
                    <div class="achievement-date">Earned recently</div>
                </div>
            </div>
        `).join('');
    }

    updateSummary() {
        const badges = this.getBadges();
        
        const totalBadges = badges.length;
        const earnedBadges = badges.filter(badge => badge.earned).length;
        const lockedBadges = totalBadges - earnedBadges;

        document.getElementById('total-badges').textContent = totalBadges;
        document.getElementById('earned-badges').textContent = earnedBadges;
        document.getElementById('locked-badges').textContent = lockedBadges;

        // Update streak (this would come from user data in a real app)
        const userData = JSON.parse(localStorage.getItem('savesmart-user') || '{}');
        const currentStreak = userData.currentStreak || 0;
        document.getElementById('current-streak').textContent = `${currentStreak} days`;
    }

    // Method to check and update badge progress
    checkBadgeProgress() {
        const badges = this.getBadges();
        let updated = false;

        // Get user data
        const userData = JSON.parse(localStorage.getItem('savesmart-user') || '{}');
        const transactions = window.saveSmartApp.getTransactions();
        const goals = JSON.parse(localStorage.getItem('savesmart-goals') || '[]');

        // Calculate metrics for badges
        const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
        const completedGoals = goals.filter(goal => goal.completed).length;
        const transactionCount = transactions.length;

        // Update badge progress
        badges.forEach(badge => {
            if (!badge.earned) {
                let newProgress = badge.progress;

                switch (badge.id) {
                    case 1: // First Saver
                        newProgress = Math.min(totalSaved, badge.target);
                        break;
                    case 2: // Consistency King
                        // This would require tracking daily savings
                        newProgress = userData.currentStreak || 0;
                        break;
                    case 3: // Goal Getter
                        newProgress = completedGoals;
                        break;
                    case 6: // Financial Guru
                        newProgress = Math.min(totalSaved, badge.target);
                        break;
                    case 7: // Transaction Tracker
                        newProgress = Math.min(transactionCount, badge.target);
                        break;
                    case 8: // Goal Crusher
                        newProgress = Math.min(completedGoals, badge.target);
                        break;
                }

                if (newProgress !== badge.progress) {
                    badge.progress = newProgress;
                    if (badge.progress >= badge.target) {
                        badge.earned = true;
                        badge.earnedDate = new Date().toISOString();
                        this.recordAchievement(badge.id);
                    }
                    updated = true;
                }
            }
        });

        if (updated) {
            this.saveBadges(badges);
            this.renderBadges();
            this.renderRecentAchievements();
            this.updateSummary();
        }
    }

    recordAchievement(badgeId) {
        const achievements = JSON.parse(localStorage.getItem('savesmart-achievements') || '{}');
        achievements[badgeId] = new Date().toISOString();
        localStorage.setItem('savesmart-achievements', JSON.stringify(achievements));

        // Show celebration notification
        const badge = this.getBadges().find(b => b.id === badgeId);
        if (badge) {
            window.saveSmartApp.showNotification(`🎉 Achievement Unlocked: ${badge.name}!`, 'success');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.badgesManager = new BadgesManager();
    
    // Check badge progress periodically
    setInterval(() => {
        window.badgesManager.checkBadgeProgress();
    }, 5000);
});