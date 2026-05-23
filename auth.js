// auth.js
// Handles Supabase authentication logic for login.html

document.addEventListener('DOMContentLoaded', () => {
    // If supabase Client isn't initialized properly, show an error.
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized.');
        return;
    }

    const supabase = window.supabaseClient;
    
    // UI Elements
    const authForm = document.getElementById('auth-form');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const nameGroup = document.getElementById('name-group');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const authSwitchText = document.getElementById('auth-switch-text');
    const authSwitchLink = document.getElementById('auth-switch-link');
    const authError = document.getElementById('auth-error');
    
    const emailInput = document.getElementById('auth-email');
    const passwordInput = document.getElementById('auth-password');
    const nameInput = document.getElementById('auth-name');

    // Determine mode based on page URL
    const isLoginMode = window.location.pathname.includes('login.html');
    const isSignupMode = window.location.pathname.includes('signup.html');

    // Handle Form Submission
    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            authError.textContent = '';
            authSubmitBtn.disabled = true;
            authSubmitBtn.textContent = 'Processing...';

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            try {
                if (isLoginMode) {
                    // Login
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email: email,
                        password: password,
                    });

                    if (error) throw error;
                    
                    // Success login -> redirect to home or products
                    window.location.href = 'index.html';
                } else {
                    // Sign Up
                    const name = nameInput.value.trim();
                    const { data, error } = await supabase.auth.signUp({
                        email: email,
                        password: password,
                        options: {
                            data: {
                                full_name: name
                            }
                        }
                    });

                    if (error) throw error;
                    
                    // Success sign up
                    if (data.user && data.user.identities && data.user.identities.length === 0) {
                        authError.textContent = 'Email already exists. Please sign in.';
                    } else {
                        alert('Registration successful! Please check your email to verify your account.');
                        window.location.href = 'login.html';
                    }
                }
            } catch (err) {
                authError.textContent = err.message || 'An error occurred during authentication.';
            } finally {
                authSubmitBtn.disabled = false;
                authSubmitBtn.textContent = isLoginMode ? 'Sign In' : 'Sign Up';
            }
        });
    }
});

// Helper function to check session across other pages
window.checkSession = async () => {
    if (!window.supabaseClient) return null;
    const { data, error } = await window.supabaseClient.auth.getSession();
    if (error) {
        console.error('Error getting session:', error);
        return null;
    }
    return data.session;
};

// Helper function to logout
window.logout = async () => {
    if (!window.supabaseClient) return;
    await window.supabaseClient.auth.signOut();
    window.location.reload();
};
