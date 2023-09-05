import { TaskEither } from "fp-ts/lib/TaskEither";
import { DiscordError } from "./DiscordError";

export type DiscordTask<T> = TaskEither<DiscordError, T>