// Transactions Management JavaScript
class TransactionsManager {
    constructor() {
        this.currentFilters = {
            type: 'all',
            category: 'all',
            dateRange: 'month'
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderTransactions();
        this.updateSummary();
    }

    setupEventListeners() {
        // Filter event listeners
        document.getElementById('type-filter')?.addEventListener('change', (e) => {
            this.currentFilters.type = e.target.value;
            this.applyFilters();
        });

        document.getElementById('category-filter')?.addEventListener('change', (e) => {
            this.currentFilters.category = e.target.value;
            this.applyFilters();
        });

        document.getElementById('date-filter')?.addEventListener('change', (e) => {
            this.currentFilters.dateRange = e.target.value;
            this.applyFilters();
        });

        // Clear filters
        document.getElementById('clear-filters')?.addEventListener('click', () => {
            this.clearFilters();
        });

        // Export functionality
        document.getElementById('export-btn')?.addEventListener('click', () => {
            this.exportToCSV();
        });

        // Add first transaction
        document.getElementById('add-first-transaction')?.addEventListener('click', () => {
            document.getElementById('quick-add-btn').click();
        });

        // Edit form submission
        document.getElementById('edit-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditTransaction();
        });

        // Delete transaction
        document.getElementById('delete-transaction')?.addEventListener('click', () => {
            this.handleDeleteTransaction();
        });

        // Edit modal close
        document.getElementById('edit-modal-close')?.addEventListener('click', () => {
            document.getElementById('edit-modal').classList.remove('active');
        });

        // Enhanced quick add form for transactions page
        const quickAddForm = document.getElementById('quick-add-form');
        if (quickAddForm) {
            // Set today's date as default
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('transaction-date').value = today;
        }
    }

    getTransactions() {
        return window.saveSmartApp.getTransactions();
    }

    applyFilters() {
        this.renderTransactions();
        this.updateSummary();
    }

    clearFilters() {
        this.currentFilters = {
            type: 'all',
            category: 'all',
            dateRange: 'month'
        };

        document.getElementById('type-filter').value = 'all';
        document.getElementById('category-filter').value = 'all';
        document.getElementById('date-filter').value = 'month';

        this.applyFilters();
    }

    filterTransactions(transactions) {
        return transactions.filter(transaction => {
            // Type filter
            if (this.currentFilters.type !== 'all' && transaction.type !== this.currentFilters.type) {
                return false;
            }

            // Category filter
            if (this.currentFilters.category !== 'all' && transaction.category !== this.currentFilters.category) {
                return false;
            }

            // Date range filter
            if (this.currentFilters.dateRange !== 'all') {
                const transactionDate = new Date(transaction.date);
                const now = new Date();
                let startDate;

                switch (this.currentFilters.dateRange) {
                    case 'today':
                        startDate = new Date(now.setHours(0, 0, 0, 0));
                        break;
                    case 'week':
                        startDate = new Date(now.setDate(now.getDate() - 7));
                        break;
                    case 'month':
                        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                        break;
                    case 'quarter':
                        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                        break;
                    case 'year':
                        startDate = new Date(now.getFullYear(), 0, 1);
                        break;
                    default:
                        return true;
                }

                if (transactionDate < startDate) {
                    return false;
                }
            }

            return true;
        });
    }

