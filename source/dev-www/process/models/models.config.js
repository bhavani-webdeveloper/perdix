irf.models
	.constant('BASE_URL', irf.BASE_URL)
	.constant('Model_ELEM_FC', {
		'fileUploadUrl': irf.BASE_URL + '/api/files/upload',
		'dataUploadUrl': irf.BASE_URL + '/api/files/upload/base64',
		'fileDeleteUrl': irf.BASE_URL + '/api/files/upload',
		'fileStreamUrl': irf.BASE_URL + '/api/stream',
		'responseSelector': 'fileId',
		'compressionRatio': 80,
		'imageCompressionRatio': 75
	})
;
