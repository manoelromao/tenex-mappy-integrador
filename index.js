import express from 'express';
import axios from 'axios';

const app = express();

// 🔴 ISSO TEM QUE VIR ANTES DAS ROTAS
app.use(express.json());

// ✅ ROTA DE SAÚDE
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// ✅ WEBHOOK TENEX
app.post('/webhook/tenex/clientes', async (req, res) => {
  try {
    console.log('Webhook recebido:', req.body);

    const paciente = {
      name: req.body.nome,
      cpf: req.body.cpf,
      birth_date: req.body['data nascimento'],
      gender: req.body.genero,
      address: req.body.endereco,
      address_number: req.body.numero,
      city: req.body.cidade,
      state: req.body.estado,
      zip_code: req.body.cep
    };

    await axios.post(
      `${process.env.MAPPY_BASE_URL}/patients`,
      paciente,
      {
        headers: {
          Authorization: `Bearer ${process.env.MAPPY_TOKEN}`
        }
      }
    );

    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro no webhook:', error.response?.data || error.message);
    res.status(500).send('Erro interno');
  }
});

// 🔊 START DO SERVIDOR (OBRIGATÓRIO NO RENDER)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Integrador rodando na porta ${PORT}`);
});
