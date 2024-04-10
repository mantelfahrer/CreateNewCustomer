export function generatePrompt(
  businessField: string,
  existingResults?: string[],
  newPrompt?: string
): string {
  // define the initial prompt
  let prompt = `I am a business owner who owns a company in the business field ${businessField} and wants to have a website developed. 
  I will now give you a short project mission for the website or web based application I want developed including a company overview and the website purpose without the specific features:`;
  // append all existing results to initial prompt
  if (existingResults) {
    const results = existingResults.join(" ");
    prompt = prompt + " " + results;
  }
  // add new prompt
  if (newPrompt) {
    prompt = prompt + " " + newPrompt;
  }
  return prompt;
}
