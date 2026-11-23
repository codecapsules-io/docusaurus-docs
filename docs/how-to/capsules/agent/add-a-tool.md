---
slug: "/how-to/capsules/agent/add-a-tool"
diataxis: how-to
title: "How to Add a Tool to an AI Agent"
description: "Add a new tool to an agent built from a Code Capsules agent template, with a worked getWeather example."
sidebar_label: "Add a tool"
---

# Add a Tool to Your Agent

Agent templates make it simple to add new tools. To create the agent first, see [Start from an AI agent template](/how-to/capsules/agent/templates/).

## Adding New Tools


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
