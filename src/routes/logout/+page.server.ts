import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, cookies }) => {
        // Sign out returns a response with set-cookie headers to clear the session
        await auth.api.signOut({
            headers: request.headers
        });
        
        // Manually clearing the session token cookie as a fallback for maximum security
        // Limpiamos tanto con el prefijo personalizado como el default por si acaso
        cookies.delete('distubeq.session_token', { path: '/' });
        cookies.delete('better-auth.session_token', { path: '/' });
        
        throw redirect(303, '/login');
    }
};
