

//kgfs-pilot irf.BASE_URL = 'http://uatperdix.kgfs.co.in:8080/kgfs-pilot';
//irf.BASE_URL = 'http://works2.sen-sei.in:8080/perdix-server';
//irf.BASE_URL = 'http://uatperdix.kgfs.co.in:8080/perdix-server';
irf.BASE_URL = 'http://52.4.230.141:8080/perdix-server';
//irf.BASE_URL = 'http://uatperdix.kgfs.co.in:8080/pilot-server';

irf.MANAGEMENT_BASE_URL = 'http://52.4.230.141:8081';

//irf.FORM_DOWNLOAD_URL = 'http://uatperdix.kgfs.co.in:8081/saijaforms/DownloadForms.php';
irf.FORM_DOWNLOAD_URL = 'http://115.113.193.49:8080/formsKinara/formPrint.jsp';

irf.BI_BASE_URL = "http://52.4.230.141:8081/bi";

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
