import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import styles from './signin.module.css'; // Import the CSS Module
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignIn = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User:', user);
            setLoading(false);
            router.push('/dashboard'); // Redirect to dashboard after successful sign-in
        } catch (error) {
            setError((error as Error).message);
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.signin}>
            <div className={styles.signincont}>
                <div className={styles.signinside}>
                    <p className={styles.headsignin}>Sign In</p>
                    <form onSubmit={handleSignIn} className={styles.inputfields}>
                        <label className={styles.textsignin} htmlFor="email">Email-ID</label>
                        <div className={styles.inputoutdiv}>
                            <input
                                type="email"
                                id="email"
                                className={styles.emailidinput}
                                name="email"
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

export default SignIn;