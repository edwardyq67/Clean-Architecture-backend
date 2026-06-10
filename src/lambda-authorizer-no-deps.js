const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET;

exports.handler = async (event) => {
    try {
        const token = event.authorizationToken?.replace('Bearer ', '');
        if (!token) throw new Error('No token');

        const parts = token.split('.');
        if (parts.length !== 3) throw new Error('JWT inválido');

        const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
        const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());

        const signature = parts[2];
        const expectedSignature = crypto
            .createHmac('sha256', JWT_SECRET)
            .update(`${parts[0]}.${parts[1]}`)
            .digest('base64url');

        if (signature !== expectedSignature) throw new Error('Firma inválida');

        if (payload.exp && Date.now() >= payload.exp * 1000) {
            throw new Error('Token expirado');
        }

        const principalId = payload.sub || payload.email || 'unknown';

        return generatePolicy(principalId, 'Allow', event.methodArn, payload);
    } catch (error) {
        return generatePolicy('user', 'Deny', event.methodArn);
    }
};

function generatePolicy(principalId, effect, resource, context) {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }]
        },
        context
    };
}
