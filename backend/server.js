const express = require('express');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Configurar Mercado Pago
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN 
});

// Webhook para notificações do Mercado Pago
app.post('/api/webhooks/mercadopago', async (req, res) => {
    const { action, data } = req.body;
    
    console.log(`🔔 Webhook Recebido: ${action}`);

    if (action === 'payment.created' || action === 'payment.updated') {
        const paymentId = data.id;
        console.log(`✅ Pagamento Atualizado: ${paymentId}`);
        // Aqui você verificaria o status real do pagamento usando o SDK
    }

    res.status(200).send('OK');
});

// Rota para criar Preferência de Checkout Pro
app.post('/api/create-preference', async (req, res) => {
    const { items, isSubscription, email } = req.body;

    try {
        const preference = new Preference(client);

        const body = {
            items: isSubscription ? [
                {
                    title: 'Assinatura Clube Além do Véu',
                    quantity: 1,
                    unit_price: 59.90,
                    currency_id: 'BRL'
                }
            ] : items.map(item => ({
                id: item.id.toString(),
                title: item.title,
                quantity: item.qty,
                unit_price: item.price,
                currency_id: 'BRL',
                picture_url: item.cover
            })),
            payer: {
                email: email
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL}/?payment=success`,
                failure: `${process.env.FRONTEND_URL}/?payment=failure`,
                pending: `${process.env.FRONTEND_URL}/?payment=pending`,
            },
            auto_return: 'approved',
            notification_url: `${process.env.BACKEND_URL}/api/webhooks/mercadopago`, // Idealmente um URL público
        };

        const result = await preference.create({ body });
        res.json({ id: result.id, init_point: result.init_point });
    } catch (err) {
        console.error('❌ Erro Mercado Pago:', err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Máquina de Vendas Além do Véu rodando na porta ${PORT}`));

