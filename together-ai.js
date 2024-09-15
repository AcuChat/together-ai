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
        console.error(err.response.data);
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

const test = async () => {

    const info = await simpleQa('Hello', 'mistralai/Mixtral-8x7B-Instruct-v0.1');
    
    console.log(info);
}

test();