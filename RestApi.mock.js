/**
 * Created by Chrobak on 23.03.2016.
 */

module.exports.mockRestApi = function (Instance, testMock) {

	for (var i = 0; i < testMock.length; i++) {

		if (typeof Instance[testMock[i].func] === 'function') {

			console.log('# TEST ' + testMock[i].func + ' : ', Instance[testMock[i].func](testMock[i].data));

		}
	}
};
