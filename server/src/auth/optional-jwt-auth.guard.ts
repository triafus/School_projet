import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override canActivate pour permettre l'accès même si l'authentification échoue
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Vérifions d'abord si un token existe dans la requête
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization || request.headers.Authorization;
    
    // Si aucun token n'est présent, on permet l'accès sans authentification
    // On définit req.user à undefined pour être explicite
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      request.user = undefined;
      return true;
    }

    // Si un token est présent, on essaie d'authentifier
    // Mais on ne lançons pas d'erreur si l'authentification échoue
    try {
      const result = await super.canActivate(context);
      return result as boolean;
    } catch (error) {
      // Si l'authentification échoue (token invalide, expiré, etc.), on permet quand même l'accès
      // On définit explicitement req.user à undefined
      request.user = undefined;
      return true;
    }
  }

  // Override handleRequest pour ne pas lancer d'erreur si l'authentification échoue
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Si l'authentification échoue, on retourne undefined au lieu de lancer une erreur
    // Cela permet à la route de fonctionner avec ou sans authentification
    if (err || !user) {
      // On définit req.user à undefined si l'authentification échoue
      const request = context.switchToHttp().getRequest();
      request.user = undefined;
      return undefined;
    }
    return user;
  }
}
