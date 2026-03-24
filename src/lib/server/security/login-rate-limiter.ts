/**
 * Rate limiter para intentos de login.
 * Limita a un máximo de intentos por email dentro de una ventana de tiempo.
 * Usa Map en memoria — adecuado para aplicaciones de bajo/medio tráfico.
 */

interface AttemptRecord {
	count: number;
	firstAttemptAt: number;
	lockedUntil: number | null;
}

interface RateLimitResult {
	allowed: boolean;
	remainingAttempts: number;
	retryAfterSeconds: number | null;
	message: string | null;
}

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutos de bloqueo
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // Limpiar entradas expiradas cada 10 min

class LoginRateLimiter {
	private attempts: Map<string, AttemptRecord> = new Map();
	private cleanupTimer: ReturnType<typeof setInterval> | null = null;

	constructor() {
		// Limpiar entradas expiradas periódicamente para evitar fugas de memoria
		this.cleanupTimer = setInterval(() => this.cleanup(), CLEANUP_INTERVAL_MS);
	}

	/**
	 * Verifica si un email puede intentar login.
	 */
	check(email: string): RateLimitResult {
		const key = email.toLowerCase().trim();
		const record = this.attempts.get(key);
		const now = Date.now();

		// Si no hay registro, permitir
		if (!record) {
			return {
				allowed: true,
				remainingAttempts: MAX_ATTEMPTS,
				retryAfterSeconds: null,
				message: null
			};
		}

		// Si está bloqueado, verificar si el bloqueo ya expiró
		if (record.lockedUntil) {
			if (now < record.lockedUntil) {
				const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
				const minutes = Math.ceil(retryAfterSeconds / 60);
				return {
					allowed: false,
					remainingAttempts: 0,
					retryAfterSeconds,
					message: `Demasiados intentos fallidos. Su cuenta está bloqueada temporalmente. Intente nuevamente en ${minutes} minuto${minutes !== 1 ? 's' : ''}.`
				};
			}
			// El bloqueo expiró, resetear
			this.attempts.delete(key);
			return {
				allowed: true,
				remainingAttempts: MAX_ATTEMPTS,
				retryAfterSeconds: null,
				message: null
			};
		}

		// Si la ventana de tiempo expiró, resetear
		if (now - record.firstAttemptAt > WINDOW_MS) {
			this.attempts.delete(key);
			return {
				allowed: true,
				remainingAttempts: MAX_ATTEMPTS,
				retryAfterSeconds: null,
				message: null
			};
		}

		// Verificar si alcanzó el máximo de intentos
		if (record.count >= MAX_ATTEMPTS) {
			// Activar bloqueo
			record.lockedUntil = now + LOCKOUT_MS;
			const minutes = Math.ceil(LOCKOUT_MS / 1000 / 60);
			return {
				allowed: false,
				remainingAttempts: 0,
				retryAfterSeconds: Math.ceil(LOCKOUT_MS / 1000),
				message: `Ha excedido el máximo de ${MAX_ATTEMPTS} intentos. Su cuenta ha sido bloqueada por ${minutes} minutos por seguridad.`
			};
		}

		const remaining = MAX_ATTEMPTS - record.count;
		return {
			allowed: true,
			remainingAttempts: remaining,
			retryAfterSeconds: null,
			message: remaining <= 2
				? `Atención: le quedan ${remaining} intento${remaining !== 1 ? 's' : ''} antes del bloqueo temporal.`
				: null
		};
	}

	/**
	 * Registra un intento fallido para un email.
	 */
	recordFailedAttempt(email: string): void {
		const key = email.toLowerCase().trim();
		const now = Date.now();
		const record = this.attempts.get(key);

		if (!record || now - record.firstAttemptAt > WINDOW_MS) {
			this.attempts.set(key, {
				count: 1,
				firstAttemptAt: now,
				lockedUntil: null
			});
		} else {
			record.count++;
		}
	}

	/**
	 * Resetea los intentos de un email (tras login exitoso).
	 */
	resetAttempts(email: string): void {
		const key = email.toLowerCase().trim();
		this.attempts.delete(key);
	}

	/**
	 * Limpia entradas expiradas del mapa.
	 */
	private cleanup(): void {
		const now = Date.now();
		for (const [key, record] of this.attempts) {
			// Si el bloqueo expiró o la ventana de tiempo pasó
			if (
				(record.lockedUntil && now > record.lockedUntil) ||
				(!record.lockedUntil && now - record.firstAttemptAt > WINDOW_MS)
			) {
				this.attempts.delete(key);
			}
		}
	}

	/**
	 * Destruye el timer de limpieza (para testing).
	 */
	destroy(): void {
		if (this.cleanupTimer) {
			clearInterval(this.cleanupTimer);
			this.cleanupTimer = null;
		}
	}
}

// Singleton — una instancia compartida en todo el servidor
export const loginRateLimiter = new LoginRateLimiter();
