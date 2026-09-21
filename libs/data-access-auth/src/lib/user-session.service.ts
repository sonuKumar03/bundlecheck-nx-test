import { Injectable, signal } from '@angular/core';

export type UserRole = 'admin' | 'analyst' | 'partner' | 'viewer';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  private _currentUser = signal<UserProfile | null>({
    id: 'usr_enterprise_01',
    email: 'admin@omnireport.internal',
    name: 'Enterprise Director',
    role: 'admin',
    organizationId: 'org_global_corp'
  });

  readonly currentUser = this._currentUser.asReadonly();

  hasRole(allowedRoles: UserRole[]): boolean {
    const user = this._currentUser();
    return user ? allowedRoles.includes(user.role) : false;
  }

  updateProfile(profile: Partial<UserProfile>): void {
    const current = this._currentUser();
    if (current) {
      this._currentUser.set({ ...current, ...profile });
    }
  }
}
