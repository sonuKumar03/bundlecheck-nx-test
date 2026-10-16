import { Route } from '@angular/router';
import { UsersManagementComponent } from './views/users-management.component';
import { RolesMatrixComponent } from './views/roles-matrix.component';
import { ClusterHealthComponent } from './views/cluster-health.component';
import { FeatureFlagsComponent } from './views/feature-flags.component';

export const adminRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: UsersManagementComponent
  },
  {
    path: 'roles',
    component: RolesMatrixComponent
  },
  {
    path: 'system',
    component: ClusterHealthComponent
  },
  {
    path: 'flags',
    component: FeatureFlagsComponent
  },
  {
    path: 'audit',
    loadComponent: () =>
      import('@nx-workspace/feature-audit-logs').then(m => m.AuditLogsComponent)
  }
];
