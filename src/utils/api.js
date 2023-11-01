import axios from "axios";

import OpenAI from "openai";

import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    OutputFixingParser,
    StructuredOutputParser,
} from "langchain/output_parsers";
import { LLMChain } from "langchain/chains";
import { z } from "zod";
import { PromptTemplate } from "langchain/prompts";

const llm = new ChatOpenAI({
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    modelName: "gpt-3.5-turbo",
    temperature: 0,
});

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

export async function generateNewSchedule(user_input, context) {
    //console.log("OLD:", user_input, context);
    try {
        const outputParser = StructuredOutputParser.fromZodSchema(
            z
                .object({
                    date: z.string().describe("YYY-MM-DD"),
                    description: z.string(),
                    schedule: z.array(
                        z
                            .object({
                                title: z.string().describe("This is the title of the event"),
                                time: z.string().describe("exmaple: 09:00 AM - 10:30 AM"),
                                speaker: z.array(
                                    z.string().describe("speakers at the event")
                                ).optional(),
                            })
                    ),
                })
                .optional()
        );
        const outputFixingParser = OutputFixingParser.fromLLM(llm, outputParser);
        const prompt = new PromptTemplate({
            template: `You are a professional event planner no time slots should overlap:\n{format_instructions}\n{query}`,
            inputVariables: ["query"],
            partialVariables: {
                format_instructions: outputFixingParser.getFormatInstructions(),
            },
        });
        const answerFormattingChain = new LLMChain({
            llm,
            prompt,
            outputKey: "records",
            outputParser: outputFixingParser,
        });

        const result = await answerFormattingChain.call({
            query: `Provided with the following JSON schedule data: ${JSON.stringify(
                user_input
                )}, your task is to optimize the schedule based on the user's background (${context}). Your goal is to identify and retain the best event for each day while removing any events with overlapping time slots. Please provide the updated JSON schedule as your output`,
        });

        const resource = result.records;
        //console.log(resource);
        return resource;
    } catch (e) {
        throw e;
    }
}


export async function generateArriveLeaveSchedule(user_input, context) {
    console.log("OLD:", user_input, context);
    try {
        const outputParser = StructuredOutputParser.fromZodSchema(
            z
                .object({
                    date: z.string().describe("YYY-MM-DD"),
                    description: z.string(),
                    schedule: z.array(
                        z
                            .object({
                                title: z.string().describe("This is the title of the event"),
                                time: z.string().describe("exmaple: 09:00 AM - 10:30 AM"),
                                arrive: z.string().describe(),
                                leave: z.string().describe(),
                                speaker: z.array(
                                    z.string().describe("speakers at the event")
                                ).optional(),
                            })
                    ),
                })
                .optional()
        );
        const outputFixingParser = OutputFixingParser.fromLLM(llm, outputParser);
        const prompt = new PromptTemplate({
            template: `You are a professional event planner no time slots should overlap:\n{format_instructions}\n{query}`,
            inputVariables: ["query"],
            partialVariables: {
                format_instructions: outputFixingParser.getFormatInstructions(),
            },
        });
        const answerFormattingChain = new LLMChain({
            llm,
            prompt,
            outputKey: "records",
            outputParser: outputFixingParser,
        });

        const result = await answerFormattingChain.call({
            query: `Given the provided schedule data (JSON): ${JSON.stringify(
                user_input
            )}, Let's optimize the schedule with respect to the actual time add arrive and leave times so user can attend all events with no overlaping . Please return the updated JSON after the optimization.`,
        });

        const resource = result.records;
        console.log(resource);
        return resource;
    } catch (e) {
        throw e;
    }
}



