// Dashboard-specific JavaScript
class Dashboard {
    constructor() {
        this.init();
    }

    init() {
        this.renderRecentTransactions();
        this.initCharts();
        this.setupEventListeners();
    }

    renderRecentTransactions() {
        const container = document.getElementById('recent-transactions');
        if (!container) return;

        const transactions = window.saveSmartApp.getTransactions().slice(0, 5);
        
        if (transactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <p>No transactions yet</p>
                    <button class="btn btn--primary" id="add-first-transaction">
                        Add Your First Transaction
                    </button>
                </div>
            `;

            document.getElementById('add-first-transaction')?.addEventListener('click', () => {
                document.getElementById('quick-add-btn').click();
            });
            return;
        }

        container.innerHTML = transactions.map(transaction => `
            <div class="transaction-item ${transaction.type}">
                <div class="transaction-icon">
                    <i class="fas fa-${this.getTransactionIcon(transaction.category)}"></i>
                </div>
                <div class="transaction-details">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-meta">
                        <span class="transaction-category">${this.formatCategory(transaction.category)}</span>
                        <span class="transaction-date">${window.saveSmartApp.formatDate(transaction.date)}</span>
                    </div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${window.saveSmartApp.formatCurrency(transaction.amount)}
                </div>
            </div>
        `).join('');
    }

    getTransactionIcon(category) {
        const icons = {
            salary: 'money-bill-wave',
            freelance: 'laptop-code',
            investment: 'chart-line',
            food: 'utensils',
            transport: 'car',
            entertainment: 'film',
            shopping: 'shopping-bag',
            bills: 'file-invoice-dollar',
            other: 'receipt'
        };
        return icons[category] || 'receipt';
    }

    formatCategory(category) {
        const categories = {
            salary: 'Salary',
            freelance: 'Freelance',
            investment: 'Investment',
            food: 'Food & Dining',
            transport: 'Transportation',
            entertainment: 'Entertainment',
            shopping: 'Shopping',
            bills: 'Bills & Utilities',
            other: 'Other'
        };
        return categories[category] || category;
    }

    initCharts() {
        this.initSpendingChart();
    }

    initSpendingChart() {
        const ctx = document.getElementById('spendingChart');
        if (!ctx) return;

        // Sample data - in a real app, this would come from your transactions
        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Income',
                data: [3200, 3500, 3800, 4200, 3900, 4500],
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Expenses',
                data: [2800, 3000, 3200, 3500, 3300, 3800],
                borderColor: '#f44336',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                fill: true,
                tension: 0.4
            }]
        };

        new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
    }

    setupEventListeners() {
        // Refresh transactions when added
        window.refreshTransactions = () => {
            this.renderRecentTransactions();
        };
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});