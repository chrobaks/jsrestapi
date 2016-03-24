/**
 * Created by Chrobak on 23.03.2016.
 */
var console = require('console');
var Mock = require('./RestApi.mock.js');
var RestApi = require('./RestApi.class.js');
// MOCK Test Data
var testMock = [
	{
		func : 'post',
		data : {id:2, name:'test2'}
	},
	{
		func : 'get',
		data : {id:2}
	},
	{
		func : 'delete',
		data : {id:'2'}
	},
	{
		func : 'put',
		data : {id:'1', name:'myupdatetest'}
	},
	{
		func : 'get',
		data : {id:1}
	}
];
// Test Resource Data
var Resource = [{id:1, name:'test1'}];
// INSTANCE RestApi
var app = {
	RestApi : new RestApi(Resource)
};

// RUN TEST
Mock.mockRestApi(app.RestApi, testMock);
