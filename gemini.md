# Constituição do Projeto (gemini.md)

## Identidade e Visão
- **Estrela Guia:** Plataforma de vendas integrada a uma rede social, focada em comercializar produtos para um público real, com estrutura descentralizada (estilo TOR/P2P).
- **Integrações:** Mercado Pago, PayPal, APIs de Notícias modernas.
- **Banco de Dados:** Supabase (Mantendo a funcionalidade atual), encapsulado em um Repository Pattern.
- **Regras Comportamentais:** 
  - Arquitetura de **Rede Federada** (nós independentes que se comunicam, mantendo persistência no Supabase).
  - Padrão visual sério, íntegro, estrito e consistente.

## Arquitetura (A.N.T.)
- **Action (Entrada):** Coleta de dados via UI padronizada e nós da rede descentralizada.
- **Node (Processamento):** Lógica de negócios agnóstica em relação ao banco de dados (Repository Pattern).
- **Trigger (Saída):** Disparo de pagamentos, notificações e sincronização da rede.

## Esquemas de Dados Base (JSON Data Schema)

### 1. Entidade: Usuário (User / Node)
```json
{
  "id": "uuid_descentralizado",
  "username": "string",
  "public_key": "string",
  "profile": {
    "avatar": "url",
    "bio": "string"
  }
}
```

### 2. Entidade: Produto/Post (Feed Item)
```json
{
  "item_id": "uuid",
  "author_id": "uuid",
  "type": "ENUM: [POST, PRODUCT, NEWS]",
  "content": {
    "text": "string",
    "media_urls": ["string"],
    "price": "number (opcional, se type=PRODUCT)",
    "currency": "string (opcional)"
  },
  "timestamp": "ISO8601"
}
```

### 3. Entidade: Transação (Transaction Payload)
```json
{
  "tx_id": "uuid",
  "buyer_id": "uuid",
  "seller_id": "uuid",
  "item_id": "uuid",
  "amount": "number",
  "gateway": "ENUM: [MERCADO_PAGO, PAYPAL, P2P]",
  "status": "ENUM: [PENDING, COMPLETED, FAILED]"
}
```
