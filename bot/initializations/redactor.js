import fastRedact from 'fast-redact';

const sensitiveEnvVariables = ['*.DISCORD_TOKEN'];
const sensitiveData = ['*.EMAIL', '*.PASSWORD'];
const defaultRedactableData = [...sensitiveData, ...sensitiveEnvVariables]

const dataRedactor = (
    dataObj,
    {
        paths = defaultRedactableData
    } = {}) => {

    const redact = fastRedact({ paths, censor: '**Redacted due to sensitivity**' });
    return redact(dataObj);
}

export { dataRedactor };