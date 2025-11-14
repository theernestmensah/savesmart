const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('auth-container');
const signUpForm = document.getElementById('signup-form');
const signInForm = document.getElementById('login-form');

// Toggle between sign-in and sign-up forms
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// Handle Sign-Up Form Submission
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    // Simulate storing user data in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.email === email);

    if (userExists) {
        alert('User with this email already exists.');
    } else {
        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Account created successfully!');
        // Switch to the sign-in panel
        container.classList.remove("right-panel-active");
    }
});

// Handle Sign-In Form Submission
signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        // Simulate a session by storing the logged-in user's email
        localStorage.setItem('loggedInUser', user.email);
        // Redirect to the dashboard page after successful login
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid email or password.');
    }
});
