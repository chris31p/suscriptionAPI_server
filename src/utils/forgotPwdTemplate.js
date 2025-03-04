const forgotPwdTemplate = ({ name, otp }) => {
  return `
    <div>
        <p>Estimado/a ${name},</p>
        <p>Se ha solicitado un reseteo de su contraseña. Por favor use a continuación el código OTP 
        asignado para resetear su contraseña</p>
        <div style="background: yellow; font-size:20px;padding:10px;text-align:center;font-weight:300">
            ${otp}
        </div>
        <p>Este código sólo es válido por 1 hora. Ingrese el código en el sitio web
        de frontApp para proceder a resetear su contraseña.</p>
        <br/>
        <p>Saludos,</p>
        <p>frontApp by Chris</p>
    </div>

    `;
};

export default forgotPwdTemplate;
