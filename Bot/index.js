
const { Client, Schema } = require('klasa');

Client.defaultPermissionLevels
    .add(8, ({ c, author }) => process.env.ADMIN_USERS.split(' ').includes(author.id));

const client = new Client({
    commandEditing: true,
    prefix: process.env.PREFIX,
    production: true,
    consoleEvents: {
        log: false,
        error: false,
        warn: false
    },
    providers: {
        default: "mongodb"
    },
    gateways: {
        users: {
            schema: new Schema()
                .add('bio', 'string')
        },
        client: {
            schema: Client.defaultClientSchema
                .add('bots', 'string', { default: "[]" })
        }
    },
    disabledCorePieces: ["commands"]
});

module.exports.init = async (token) => {
    client.userBaseDirectory = __dirname;
    await client.login("Njk5OTk1ODQ3NzY0NDc1OTM0.XpcgDA.mxkcQkykv6nG7gT-RLdx8FGaH_Q");
    return client;
}
