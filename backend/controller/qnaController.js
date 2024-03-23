require('core-js/features/string/replace-all');
require("dotenv").config();
const { PineconeStore } = require("langchain/vectorstores/pinecone");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PineconeClient } = require("@pinecone-database/pinecone");
const { OpenAI } = require("langchain/llms/openai");
const { ChatOpenAI } = require("langchain/chat_models/openai")
const { Document } = require("langchain/document");
const { loadQAStuffChain } = require("langchain/chains");
const e = require("express");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_API_ENV = "gcp-starter";

const qna = async (req, res) => {
  try {
    const embeddings = await new OpenAIEmbeddings().embedQuery(req.body.query);
    const client = new PineconeClient();
    await client.init({
      environment: PINECONE_API_ENV,
      apiKey: PINECONE_API_KEY,
      projectName: "gcp-starter",
    });
    const index_name = process.env.PINECONE_INDEX_NAME;
    const pineconeIndex = client.Index(index_name);
    let queryResponse = await pineconeIndex.query({
      queryRequest: {
        topK: 5,
        vector: embeddings,
        includeMetadata: true,
        includeValues: true,
      },
    });
    // console.log(queryResponse.matches[0].metadata);
    console.log(`Found ${queryResponse.matches.length} results`);
    if (queryResponse.matches.length > 0) {
      const llm = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });
      const chain = loadQAStuffChain(llm);
      // console.log(concatenatedTexts);
      // const docSearch = await PineconeStore.fromExistingIndex(embeddings, {
      //   pineconeIndex,
      // });
      const concatenatedTexts = queryResponse.matches.map((match) => match.metadata.text).join(" ");
      // console.log(concatenatedTexts);
      const result = await chain.call({
        input_documents: [new Document({ pageContent: concatenatedTexts })],
        question: req.body.query,
      });
      // console.log(result);
      return res.json(result);
    }


    // console.log("Here");
    // const query = req.body.query || "Why was Donald Trump arrested ?";

    // const searchResults = await docSearch.similaritySearch(query, 5);
    //  console.log("here", searchResults);

    // const llm = new OpenAI({
    //   temperature: 0.7,
    //   openAIApiKey: OPENAI_API_KEY,
    //   // modelName: "text-embedding-3-small",
    // });
    // // const llm = new OpenAI({});
    // // const chainA = loadQAStuffChain(llmA);
    // const chain = loadQAStuffChain(llm);


    // // console.log(chain);
    // // const resp=await chain.run({ question: "Who is saying Hello?", input_documents: "Hello World" });
    // // console.log(resp);
    // // console.log(searchResults);
    // const responseAns = await chain.call({
    //   input_documents: searchResults,
    //   question: query,
    // });
    // console.log(responseAns);
    // res.json(responseAns);
  } catch (errors) {
    console.log("error", errors);
    res.json({ error: "well, this is awkward.. I don't know the answer for that" });
  }
  //console.log("Here");

};

module.exports = qna;


