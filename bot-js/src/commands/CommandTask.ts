import * as TaskEither from "fp-ts/lib/TaskEither";
import { BundleError } from "../support/EitherHelper";

export type CommandTask = TaskEither.TaskEither<BundleError, void>;
