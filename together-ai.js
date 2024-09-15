require ('dotenv').config();
const lodash = require('lodash');
const axios = require('axios');

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
 *      
 *      max_tokens: integer
 *      temperature: float
 * 
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

const test = async () => {
    const systemPrompt = "You are an expert in simplifying sentences while preserving meaning. \n\n\n\nYou split each sentence into one sentences that have only one independent clause.\n\n\n\nYou preserve the vocabulary used wherever possible.";
    //const info = await simpleQa('Hello', 'meta-llama/Llama-3-70b-chat-hf');
    const models = await getModels();
    console.log(models);
}



test();