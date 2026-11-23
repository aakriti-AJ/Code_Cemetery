
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";

import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

import { auth, db, isPreviewMode } from "../lib/firebase";
import { AuthContext } from "./auth-context";
import type { UserProfile } from "../types/user";
import {publishPublicProfile} from "../services/community.service";
import {syncGithubNow} from "../services/github-auto.service";

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentUser, setCurrentUser] =
    useState<User | null>(null);

  const [userProfile, setUserProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(!isPreviewMode);
  const syncedGithub = useRef(new Set<string>());

  useEffect(() => {
    if (isPreviewMode) {
      // Showcase does not authenticate fictitious users or use live credentials.
      return;
    }
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        unsubscribeProfile?.();
        unsubscribeProfile = undefined;

        setCurrentUser(firebaseUser);
        setUserProfile(null);

        if (!firebaseUser) {
          setLoading(false);
          return;
        }

        setLoading(true);

        unsubscribeProfile = onSnapshot(
          doc(db, "users", firebaseUser.uid),
          (snapshot) => {
            if (snapshot.exists()) {
              const profile=snapshot.data() as UserProfile;
              setUserProfile(profile);
              publishPublicProfile(profile).catch(error=>console.warn('Public developer directory sync failed:',error));
              if(profile.githubAutoImport && firebaseUser.providerData.some(p=>p.providerId==='github.com') && !syncedGithub.current.has(firebaseUser.uid)){
                syncedGithub.current.add(firebaseUser.uid);
                void syncGithubNow().catch(error=>console.warn('Optional GitHub auto-sync failed:',error));
              }
            } else {
              setUserProfile(null);
            }

            setLoading(false);
          },
          (error) => {
            console.error(
              "Failed to load user profile:",
              error
            );

            setUserProfile(null);
            setLoading(false);
          }
        );
      },
      (error) => {
        console.error(
          "Authentication state error:",
          error
        );

        setCurrentUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeProfile?.();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
