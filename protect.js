// protect.js
(function() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        // If no user is logged in, redirect to the login page
        window.location.href = 'index.html';
    }
})();
