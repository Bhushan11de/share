import React, { useState } from 'react';
import { auth } from './firebaseconfig'; // Adjust the path as needed
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import styles from './signin.module.css';

const Signin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoading(false);
            router.push('/dashboard'); // Redirect to dashboard after successful sign-in
        } catch (err) {
            setError('Failed to sign in. Please check your credentials.');
            setLoading(false);
        }
    };

    return (
        <div className={styles.signin}>
            <div className={styles.signincont}>
                <div className={styles.signinside}>
                    <p className={styles.headsignin}>Sign In</p>
                    <form onSubmit={handleSignin} className={styles.inputfields}>
                        <label className={styles.textsignin} htmlFor="email">Email-ID</label>
                        <div className={styles.inputoutdiv}>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={styles.emailidinput}
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <label className={styles.textsignin} htmlFor="password">Password</label>
                        <div className={styles.inputoutdiv}>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className={styles.passwordinput}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <p className={styles.createaccount}>
                            Don't have an account? <a href="/signup" className={styles.signuproute}>Sign Up</a>
                        </p>
                        <button
                            className={styles.buttontext}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signin;