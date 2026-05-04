import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import type { AuthContextValue } from "../types";
import { isSupabaseConfigured, supabase } from "../supabaseClient";
import { useToast } from "./ToastContext";

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);
  const showToast = useToast();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return undefined;
    }

    let mounted = true;

    supabase!.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) showToast(error.message);
      setSession(data.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase!.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      if (event === "SIGNED_IN") showToast("Signed in successfully.");
      if (event === "SIGNED_OUT") showToast("Signed out.");
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [showToast]);

  const signUpWithEmail = async ({
    name,
    email,
    password,
    grade,
    school,
    learningGoal
  }: {
    name: string;
    email: string;
    password: string;
    grade: string;
    school: string;
    learningGoal: string;
  }) => {
    if (!isSupabaseConfigured) {
      return { error: new Error("Add Supabase environment variables to enable auth.") };
    }

    return supabase!.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          grade,
          school,
          learning_goal: learningGoal
        },
        emailRedirectTo: `${window.location.origin}/login`
      }
    });
  };

  const signInWithEmail = async ({ email, password }: { email: string; password: string }) => {
    if (!isSupabaseConfigured) {
      return { error: new Error("Add Supabase environment variables to enable auth.") };
    }

    return supabase!.auth.signInWithPassword({ email, password });
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      return { error: new Error("Add Supabase environment variables to enable Google login.") };
    }

    return supabase!.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/courses`
      }
    });
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) return { error: null };
    return supabase!.auth.signOut();
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      isConfigured: isSupabaseConfigured,
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      signOut
    }),
    [loading, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
