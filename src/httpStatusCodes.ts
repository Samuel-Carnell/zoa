const statusCodeToReasonPhrase = {
	'202': 'Accepted',
	'502': 'Bad Gateway',
	'400': 'Bad Request',
	'409': 'Conflict',
	'100': 'Continue',
	'201': 'Created',
	'417': 'Expectation Failed',
	'424': 'Failed Dependency',
	'403': 'Forbidden',
	'504': 'Gateway Timeout',
	'410': 'Gone',
	'505': 'HTTP Version Not Supported',
	'418': "I'm a teapot",
	'419': 'Insufficient Space on Resource',
	'507': 'Insufficient Storage',
	'500': 'Internal Server Error',
	'411': 'Length Required',
	'423': 'Locked',
	'420': 'Method Failure',
	'405': 'Method Not Allowed',
	'301': 'Moved Permanently',
	'302': 'Moved Temporarily',
	'207': 'Multi-Status',
	'300': 'Multiple Choices',
	'511': 'Network Authentication Required',
	'204': 'No Content',
	'203': 'Non Authoritative Information',
	'406': 'Not Acceptable',
	'404': 'Not Found',
	'501': 'Not Implemented',
	'304': 'Not Modified',
	'200': 'OK',
	'206': 'Partial Content',
	'402': 'Payment Required',
	'308': 'Permanent Redirect',
	'412': 'Precondition Failed',
	'428': 'Precondition Required',
	'102': 'Processing',
	'103': 'Early Hints',
	'426': 'Upgrade Required',
	'407': 'Proxy Authentication Required',
	'431': 'Request Header Fields Too Large',
	'408': 'Request Timeout',
	'413': 'Request Entity Too Large',
	'414': 'Request-URI Too Long',
	'416': 'Requested Range Not Satisfiable',
	'205': 'Reset Content',
	'303': 'See Other',
	'503': 'Service Unavailable',
	'101': 'Switching Protocols',
	'307': 'Temporary Redirect',
	'429': 'Too Many Requests',
	'401': 'Unauthorized',
	'451': 'Unavailable For Legal Reasons',
	'422': 'Unprocessable Entity',
	'415': 'Unsupported Media Type',
	'305': 'Use Proxy',
	'421': 'Misdirected Request',
} as const;

export function reasonPhrase(statusCode: HttpStatusCode) {
	return statusCodeToReasonPhrase[statusCode];
}

export type HttpStatusCode =
	| '202'
	| '502'
	| '400'
	| '409'
	| '100'
	| '201'
	| '417'
	| '424'
	| '403'
	| '504'
	| '410'
	| '505'
	| '418'
	| '419'
	| '507'
	| '500'
	| '411'
	| '423'
	| '420'
	| '405'
	| '301'
	| '302'
	| '207'
	| '300'
	| '511'
	| '204'
	| '203'
	| '406'
	| '404'
	| '501'
	| '304'
	| '200'
	| '206'
	| '402'
	| '308'
	| '412'
	| '428'
	| '102'
	| '103'
	| '426'
	| '407'
	| '431'
	| '408'
	| '413'
	| '414'
	| '416'
	| '205'
	| '303'
	| '503'
	| '101'
	| '307'
	| '429'
	| '401'
	| '451'
	| '422'
	| '415'
	| '305'
	| '421';
