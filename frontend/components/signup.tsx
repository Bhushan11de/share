import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import styles from './signin.module.css'; // Reuse the CSS Module from signin

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
const db = getFirestore(app);

const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user data in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name: name,
                email: email,
                uid: user.uid
            });

            setLoading(false);
            router.push('/signupnext'); // Redirect to /signupnext page after successful sign-up
        } catch (err) {
            setError('Failed to sign up. Please check your credentials.');
            setLoading(false);
        }
    };

    return (
        <div className={styles.signin}>
            <div className={styles.signincont}>
                <div className={styles.signinside}>
                    <p className={styles.headsignin}>Sign Up</p>
                    <form onSubmit={handleSignup} className={styles.inputfields}>
                        <label className={styles.textsignin} htmlFor="name">Name</label>
                        <div className={styles.inputoutdiv}>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={styles.emailidinput}
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

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
                            Already have an account? <a href="/signin" className={styles.signuproute}>Sign In</a>
                        </p>
                        <button
                            className={styles.buttontext}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;