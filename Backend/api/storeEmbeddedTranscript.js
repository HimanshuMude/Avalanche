
require("dotenv").config();
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { PineconeStore } = require("langchain/vectorstores/pinecone");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { PineconeClient } = require("@pinecone-database/pinecone");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_API_ENV = "gcp-starter";
const storeEmbedded = async (textFile) => {
  try {
    const loader = new TextLoader(textFile);
    const documents = await loader.load();
    // console.log(documents);
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunk_size: 1000,
      chunk_overlap: 10,
    });
    const texts = await textSplitter.splitDocuments(documents);
    // console.log(texts);
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: OPENAI_API_KEY,
    });
    // console.log(embeddings);
    const client = new PineconeClient();
    await client.init({
      environment: PINECONE_API_ENV,
      apiKey: PINECONE_API_KEY,
    });
    const index_name = process.env.PINECONE_INDEX_NAME;
    const pineconeIndex = client.Index(index_name);

    await PineconeStore.fromDocuments(texts, embeddings, {
      pineconeIndex,
    });
    // await pineconeIndex.upsert(embeddings);
    console.log("Stored");
    return "success";
  } catch (error) {
    return "error";
  }
};

module.exports = storeEmbedded;