    renderTransactions() {
        const container = document.getElementById('transactions-list');
        const emptyState = document.getElementById('empty-state');
        const countElement = document.getElementById('transactions-count');

        if (!container) return;

        const allTransactions = this.getTransactions();
        const filteredTransactions = this.filterTransactions(allTransactions);

        // Update count
        if (countElement) {
            countElement.textContent = filteredTransactions.length;
        }

        // Show empty state if no transactions
        if (filteredTransactions.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        container.style.display = 'block';
        emptyState.style.display = 'none';

        // Render transactions
        container.innerHTML = filteredTransactions.map(transaction => `
            <div class="transaction-item ${transaction.type}" data-id="${transaction.id}">
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
                <div class="transaction-actions">
                    <button class="btn-icon edit-transaction" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-transaction" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to action buttons
        this.attachTransactionEventListeners();
    }

    attachTransactionEventListeners() {
        // Edit buttons
        document.querySelectorAll('.edit-transaction').forEach(button => {
            button.addEventListener('click', (e) => {
                const transactionId = parseInt(e.target.closest('.transaction-item').dataset.id);
                this.openEditModal(transactionId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-transaction').forEach(button => {
            button.addEventListener('click', (e) => {
                const transactionId = parseInt(e.target.closest('.transaction-item').dataset.id);
                this.confirmDeleteTransaction(transactionId);
            });
        });
    }

    openEditModal(transactionId) {
        const transactions = this.getTransactions();
        const transaction = transactions.find(t => t.id === transactionId);

        if (!transaction) return;

        // Populate form
        document.getElementById('edit-transaction-id').value = transaction.id;
        document.getElementById('edit-transaction-amount').value = transaction.amount;
        document.getElementById('edit-transaction-description').value = transaction.description;
        document.getElementById('edit-transaction-type').value = transaction.type;
        document.getElementById('edit-transaction-category').value = transaction.category;
        document.getElementById('edit-transaction-date').value = transaction.date;

        // Show modal
        document.getElementById('edit-modal').classList.add('active');
    }

    handleEditTransaction() {
        const transactionId = parseInt(document.getElementById('edit-transaction-id').value);
        const amount = parseFloat(document.getElementById('edit-transaction-amount').value);
        const description = document.getElementById('edit-transaction-description').value;
        const type = document.getElementById('edit-transaction-type').value;
        const category = document.getElementById('edit-transaction-category').value;
        const date = document.getElementById('edit-transaction-date').value;

        if (!amount || !description) {
            window.saveSmartApp.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const transactions = this.getTransactions();
        const transactionIndex = transactions.findIndex(t => t.id === transactionId);

        if (transactionIndex === -1) {
            window.saveSmartApp.showNotification('Transaction not found', 'error');
            return;
        }

        // Update transaction
        transactions[transactionIndex] = {
            ...transactions[transactionIndex],
            amount,
            description,
            type,
            category,
            date
        };

        // Save to localStorage
        localStorage.setItem('savesmart-transactions', JSON.stringify(transactions));

        // Close modal and refresh
        document.getElementById('edit-modal').classList.remove('active');
        this.renderTransactions();
        this.updateSummary();
        window.saveSmartApp.showNotification('Transaction updated successfully', 'success');
    }

    confirmDeleteTransaction(transactionId) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.handleDeleteTransaction(transactionId);
        }
    }

    handleDeleteTransaction(transactionId = null) {
        if (!transactionId) {
            transactionId = parseInt(document.getElementById('edit-transaction-id').value);
        }

        const transactions = this.getTransactions();
        const transactionIndex = transactions.findIndex(t => t.id === transactionId);

        if (transactionIndex === -1) {
            window.saveSmartApp.showNotification('Transaction not found', 'error');
            return;
        }

        const transaction = transactions[transactionIndex];

        // Remove transaction
        transactions.splice(transactionIndex, 1);
        localStorage.setItem('savesmart-transactions', JSON.stringify(transactions));

        // Update balance
        const userData = JSON.parse(localStorage.getItem('savesmart-user'));
        if (transaction.type === 'income') {
            userData.balance -= transaction.amount;
        } else {
            userData.balance += transaction.amount;
        }
        localStorage.setItem('savesmart-user', JSON.stringify(userData));

        // Close modal and refresh
        document.getElementById('edit-modal').classList.remove('active');
        this.renderTransactions();
        this.updateSummary();
        window.saveSmartApp.showNotification('Transaction deleted successfully', 'success');
    }

    updateSummary() {
        const transactions = this.filterTransactions(this.getTransactions());
        
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const netAmount = totalIncome - totalExpenses;

        document.getElementById('total-income').textContent = window.saveSmartApp.formatCurrency(totalIncome);
        document.getElementById('total-expenses').textContent = window.saveSmartApp.formatCurrency(totalExpenses);
        document.getElementById('net-amount').textContent = window.saveSmartApp.formatCurrency(netAmount);
    }

    exportToCSV() {
        const transactions = this.filterTransactions(this.getTransactions());
        
        if (transactions.length === 0) {
            window.saveSmartApp.showNotification('No transactions to export', 'warning');
            return;
        }

        const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
        const csvData = transactions.map(transaction => [
            transaction.date,
            `"${transaction.description}"`,
            this.formatCategory(transaction.category),
            transaction.type,
            transaction.amount
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `savesmart-transactions-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        window.saveSmartApp.showNotification('Transactions exported successfully', 'success');
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TransactionsManager();
});