
//kgfs-pilot irf.BASE_URL = 'http://uatperdix.kgfs.co.in:8080/kgfs-pilot';
// irf.BASE_URL = 'http://works2.sen-sei.in:8080/perdix-server';
irf.BASE_URL = 'http://uatperdix.kgfs.co.in:8080/perdix-server';
//UAT irf.BASE_URL = 'http://uatperdix.kgfs.co.in:8080/pilot-server';
irf.MANAGEMENT_BASE_URL = 'http://uatperdix.kgfs.co.in:8081/perdixService/index.php';
//irf.MANAGEMENT_BASE_URL = 'http://localhost/perdixService/index.php';
irf.FORM_DOWNLOAD_URL = 'http://uatperdix.kgfs.co.in:8081/saijaforms/DownloadForms.php';

irf.models
	.constant('BASE_URL', irf.BASE_URL)
	.constant('Model_ELEM_FC', {
		'fileUploadUrl': irf.BASE_URL + '/api/files/upload',
		'dataUploadUrl': irf.BASE_URL + '/api/files/upload/base64',
		'fileDeleteUrl': irf.BASE_URL + '/api/files/upload',
		'fileStreamUrl': irf.BASE_URL + '/api/stream',
		'responseSelector': 'fileId'
	})
;
