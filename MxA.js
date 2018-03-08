"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mendixplatformsdk_1 = require("mendixplatformsdk");
var MxAProject = /** @class */ (function () {
    function MxAProject(username, apikey, appid) {
        this.name = username;
        this.key = apikey;
        this.id = appid;
        this.client = new mendixplatformsdk_1.MendixSdkClient(name, this.key);
        this.project = new mendixplatformsdk_1.Project(this.client, this.id, "");
    }
    MxAProject.prototype.getDocsFromProject = function () {
        this.project.createWorkingCopy();
    };
    return MxAProject;
}());
var MxAToHtmlTextField = /** @class */ (function (_super) {
    __extends(MxAToHtmlTextField, _super);
    function MxAToHtmlTextField(username, apikey, appid, htmlresultfield, htmlerrorfield) {
        var _this = _super.call(this, username, apikey, appid) || this;
        _this.htmlresult = htmlresultfield;
        if (htmlerrorfield) {
            _this.htmlerror = htmlerrorfield;
        }
        return _this;
    }
    MxAToHtmlTextField.prototype.getDocumentsFromProject = function () {
        _super.prototype.getDocsFromProject.call(this);
    };
    return MxAToHtmlTextField;
}(MxAProject));
exports.MxAToHtmlTextField = MxAToHtmlTextField;
var MxAToTextFile = /** @class */ (function (_super) {
    __extends(MxAToTextFile, _super);
    function MxAToTextFile(username, apikey, appid, textfile) {
        var _this = _super.call(this, username, apikey, appid) || this;
        _this.file = textfile;
        return _this;
    }
    return MxAToTextFile;
}(MxAProject));
exports.MxAToTextFile = MxAToTextFile;
