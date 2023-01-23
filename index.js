import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from "openai"

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const configuration = new Configuration({
    organization: process.env.ORGANIZATION_ID,
    apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);


const getDavinciResponse = async (clientText) => {
    const options = {
        model: "text-davinci-003", // Modelo GPT a ser usado
        prompt: clientText, // Texto enviado pelo usuário
        temperature: 1, // Nível de variação das respostas geradas, 1 é o máximo
        max_tokens: 4000 // Quantidade de tokens (palavras) a serem retornadas pelo bot, 4000 é o máximo
    }

    try {
        const response = await openai.createCompletion(options)
        let botResponse = ""
        response.data.choices.forEach(({ text }) => {
            botResponse += text
        })
        // return `Teodoro 🤖\n\n ${botResponse.trim()}`
        return `${botResponse.trim()}`
    } catch (e) {
        return `❌ OpenAI Response Error: ${e.response.data.error.message}`
    }
}

const getDalleResponse = async (clientText) => {
    const options = {
        prompt: clientText, // Descrição da imagem
        n: 1, // Número de imagens a serem geradas
        size: "1024x1024", // Tamanho da imagem
    }

    try {
        const response = await openai.createImage(options);
        return response.data.data[0].url
    } catch (e) {
        return `❌ OpenAI Response Error: ${e.response.data.error.message}`
    }
}

bot.command('quit', async (ctx) => {
  // Explicit usage
  await ctx.telegram.leaveChat(ctx.message.chat.id);

  // Using context shortcut
  await ctx.leaveChat();
});

bot.on('text', async (ctx) => {

    const iaCommands = {
        davinci3: "/teo",
        dalle: "/img",
    }

    let firstWord = ctx.message.text.substring(0, ctx.message.text.indexOf(" "));

    switch (firstWord) {
        case iaCommands.davinci3:
            const question = ctx.message.text.substring(ctx.message.text.indexOf(" "));
            getDavinciResponse(question).then((response) => {
                /*
                 * Faremos uma validação no message.from
                 * para caso a gente envie um comando
                 * a response não seja enviada para
                 * nosso próprio número e sim para 
                 * a pessoa ou grupo para o qual eu enviei
                 */
                ctx.telegram.sendMessage(ctx.message.chat.id, response)
                // client.sendText(message.from === process.env.BOT_NUMBER ? message.to : message.from, response)
            })
            break;
    
        default:
            break;
    }

  // Explicit usage
//   await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);
//   await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.message.text}`);
  // Using context shortcut
//   await ctx.reply(`Hello ${ctx.state.role}`);
});

bot.on('callback_query', async (ctx) => {
  // Explicit usage
  await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

  // Using context shortcut
  await ctx.answerCbQuery();
});

bot.on('inline_query', async (ctx) => {
  const result = [];
  // Explicit usage
  await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);

  // Using context shortcut
  await ctx.answerInlineQuery(result);
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
