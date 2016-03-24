/**
 * Created by Chrobak on 21.03.2016.
 */
function RestApi (Resource) {

	var Resource = Resource;
	var resourceKeys = [];
	var responseObj = {
		status : ''
	};

	var namespace = this;

	this.errorObj = {
		error : '',
		errorStatus : '404'
	};

	function reset () {

		responseObj = { status : '' };
		namespace.errorObj.error = '';
	}

	function copyRow (row) {

		var res = {};

		if (typeof row === 'object') {

			for (var e in row) { res[e] = row[e]; }

		}

		return res;

	}

	function getResourceKeys () {

		if ( ! resourceKeys.length) {

			if (Resource.length) {

				for (var key in Resource[0]) {
					resourceKeys.push(key);
				}
			}
		}

		return resourceKeys;

	}

	function filterId (id) {

		id = String(id);

		var maxStrLen = (id.length > 22 ) ? 22 : id.length;
		var res = id.substr(0, maxStrLen);
		res = res.replace(/\s*/gi, '');
		res = res.match(/^[1-9]{1}[0-9]{0,21}$/gi);

		return (Array.isArray(res) && res.length) ? res[0] : '';

	}

	function filterData (data, handler) {

		namespace.errorObj.error = [];

		var keys = getResourceKeys();
		var res = {};

		if ( keys.length ) {

			keys.find(function (key) {

				if ( data.hasOwnProperty(key)) {

					if (key === 'id') {

						data[key] = filterId(data[key]);

						if (data[key] == '') {
							namespace.errorObj.error.push('DATAERROR_KEY_NOTVALID : ' + key);
						}
					}

					res[key] = data[key];

				} else {

					if (handler === 'post') {
						namespace.errorObj.error.push('DATAERROR_KEY_NOTFOUNF : ' + key);
					}
				}

			});

		} else {
			namespace.errorObj.error.push('DATAERROR_KEYS_EMPTY ');
		}

		return res;

	}

	function _add (data) {

		if (Resource.length) {

			for (var i = 0;i < Resource.length; i++) {

				if (Resource[i].id == data.id) {
					Resource[i] = data;
					break;
				}

			}
		}
	}

	function _delete  (id) {

		if (Resource.length) {

			var resId = -1;

			Resource.find( function (row, index) { if (row.id == id) { resId = index; } });

			if (resId > -1) {

				Resource.splice(resId,1);

			} else {

				namespace.errorObj.error = 'ERROR_RESOURCE_NOTFOUND';

			}
		}
	}

	function _find (id) {

		responseObj.data = {};

		if (Resource.length) {

			for (var i = 0;i < Resource.length; i++) {

				if (Resource[i].id == id) {

					responseObj.data = copyRow(Resource[i]);
					break;
				}
			}
		}
	}

	this.addResource = function (data, handler) {

		reset();

		data = filterData(data, handler);

		if ( ! namespace.errorObj.error.length) {

			if (handler === 'post') {

				Resource.push(data);

			} else if (handler === 'put') {

				_add(data);

			}

		} else {
			namespace.errorObj.error = namespace.errorObj.error.join(', ');
		}

	};

	this.findResource = function (data) {

		reset();

		if (data.hasOwnProperty('id')) {

			var id = filterId(data.id);

			if (id) {
				_find(id);
			} else {
				namespace.errorObj.error = 'ERROR_ID_WRONG';
			}
		} else {
			namespace.errorObj.error = 'ERROR_ID_NOTFOUND';
		}
	};

	this.deleteResource = function (data) {

		reset();

		if (data.hasOwnProperty('id')) {

			var id = filterId(data.id);

			if (id) {
				_delete(id);
			} else {
				namespace.errorObj.error = 'ERROR_ID_WRONG';
			}
		} else {
			namespace.errorObj.error = 'ERROR_ID_NOTFOUND';
		}
	};

	function errorResponse () {

		responseObj.status = namespace.errorObj.errorStatus;
		responseObj.msg = namespace.errorObj.error;

		return JSON.stringify(responseObj);
	}

	function successResponse () {

		responseObj.status = '200';

		return JSON.stringify(responseObj);
	}

	this.response = function () {
		return (this.errorObj.error.length) ? errorResponse() : successResponse();
	};
}

RestApi.prototype.delete = function (data) {

	this.deleteResource(data);

	return this.response();

};

RestApi.prototype.get = function (data) {

	this.findResource(data);

	return this.response();

};

RestApi.prototype.post = function (data) {

	this.addResource(data, 'post');

	return this.response();

};

RestApi.prototype.put = function (data) {

	this.addResource(data, 'put');

	return this.response();

};

module.exports = RestApi;