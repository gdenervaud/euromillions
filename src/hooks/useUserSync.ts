import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function useUserSync() {
  const { isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  
  // Query the user by Clerk ID
  const convexUser = useQuery(
    api.users.getByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  useEffect(() => {
    if (isAuthenticated && user && !convexUser) {
      // User is authenticated but doesn't exist in Convex yet
      createOrUpdateUser({
        clerkId: user.id,
        name: user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || 'Unknown User',
        email: user.primaryEmailAddress?.emailAddress,
        profileUrl: user.imageUrl,
      });
    }
  }, [isAuthenticated, user, convexUser, createOrUpdateUser]);

  return {
    user: convexUser,
    isLoading: isAuthenticated && user && convexUser === undefined,
  };
}
