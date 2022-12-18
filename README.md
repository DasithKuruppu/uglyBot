# UGLY BOT

<img alt="uglyBee" src="./readmeResources/images/uglyBot.png" width="250px">

This is a simple discord bot buit to interact with some discord users.

[![forthebadge](https://forthebadge.com/images/badges/contains-technical-debt.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/it-works-why.svg)](https://forthebadge.com)

## Built using

[![Node][node.js]][node-url]
[![Typescript][typescript]][typescript-url]
[![Pulumi][pulumi]][pulumi-url]
[![AWS][aws]][pulumi-url]

## Test coverage

![](https://img.shields.io/badge/Coverage-86%25-83A603.svg?style=for-the-badge&logo=tsnode&logoColor=white&color=blue&label=Total&prefix=$coverage$) ![](https://img.shields.io/badge/Coverage-79%25-5A7302.svg?style=for-the-badge&logo=codereview&logoColor=white&color=blue&label=Statements&prefix=$statements$) ![](https://img.shields.io/badge/Coverage-94%25-83A603.svg?style=for-the-badge&logo=diagramsdotnet&logoColor=white&color=blue&label=Branches&prefix=$branches$) ![](https://img.shields.io/badge/Coverage-92%25-83A603.svg?style=for-the-badge&logo=awslambda&logoColor=white&color=blue&label=Functions&prefix=$functions$) ![](https://img.shields.io/badge/Coverage-79%25-5A7302.svg?style=for-the-badge&logo=codefactor&logoColor=white&color=blue&label=Lines&prefix=$lines$)

## Architecture

![Architecture](./readmeResources/images/UglyBotArchitectureWhiteBgv1.png)

## Prerequisites

- Pulumi installed ([see instructions](https://www.pulumi.com/docs/get-started/aws/begin/)).
- Nodejs 16.x or latest installed [see instructions](https://nodejs.org/en/download/).
- An [AWS account](https://aws.amazon.com/).
- An [Discord account](https://discord.com/).
- A discord bot created on [Discord developer portal](https://discord.com/developers/applications)
- Git installed ([see instructions](https://github.com/git-guides/install-git))


## Configuration

You need to create an environment config in the following way.

```
DISCORD_TOKEN='yourDiscordToken'
DISCORD_PUBLIC_KEY='yourDiscordPublickey'
DISCORD_APPLICATION_ID='yourDiscordApplicationId'
DISCORD_SERVER_ID='yourDiscordServerId'
```

And save it as any or all of the following files within the folder `/environmentConfigs`

```
develop.env
production.env
lambdadevelop.env
```

Your default environment is `develop.env` and default deployed environment would be `lambdadevelop.env`

## Running it locally.

1. Clone this repo using SSH or Github Cli ([guide](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)).
2. Navigate to the cloned repo/folder(uglyBot) using a terminal or shell and run the following.
3. `npm install`
4. `npm run build`
5. `npm run start`

## Deploying and running it

1.  `cd pulumi`
2.  `npm install`
3.  `pulumi up`
4.  Review and accept the deployment. (note that this will automatically create required services and resources in AWS lambda).
5.  Copy the URL on the output `apiGatewayEndpointUrl` and append it with `discordEvents`. Example: `https://example.execute-api.us-east-1.amazonaws.com/stage/discordEvents` and set the `INTERACTIONS ENDPOINT URL` on your application to the URL you just constructed.
6.  Add your discord bot to one of your servers. (make sure the server ID is the same as the one you specified on Configuration).
7.  Try the command `/info` on your server.

## Test coverage report generation

`npm run coverage`

## Update readme with latest coverage

`npm run updateReadmeCoverage`

## License

Distributed under the MIT License. See LICENSE.txt for more information.

## Contact

Project Owner - [Dasith Kuruppu](https://github.com/DasithKuruppu)

[node.js]: https://img.shields.io/badge/Nodejs-000000?style=for-the-badge&logo=node.js&logoColor=white
[node-url]: https://nodejs.org/
[pulumi]: https://img.shields.io/badge/Pulumi-000000?style=for-the-badge&logo=pulumi&logoColor=white
[pulumi-url]: https://www.pulumi.com/
[aws]: https://img.shields.io/badge/AWS-000000?style=for-the-badge&logo=amazonaws&logoColor=#232F3E
[aws-url]: https://aws.amazon.com/
[typescript]: https://img.shields.io/badge/Typescript-000000?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://typescript.org/
