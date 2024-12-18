# Instructions

1. **Insert the OpenAI Key**

   Open the `gpt.mjs` file and navigate to **line 17**. Insert your OpenAI API key there. It should look something like this:

   ```javascript
   const openai = new OpenAI({
    apiKey:
      "", // Add your OpenAI API key here
   });
   ```

   Make sure to replace with your actual key.

2. **Run the Server**

   Open your terminal and run:

   ```bash
   node gpt.mjs
   ```

   After running this command, the Robotaxi GPT server should start up and be accessible at [http://localhost:5001](http://localhost:5001).