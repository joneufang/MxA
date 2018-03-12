"use strict";
//All Constants for Propertys and Filter
Object.defineProperty(exports, "__esModule", { value: true });
var documents;
(function (documents) {
    var propertys;
    (function (propertys) {
        propertys.ID = "Id";
        propertys.NAME = "Name";
        propertys.TYPE = "Type";
        propertys.CONTAINER = "Container";
        propertys.DOCUMENTATION = "Documentation";
        propertys.ALL = "All";
        //export const CALLLOCATIONS : String = "CALLLOCATIONS";
        //export const CALLCOUNT : string = "CALLCOUNT"; 
    })(propertys = documents.propertys || (documents.propertys = {}));
    var filter;
    (function (filter) {
        filter.ID = "Id";
        filter.NAME = "Name";
        filter.TYPE = "Type";
        filter.CONTAINER = "Container";
    })(filter = documents.filter || (documents.filter = {}));
})(documents = exports.documents || (exports.documents = {}));
