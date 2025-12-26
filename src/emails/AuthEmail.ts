import { transporter } from "../config/nodemailer";

interface InterfaceEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: InterfaceEmail) => {
    const info = await transporter.sendMail({
      from: "ProjectMagnament <admin@gamil.com>",
      to: user.email,
      subject: "ProjectMagnament - CONFIRMA TU CUENTA",
      text: "ProjectMagnament - CONFIRMA TU CUENTA",
      html: `
  <div style="font-family: Arial, Helvetica, sans-serif; color: #333; line-height: 1.5;">
    <h2 style="color: #4f46e5;">ProjectMagnament</h2>

    <p>Hola <strong>${user.name}</strong>,</p>

    <p>
      Gracias por crear una cuenta en <strong>ProjectMagnament</strong>.
      Para activar tu cuenta, por favor confirma tu email haciendo clic en el siguiente botón:
    </p>

    <a 
      href="${process.env.FRONTEND_URL}/auth/confirm-account"
      style="
        display: inline-block;
        padding: 12px 20px;
        margin: 20px 0;
        background-color: #4f46e5;
        color: #ffffff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;

      "
    >
      Confirmar cuenta
    </a>
    <p style="color:#008000; font-style: italic;"> E ingresa el codigo: 
        <b>${user.token}</b> 
    </p>
<p>Este Token expira en 10 minutos</p>
    <p>
      Si no creaste esta cuenta, puedes ignorar este mensaje.
    </p>

    <hr />

    <p style="font-size: 12px; color: #777;">
      © ${new Date().getFullYear()} ProjectMagnament. Todos los derechos reservados.
    </p>
  </div>
`,
    });
    console.log(info);
  };
}
