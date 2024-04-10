export type ModelGenerationInputKobold = {
  // example: 1, min: 1, max: 20
  n?: number;
  // Input formatting option. When enabled, adds a leading space to your input if there is no trailing whitespace at the end of the previous action.
  frmtadsnsp?: boolean;
  // Output formatting option. When enabled, replaces all occurrences of two or more consecutive newlines in the output with one newline.
  frmtrmblln?: boolean;
  // Output formatting option. When enabled, removes #/@%}{+=~|^<> from the output.
  frmtrmspch?: boolean;
  // Output formatting option. When enabled, removes some characters from the end of the output such that the output doesn't end in the middle of a sentence.
  // If the output is less than one sentence long, does nothing.
  frmttriminc?: boolean;
  // Maximum number of tokens to send to the model.
  // default: 1024, min: 80, max: 32000
  max_context_length?: number;
  // Number of tokens to generate.
  // default: 80, min: 16, maximum: 1024
  max_length?: number;
  // Base repetition penalty value.
  // min: 1, max: 3
  rep_pen?: number;
  // Repetition penalty range.
  // min: 0, max: 4096
  rep_pen_range?: number;
  // Repetition penalty slope.
  // min: 0, max: 10
  rep_pen_slope?: number;
  // Output formatting option. When enabled, removes everything after the first line of the output, including the newline.
  singleline?: boolean;
  // Temperature value.
  temperature?: number;
  // Tail free sampling value
  // min: 0, max: 1
  tfs?: number;
  // Top-a sampling value.
  // min: 0, max: 1
  top_a?: number;
  // Top-k sampling value.
  // min: 0,  max: 100
  top_k?: number;
  // Top-p sampling value.
  // min: 0.001, max: 1
  top_p?: number;
  // Typical sampling value
  typical?: number;
  // Array of integers representing the sampler order to be used.
  sampler_oder?: number[];
  // When True, uses the default KoboldAI bad word IDs.
  use_default_badwordsids?: boolean;
  // An array of string sequences whereby the model will stop generating further tokens. The returned text WILL contain the stop sequence.
  stop_sequence?: string[];
  // Min-p sampling value.
  min_p?: number;
  // Quadratic sampling value.
  smoothing_factor?: number;
  // Dynamic temperature range value.
  dynatemp_range?: number;
  // Dynamic temperature exponent value.
  dynatemp_exponent?: number;
};

export type ExtraSourceImage = {
  // The base64-encoded webp to use for further processing
  image: string;
  // Optional field, determining the strength to use for the processing
  // default: 1
  strength: number;
};

export type GenerationInputKobold = {
  // The prompt which will be sent to KoboldAI to generate text.
  prompt: string;
  params?: ModelGenerationInputKobold;
  // Specify which softprompt needs to be used to service this request.
  // minLength: 1
  softprompt?: string;
  // When true, only trusted workers will serve this request. When False, Evaluating workers will also be used which can increase speed but adds more risk!
  // default: false
  trusted_workers?: boolean;
  // When True, allows slower workers to pick up this request. Disabling this incurs an extra kudos cost.
  // default: true
  slow_workers?: boolean;
  // Specify up to 5 workers which are allowed to service this request.
  workers?: string[];
  // If true, the worker list will be treated as a blacklist instead of a whitelist.
  // default: false
  worker_blacklist?: boolean;
  // Specify which models are allowed to be used for this request.
  models?: string[];
  // When true, the endpoint will simply return the cost of the request in kudos and exit.
  // default: false
  dry_run?: boolean;
  // If using a service account as a proxy, provide this value to identify the actual account from which this request is coming from.
  proxied_account?: string;
  extra_source_images?: ExtraSourceImage[];
  // When true and the request requires upfront kudos and the account does not have enough
  // The request will be downgraded in max context and max tokens so that it does not need upfront kudos.
  // default: false
  disable_batching?: boolean;
  // Provide a URL where the AI Horde will send a POST call after each delivered generation.
  // The request will include the details of the job as well as the request ID.
  webhook?: string;
};

export type RequestSingleWarning = {
  // A unique identifier for this warning.
  code: string;
  // Something that you should be aware about this request, in plain text.
  message: string;
};
export type RequestAsync = {
  // The UUID of the request. Use this to retrieve the request status in the future.
  id: string;
  // The expected kudos consumption for this request.
  kudos: number;
  // Any extra information from the horde about this request.
  message: string;
  warnings: RequestSingleWarning[];
};

export type RequestError = {
  // The error message for this status code.
  message: string;
  // The return code for this error.
  rc: string;
};

export type RequestValidationError = RequestError & {
  errors: {
    // The details of the validation error
    [key: string]: string;
  };
};

export type GenerationMetadataKobold = {
  // The relevance of the metadata field
  type: string;
  // The value of the metadata field
  value: string;
  // Optionally a reference for the metadata
  ref: string;
};

export type GenerationKobold = {
  // The UUID of the worker which generated this image.
  worker_id: string;
  // The name of the worker which generated this image.
  worker_name: string;
  // The model which generated this image.
  model: string;
  // OBSOLETE (Use the gen_metadata field). The state of this generation.
  state: string;
  // The generated text.
  text: string;
  // The seed which generated this text.
  seed: number;
  gen_metadata: GenerationMetadataKobold[];
};

export type RequestStatusKobold = {
  // The amount of finished jobs in this request.
  finished: number;
  // The amount of still processing jobs in this request.
  processing: number;
  // The amount of jobs that timed out and had to be restarted or were reported as failed by a worker.
  restarted: number;
  // The amount of jobs waiting to be picked up by a worker.
  waiting: number;
  // True when all jobs in this request are done. Else False.
  done: boolean;
  // True when this request caused an internal server error and could not be completed.
  faulted: boolean;
  // The expected amount to wait (in seconds) to generate all jobs in this request.
  wait_time: number;
  // The position in the requests queue. This position is determined by relative Kudos amounts.
  queue_position: number;
  // The amount of total Kudos this request has consumed until now.
  kudos: number;
  // If False, this request will not be able to be completed with the pool of workers currently available.
  is_possible: boolean;
  generations: GenerationKobold[];
};
