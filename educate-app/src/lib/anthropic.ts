import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Model for tutor chat, topic chat and study tools.
 *
 * Claude Sonnet 5.5 thinks before it answers (adaptive thinking, on by default) and that
 * thinking counts towards max_tokens, so leave headroom above the length of the reply.
 * It rejects `thinking: {type: 'disabled'}`, forced `tool_choice` and non-default
 * `temperature` with a 400. Depth is controlled with effort, not a thinking budget.
 */
export const TUTOR_MODEL = 'claude-sonnet-5-5';

export interface TutorReply {
  text: string;
  /** True when the model declined to answer (stop_reason "refusal") */
  refused: boolean;
  /** True when the reply was cut off at max_tokens */
  truncated: boolean;
}

/**
 * One non-streaming request to the tutor model at low effort (the level recommended for
 * chat and content generation: short or no thinking, fastest replies).
 */
export async function askTutorModel(opts: {
  route: string;
  system: string;
  messages: Anthropic.MessageParam[];
  maxTokens: number;
}): Promise<TutorReply> {
  const params = {
    model: TUTOR_MODEL,
    max_tokens: opts.maxTokens,
    output_config: { effort: 'low' as const },
    system: opts.system,
    messages: opts.messages,
    // Server-side fallback: some safety declines are retried on a fallback model in the same call
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
  };

  // `fallbacks` is newer than the installed SDK's types, so the request is cast
  const message = await anthropic.beta.messages.create(
    params as unknown as Anthropic.Beta.Messages.MessageCreateParamsNonStreaming,
  );

  // Token counts only (no content), so the cost of each route can be tracked in the logs
  const u = message.usage;
  console.log(`[${opts.route}] usage`, JSON.stringify({
    model: message.model, input: u.input_tokens, output: u.output_tokens, stop: message.stop_reason,
  }));

  // A reply can begin with thinking blocks, so read text by block type, never by position
  const text = message.content.map(b => (b.type === 'text' ? b.text : '')).join('').trim();
  return {
    text,
    refused: message.stop_reason === 'refusal',
    truncated: message.stop_reason === 'max_tokens',
  };
}
