---
slug: "/products/agent-capsule/templates"
---

# Templates

Code Capsules provides a variety of agent template repos for you to use as the base for your Agent Capsule.

Each template comes with a tutorial on how to successfully deploy the template, and can be accessed from our GitHub pages. See the list of available templates below:

| Template | Functions | GitHub repo |
|---|---|---|
| Base Agent | Basic agent communication, RAG (context) functionality | [ai-agent-template](https://github.com/codecapsules-io/ai-agent-template) |
| Telegram Bot Agent | Base Agent functionality (forked off Base Agent), runs a Telegram bot which calls the agent for communication | [ai-telegram-bot-agent-template](https://github.com/codecapsules-io/ai-telegram-bot-agent-template) |
| Google Calendar Agent | Base Agent functionality (forked off Base Agent), add events to Google Calendar, get a list of events from Google Calendar | [ai-calendar-agent-template](https://github.com/codecapsules-io/ai-calendar-agent-template) |

## Architecture

Each template consists of the same base architecture, containing the following:

* A list of endpoints: required for interaction with the Code Capsules Agent Chat tab
* A memory store: allows for the agent to retain overall memory. Useful when the agent needs to store some memory "globally" (i.e. will be applied across all prompts). By default, a connection attempt will be made to a Redis instance, but will fall back to an in-memory store if unavailable
* A vector store: allows for the agent to gain context through RAG. Using the prescribed endpoints, one can add context using text or a URL. By default, a connection attempt will be made to a Redis instance, but will fall back to an in-memory vector store if unavailable

## Creating a New Agent

Follow the following procedure to begin creating your new agent. In this example, we will use Google as the provider, but there are other options available.

1. If you already have a free or paid tier Google AI Studio account and API key, you can move to step 3, else continue to step 2.
2. Follow the following guidelines to create a new Google Gemini API key: [https://ai.google.dev/gemini-api/docs/api-key](https://ai.google.dev/gemini-api/docs/api-key). Make sure to copy your key somewhere safe as it will be needed later.
3. Navigate to one of the template repositories on GitHub as described above. If you are new to AI Agent development, it is recommended to start with a simple Base Agent.
4. Using the template repo, create your own new repository by following the steps here: [https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template#creating-a-repository-from-a-template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template#creating-a-repository-from-a-template).
5. Follow the setup steps for the template in the relevant README.md file which can be found in the same GitHub repository.
6. [Create a new Agent Capsule](/products/agent-capsule/deploy), linking your newly created repo, and adding your provider, model, and API key when requested.
7. Once the capsule is built, navigate to the Chat page - ask your newly deployed Agent Capsule anything you'd like! Remember: if you are using a template, the agent will most likely be confined to a specific purpose, so be sure to read the README.md file for more information on its capabilities.
8. You can now modify your codebase however you'd like to include new tools, context, and more.


:::warning

Agent Capsule templates have been built with the capabilities of using either a Redis or in-memory vector store. When using the in-memory option (i.e. no Redis Capsule is linked), it is recommended to scale the Agent Capsule to the following in order to ensure optimal performance:

* CPU 25%
* Memory 1GB
* Replicas 1

To do this, visit the Agent Capsule [Scale](/products/agent-capsule/scale) page.

:::


## Setting up a Vector Store (RAG)

Each template has been written to use memory as a vector store for RAG. However, the templates also cater for connections to a Redis instance as its vector store. In order to set this up, follow the following steps:

1. Create a [Redis Capsule](/database/redis).
2. Copy the **Connection String** in the **Details** tab of your **Redis Capsule**.
3. Navigate to the **Config** page of your **Agent Capsule**.
4. On the **Environment Variables** section (on the right-hand side), click the **Text Editor**.
5. Add the following at the bottom of the Environment Variables list:&#x20;

```dotenv
REDIS_URL=your_copied_connection_string
```

6. Wait for the Agent Capsule to restart - it should now use the Redis Capsule as its vector store.

### Testing RAG

In order to test RAG functionality, do the following:

1. Make a call to the following endpoint:



#### cURL

```shellscript
curl -L \
  --request POST \
  --url '{agent_capsule_public_url}/api/context/text' \
  --header 'Content-Type: application/json' \
  --data '{
    "text": "George is the king of the jungle. He likes hats and eats snails."
  }'
```




#### Javascript

```javascript
const response = await fetch('{agent_capsule_public_url}/api/context/text', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "text": "George is the king of the jungle. He likes hats and eats snails."
    })
});

const data = await response.json();
```




2. Navigate to the Agent Capsule **Chat** tab.
3. Ask the agent the following question:

```
Who is the king of the jungle?
```

The agent should respond with something along the lines of:

```
George is the king of the jungle. He likes hats and eats snails.
```

## Accessing documentation

All agent templates come with pre-written OpenAPI documentation. In order to access this documentation, an environment variable needs to be added to the Agent Capsule. Follow the following steps to do so:

1. Open Code Capsules.
2. Navigate to the Config page of your Agent Capsule.
3. On the right-hand side, in the Environment Variables section, click 'Text Editor'.
4. Paste the following into the bottom of the editor:

```dotenv
SHOW_DOCUMENTATION=true
```

5. Click 'Save'.
6. Wait for the Agent Capsule to restart.
7. Navigate to the 'Details' page of your Agent Capsule.
8. Copy the 'Public URL' link.
9. In a new browser tab, paste the URL and append `/api-docs` to the end of the URL.
10. Once the page is loaded, you should see some fully functional OpenAPI documentation for your agent, unique to your selected agent template.

These documents are served directly from the `src/docs/swagger.json` file in the agent repo.

## Customisation

If you've followed the above steps to create an Agent Capsule, you're probably now looking into how you can add your own tools, context, and other customisation. Follow the topics below to investigate how to do this.

### Changing the Provider and Model

Changing the public AI provider and model through the Code Capsules site is easy. You can do this by navigating to the Config page for the Agent Capsule. Here, you can edit the `Agent Config` to change these details to cater your needs. After the changes are applied, the Agent Capsule will restart and use your newly provided configuration. See more [here](/products/agent-capsule/configure).

### Changing the System Prompt

Each agent template comes with a pre-written system prompt found in the `src/modules/agent/config/system-prompt.ts` file. This will provide your agent with a base prompt from which it will build it's context.

It is important to note that changing this prompt will require you to push your changes to the relevant GitHub repo and branch, and ensuring that a new build is started in Code Capsules. Once the build is complete, your changes will be ready for use.

### Adding New Tools

Adding a new tool to your agent has been made easy with the simple layout structure built into the agent templates. Follow these simple steps to add a new tool, with a side-by-side example of creating a new `getWeather` tool.

1. Navigate to the /src/modules/agent/tools/implementations folder.
2. Create a new file to describe your new tool.



#### Step

New file:\
`src/modules/agent/tools/implementations/my-new-tool.tool.ts`




#### Example (getWeather)

New file:\
`src/modules/agent/tools/implementations/get-weather.tool.ts`




3. In your new file, add code with the following structure, replacing where necessary:



#### Step


```ts
```typescript
import { z } from "zod";
import { tool } from "langchain";

import { BaseTool } from "../base.tool";

export class NewTool implements BaseTool {
  public tool = tool(
    async (input) => {
      return `New tool with input ${input.anInputString}`;
    },
    {
      name: "newTool",
      description: "New tool with an input string",
      schema: z.object({
        anInputString: z.string(),
      }),
    }
  );
}

```
```





#### Example (getWeather)


```ts
```typescript
import { z } from "zod";
import { tool } from "langchain";

import { BaseTool } from "../base.tool";

export class GetWeatherTool implements BaseTool {
  public tool = tool(
    async (input) => {
      return `The weather in ${input.location} is sunny and 20 degrees!`;
    },
    {
      name: "getWeather",
      description: "Get the weather in a location",
      schema: z.object({
        location: z.string().describe("The location to get the weather for"),
      }),
    }
  );
}

```
```





4. In the `src/modules/agent/tools/implementations/index.ts` file, export your new tool.



#### Step


```ts
```typescript
export * from "./new-tool";
```
```





#### Example (getWeather)


```ts
```typescript
export * from "./get-weather.tool";
```
```





5. In the `src/modules/agent/tools/tools-manager.ts` file, add your new tool to the list in the constructor.



#### Step


```ts
```typescript
this.tools.push(new NewTool());
```
```





#### Example (getWeather)


```ts
```typescript
this.tools.push(new GetWeatherTool());
```
```





6. (Optional) Add new System Prompt context in the `src/modules/agent/config/system-prompt.ts` file.



#### Step

{% code title="src/modules/agent/config/system-prompt.ts" overflow="wrap" %}
```
You are a helpful assistant with access to the following tool:
newTool - a new tool which retrieves an inut string and returns the same string.
This is a very basic tool which is just for testing Agent functionality, so ensure to just fire off this tool as necessary without being concerned about input or output. 
An example of a user wanting to fire this would be "Please use my newTool with the input 'Hello, friend!'"
```
{% endcode %}




#### Example (getWeather)

{% code title="src/modules/agent/config/system-prompt.ts" overflow="wrap" %}
```
You are a helpful assistant with access to the following tool:
getWeather - a tool used to get the weather of a specific location.
This is a very basic tool which is just for testing Agent functionality, so ensure to just fire off this tool as necessary without being concerned about input or output. It only returns that the weather is sunny in the provided location, and this is what is expected.
An example of a user wanting to fire this would be "What is the weather in Tokyo today?", which should return "The weather in Tokyo is sunny and 20 degrees". This can then be formatted into a nice, unique sentence for the user.
```
{% endcode %}




7. Push your code.

```shellscript
git add .
git commit -m "Added new tool"
git push origin main
```

8. Code Capsules, if configured to do so, will automatically rebuild your Agent Capsule. Once complete, navigate to your Chat page and ask the agent a question.



#### Step

```
Please use my newTool with the input 'Hello, friend!'
```




#### Example (getWeather)

```
What is the weather in Tokyo today?
```



