import fastRedact from 'fast-redact';

const sensitiveEnvVariables = ['*.DISCORD_TOKEN'];
const sensitiveData = ['*.EMAIL', '*.PASSWORD'];
const defaultRedactableData = [...sensitiveData, ...sensitiveEnvVariables]

interface DataRedactorOptions {
    paths?: Array<string>
}

const dataRedactor = (
    dataObj: Object,
    {
        paths = defaultRedactableData
    }: DataRedactorOptions = {}): Object => {

    const redact = fastRedact({ paths, censor: '**Redacted due to sensitivity**' });
    return redact(dataObj);
}

export { dataRedactor };