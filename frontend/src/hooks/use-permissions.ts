import {
  type Permission,
  type Role,
  hasPermission as checkPermission,
  ROLE_PERMISSIONS,
} from "@/lib/permissions";

// MOCK: Temporary abstraction for dashboard testing.
// Replace with actual user context/store when authentication is implemented.
const MOCK_ROLE: Role = "owner";

export function usePermissions() {
  const hasPermission = (permission: Permission) => {
    return checkPermission(MOCK_ROLE, permission);
  };

  return {
    hasPermission,
    role: MOCK_ROLE,
    permissions: ROLE_PERMISSIONS[MOCK_ROLE],
  };
}
