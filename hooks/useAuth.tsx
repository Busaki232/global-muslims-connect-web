import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  emailConfirmed: boolean;
  signUp: (email: string, password: string, fullName: string, phoneNumber?: string, location?: string, captchaToken?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string, captchaToken?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const isMountedRef = useRef(false);
  const { toast } = useToast();

  // Safe toast function that only works when component is mounted
  const safeToast = (toastOptions: Parameters<typeof toast>[0]) => {
    if (isMountedRef.current) {
      try {
        toast(toastOptions);
      } catch (error) {
        // Toast failed - handled silently in production
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setEmailConfirmed(session?.user?.email_confirmed_at ? true : false);
        setLoading(false);
        
        if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
          safeToast({
            title: "Welcome!",
            description: "Successfully signed in to your account."
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setEmailConfirmed(session?.user?.email_confirmed_at ? true : false);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phoneNumber?: string, location?: string, captchaToken?: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/email-confirmed`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          captchaToken,
          data: {
            full_name: fullName,
            phone_number: phoneNumber,
            location: location
          }
        }
      });

      if (error) {
        safeToast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: error.message
        });
        return { error };
      }

      safeToast({
        title: "Account Created Successfully!",
        description: "We've sent a confirmation link to your email. Please check your inbox and click the link to verify your account before signing in."
      });

      return { error: null };
    } catch (error: any) {
      safeToast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string, captchaToken?: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken
        }
      });

      if (error) {
        // Check if it's an email not confirmed error
        if (error.message.includes('Email not confirmed') || error.message.includes('Invalid login credentials')) {
          safeToast({
            variant: "destructive",
            title: "Email Not Confirmed",
            description: "Please check your email and click the confirmation link before signing in."
          });
        } else {
          safeToast({
            variant: "destructive",
            title: "Sign In Failed",
            description: error.message
          });
        }
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      safeToast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error.message
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      safeToast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
    } catch (error: any) {
      safeToast({
        variant: "destructive",
        title: "Sign Out Failed",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmation = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/email-confirmed`
        }
      });

      if (error) {
        safeToast({
          variant: "destructive",
          title: "Resend Failed",
          description: error.message
        });
        return { error };
      }

      safeToast({
        title: "Confirmation Email Sent!",
        description: "Please check your email for the new confirmation link."
      });

      return { error: null };
    } catch (error: any) {
      safeToast({
        variant: "destructive",
        title: "Resend Failed",
        description: error.message
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    emailConfirmed,
    signUp,
    signIn,
    signOut,
    resendConfirmation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};