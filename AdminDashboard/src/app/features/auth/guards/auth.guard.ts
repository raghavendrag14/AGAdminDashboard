import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
    
    try{
const isLoggedIn = auth.isLoggedIn;

  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }
} 
    catch(err){
      console.error('Auth guard error:', err);
    }

  return true;
};
