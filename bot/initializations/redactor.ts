import fastRedact from 'fast-redact';

const sensitiveEnvVariables = ['*.DISCORD_TOKEN'];
const sensitiveData = ['*.EMAIL', '*.PASSWORD'];
export const censorMessage = '**Redacted due to sensitivity**';
export const defaultRedactableData = [...sensitiveData, ...sensitiveEnvVariables]

interface DataRedactorOptions {
    paths?: Array<string>
}

const dataRedactor = (
    dataObj: Object,
    {
        paths = defaultRedactableData
    }: DataRedactorOptions = {}): Object => {

    const redact = fastRedact({ paths, censor: censorMessage });
    return redact(dataObj);
}

export { dataRedactor };