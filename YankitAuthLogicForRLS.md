# Yankit Authentication & RLS Policy Review Guide

This document outlines Yankit's authentication flow and key considerations for reviewing and implementing Supabase Row Level Security (RLS) policies.

## 1. Core Authentication Provider

*   **Supabase Auth:** All authentication (email/password, social logins like Google & Facebook) is managed by Supabase Auth.

## 2. User Sign-Up Flow (`SignUpForm.jsx`)

*   **Input:** First name, surname, email, password.
*   **Action:** Calls Supabase `auth.signUp`.
    *   `first_name`, `surname`, `full_name` are passed in `options.data` and stored in `auth.users.raw_user_meta_data`.
*   **Critical Step: Profile Creation:**
    *   Upon successful `auth.signUp`, a record is **immediately created in the public `profiles` table**.
    *   `profiles.id` is linked to `auth.users.id`.
    *   `profiles.email`, `profiles.full_name`, `profiles.first_name`, `profiles.surname`, `profiles.avatar_url` are populated.
*   **Outcome:** User receives a confirmation email. Account is active but requires email verification for some features.

## 3. User Sign-In Flow (`SignInForm.jsx`, `SocialLoginButtons.jsx`)

*   **Email/Password:** Uses Supabase `auth.signInWithPassword`.
*   **Social Logins:** Uses Supabase `auth.signInWithOAuth`.
    *   `redirectTo` is configured to return users to the app (e.g., dashboard).

## 4. Session Management & Profile Handling (`AuthContext.jsx`)

*   **`onAuthStateChange` Listener:** Keeps the app's session state synchronized with Supabase Auth.
*   **Profile Auto-Creation/Verification (`createProfileIfNeeded` function):**
    *   **Trigger:** Fires on `onAuthStateChange` or initial session fetch if a user is authenticated.
    *   **Logic:**
        1.  Checks if a profile for the `currentUser.id` exists in the `profiles` table.
        2.  **If no profile is found** (e.g., social auth sign-up, or an orphaned `auth.users` record):
            *   A new record is inserted into the `profiles` table.
            *   User metadata (name, email, avatar) from `currentUser` is used to populate the new profile.
    *   **Purpose:** Ensures every authenticated user in `auth.users` has a corresponding entry in `public.profiles`. This is **essential** for RLS policies that join or reference `auth.uid()` with `profiles.id`.
*   **Navigation Logic:**
    *   Redirects users based on auth state (e.g., to `/dashboard` after login, `/signin` if unauthenticated).
    *   Checks `email_confirmed_at` and can redirect to `/confirm-email`.

## 5. Protected Routes (`ProtectedRoute.jsx`)

*   Wraps components/pages requiring authentication.
*   Redirects to `/signin` if no active session, passing the original intended `location`.

## 6. Supabase Client (`supabaseClient.js`)

*   A single Supabase client instance (initialized with `supabaseUrl` and `supabaseAnonKey`) is used for all Supabase interactions.

## 7. Key Implications & Tasks for RLS Policy Review

*   **`auth.uid()` is Central:** RLS policies **must** primarily rely on `auth.uid()` to identify the currently authenticated user.
*   **`profiles` Table Linkage:**
    *   Policies for tables like `listings`, `shipments`, `conversations` (which have a `user_id` column) will typically check `user_id = auth.uid()`.
    *   Due to the `createProfileIfNeeded` logic, it can be generally assumed that if `auth.uid()` exists, a corresponding record *should* exist in `profiles` with `profiles.id = auth.uid()`. This is vital for policies that might `SELECT` from or `JOIN` with `profiles`.
*   **Email Confirmation:** While the client-side app checks `email_confirmed_at` for UI/UX flows, RLS policies usually don't need to check this directly unless a specific business rule demands it at the database level. The primary gate for data access is `auth.uid()`.
*   **Public Data:** For tables like `flight_routes_data` or publicly viewable active `listings`, RLS policies are set to allow broader access (e.g., for `public`, `anon`, or `authenticated` roles without specific `auth.uid()` checks).

*   **Crucial Developer Tasks for RLS Verification:**
    *   **Query Existing Policies:** Directly query the `pg_policies` table in the Supabase SQL Editor (or use the Supabase Dashboard UI) to inspect the `DEFINITION` and `CHECK` expressions of all RLS policies on relevant tables (e.g., `profiles`, `listings`, `shipments`, `conversations`, `messages`).
        ```sql
        -- Example: Query policies for the 'listings' table
        SELECT * FROM pg_policies WHERE tablename = 'listings';
        ```
    *   **Observe Application Behavior:**
        *   Thoroughly test the **Dashboard** functionality. Pay close attention to data visibility and actions (e.g., viewing personal stats, listings, shipments). Ensure users only see their own data where appropriate.
        *   Test other areas previously identified as problematic or complex regarding data access. This includes:
            *   Creating, viewing, updating, and deleting listings.
            *   Initiating and participating in conversations and messages.
            *   Viewing and managing shipments (both as a sender and a traveler).
            *   Profile updates.
        *   Verify that actions by one user do not inadvertently affect or expose data of another user.
        *   Test anonymous user access to ensure they can only see publicly designated data.
    *   **Test Edge Cases:** Consider scenarios like newly signed-up users, users with incomplete profiles, or users attempting to access resources they don't own via direct URL manipulation (if applicable).
    *   **Cross-Reference with Code:** Compare the RLS policy logic with the client-side data fetching logic (e.g., in `useDashboardLogic.jsx`, `AuthContext.jsx`) to ensure they are aligned.
</harkdown>