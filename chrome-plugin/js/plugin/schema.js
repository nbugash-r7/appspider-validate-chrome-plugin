appspider.schema = {
    attack: function() {
        return {
            request: appspider.schema.request(),
            description: '',
            response: appspider.schema.response(),
            id: ''
        };
    },
    request: function() {
        return {
            headers:[],
            payload: '',
            cookie:[],
            uri: appspider.schema.uri(),
            method: '',
            version: ''
        }
    },
    response: function() {
        return {
            headers: 'Waiting for attack response....(click the ' +
            'Send request button if response is taking a while)',
            content: ''
        }
    },
    uri: function() {
        return {
            parameters: [],
            protocol: 'http',
            url: '',
            path: '',
            queryString: ''
        }
    }
};