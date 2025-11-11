// SaveSmart - Main Application JavaScript
class SaveSmartApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.updateCurrentDate();
    }

    setupEventListeners() {
        // Mobile navigation toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('show');
            });
        }

        // Quick add modal
        const quickAddBtn = document.getElementById('quick-add-btn');
        const quickAddModal = document.getElementById('quick-add-modal');
        const modalClose = document.getElementById('modal-close');
        const quickAddForm = document.getElementById('quick-add-form');

        if (quickAddBtn && quickAddModal) {
            quickAddBtn.addEventListener('click', () => {
                quickAddModal.classList.add('active');
            });

            modalClose.addEventListener('click', () => {
                quickAddModal.classList.remove('active');
            });

            // Close modal when clicking outside
            quickAddModal.addEventListener('click', (e) => {
                if (e.target === quickAddModal) {
                    quickAddModal.classList.remove('active');
                }
            });
        }

        if (quickAddForm) {
            quickAddForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleQuickAddTransaction();
            });
        }
    }

    loadUserData() {
        // Load user data from localStorage or initialize
        const userData = localStorage.getItem('savesmart-user');
        if (!userData) {
            const defaultData = {
                balance: 12458.75,
                monthlyBudget: 3000,
                currency: 'USD',
                preferences: {
                    theme: 'light',
                    notifications: true
                }
            };
            localStorage.setItem('savesmart-user', JSON.stringify(defaultData));
        }
    }

    updateCurrentDate() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            dateElement.textContent = now.toLocaleDateString('en-US', options);
        }
    }

    handleQuickAddTransaction() {
        const amount = document.getElementById('transaction-amount').value;
        const description = document.getElementById('transaction-description').value;
        const type = document.getElementById('transaction-type').value;
        const category = document.getElementById('transaction-category').value;

        if (!amount || !description) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const transaction = {
            id: Date.now(),
            amount: parseFloat(amount),
            description,
            type,
            category,
            date: new Date().toISOString(),
            status: 'completed'
        };

        this.saveTransaction(transaction);
        this.showNotification('Transaction added successfully!', 'success');
        
        // Close modal and reset form
        document.getElementById('quick-add-modal').classList.remove('active');
        document.getElementById('quick-add-form').reset();

        // Refresh data if we're on dashboard or transactions page
        if (typeof window.refreshTransactions === 'function') {
            window.refreshTransactions();
        }
    }

    saveTransaction(transaction) {
        const transactions = this.getTransactions();
        transactions.unshift(transaction);
        localStorage.setItem('savesmart-transactions', JSON.stringify(transactions));

        // Update balance
        this.updateBalance(transaction);
    }

    getTransactions() {
        return JSON.parse(localStorage.getItem('savesmart-transactions') || '[]');
    }

    updateBalance(transaction) {
        const userData = JSON.parse(localStorage.getItem('savesmart-user'));
        if (transaction.type === 'income') {
            userData.balance += transaction.amount;
        } else {
            userData.balance -= transaction.amount;
        }
        localStorage.setItem('savesmart-user', JSON.stringify(userData));
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification__close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    border-left: 4px solid #2196F3;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    max-width: 400px;
                    animation: slideIn 0.3s ease;
                }
                .notification--success { border-left-color: #4CAF50; }
                .notification--error { border-left-color: #f44336; }
                .notification--warning { border-left-color: #ff9800; }
                .notification__content {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    flex: 1;
                }
                .notification__close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 4px;
                }
                .notification__close:hover {
                    background: #f5f5f5;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Close button
        notification.querySelector('.notification__close').addEventListener('click', () => {
            notification.remove();
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.saveSmartApp = new SaveSmartApp();
});