import OpenAI from "openai";


(async function () {
  const command = `Convert this text to a programmatic command:\n
  Example: Update the date and time of raid IfPE2ZNEjd to Tomorrow 9:30 PM \n\n
  output:{"update_raid": "IfPE2ZNEjd", "date_time": "Tomorrow 9:30 PM"}`
  const chatCompletion = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt: `${command} \n\n Update the date and time of raid IfPE2ZNE5d to Tomorrow 9:10 PM`,
    temperature: 0,
    max_tokens: 92,
    top_p: 1,
    frequency_penalty: 0.2,
    presence_penalty: 0,
  });

  console.log(chatCompletion.choices[0]);
})();
