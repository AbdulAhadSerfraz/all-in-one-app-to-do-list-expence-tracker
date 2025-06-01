"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/auth-context';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const { signIn, signUp, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      if (isSignUp) {
        const { success, error } = await signUp(email, password);
        if (success) {
          setIsSignUp(false);
          setEmail('');
          setPassword('');
        }
      } else {
        await signIn(email, password);
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card rounded-lg shadow-sm p-6 border">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">Welcome to HabitSync</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Track your habits, expenses, and daily activities all in one place
          </p>
        </div>
        <div className="mt-6 bg-muted rounded-lg p-1">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              className={`py-2 text-sm font-medium rounded-md transition-colors ${!isSignUp ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`py-2 text-sm font-medium rounded-md transition-colors ${isSignUp ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
          </div>
        </div>
        <form onSubmit={handleAuth} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm shadow-sm placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              required
              minLength={6}
              className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md text-sm shadow-sm placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder={isSignUp ? 'Choose a password (min. 6 characters)' : 'Enter your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            <span className="flex items-center">
              {isLoading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}

