import { YamlPhraseRepository } from "../../src/yaml/YamlPhraseRepository";
import yaml from 'js-yaml';
import fs from "fs";
import { PhraseConfig } from "../../src/support/PhraseConfig";

export function createPhraseRepository() {
    return new YamlPhraseRepository(yaml.load(fs.readFileSync("src/resources/config.yaml", "utf8")) as PhraseConfig)
}