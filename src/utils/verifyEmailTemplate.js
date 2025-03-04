const verifyEmailTemplate = ({name, url}) => {
  return `
    <p>Estimado/a ${name}</p>
    <p>Gracias por registrarte en FrontApp by Chris</p>
    <a href=${url} style="color:white;background: #6eb4f5;margin-top: 10px,padding: 20px">
        Verificar Email
    </a>

    `
};

export default verifyEmailTemplate;
