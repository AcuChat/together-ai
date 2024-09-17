require ('dotenv').config();
const lodash = require('lodash');
const axios = require('axios');
const config = require('./config.json');

const { TOGETHER_API_TOKEN } = process.env;



const togetherAiHeaders = () => {
    return {
        accept: 'application/json',
        authorization: 'Bearer ' + TOGETHER_API_TOKEN,
        "content-type": 'application/json'
    }
}

/** 
 * Available Options: https://docs.together.ai/reference/chat-completions-1
 */

const chatCompletions = async (model, messages, options = {}) => {

    const endpoint = 'https://api.together.xyz/v1/chat/completions';

    const request = {
        url: endpoint,
        method: 'post',
        headers: togetherAiHeaders(),
        data: {
            messages,
            model
        }
    }

    lodash.merge(request.data, options);
 
    try {
        const response = await axios(request);
        const usage = response?.data?.usage;
        const { prompt_tokens, completion_tokens, total_tokens } = usage;
        //console.log(usage);
        return response?.data?.choices[0]?.message?.content;
    } catch (err) {
        console.error(err?.response?.data);
        return false;
    }

}

const simpleQa = async (query, model, systemPrompt = 'You are a helpful assistant', options = {}) => {
    const messages = [
        {
            "role": "system",
            "content": systemPrompt
          },
          {
            "role": "user",
            "content": query
          }
    ]

    return await chatCompletions(model, messages, options);
}

const getModels = async () => {
    try {
        const response = await axios.get('https://api.together.xyz/v1/models', { headers: togetherAiHeaders()});
        return response.data;
    } catch (err) {
        console.error(err?.response?.data);
        return false;
    }
}

const simplifyText = async (text) => {
    const query = 'Text:\n' + text;
    const result = await simpleQa(query, 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo', config.simplifyTextSystemPrompt);
    console.log(result);
}

const test = async () => {
    const systemPrompt = ''
    //const info = await simpleQa('Hello', 'meta-llama/Llama-3-70b-chat-hf');
    const models = await getModels();
    console.log(models);
}



simplifyText(`Conway assumed the role as North America CEO in April this year as the company was grappling with weak demand for its pricey lattes in the U.S.

Niccol, who took over from Laxman Narasimhan in a surprise appointment last month, said in an open letter that he would initially focus on ensuring the U.S. stores deliver drinks and food on time, as well as re-establishing the coffeehouse culture at its outlets.`)