export async function watsonExample() {
    const url =
        "https://us-south.ml.cloud.ibm.com/ml/v1-beta/generation/text?version=2023-05-29";
    const accessToken =
        "eyJraWQiOiIyMDIzMTAwODA4MzUiLCJhbGciOiJSUzI1NiJ9.eyJpYW1faWQiOiJJQk1pZC02OTEwMDA2RDFaIiwiaWQiOiJJQk1pZC02OTEwMDA2RDFaIiwicmVhbG1pZCI6IklCTWlkIiwianRpIjoiZTM1NjBmZWYtODk1OS00MTA1LTkzNjUtZjljMTY3MGYyNzRjIiwiaWRlbnRpZmllciI6IjY5MTAwMDZEMVoiLCJnaXZlbl9uYW1lIjoiVGFsYmVydCIsImZhbWlseV9uYW1lIjoiSGVybmRvbiIsIm5hbWUiOiJUYWxiZXJ0IEhlcm5kb24iLCJlbWFpbCI6InRhbGJlcnRoZXJuZG9uMUBnbWFpbC5jb20iLCJzdWIiOiJ0YWxiZXJ0aGVybmRvbjFAZ21haWwuY29tIiwiYXV0aG4iOnsic3ViIjoidGFsYmVydGhlcm5kb24xQGdtYWlsLmNvbSIsImlhbV9pZCI6IklCTWlkLTY5MTAwMDZEMVoiLCJuYW1lIjoiVGFsYmVydCBIZXJuZG9uIiwiZ2l2ZW5fbmFtZSI6IlRhbGJlcnQiLCJmYW1pbHlfbmFtZSI6Ikhlcm5kb24iLCJlbWFpbCI6InRhbGJlcnRoZXJuZG9uMUBnbWFpbC5jb20ifSwiYWNjb3VudCI6eyJ2YWxpZCI6dHJ1ZSwiYnNzIjoiZGZlNTA4ZDEzMWI4NDdiNjhkNmRkZTE3ZWExNjE3ZjUiLCJpbXNfdXNlcl9pZCI6IjExNTAwNjM0IiwiaW1zIjoiMjcxMTUxNyJ9LCJpYXQiOjE2OTg4Mjg2MjcsImV4cCI6MTY5ODgzMjIyNywiaXNzIjoiaHR0cHM6Ly9pYW0uY2xvdWQuaWJtLmNvbS9pZGVudGl0eSIsImdyYW50X3R5cGUiOiJ1cm46aWJtOnBhcmFtczpvYXV0aDpncmFudC10eXBlOnBhc3Njb2RlIiwic2NvcGUiOiJpYm0gb3BlbmlkIiwiY2xpZW50X2lkIjoiYngiLCJhY3IiOjEsImFtciI6WyJwd2QiXX0.pBtbSRoOgVCABLwmEzL_TvsA_67jku1xOMnNKirjFMbhbQP_bCH6xITrwADA41b0mJSKO0WT9qJk7vrDVEq4mzrB9W5JKeXulQcPzLjS8xW8hoWf7lcHabFCe0dyAnk85lN7Bu7U15gUTHb_YNZJdS-ehk_cLmB5VNVWfOABuWBeyqo0HYHDw9C1p8Gbou-jUtRll1op_xiiFoC0b3-_t-fN322l7VgNUpLPpu3z9zQMB2S0OeT3gYowEQYxDexbW24vAJIhYZIpLDXwzQz3DyJy-Kquaq-sYDNsNekaT6KOhTpa0THY1JpaNYetqHEyu7pkxz9VNsmoSgrwvqUUzw"; // Replace with your access token

    const data = {
        model_id: "google/flan-ul2",
        input: "hey",
        parameters: {
            decoding_method: "greedy",
            max_new_tokens: 20,
            min_new_tokens: 0,
            stop_sequences: [],
            repetition_penalty: 1,
        },
        project_id: "c8fbdaf2-d78a-4bef-abce-7fe69dc19a19",
    };

    axios
        .post(url, data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

export async function getEvents() {
    try {
        return await axios
            .get("https://x8ki-letl-twmt.n7.xano.io/api:b1UPijU0/events")
            .then((res) => {
                console.log(res.data);
            });
    } catch (e) {
        throw e;
    }
}
