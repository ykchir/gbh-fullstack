1. Auth / RBAC dans SELFY
1.1 Comment Cognito est utilise (JWT, groups, custom claims)
L'authentification est 100% JWT Cognito, validee localement (pas d'appel Cognito a chaque requete):
Backend - Chaine d'authentification en 2 couches:
JwtLocalGuard (libs/auth/src/guards/jwt-local.guard.ts) - Guard global:
Extrait le Bearer token du header Authorization
Valide localement le JWT (signature RS256 via JWKS, expiration, issuer, token_use: access)
Verifie dans un RevocationCacheService si le token/user est revoque
Attache sur request.user un AuthenticatedUser:
jwt-local.guard.ts
Lines 1-26
// ...export interface AuthenticatedUser {  id: string;           // UUID deterministe genere depuis Cognito sub  cognitoSub: string;   // sub du JWT Cognito  username?: string;  email?: string;  groups?: string[];    // cognito:groups (depuis le token)  tokenExp: number;  tokenIat: number;}
JwtIntrospectionGuard (libs/auth/src/guards/jwt-introspection.guard.ts) - Guard optionnel pour operations sensibles:
Appelle le user-service pour verifier que le user est toujours ACTIVE
Enrichit request.user avec les roles resolus depuis la DB
Claims Cognito utilises: sub, cognito:username, email, cognito:groups, exp, iat, jti, token_use, client_id
1.2 Modele RBAC - Roles / Permissions / Policies
Le RBAC est stocke en PostgreSQL (schema authorization) et resolu cote backend:
Roles existants (user-roles.contract.ts):
user-roles.contract.ts
Lines 1-13
export enum UserRole {  SUPER_ADMIN = "SUPER_ADMIN",  PRODUCT_MANAGER = "PRODUCT_MANAGER",  TEAM_LEAD_FRANCE = "TEAM_LEAD_FRANCE",  TEAM_LEAD_OFFSHORE = "TEAM_LEAD_OFFSHORE",  CRC_FRANCE = "CRC_FRANCE",  CRC_OFFSHORE = "CRC_OFFSHORE",}export enum Realm {  FRANCE = "FRANCE",  OFFSHORE = "OFFSHORE",}
Hierarchie de niveaux (role-levels.const.ts):
role-levels.const.ts
Lines 1-10
export const ROLE_LEVELS: Record<UserRole, number> = {  [UserRole.SUPER_ADMIN]: 0,       // Bypass total  [UserRole.PRODUCT_MANAGER]: 10,  [UserRole.TEAM_LEAD_FRANCE]: 20,  [UserRole.TEAM_LEAD_OFFSHORE]: 20,  [UserRole.CRC_FRANCE]: 30,  [UserRole.CRC_OFFSHORE]: 30,};
Policies existantes (policy-name.ts) - 17 policies couvrant user, justificatif, photo, priorite, KPI, donnees financieres:
policy-name.ts
Lines 1-35
export enum PolicyName {  USER_CREATE = "user.create",  USER_UPDATE = "user.update",  USER_DELETE = "user.delete",  USER_ASSIGN_ROLE = "user.assign_role",  USER_VIEW = "user.view",  USER_EXPORT = "user.export",  ROLE_VIEW = "role.view",  JUSTIF_VALIDATE = "justif.validate",  // ... + photo, priority, kpi, data policies}
Mecanisme d'evaluation - Le AuthorizationService charge les permissions du user (roles + policies + conditions), avec cache in-memory et TTL configurable. Il supporte:
hasPermission(userId, policy, context?) - check unique
hasAnyPermission(userId, policies[], context?) - OR
hasAllPermissions(userId, policies[], context?) - AND
Conditions granulaires : produit, type, domaine (allow/deny)
SUPER_ADMIN bypass automatique
Decorators NestJS pour les controllers:
require-permission.decorator.ts
Lines 14-41
export const RequirePermission = (policy: PolicyName, context?: AuthorizationContext) => ...export const RequirePermissions = (policies: PolicyName[], context?: AuthorizationContext) => ...export const RequireAnyPermission = (policies: PolicyName[], context?: AuthorizationContext) => ...
Verdict pour les templates SC: Le modele est extensible. Il faudra ajouter des PolicyName pour le module template (ex: template.create, template.edit, template.validate, template.publish, template.archive) et potentiellement de nouveaux roles (ex: TEMPLATE_REVIEWER, TEMPLATE_VALIDATOR). Le pattern est deja en place, pas besoin de refaire l'archi.
2. Patterns d'integration externes
2.1 Adapter / client HTTP
Backend: Le HttpModule (Axios) est deja configure dans InfrastructureModule:
infrastructure.module.ts
Lines 21-31
@Module({  imports: [    DatabaseModule.forRoot([]),    ConfigModule,    HttpModule.register({      timeout: 30000,      maxRedirects: 5,      // ...    }),  ],  // ...})
Mais aucun microservice ne consomme actuellement une API REST externe. Les integrations existantes sont:
Cognito : via SDK @aws-sdk/client-cognito-identity-provider (adapter CognitoClient)
SQS : via SDK @aws-sdk/client-sqs (adapter SqsClientService)
S3 : via SDK @aws-sdk/client-s3 (adapter via port/adapter)
2.2 Retry / Circuit breaker
DB: Retry natif TypeORM (retryAttempts: 10, retryDelay: 8084 dans database-options.utils.ts)
SQS: Pas de retry applicatif explicite, mais DLQ configuree (Dead Letter Queue)
Cognito: Aucun retry/circuit breaker
Pas de circuit breaker au sens propre (pas de opossum ou similaire installe)
2.3 Observabilite / Correlation ID
Le pattern Correlation ID est en place:
correlation-id.middleware.ts
Lines 1-24
@Injectable()export class CorrelationIdMiddleware implements NestMiddleware {  use(req: Request, res: Response, next: NextFunction): void {    const correlationId = (req.headers["x-correlation-id"] as string) || uuidv4();    res.setHeader("x-correlation-id", correlationId);    LoggerService.setLogContext({      correlationId,      requestId: uuidv4(),      path: req.path,      method: req.method,    });    next();  }}
Le LoggerService utilise AsyncLocalStorage pour propager le contexte et produit du JSON structure:
logger.service.ts
Lines 47-66
private formatLogMessage(message, context, additionalData) {    const logEntry = {      timestamp,      message,      context,      correlationId: logContext.correlationId || "unknown",      serviceName: logContext.serviceName,      // ...    };    return JSON.stringify(logEntry);  }
Pas de Datadog/ELK/OpenTelemetry installe actuellement (juste stdout JSON, compatible CloudWatch).
2.4 Audit Log
Un systeme d'audit existe en base de donnees via triggers PostgreSQL:
Tables (schema authorization):
audit_log : action, table_name, record_id, details (JSONB), created_at
user_history : audit_log_id, user_id, changed_by, change_type
field_change_history : audit_log_id, field_name, old_value, new_value, change_type, is_sensitive
Un trigger trg_audit_users capture automatiquement les INSERT/UPDATE/DELETE sur la table users avec les details complets (ancien/nouveau record) et l'historique champ par champ.
Outbox pattern : La table outbox_messages existe aussi dans le document-service pour le transactional outbox pattern (PENDING -> PROCESSING -> COMPLETED/FAILED, avec retry_count/max_retries).
Verdict: L'audit de base existe cote user, mais uniquement via trigger DB. Il n'y a pas d'audit applicatif generique (pas de service AuditService reutilisable). Pour le module templates, il faudrait soit etendre les triggers, soit creer un audit service applicatif.
3. Frontend Next.js
3.1 Architecture
Element	Stack
Framework	Next.js 15 (App Router, standalone output)
Routing	App Router avec Route Groups: (auth), (dashboard)
State management	Zustand (persist middleware) + nuqs (URL state)
Server state	TanStack React Query v5
Forms	React Hook Form + Zod (resolver @hookform/resolvers)
HTTP Client	Axios (custom httpClient wrapper avec interceptors auto-refresh)
Styling	Tailwind CSS 4 + tailwind-merge + clsx + tailwindcss-animate
UI primitives	Radix UI (@radix-ui/react-slot) + composants custom
Icons	Lucide React
Storybook	Storybook 9 configure (port 6007)
Tests	Jest + Testing Library
3.2 Composants UI disponibles
Le src/components/ui/ contient un design system maison avec:
button (avec variants via CVA)
table (avec header, row, cell, status badge, date cell, action popover, skeleton)
modal (+ validation-modal)
input, label, checkbox, radio-button, select-dropdown, toggle
chip, alert, empty-state, search-box, pagination-select
stat-card, block
Tous avec Storybook stories
3.3 Pattern HTTP / Auth Frontend
Le http-client.ts est un wrapper Axios sophistique avec:
Injection automatique du Bearer token
Auto-refresh token sur 401 (avec queue de requetes en attente)
Resolution dynamique d'URL par service (user-service / document-service) via runtime-config.ts
Middleware Next.js pour route protection (roles depuis le token JWT)
3.4 RBAC Frontend
Le middleware Next.js fait du role-checking basique:
middleware.ts
Lines 17-31
const RESTRICTED_ROUTES_BY_PROFILE: Record<string, readonly string[]> = {  CRC_FRANCE: ['/justificatifs/liberes', '/users', '/priorisation'],  CRC_OFFSHORE: ['/users', '/priorisation'],};const PRIVILEGED_ROLES = new Set([  'SUPER_ADMIN', 'ADMIN', 'ADMIN_ALL', 'PRODUCT_MANAGER',  'TEAM_MANAGER', 'TEAM_LEAD_FRANCE', 'TEAM_LEAD_OFFSHORE',]);
Les roles sont extraits du JWT payload (claim cognito:groups normalise). Pas de gestion fine des policies cote front (uniquement restriction par route + role).
4. Format Template Email
4.1 Templates existants dans le code
Il n'y a aucun template email HTML dans le codebase SELFY (ni .html, ni .hbs, ni .mjml). Les seuls emails envoyes passent exclusivement par Cognito natif :
Email de bienvenue (mot de passe temporaire) via AdminCreateUser avec DesiredDeliveryMediums: ["EMAIL"]
Email de verification via GetUserAttributeVerificationCode
Email de reset password via ForgotPassword
Cognito utilise ses propres templates internes (configurables dans la console AWS mais pas geres dans ce code).
4.2 Variables et injection
Aucun moteur de templating n'est present cote SELFY. Les variables qu'on peut anticiper cote IRIS/assets (basees sur les entites du domaine SELFY) seraient:
Donnees user : nom, prenom, email, profil
Donnees contrat/document : contractReference, externalRequestId
Dates : createdAt, validatedAt
Liens : URLs presignees S3
4.3 Header/Footer/Signature
Aucune gestion dans le code actuel. Tout est delegue a Cognito ou inexistant.
4.4 Verdict editeur
Puisqu'il n'y a aucun template existant a migrer dans SELFY et que les templates sont geres dans les assets via IRIS, le choix d'editeur est libre. Le fait qu'IRIS centralise deja les templates signifie que :
Le format de sortie doit etre celui attendu par IRIS (probablement HTML)
Un editeur WYSIWYG drag-and-drop (type Unlayer/Beefree) est parfaitement adapte car il exporte du HTML standardise
MJML pourrait etre utilise en intermediaire (l'editeur genere le design -> export MJML -> compilation en HTML responsive) mais ce n'est pas indispensable si l'editeur embarque produit directement du HTML responsive de qualite
Resume synthetique pour le chiffrage
Brique	Existe	Reutilisable pour templates	Effort supplementaire
Auth JWT Cognito	Oui	Oui - identique	0
RBAC (roles/policies/guard)	Oui	Oui - ajouter PolicyNames	~1j (ajout policies + seeds)
Audit DB (triggers)	Oui (users seulement)	Pattern reutilisable	~2-3j (adapter pour templates)
Correlation ID / Logger JSON	Oui	Oui - natif	0
HTTP client externe (vers IRIS)	Non	HttpModule present	~3-5j (adapter IRIS + retry + error mapping)
Circuit breaker	Non	-	~2j si necessaire
Frontend framework	Oui (Next.js 15 / App Router)	Oui	0
Design system / UI kit	Oui (custom Tailwind + Storybook)	Oui	~2-3j (composants specifiques templates)
Table / Forms / State	Oui (React Query + Zustand + RHF + Zod)	Oui	0
RBAC Frontend	Partiel (routes/roles, pas policies)	A enrichir	~2-3j (permission-based rendering)
Templates email existants	Non	N/A	N/A (IRIS gere le stockage)
