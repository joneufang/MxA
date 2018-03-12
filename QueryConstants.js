"use strict";
//All Constants for Propertys and Filter
Object.defineProperty(exports, "__esModule", { value: true });
var documents;
(function (documents) {
    var propertys;
    (function (propertys) {
        propertys.ID = "ID";
        propertys.NAME = "NAME";
        propertys.TYPE = "TYPE";
        propertys.CONTAINER = "CONTAINER";
        propertys.DOCUMENTATION = "DOCUMENTATION";
        propertys.ALL = "ALL";
        //export const CALLLOCATIONS : String = "CALLLOCATIONS";
        //export const CALLCOUNT : string = "CALLCOUNT"; 
    })(propertys = documents.propertys || (documents.propertys = {}));
    var filter;
    (function (filter) {
        filter.ID = "ID";
        filter.NAME = "NAME";
        filter.TYPE = "TYPE";
        filter.CONTAINER = "CONTAINER";
    })(filter = documents.filter || (documents.filter = {}));
    var sorting;
    (function (sorting) {
        sorting.ID = "ID";
        sorting.NAME = "NAME";
        sorting.TYPE = "TYPE";
        sorting.CONTAINER = "CONTAINER";
    })(sorting = documents.sorting || (documents.sorting = {}));
})(documents = exports.documents || (exports.documents = {}));
