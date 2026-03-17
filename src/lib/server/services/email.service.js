import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

export class EmailService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: env.GMAIL_USER,
				pass: env.GMAIL_APP_PASSWORD
			}
		});
	}

	/**
	 * Send a password recovery email
	 * @param {string} to
	 * @param {string} token
	 * @returns {Promise<any>}
	 */
	async sendRecoveryEmail(to, token) {
		const mailOptions = {
			from: `"Ferretería Distubeq" <${env.GMAIL_USER}>`,
			to: to,
			subject: 'Recuperación de Contraseña',
			html: `
				<div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
					<h2 style="color: #1B3A6B;">Restablecer Contraseña</h2>
					<p>Has solicitado restablecer tu contraseña para el Sistema de Gestión de Distubeq.</p>
					<p>Usa el siguiente token o haz clic en el enlace para continuar:</p>
					<div style="background: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
						${token}
					</div>
					<p>Si no solicitaste esto, puedes ignorar este correo.</p>
					<hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
					<p style="font-size: 12px; color: #888;">© 2023 Ferretería Distubeq. Todos los derechos reservados.</p>
				</div>
			`
		};

		return await this.transporter.sendMail(mailOptions);
	}
}

export const emailService = new EmailService();
